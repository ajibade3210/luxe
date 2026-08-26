import { activities, customers as initialCustomers } from "@/lib/mock-data";
import type { Customer, Project, ProjectStatus } from "@/lib/types";

let currentCustomers: Customer[] = [...initialCustomers];

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

function notifyCustomersUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("luxe_customers_updated", {
        detail: currentCustomers,
      })
    );
  }
}

/**
 * Fetch all customers with optional search query
 * When connecting to real backend, easily swap with:
 * `const res = await fetch('/api/customers' + (query ? `?q=${encodeURIComponent(query)}` : '')); return res.json();`
 */
export async function getCustomers(query?: string): Promise<Customer[]> {
  await delay(100);
  if (!query?.trim()) {
    return currentCustomers;
  }
  const q = query.toLowerCase().trim();
  return currentCustomers.filter(c => {
    const matchesBasic =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.notes?.toLowerCase().includes(q);

    const matchesProject = c.projects.some(
      p => p.name.toLowerCase().includes(q) || p.service.toLowerCase().includes(q)
    );

    return matchesBasic || matchesProject;
  });
}

/**
 * Add a new Project / Scope to an existing customer
 * When connecting to real backend, easily swap with:
 * `const res = await fetch(`/api/customers/${customerId}/projects`, { method: 'POST', body: JSON.stringify(input) }); return res.json();`
 */
export async function addProjectToCustomer(
  customerId: string,
  input: { name: string; service: string; amount: number; status?: ProjectStatus }
): Promise<Customer> {
  await delay(200);
  const custIndex = currentCustomers.findIndex(c => c.id === customerId);
  if (custIndex === -1) {
    throw new Error("Customer not found");
  }

  const existing = currentCustomers[custIndex];
  const newProject: Project = {
    id: `p-${Date.now()}`,
    customerId,
    name: input.name,
    service: input.service,
    amount: input.amount,
    status: input.status || "pending",
    createdAt: new Date().toISOString(),
  };

  const updatedProjects = [...existing.projects, newProject];
  const updatedRevenue = updatedProjects.reduce((acc, p) => acc + (p.amount || 0), 0);

  const updatedCustomer: Customer = {
    ...existing,
    projects: updatedProjects,
    totalRevenue: updatedRevenue,
  };

  currentCustomers[custIndex] = updatedCustomer;
  notifyCustomersUpdated();
  return updatedCustomer;
}

export async function getCustomer(id: string): Promise<Customer | undefined> {
  await delay(120);
  return currentCustomers.find(c => c.id === id);
}

export async function getCustomerActivity(id: string) {
  await delay(100);
  return activities.filter(a => a.customerId === id);
}

export interface NewCustomerInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectName?: string;
  service?: string;
  amount?: number;
  status?: ProjectStatus;
}

/**
 * Create a new customer in the studio directory
 * When connecting to real backend, easily swap with:
 * `const res = await fetch('/api/customers', { method: 'POST', body: JSON.stringify(input) }); return res.json();`
 */
export async function createCustomer(input: NewCustomerInput): Promise<Customer> {
  await delay(250);

  const newId = `c${Date.now()}`;
  const initialProject: Project = {
    id: `p-${Date.now()}`,
    customerId: newId,
    name: input.projectName || "Initial Studio Project",
    service: input.service || "Bespoke Styling",
    amount: input.amount || 0,
    status: input.status || "active",
    createdAt: new Date().toISOString(),
  };

  const newCustomer: Customer = {
    id: newId,
    name: input.name,
    email: input.email,
    phone: input.phone || "",
    company: input.company || "",
    totalRevenue: input.amount || 0,
    projects: [initialProject],
    createdAt: new Date().toISOString(),
  };

  currentCustomers = [newCustomer, ...currentCustomers];
  notifyCustomersUpdated();

  return newCustomer;
}

/**
 * Send an invoice to a customer with pending project/retainer
 * When connecting to real backend, easily swap with:
 * `const res = await fetch(`/api/customers/${customerId}/invoices/send`, { method: 'POST' }); return res.json();`
 */
export async function sendCustomerInvoice(
  customerId: string,
  projectId?: string
): Promise<{ success: boolean; invoiceId: string; recipient: string; amount: number }> {
  await delay(300);

  const customer = currentCustomers.find(c => c.id === customerId);
  const project = customer?.projects.find(p => (projectId ? p.id === projectId : true));

  return {
    success: true,
    invoiceId: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    recipient: customer?.email || "customer@example.com",
    amount: project?.amount || 0,
  };
}

/**
 * Export Customers List as CSV
 * When connecting to real backend, easily swap with:
 * `window.location.href = '/api/customers/export?format=csv'`
 */
export async function exportCustomersCSV(): Promise<{ count: number; filename: string }> {
  await delay(350);

  if (typeof window === "undefined") {
    return { count: currentCustomers.length, filename: "customers.csv" };
  }

  const headers = [
    "ID",
    "Customer Name",
    "Email",
    "Phone",
    "Company",
    "Total Revenue",
    "Projects Count",
    "Primary Service",
    "Latest Status",
  ];
  const rows = currentCustomers.map(c => [
    c.id,
    `"${c.name}"`,
    c.email,
    c.phone || "N/A",
    c.company ? `"${c.company}"` : "Private Client",
    c.totalRevenue,
    c.projects.length,
    c.projects[0]?.service ? `"${c.projects[0].service}"` : "Bespoke",
    c.projects[0]?.status || "N/A",
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `elan-atelier-customers-${new Date().toISOString().split("T")[0]}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { count: currentCustomers.length, filename };
}

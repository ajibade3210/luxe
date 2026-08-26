import { CUSTOM_EVENTS } from "@/constants";
import { activities, customers as initialCustomers } from "@/lib/mock-data";
import { AddServiceInputSchema, NewCustomerInputSchema } from "@/lib/schemas";
import type { Customer, CustomerService, ServiceStatus } from "@/lib/types";

let currentCustomers: Customer[] = [...initialCustomers];

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

function notifyCustomersUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(CUSTOM_EVENTS.customersUpdated, {
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

    const matchesService = c.services.some(
      s => s.name.toLowerCase().includes(q) || s.service.toLowerCase().includes(q)
    );

    return matchesBasic || matchesService;
  });
}

/**
 * Add a new Service / Scope to an existing customer
 * When connecting to real backend, easily swap with:
 * `const res = await fetch(`/api/customers/${customerId}/services`, { method: 'POST', body: JSON.stringify(input) }); return res.json();`
 */
export async function addServiceToCustomer(
  customerId: string,
  input: { name: string; service: string; amount: number; status?: ServiceStatus }
): Promise<Customer> {
  const validatedInput = AddServiceInputSchema.parse(input);
  await delay(200);
  const custIndex = currentCustomers.findIndex(c => c.id === customerId);
  if (custIndex === -1) {
    throw new Error("Customer not found");
  }

  const existing = currentCustomers[custIndex];
  const newService: CustomerService = {
    id: `svc-${Date.now()}`,
    businessId: existing.businessId || "elan-events",
    customerId,
    name: validatedInput.name,
    service: validatedInput.service,
    amount: validatedInput.amount,
    status: validatedInput.status || "pending",
    createdAt: new Date().toISOString(),
  };

  const updatedServices = [...existing.services, newService];
  const updatedRevenue = updatedServices.reduce((acc, s) => acc + (s.amount || 0), 0);

  const updatedCustomer: Customer = {
    ...existing,
    services: updatedServices,
    totalRevenue: updatedRevenue,
  };

  currentCustomers[custIndex] = updatedCustomer;
  notifyCustomersUpdated();
  return updatedCustomer;
}

/**
 * Delete a Service from a customer
 * When connecting to real backend, easily swap with:
 * `const res = await fetch(`/api/customers/${customerId}/services/${serviceId}`, { method: 'DELETE' }); return res.json();`
 */
export async function deleteCustomerService(
  customerId: string,
  serviceId: string
): Promise<Customer> {
  await delay(200);
  const custIndex = currentCustomers.findIndex(c => c.id === customerId);
  if (custIndex === -1) {
    throw new Error("Customer not found");
  }

  const existing = currentCustomers[custIndex];
  const updatedServices = existing.services.filter(s => s.id !== serviceId);
  const updatedRevenue = updatedServices.reduce((acc, s) => acc + (s.amount || 0), 0);

  const updatedCustomer: Customer = {
    ...existing,
    services: updatedServices,
    totalRevenue: updatedRevenue,
  };

  currentCustomers[custIndex] = updatedCustomer;
  notifyCustomersUpdated();
  return updatedCustomer;
}

/**
 * Update a Service status for a customer
 * When connecting to real backend, easily swap with:
 * `const res = await fetch(`/api/customers/${customerId}/services/${serviceId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); return res.json();`
 */
export async function updateCustomerServiceStatus(
  customerId: string,
  serviceId: string,
  status: ServiceStatus
): Promise<Customer> {
  await delay(150);
  const custIndex = currentCustomers.findIndex(c => c.id === customerId);
  if (custIndex === -1) {
    throw new Error("Customer not found");
  }

  const existing = currentCustomers[custIndex];
  const updatedServices = existing.services.map(s => (s.id === serviceId ? { ...s, status } : s));

  const updatedCustomer: Customer = {
    ...existing,
    services: updatedServices,
  };

  currentCustomers[custIndex] = updatedCustomer;
  notifyCustomersUpdated();
  return updatedCustomer;
}

/**
 * Toggle customer active status (isActive: true/false)
 * When connecting to real backend, easily swap with:
 * `const res = await fetch(`/api/customers/${customerId}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }); return res.json();`
 */
export async function toggleCustomerActiveStatus(
  customerId: string,
  isActive: boolean
): Promise<Customer> {
  await delay(150);
  const custIndex = currentCustomers.findIndex(c => c.id === customerId);
  if (custIndex === -1) {
    throw new Error("Customer not found");
  }

  const updatedCustomer: Customer = {
    ...currentCustomers[custIndex],
    isActive,
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
  businessId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceName?: string;
  service?: string;
  amount?: number;
  status?: ServiceStatus;
  isActive?: boolean;
}

/**
 * Create a new customer in the studio directory
 * When connecting to real backend, easily swap with:
 * `const res = await fetch('/api/customers', { method: 'POST', body: JSON.stringify(input) }); return res.json();`
 */
export async function createCustomer(input: NewCustomerInput): Promise<Customer> {
  const validatedInput = NewCustomerInputSchema.parse(input);
  await delay(250);

  const newId = `c${Date.now()}`;
  const businessId = validatedInput.businessId || "elan-events";
  const services: CustomerService[] = [];
  const initialServiceName = validatedInput.serviceName?.trim();
  if (initialServiceName) {
    services.push({
      id: `svc-${Date.now()}`,
      businessId,
      customerId: newId,
      name: initialServiceName,
      service: validatedInput.service || "Bespoke Styling",
      amount: validatedInput.amount || 0,
      status: validatedInput.status || "active",
      createdAt: new Date().toISOString(),
    });
  }

  const newCustomer: Customer = {
    id: newId,
    businessId,
    name: validatedInput.name,
    email: validatedInput.email,
    phone: validatedInput.phone || "",
    company: validatedInput.company || "",
    totalRevenue: services.reduce((acc, s) => acc + (s.amount || 0), 0),
    services,
    isActive: validatedInput.isActive ?? true,
    createdAt: new Date().toISOString(),
  };

  currentCustomers = [newCustomer, ...currentCustomers];
  notifyCustomersUpdated();

  return newCustomer;
}

/**
 * Send an invoice to a customer with pending service/retainer
 * When connecting to real backend, easily swap with:
 * `const res = await fetch(`/api/customers/${customerId}/invoices/send`, { method: 'POST' }); return res.json();`
 */
export async function sendCustomerInvoice(
  customerId: string,
  serviceId?: string
): Promise<{ success: boolean; invoiceId: string; recipient: string; amount: number }> {
  await delay(300);

  const customer = currentCustomers.find(c => c.id === customerId);
  const service = customer?.services.find(s => (serviceId ? s.id === serviceId : true));

  return {
    success: true,
    invoiceId: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    recipient: customer?.email || "customer@example.com",
    amount: service?.amount || 0,
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
    "Services Count",
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
    c.services.length,
    c.services[0]?.service ? `"${c.services[0].service}"` : "Bespoke",
    c.services[0]?.status || "N/A",
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

export interface ImportCustomerRecord {
  name: string;
  phone?: string;
  email: string;
  notes?: string;
}

/**
 * Import Customers from CSV / structured records (Accepts name, phone, email, notes)
 * When connecting to real backend, easily swap with:
 * `const res = await fetch('/api/customers/import', { method: 'POST', body: JSON.stringify(records) }); return res.json();`
 */
export async function importCustomers(
  records: ImportCustomerRecord[]
): Promise<{ imported: number; customers: Customer[] }> {
  await delay(400);

  const newCustomers: Customer[] = records.map((r, idx) => {
    const id = `c-imp-${Date.now()}-${idx}`;
    return {
      id,
      name: r.name.trim(),
      email: r.email.trim(),
      phone: r.phone?.trim() || "",
      company: "",
      notes: r.notes?.trim() || "Imported via bulk customer register",
      totalRevenue: 0,
      services: [],
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  });

  currentCustomers = [...newCustomers, ...currentCustomers];
  notifyCustomersUpdated();
  return { imported: newCustomers.length, customers: newCustomers };
}

/**
 * Download standard Customer CSV Import Template
 */
export function downloadCustomerCSVTemplate(): void {
  if (typeof window === "undefined") return;
  const headers = ["Name", "Phone", "Email", "Notes"];
  const sampleRows = [
    [
      "Adeola Adeleke",
      "+234 803 123 4567",
      "adeola@example.com",
      "VIP anniversary celebration client",
    ],
    ["Chinedu Obi", "+234 802 987 6543", "chinedu@example.com", "Executive corporate gala inquiry"],
  ];
  const csvContent = [
    headers.join(","),
    ...sampleRows.map(r => r.map(c => `"${c}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "customer_import_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

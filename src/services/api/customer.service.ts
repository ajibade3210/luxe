import { activities, customers } from "@/lib/mock-data";
import type { Customer } from "@/lib/types";

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export async function getCustomers(): Promise<Customer[]> {
  await delay(100);
  return customers;
}

export async function getCustomer(id: string): Promise<Customer | undefined> {
  await delay(120);
  return customers.find(c => c.id === id);
}

export async function getCustomerActivity(id: string) {
  await delay(100);
  return activities.filter(a => a.customerId === id);
}

/**
 * Export Customers List as CSV
 * When connecting to real backend, easily swap with:
 * `window.location.href = '/api/customers/export?format=csv'`
 */
export async function exportCustomersCSV(): Promise<{ count: number; filename: string }> {
  await delay(350);

  if (typeof window === "undefined") {
    return { count: customers.length, filename: "customers.csv" };
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
  const rows = customers.map(c => [
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

  return { count: customers.length, filename };
}

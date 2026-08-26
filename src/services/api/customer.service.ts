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

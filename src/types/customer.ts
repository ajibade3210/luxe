// Customer and service tracking types
export type ServiceStatus = "active" | "completed" | "pending" | "cancelled";

export interface CustomerService {
  id: string;
  businessId?: string;
  customerId: string;
  name: string;
  service: string;
  amount: number;
  status: ServiceStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Activity {
  id: string;
  businessId?: string;
  customerId: string;
  type: "contact" | "update" | "note" | "service";
  description: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  businessId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  services: CustomerService[];
  totalRevenue: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface NewCustomerInput {
  businessId?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  serviceName?: string;
  service?: string;
  amount?: number;
  status?: ServiceStatus;
  isActive?: boolean;
}

export interface AddServiceInput {
  businessId?: string;
  name: string;
  service: string;
  amount: number;
  status?: ServiceStatus;
}

export interface ImportCustomerRecord {
  name: string;
  phone?: string;
  email: string;
  notes?: string;
}

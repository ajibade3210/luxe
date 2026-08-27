// Lead and inquiry types
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "closed";

export interface Lead {
  id: string;
  businessId?: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  services?: string[];
  eventDate: string;
  budget?: number;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export interface CreateLeadInput {
  businessId?: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  services?: string[];
  eventDate: string;
  budget?: number;
  message: string;
}

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

export interface LeadTableProps {
  items: Lead[];
  paginatedItems: Lead[];
  searchQuery: string;
  onSearch: (query: string) => void;
  onSelectLead: (id: string) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface LeadDetailDrawerProps {
  lead: Lead | null;
  isConverting: boolean;
  onClose: () => void;
  onOpenMessageModal: (lead: Lead) => void;
  onConvertToCustomer: (leadId: string) => void;
  onIssueInvoice: (lead: Lead) => void;
}

export interface LeadMessageModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSendWhatsApp: (lead: Lead, phone: string, text: string) => void;
  onSendEmail: (lead: Lead, email: string, name: string, text: string) => void;
}

import { formatStatusLabel } from "@/utils";

export type StatusVariant =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "completed"
  | "active"
  | "paid"
  | "closed"
  | "lost"
  | "overdue"
  | "draft"
  | "pending"
  | "sent"
  | string;

export function getStatusBadgeClass(status: StatusVariant): string {
  switch (status?.toLowerCase()) {
    case "new":
    case "pending":
    case "sent":
      return "bg-[#fef3c7] text-[#b45309] border-[#fde68a]";
    case "contacted":
      return "bg-[#faf5ee] text-[#6f4c22] border-[#f0e4d4]";
    case "qualified":
      return "bg-[#f0fdfa] text-[#115e59] border-[#ccfbf1]";
    case "converted":
    case "completed":
    case "active":
    case "paid":
      return "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]";
    case "closed":
    case "lost":
    case "overdue":
      return "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]";
    case "draft":
      return "bg-[#f1f5f9] text-[#334155] border-[#e2e8f0]";
    default:
      return "bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]";
  }
}

export function StatusBadge({
  status,
  className = "",
}: {
  status: StatusVariant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center border px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold rounded-full capitalize whitespace-nowrap leading-tight transition-colors ${getStatusBadgeClass(
        status
      )} ${className}`}
    >
      {formatStatusLabel(status)}
    </span>
  );
}

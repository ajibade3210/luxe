"use client";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Search,
} from "lucide-react";
import { INVOICE_PAGE_CONFIG, INVOICE_STATUS_FILTERS } from "@/constants";
import type { InvoiceStatusFilter, InvoiceTableProps } from "@/types";
import { formatDate, formatMoney, formatStatusLabel } from "@/utils";
import { StatusBadge } from "../common/status-badge";
import { TableEmptyState } from "../common/table-empty-state";

export function InvoiceTable({
  items,
  paginatedItems,
  searchQuery,
  statusFilter,
  onSearch,
  onStatusFilterChange,
  onSelectInvoice,
  onMarkPaid,
  onMarkUnpaid,
  currentPage,
  totalPages,
  pageSize,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: InvoiceTableProps) {
  return (
    <div className="table-card">
      <div className="table-head justify-end">
        <div className="flex items-center gap-3 ml-auto">
          {/* Status Filter Dropdown matching Expenses */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => onStatusFilterChange(e.target.value as InvoiceStatusFilter)}
              aria-label="Filter invoices by status"
              className="h-9 appearance-none pl-3 pr-7 bg-white border border-[#ded7cb] rounded-xl text-[11px] font-medium text-[#191c1d] hover:bg-[#faf8f5] focus:outline-none transition-colors cursor-pointer shadow-2xs"
            >
              {INVOICE_STATUS_FILTERS.map(f => (
                <option key={f.key} value={f.key} className="text-[11px]">
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8c827a] pointer-events-none"
            />
          </div>

          {/* Standard Search Box */}
          <div className="table-search-box">
            <Search size={13} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder={INVOICE_PAGE_CONFIG.searchPlaceholder}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full border-collapse sm:min-w-[680px] text-left">
          <thead>
            <tr>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Invoice #
              </th>
              <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Customer
              </th>
              <th className="hidden md:table-cell px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Date Issued
              </th>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Due Date
              </th>
              <th className="px-2 sm:px-5 py-3 sm:py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Amount
              </th>
              <th className="text-right sm:text-left px-2 sm:px-5 py-3 sm:py-3.5 text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Status
              </th>
              <th className="hidden sm:table-cell text-right px-5 py-3.5 text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Actions
              </th>
              <th className="sm:hidden w-5 px-2 sm:px-5 py-3 sm:py-3.5 bg-[#faf8f5] border-b border-[#eee7dc]" />
            </tr>
          </thead>
          <tbody className="align-middle">
            {paginatedItems.map(inv => (
              <tr
                key={inv.id}
                onClick={() => onSelectInvoice(inv)}
                className="cursor-pointer hover:bg-[#faf8f5]/60 transition-colors"
              >
                <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                  <b className="font-mono text-xs font-semibold text-[#191c1d] block">
                    {inv.invoiceNumber}
                  </b>
                  <small className="text-[#8c827a] text-[11px] mt-0.5 block">
                    {inv.items.length} {inv.items.length === 1 ? "item" : "items"}
                  </small>
                </td>
                <td className="px-3 sm:px-5 py-3 sm:py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                  <b className="text-xs sm:text-sm font-semibold text-[#191c1d] block">
                    {inv.customerName}
                  </b>
                  {/* Mobile Invoice # & item count */}
                  <span className="sm:hidden font-mono text-[10px] text-[#855e2e] block mt-0.5">
                    {inv.invoiceNumber} · {inv.items.length} item{inv.items.length === 1 ? "" : "s"}
                  </span>
                  <small className="text-[10px] sm:text-xs text-[#8c827a] truncate block max-w-[140px] sm:max-w-none mt-0.5">
                    {inv.customerEmail}
                  </small>
                </td>
                <td className="hidden md:table-cell px-5 py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                  {formatDate(inv.issueDate)}
                </td>
                <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                  {formatDate(inv.dueDate)}
                </td>
                <td className="whitespace-nowrap px-2 sm:px-5 py-3 sm:py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                  <span className="font-sans font-bold text-xs sm:text-sm text-[#191c1d] tabular-nums">
                    {formatMoney(inv.total, inv.currency || "NGN")}
                  </span>
                </td>
                <td className="text-right sm:text-left whitespace-nowrap px-2 sm:px-5 py-3 sm:py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                  {/* Mobile: clean text label */}
                  <span
                    className={`sm:hidden text-[11px] font-semibold capitalize ${
                      inv.status === "paid"
                        ? "text-[#047857]"
                        : inv.status === "sent"
                          ? "text-[#b45309]"
                          : inv.status === "cancelled"
                            ? "text-[#b91c1c]"
                            : "text-[#6b7280]"
                    }`}
                  >
                    {formatStatusLabel(inv.status)}
                  </span>
                  {/* Desktop: standard StatusBadge pill */}
                  <span className="hidden sm:inline-block">
                    <StatusBadge status={inv.status} />
                  </span>
                </td>
                <td
                  className="hidden sm:table-cell text-right px-5 py-3.5 border-b border-[#eee7dc] align-middle"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    {inv.status === "sent" && (
                      <button
                        type="button"
                        onClick={() => onMarkPaid(inv.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] text-xs font-semibold transition-all cursor-pointer"
                        title="Mark invoice as paid"
                        aria-label="Mark invoice as paid"
                      >
                        <Check size={12} />
                        <span>Mark Paid</span>
                      </button>
                    )}

                    {inv.status === "paid" && (
                      <button
                        type="button"
                        onClick={() => onMarkUnpaid(inv.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#faf7f2] hover:bg-[#f0ebe3] text-[#5c5f60] border border-[#ded7cb] text-xs font-semibold transition-all cursor-pointer"
                        title="Revert invoice to unpaid"
                        aria-label="Revert invoice to unpaid"
                      >
                        <RefreshCw size={11} />
                        <span>Revert</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectInvoice(inv)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#ded7cb] hover:border-[#c59a78] text-xs font-semibold transition-all cursor-pointer"
                      title="View and edit invoice details"
                      aria-label="View and edit invoice details"
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </button>
                  </div>
                </td>
                <td className="sm:hidden w-5 text-right px-2 py-3 border-b border-[#eee7dc] align-middle">
                  <ChevronRight size={14} className="text-[#8c827a] ml-auto" />
                </td>
              </tr>
            ))}

            {paginatedItems.length === 0 && (
              <TableEmptyState
                colSpan={7}
                title="No invoices found"
                description={INVOICE_PAGE_CONFIG.emptyStateMessage}
              />
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#f0e8dc] bg-[#fdfbf7] text-xs text-[#5c5f60] rounded-b-3xl">
        <div className="flex items-center gap-2">
          <span>
            Showing <b className="text-[#191c1d]">{items.length === 0 ? 0 : startIndex + 1}</b>–
            <b className="text-[#191c1d]">{Math.min(startIndex + pageSize, items.length)}</b> of{" "}
            <b className="text-[#191c1d]">{items.length}</b> records
          </span>
          <div className="hidden sm:flex items-center gap-1.5 ml-3 border-l border-[#ded7cb] pl-3">
            <span className="text-[11px] text-[#8c827a]">Per page:</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-[#ded7cb] rounded-lg px-2 py-0.5 text-[11px] text-[#191c1d] focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-[#ded7cb] bg-white hover:bg-[#faf7f2] disabled:opacity-40 disabled:cursor-not-allowed text-[#191c1d] transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-2 text-xs font-semibold text-[#191c1d]">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-[#ded7cb] bg-white hover:bg-[#faf7f2] disabled:opacity-40 disabled:cursor-not-allowed text-[#191c1d] transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

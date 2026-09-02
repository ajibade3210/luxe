"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { LeadFilterStatus, LeadTableProps } from "@/types";
import { formatDate, formatStatusLabel } from "@/utils";
import { StatusBadge } from "../common/status-badge";
import { TableEmptyState } from "../common/table-empty-state";

export function LeadTable({
  items,
  paginatedItems,
  searchQuery,
  onSearch,
  statusFilter = "all",
  onStatusFilterChange,
  onSelectLead,
  currentPage,
  totalPages,
  pageSize,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: LeadTableProps) {
  return (
    <div className="table-card">
      <div className="table-head justify-end">
        <div className="flex items-center gap-3 ml-auto">
          {/* Status Filter Dropdown matching Invoices and Expenses */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => onStatusFilterChange?.(e.target.value as LeadFilterStatus)}
              aria-label="Filter inquiries by status"
              className="h-9 appearance-none pl-3 pr-7 bg-white border border-[#ded7cb] rounded-xl text-[11px] font-medium text-[#191c1d] hover:bg-[#faf8f5] focus:outline-none transition-colors cursor-pointer shadow-2xs"
            >
              <option value="all" className="text-[11px]">
                All
              </option>
              <option value="active" className="text-[11px]">
                Active
              </option>
              <option value="new" className="text-[11px]">
                New
              </option>
              <option value="contacted" className="text-[11px]">
                Contacted
              </option>
              <option value="qualified" className="text-[11px]">
                Qualified
              </option>
              <option value="converted" className="text-[11px]">
                Converted
              </option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8c827a] pointer-events-none"
            />
          </div>

          {/* Search Box */}
          <div className="table-search-box">
            <Search size={13} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search leads..."
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full border-collapse sm:min-w-[680px] text-left">
          <thead>
            <tr>
              <th className="px-3 sm:px-5 py-3 sm:py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Name
              </th>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Service requested
              </th>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Estimated date
              </th>
              <th className="text-right sm:text-left px-2 sm:px-5 py-3 sm:py-3.5 text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Status
              </th>
              <th className="w-5 sm:w-10 px-2 sm:px-5 py-3 sm:py-3.5 bg-[#faf8f5] border-b border-[#eee7dc]" />
            </tr>
          </thead>
          <tbody className="align-middle">
            {paginatedItems.map(lead => (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className="cursor-pointer hover:bg-[#faf8f5]/60 transition-colors"
              >
                <td className="px-3 sm:px-5 py-3 sm:py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <b className="text-xs sm:text-sm font-semibold text-[#191c1d] block">
                      {lead.name}
                    </b>
                    {lead.isExistingCustomer && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
                        Customer
                      </span>
                    )}
                  </div>
                  {/* Mobile service requested subtitle */}
                  <div className="sm:hidden text-[10px] text-[#855e2e] font-medium mt-0.5 truncate">
                    {lead.service}
                    {lead.services && lead.services.length > 1 && ` (+${lead.services.length - 1})`}
                  </div>
                  <small className="text-[10px] sm:text-xs text-[#8c827a] truncate block max-w-[150px] sm:max-w-none mt-0.5">
                    {lead.email}
                  </small>
                </td>
                <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                  <div className="flex items-center">
                    <span className="font-semibold text-[#191c1d]">{lead.service}</span>
                    {lead.services && lead.services.length > 1 && (
                      <span
                        className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-[#f4ece1] text-[#855e2e] font-mono font-bold shrink-0"
                        title={`${lead.services.length} requested services/scopes`}
                      >
                        +{lead.services.length - 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                  {formatDate(lead.eventDate)}
                </td>
                <td className="text-right sm:text-left whitespace-nowrap px-2 sm:px-5 py-3 sm:py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                  {/* Mobile: clean text label */}
                  <span
                    className={`sm:hidden text-[11px] font-semibold capitalize ${
                      lead.status === "new"
                        ? "text-[#b45309]"
                        : lead.status === "contacted"
                        ? "text-[#855e2e]"
                        : lead.status === "qualified"
                        ? "text-[#0f766e]"
                        : lead.status === "converted"
                        ? "text-[#047857]"
                        : "text-[#6b7280]"
                    }`}
                  >
                    {formatStatusLabel(lead.status)}
                  </span>
                  {/* Desktop: standard StatusBadge pill */}
                  <span className="hidden sm:inline-block">
                    <StatusBadge status={lead.status} />
                  </span>
                </td>
                <td className="w-5 sm:w-10 text-right px-2 sm:px-5 py-3 sm:py-3.5 border-b border-[#eee7dc] align-middle">
                  <ChevronRight size={14} className="text-[#8c827a] ml-auto" />
                </td>
              </tr>
            ))}
            {paginatedItems.length === 0 && (
              <TableEmptyState
                colSpan={5}
                title="No inquiries found"
                description="Try adjusting your search query or no inquiries yet"
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
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ded7cb] bg-white text-xs font-semibold text-[#191c1d] hover:bg-[#faf8f5] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft size={13} />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  page === currentPage
                    ? "bg-[#191c1d] text-white shadow-2xs"
                    : "bg-white border border-[#ded7cb] text-[#5c5f60] hover:bg-[#faf8f5] hover:text-[#191c1d]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ded7cb] bg-white text-xs font-semibold text-[#191c1d] hover:bg-[#faf8f5] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

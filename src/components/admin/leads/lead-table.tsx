"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { LeadTableProps } from "@/types";
import { formatDate, formatStatusLabel } from "@/utils";

export function LeadTable({
  items,
  paginatedItems,
  searchQuery,
  onSearch,
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
      <div className="table-head">
        <h2>Recent inquiries</h2>
        <div className="table-search-box">
          <Search size={13} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Service requested</th>
              <th>Estimated date</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(lead => (
              <tr key={lead.id} onClick={() => onSelectLead(lead.id)} className="cursor-pointer">
                <td>
                  <b>{lead.name}</b>
                  <small>{lead.email}</small>
                </td>
                <td>
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
                <td>{formatDate(lead.eventDate)}</td>
                <td>
                  <span className={`status ${lead.status}`}>{formatStatusLabel(lead.status)}</span>
                </td>
                <td>
                  <ChevronRight size={16} />
                </td>
              </tr>
            ))}
            {paginatedItems.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[#8c827a] text-xs italic">
                  No inquiries found.
                </td>
              </tr>
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
              className="bg-white border border-[#ded7cb] rounded-lg px-2 py-0.5 text-xs text-[#191c1d] focus:outline-none"
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

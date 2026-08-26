"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Customer } from "@/lib/types";

interface CustomerTableProps {
  items: Customer[];
  paginatedItems: Customer[];
  searchQuery: string;
  onSearch: (query: string) => void;
  onSelectCustomer: (id: string) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function CustomerTable({
  items,
  paginatedItems,
  searchQuery,
  onSearch,
  onSelectCustomer,
  currentPage,
  totalPages,
  pageSize,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: CustomerTableProps) {
  return (
    <div className="table-card">
      <div className="table-head">
        <h2>All customers</h2>
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
              <th>Customer</th>
              <th>Service</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(c => {
              const servicesList = c.services || [];
              const hasServices = servicesList.length > 0;
              const s = hasServices ? servicesList[0] : null;

              return (
                <tr key={c.id} onClick={() => onSelectCustomer(c.id)} className="cursor-pointer">
                  <td>
                    <b>{c.name}</b>
                    <small>
                      {c.email}
                      {c.phone ? ` · ${c.phone}` : ""}
                    </small>
                  </td>
                  <td>
                    {s ? (
                      <div className="flex items-center">
                        <b className="truncate max-w-[220px]">{s.name}</b>
                        {servicesList.length > 1 && (
                          <span
                            className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-[#f4ece1] text-[#855e2e] font-mono font-bold shrink-0"
                            title={`${servicesList.length} connected services / scopes`}
                          >
                            +{servicesList.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center min-h-[38px]">
                        <span className="text-sm font-semibold text-[#9ca3af] leading-none select-none">
                          —
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center min-h-[38px]">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          c.isActive
                            ? "bg-[#10b981] shadow-xs shadow-emerald-500/20"
                            : "bg-[#d1d5db]"
                        }`}
                        title={c.isActive ? "Active Customer" : "Inactive Customer"}
                      />
                    </div>
                  </td>
                  <td>
                    <ChevronRight size={16} />
                  </td>
                </tr>
              );
            })}
            {paginatedItems.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-[#8c827a] text-xs italic">
                  No customer records found.
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

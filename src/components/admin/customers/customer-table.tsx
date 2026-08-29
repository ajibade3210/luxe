"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { CustomerTableProps } from "@/types";

export function CustomerTable({
  items,
  paginatedItems,
  searchQuery,
  onSearch,
  onSelectCustomer,
  selectedCustomerIds,
  onToggleSelect,
  onSelectAllActive,
  onClearSelection,
  onOpenBroadcast,
  currentPage,
  totalPages,
  pageSize,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: CustomerTableProps) {
  const activeItems = items.filter(c => c.isActive);
  const isAllActiveSelected =
    activeItems.length > 0 && activeItems.every(c => selectedCustomerIds.includes(c.id));

  return (
    <div className="table-card">
      <div className="table-head">
        <div className="flex items-center gap-3">
          <h2>All customers</h2>
          {selectedCustomerIds.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#faf7f2] text-[#855e2e] border border-[#e8ded1]">
              {selectedCustomerIds.length} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {selectedCustomerIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in duration-150">
              <button
                type="button"
                onClick={onOpenBroadcast}
                className="px-3.5 py-2 rounded-xl bg-[#191c1d] hover:bg-black text-white !text-white text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer shadow-xs"
              >
                Broadcast ({selectedCustomerIds.length})
              </button>

              <button
                type="button"
                onClick={onClearSelection}
                className="px-3 py-2 rounded-xl border border-[#ded7cb] hover:border-[#c59a78] bg-white hover:bg-[#faf7f2] text-[#5c5f60] hover:text-[#191c1d] text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer shadow-2xs"
              >
                Clear
              </button>
            </div>
          )}

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
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="w-10">
                <input
                  type="checkbox"
                  checked={isAllActiveSelected}
                  onChange={onSelectAllActive}
                  title="Select all active customers"
                  aria-label="Select all active customers"
                  className="rounded border-[#ded7cb] text-[#855e2e] focus:ring-[#855e2e] cursor-pointer"
                />
              </th>
              <th>Customer</th>
              <th>Service</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(c => {
              const isSelected = selectedCustomerIds.includes(c.id);
              const servicesList = c.services || [];
              const hasServices = servicesList.length > 0;
              const s = hasServices ? servicesList[0] : null;

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectCustomer(c.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-[#faf7f2]/60" : ""
                  }`}
                >
                  <td onClick={e => e.stopPropagation()} className="w-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(c.id)}
                      aria-label={`Select customer ${c.name}`}
                      className="rounded border-[#ded7cb] text-[#855e2e] focus:ring-[#855e2e] cursor-pointer"
                    />
                  </td>
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
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          c.isActive
                            ? "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]"
                            : "bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.isActive ? "bg-[#059669]" : "bg-[#a1a1aa]"
                          }`}
                        />
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
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
                <td colSpan={5} className="text-center py-8 text-[#8c827a] text-xs italic">
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

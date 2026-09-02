"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { CustomerTableProps } from "@/types";
import { TableEmptyState } from "../common/table-empty-state";

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
          {selectedCustomerIds.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#faf7f2] text-[#855e2e] border border-[#e8ded1]">
              {selectedCustomerIds.length} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
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

      <div className="overflow-x-auto flex-1 min-h-0">
        <table className="w-full border-collapse sm:min-w-[680px] text-left">
          <thead>
            <tr>
              <th className="w-8 sm:w-10 px-3 sm:px-5 py-3 sm:py-3.5 bg-[#faf8f5] border-b border-[#eee7dc]">
                <input
                  type="checkbox"
                  checked={isAllActiveSelected}
                  onChange={onSelectAllActive}
                  title="Select all active customers"
                  aria-label="Select all active customers"
                  className="rounded border-[#ded7cb] text-[#855e2e] focus:ring-[#855e2e] cursor-pointer"
                />
              </th>
              <th className="px-2.5 sm:px-5 py-3 sm:py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Customer
              </th>
              <th className="hidden sm:table-cell px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Service
              </th>
              <th className="text-right sm:text-left px-2 sm:px-5 py-3 sm:py-3.5 text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]">
                Status
              </th>
              <th className="w-5 sm:w-10 px-2 sm:px-5 py-3 sm:py-3.5 bg-[#faf8f5] border-b border-[#eee7dc]" />
            </tr>
          </thead>
          <tbody className="align-middle">
            {paginatedItems.map(c => {
              const isSelected = selectedCustomerIds.includes(c.id);
              const servicesList = c.services || [];
              const hasServices = servicesList.length > 0;
              const s = hasServices ? servicesList[0] : null;

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectCustomer(c.id)}
                  className={`cursor-pointer hover:bg-[#faf8f5]/60 transition-colors ${
                    isSelected ? "bg-[#faf7f2]/60" : ""
                  }`}
                >
                  <td
                    onClick={e => e.stopPropagation()}
                    className="w-8 sm:w-10 px-3 sm:px-5 py-3 sm:py-3.5 border-b border-[#eee7dc] align-middle"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(c.id)}
                      aria-label={`Select customer ${c.name}`}
                      className="rounded border-[#ded7cb] text-[#855e2e] focus:ring-[#855e2e] cursor-pointer"
                    />
                  </td>
                  <td className="px-2.5 sm:px-5 py-3 sm:py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                    <b className="text-xs sm:text-sm font-semibold text-[#191c1d] block">
                      {c.name}
                    </b>
                    {/* Mobile service subtitle */}
                    {s && (
                      <span className="sm:hidden text-[10px] text-[#855e2e] font-medium block truncate mt-0.5">
                        {s.name}
                        {servicesList.length > 1 && ` (+${servicesList.length - 1})`}
                      </span>
                    )}
                    <small className="text-[10px] sm:text-xs text-[#8c827a] truncate block max-w-[150px] sm:max-w-none mt-0.5">
                      {c.email}
                      {c.phone ? ` · ${c.phone}` : ""}
                    </small>
                  </td>
                  <td className="hidden sm:table-cell px-5 py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle">
                    {s ? (
                      <div className="flex items-center">
                        <b className="truncate max-w-[220px] font-semibold text-[#191c1d]">
                          {s.name}
                        </b>
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
                  <td className="text-right sm:text-left whitespace-nowrap px-2 sm:px-5 py-3 sm:py-3.5 text-xs border-b border-[#eee7dc] align-middle">
                    <div className="flex items-center justify-end sm:justify-start">
                      {/* Mobile: clean green/gray dot indicator */}
                      <span
                        className={`sm:hidden inline-block w-2.5 h-2.5 rounded-full ${
                          c.isActive ? "bg-[#10b981]" : "bg-[#9ca3af]"
                        }`}
                        title={c.isActive ? "Active" : "Inactive"}
                      />
                      {/* Desktop: full pill badge */}
                      <span
                        className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border ${
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
                  <td className="w-5 sm:w-10 text-right px-2 sm:px-5 py-3 sm:py-3.5 border-b border-[#eee7dc] align-middle">
                    <ChevronRight size={14} className="text-[#8c827a] ml-auto" />
                  </td>
                </tr>
              );
            })}
            {paginatedItems.length === 0 && (
              <TableEmptyState
                colSpan={5}
                title="No customer records found"
                description="Try adjusting your search query or add a new customer."
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

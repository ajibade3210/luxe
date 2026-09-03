"use client";

import { AlertTriangle, Edit2, MoreVertical, Package, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useDeleteProductMutation } from "@/hooks/queries";
import type { ProductsTableProps } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { StatusBadge } from "../common/status-badge";

export function ProductsTable({ products, isLoading, onEdit }: ProductsTableProps) {
  const deleteMutation = useDeleteProductMutation();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const confirmDelete = async () => {
    if (!productToDelete) return;
    await deleteMutation.mutateAsync(productToDelete.id);
    setProductToDelete(null);
    setActiveMenuId(null);
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-[#6b7280]">
        <div className="animate-spin w-5 h-5 border-2 border-[#191c1d] border-t-transparent rounded-full mx-auto mb-2" />
        Loading catalog...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-16 text-center text-[#6b7280]">
        <Package size={36} className="mx-auto mb-3 text-[#9ca3af]" />
        <h3 className="text-sm font-bold text-[#191c1d]">No products found</h3>
        <p className="text-xs mt-1">Start by adding your first product to your online store.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#191c1d] border-collapse font-sans">
          <thead>
            <tr className="border-b border-[#eee7dc] bg-[#faf8f5] text-[#6b7280] font-bold text-[10px] uppercase tracking-wider">
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Inventory</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {products.map(product => {
              const isLowStock =
                product.trackInventory &&
                product.inventoryCount > 0 &&
                product.inventoryCount <= (product.lowStockThreshold || 5);
              const isOutOfStock = product.trackInventory && product.inventoryCount <= 0;

              return (
                <tr key={product.id} className="hover:bg-[#faf8f5]/60 transition-colors group">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f3f4f6] border border-[#e5e7eb] overflow-hidden shrink-0 flex items-center justify-center">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={16} className="text-[#9ca3af]" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[#191c1d] group-hover:text-black flex items-center gap-1.5">
                          <span>{product.name}</span>
                          {product.hasVariants && (
                            <span className="text-[10px] font-bold bg-[#faf7f2] text-[#9e633d] border border-[#e8dfd2] px-1.5 py-0.2 rounded-md">
                              {product.variants?.length || 0} variants
                            </span>
                          )}
                        </div>
                        {product.sku && (
                          <div className="text-[10px] text-[#6b7280] font-mono mt-0.5">
                            SKU: {product.sku}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#6b7280]">
                    {product.category?.name || (
                      <span className="text-[#9ca3af] italic">Uncategorized</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-sans font-bold tabular-nums">
                    <div>{formatCurrency(Number(product.price))}</div>
                    {product.compareAtPrice && (
                      <div className="text-[10px] text-[#9ca3af] line-through font-sans tabular-nums font-normal">
                        {formatCurrency(Number(product.compareAtPrice))}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {!product.trackInventory ? (
                      <span className="text-[11px] text-[#6b7280]">Don&apos;t track</span>
                    ) : isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                        <AlertTriangle size={11} /> Out of stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-sans tabular-nums">
                        <AlertTriangle size={11} /> {product.inventoryCount} left
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#191c1d] font-sans font-semibold tabular-nums">
                        {product.inventoryCount} in stock
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={product.status} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === product.id ? null : product.id)
                        }
                        className="p-1.5 text-[#6b7280] hover:text-[#191c1d] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {activeMenuId === product.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-[#e5e7eb] z-20 py-1 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onEdit(product);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#191c1d] hover:bg-gray-50 text-left font-medium cursor-pointer"
                            >
                              <Edit2 size={12} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                setProductToDelete({ id: product.id, name: product.name });
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 text-left font-medium cursor-pointer"
                            >
                              <Trash2 size={12} /> Archive
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#eee7dc] rounded-2xl shadow-xl p-5 max-w-sm w-full space-y-4 font-sans">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#191c1d]">Archive Product</h4>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="text-[#9ca3af] hover:text-[#191c1d] p-1"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-[#665e57]">
              Are you sure you want to remove <b>&ldquo;{productToDelete.name}&rdquo;</b> from your
              active catalog?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="inline-flex items-center justify-center bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Archive Product
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

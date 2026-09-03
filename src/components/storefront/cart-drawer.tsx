"use client";

import {
  AlertCircle,
  ArrowRight,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { validateStorefrontCartStock } from "@/services/api/product.service";
import type { CartDrawerProps, StockValidationIssue } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { useCart } from "./cart-context";
import { CheckoutModal } from "./checkout-modal";

export function CartDrawer({ slug, studioName }: CartDrawerProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [stockIssues, setStockIssues] = useState<StockValidationIssue[]>([]);

  if (!isCartOpen) return null;

  const handleOpenCheckout = async () => {
    if (items.length === 0) return;
    setStockIssues([]);
    setIsValidating(true);

    try {
      const validation = await validateStorefrontCartStock(slug, {
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || undefined,
          quantity: i.quantity,
        })),
      });

      if (!validation.isValid && validation.issues.length > 0) {
        setStockIssues(validation.issues);
        return;
      }

      setIsCheckoutOpen(true);
    } catch {
      setIsCheckoutOpen(true);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setIsCartOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#eee7dc] animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-[#eee7dc] flex items-center justify-between bg-[#faf8f5]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#1f1d1a]" />
                <h3 className="text-sm font-bold text-[#1f1d1a]">Your Shopping Bag</h3>
                <span className="text-[11px] font-sans font-bold tabular-nums bg-white border border-[#e5e7eb] text-[#1f1d1a] px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-[#6b7280] hover:text-[#1f1d1a] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stock Warning Notice */}
            {stockIssues.length > 0 && (
              <div className="p-4 bg-red-50 border-b border-red-200 text-xs text-red-800 space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle size={15} className="text-red-600 shrink-0" />
                  <span>Inventory update before checkout:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                  {stockIssues.map((issue, idx) => (
                    <li key={idx}>
                      <b>{issue.productName}</b>:{" "}
                      {issue.issue === "OUT_OF_STOCK"
                        ? "Out of stock"
                        : `Only ${issue.availableQty} available`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-[#6b7280]">
                  <Package size={40} className="mx-auto mb-3 text-[#cbd5e1]" />
                  <p className="text-sm font-semibold text-[#1f1d1a]">Your bag is empty</p>
                  <p className="text-xs mt-1">Browse our products and add items to your cart.</p>
                </div>
              ) : (
                items.map(item => {
                  const itemPrice =
                    item.price !== undefined ? item.price : Number(item.product.price);
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3.5 p-3.5 rounded-2xl border border-[#eee7dc] bg-white shadow-2xs"
                    >
                      <div className="w-16 h-16 rounded-xl bg-[#f3f4f6] overflow-hidden border border-[#eee7dc] shrink-0 flex items-center justify-center">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={20} className="text-[#9ca3af]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-[#1f1d1a] truncate">
                              {item.product.name}
                            </h4>
                            {item.variantTitle && (
                              <p className="text-[11px] font-semibold text-[#9e633d]">
                                {item.variantTitle}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-[#9ca3af] hover:text-red-600 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="text-xs font-sans font-bold tabular-nums text-[#1f1d1a] mt-1.5">
                          {formatCurrency(itemPrice * item.quantity)}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-[#e5e7eb] rounded-lg bg-[#faf8f5]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-[#6b7280] hover:text-black hover:bg-gray-200 rounded-l-lg transition-colors cursor-pointer"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-2.5 text-xs font-sans font-bold tabular-nums text-[#1f1d1a]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-[#6b7280] hover:text-black hover:bg-gray-200 rounded-r-lg transition-colors cursor-pointer"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout Button */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[#eee7dc] bg-[#faf8f5] space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#665e57] font-medium">Subtotal</span>
                  <span className="font-sans font-bold tabular-nums text-base text-[#1f1d1a]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-[#8c827a]">
                  Shipping and taxes calculated during checkout.
                </p>

                <button
                  type="button"
                  disabled={isValidating}
                  onClick={handleOpenCheckout}
                  className="w-full py-3.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isValidating ? "Checking Stock..." : "Proceed to Checkout"}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        slug={slug}
        studioName={studioName}
        onOrderComplete={() => {
          clearCart();
          setIsCheckoutOpen(false);
          setIsCartOpen(false);
        }}
      />
    </>
  );
}

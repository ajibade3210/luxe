"use client";

import { Eye, MessageCircle, ShoppingBag } from "lucide-react";
import type { CheckoutSession, Order, OrdersTableProps } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { StatusBadge } from "../common/status-badge";

export function OrdersTable({
  orders,
  isAbandonedTab,
  isLoading,
  onSelectOrder,
}: OrdersTableProps) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-[#6b7280]">
        <div className="animate-spin w-5 h-5 border-2 border-[#191c1d] border-t-transparent rounded-full mx-auto mb-2" />
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-16 text-center text-[#6b7280]">
        <ShoppingBag size={36} className="mx-auto mb-3 text-[#9ca3af]" />
        <h3 className="text-sm font-bold text-[#191c1d]">
          {isAbandonedTab ? "No abandoned checkouts" : "No orders found"}
        </h3>
        <p className="text-xs mt-1">
          {isAbandonedTab
            ? "Great! All customers are completing their checkouts."
            : "Orders placed by buyers will automatically show up here."}
        </p>
      </div>
    );
  }

  if (isAbandonedTab) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#191c1d] border-collapse font-sans">
          <thead>
            <tr className="border-b border-[#eee7dc] bg-[#faf8f5] text-[#6b7280] font-bold text-[10px] uppercase tracking-wider">
              <th className="py-3.5 px-4">Customer Contact</th>
              <th className="py-3.5 px-4">Cart Value</th>
              <th className="py-3.5 px-4">Items</th>
              <th className="py-3.5 px-4">Abandoned On</th>
              <th className="py-3.5 px-4 text-right">Recovery Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {(orders as CheckoutSession[]).map(session => {
              const phone = session.customerPhone ? session.customerPhone.replace(/\D/g, "") : "";
              const whatsappUrl = phone
                ? `https://wa.me/${phone}?text=Hello%20${encodeURIComponent(session.customerName || "there")},%20we%20noticed%20you%20left%20items%20in%20your%20cart%20at%20our%20store.%20Can%20we%20help%20you%20complete%20your%20order?`
                : null;

              return (
                <tr key={session.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#191c1d]">
                      {session.customerName || "Anonymous Guest"}
                    </div>
                    <div className="text-[11px] text-[#6b7280] mt-0.5">
                      {session.customerEmail || "No email"}{" "}
                      {session.customerPhone ? `• ${session.customerPhone}` : ""}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-sans font-bold tabular-nums">
                    {formatCurrency(Number(session.subtotal))}
                  </td>

                  <td className="py-3.5 px-4 text-[#6b7280]">
                    {session.cartSnapshot
                      ? `${session.cartSnapshot.length} item(s)`
                      : "Cart details"}
                  </td>

                  <td className="py-3.5 px-4 text-[#6b7280]">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] hover:border-[#9ca3af] px-3 py-1.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs"
                      >
                        <MessageCircle size={12} className="text-emerald-600" /> Contact on WhatsApp
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-[#191c1d] border-collapse font-sans">
        <thead>
          <tr className="border-b border-[#eee7dc] bg-[#faf8f5] text-[#6b7280] font-bold text-[10px] uppercase tracking-wider">
            <th className="py-3.5 px-4">Order #</th>
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4">Customer</th>
            <th className="py-3.5 px-4">Total</th>
            <th className="py-3.5 px-4">Payment</th>
            <th className="py-3.5 px-4">Fulfillment</th>
            <th className="py-3.5 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0f0f0]">
          {(orders as Order[]).map(order => (
            <tr key={order.id} className="hover:bg-[#faf8f5]/60 transition-colors group">
              <td className="py-3.5 px-4">
                <button
                  type="button"
                  onClick={() => onSelectOrder(order.id)}
                  className="font-mono font-bold text-[#191c1d] hover:underline cursor-pointer"
                >
                  {order.orderNumber}
                </button>
              </td>

              <td className="py-3.5 px-4 text-[#6b7280]">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>

              <td className="py-3.5 px-4">
                <div className="font-semibold text-[#191c1d]">{order.customerName}</div>
                <div className="text-[10px] text-[#6b7280]">{order.customerPhone}</div>
              </td>

              <td className="py-3.5 px-4 font-sans font-bold tabular-nums">
                {formatCurrency(Number(order.total))}
              </td>

              <td className="py-3.5 px-4">
                <StatusBadge status={order.paymentStatus} />
              </td>

              <td className="py-3.5 px-4">
                <StatusBadge status={order.fulfillmentStatus} />
              </td>

              <td className="py-3.5 px-4 text-right">
                <button
                  type="button"
                  onClick={() => onSelectOrder(order.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#191c1d] hover:bg-gray-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Eye size={12} /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

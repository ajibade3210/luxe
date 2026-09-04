"use client";

import { MapPin, Package, ShieldCheck, Truck, User, X } from "lucide-react";
import { useState } from "react";
import { useOrderQuery, useUpdateOrderStatusMutation } from "@/hooks/queries";
import type { FulfillmentStatus, OrderDetailsDrawerProps, PaymentStatus } from "@/types";
import { formatCurrency } from "@/utils/currency";

import { StatusBadge } from "../common/status-badge";

export function OrderDetailsDrawer({ orderId, onClose }: OrderDetailsDrawerProps) {
  const { data: order, isLoading } = useOrderQuery(orderId);
  const updateMutation = useUpdateOrderStatusMutation();

  const [fulfillmentStatus, setFulfillmentStatus] = useState<FulfillmentStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("");

  if (!orderId) return null;

  const handleUpdateStatus = async () => {
    if (!order) return;
    await updateMutation.mutateAsync({
      id: order.id,
      input: {
        fulfillmentStatus: (fulfillmentStatus as FulfillmentStatus) || undefined,
        paymentStatus: (paymentStatus as PaymentStatus) || undefined,
        trackingNumber: trackingNumber || undefined,
        courierName: courierName || undefined,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-[#e5e7eb] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#eee] bg-[#fafaf9]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#191c1d] font-mono">
                {order?.orderNumber || "Order Details"}
              </h2>
              {order && (
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={order.paymentStatus} />
                  <StatusBadge status={order.fulfillmentStatus} />
                </div>
              )}
            </div>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Placed on {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "..."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#6b7280] hover:text-[#191c1d] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        {isLoading || !order ? (
          <div className="p-12 text-center text-xs text-[#6b7280] my-auto">
            <div className="animate-spin w-5 h-5 border-2 border-[#191c1d] border-t-transparent rounded-full mx-auto mb-2" />
            Loading order details...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#191c1d]">
            {/* Customer & Delivery Information Card */}
            <div className="bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 font-bold text-[#191c1d] text-xs">
                <User size={14} className="text-[#6b7280]" />
                Customer Contact
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#6b7280] block text-[11px]">Name:</span>
                  <b>{order.customerName}</b>
                </div>
                <div>
                  <span className="text-[#6b7280] block text-[11px]">Phone:</span>
                  <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline">
                    {order.customerPhone}
                  </a>
                </div>
                {order.customerEmail && (
                  <div className="col-span-2">
                    <span className="text-[#6b7280] block text-[11px]">Email:</span>
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {order.customerEmail}
                    </a>
                  </div>
                )}
              </div>

              {/* Delivery Details */}
              <div className="pt-3 border-t border-[#eee]">
                <div className="flex items-center gap-2 font-bold text-[#191c1d] text-xs mb-1">
                  {order.deliveryType === "STORE_PICKUP" ? (
                    <MapPin size={14} className="text-[#6b7280]" />
                  ) : (
                    <Truck size={14} className="text-[#6b7280]" />
                  )}
                  {order.deliveryType === "STORE_PICKUP" ? "Store Pickup" : "Home Delivery"}
                </div>
                {order.shippingAddress ? (
                  <div className="text-xs text-[#444748] space-y-0.5">
                    <div>{order.shippingAddress.addressLine1}</div>
                    {order.shippingAddress.addressLine2 && (
                      <div>{order.shippingAddress.addressLine2}</div>
                    )}
                    <div>
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[#6b7280]">Customer will pick up at store.</div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#6b7280] mb-3 flex items-center gap-1.5">
                <Package size={14} /> Purchased Items ({order.items.length})
              </h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white border border-[#e5e7eb] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] overflow-hidden border border-[#e5e7eb] shrink-0 flex items-center justify-center">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={16} className="text-[#9ca3af]" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[#191c1d]">{item.productName}</div>
                        <div className="text-[10px] text-[#6b7280]">
                          <span className="font-sans font-bold tabular-nums">
                            {formatCurrency(Number(item.unitPrice))}
                          </span>{" "}
                          × {item.quantity} unit{item.quantity > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    <div className="font-sans font-bold tabular-nums text-xs text-[#191c1d]">
                      {formatCurrency(Number(item.totalPrice))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Breakdown & Split Settlement */}
            <div className="bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-4 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#6b7280] mb-2 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Payment & Split Breakdown
              </h3>
              <div className="flex justify-between text-xs text-[#6b7280]">
                <span>Product Subtotal:</span>
                <span className="font-sans font-bold tabular-nums text-[#191c1d]">
                  {formatCurrency(Number(order.subtotal))}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#6b7280]">
                <span>Delivery Fee:</span>
                <span className="font-sans font-bold tabular-nums text-[#191c1d]">
                  {formatCurrency(Number(order.deliveryFee))}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#6b7280]">
                <span>Platform Commission:</span>
                <span className="font-sans font-bold tabular-nums text-red-600">
                  - {formatCurrency(Number(order.platformFee))}
                </span>
              </div>
              <div className="pt-2 border-t border-[#eee] flex justify-between text-xs font-bold text-[#191c1d]">
                <span>Total Paid by Buyer:</span>
                <span className="font-sans font-bold tabular-nums text-sm">
                  {formatCurrency(Number(order.total))}
                </span>
              </div>
              <div className="pt-1 flex justify-between text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <span>Net Deposited to Vendor Bank:</span>
                <span className="font-sans font-bold tabular-nums">
                  {formatCurrency(Number(order.merchantEarnings))}
                </span>
              </div>
            </div>

            {/* Fulfillment Status Switcher */}
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#191c1d] flex items-center gap-1.5">
                <Truck size={14} /> Update Fulfillment
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    defaultValue={order.fulfillmentStatus}
                    onChange={e => setFulfillmentStatus(e.target.value as FulfillmentStatus)}
                    className="w-full px-3 py-1.5 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
                  >
                    <option value="UNFULFILLED">Unfulfilled</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                    <option value="DISPATCHED">Dispatched / In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Payment Status
                  </label>
                  <select
                    defaultValue={order.paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-1.5 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
                  >
                    <option value="UNPAID">Unpaid</option>
                    <option value="PAID">Paid</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Courier Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Fez Delivery, DHL"
                    defaultValue={order.courierName || ""}
                    onChange={e => setCourierName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., TRK-982189"
                    defaultValue={order.trackingNumber || ""}
                    onChange={e => setTrackingNumber(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#fafaf9] border border-[#e5e7eb] rounded-xl font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updateMutation.isPending}
                className="inline-flex items-center justify-center gap-2 w-full bg-[#111827] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs disabled:opacity-50 mt-2"
              >
                {updateMutation.isPending ? "Updating..." : "Save Status Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

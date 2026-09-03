"use client";

import { CheckCircle2, CreditCard, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useStorefrontDeliveryConfigQuery } from "@/hooks/queries";
import { initializeOrderPayment } from "@/services/api/billing.service";
import { placeStorefrontOrder, syncCheckoutSession } from "@/services/api/order.service";
import type { CheckoutModalProps, DeliveryType, Order, ShippingAddress } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { useCart } from "./cart-context";
import { CheckoutDeliveryForm } from "./checkout-delivery-form";
import { CheckoutOrderSummary } from "./checkout-order-summary";

export function CheckoutModal({
  isOpen,
  onClose,
  slug,
  studioName,
  onOrderComplete,
}: CheckoutModalProps) {
  const { items, subtotal } = useCart();
  const { data: deliveryConfig } = useStorefrontDeliveryConfigQuery(slug);

  const [step, setStep] = useState<"details" | "success">("details");
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("HOME_DELIVERY");
  const [address, setAddress] = useState<ShippingAddress>({
    recipientName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Lagos",
    postalCode: "",
    deliveryNote: "",
  });

  // Default to Store Pickup if merchant doesn't offer Home Delivery
  useEffect(() => {
    if (deliveryConfig) {
      if (!deliveryConfig.enableHomeDelivery && deliveryConfig.enableStorePickup) {
        setDeliveryType("STORE_PICKUP");
      }
    }
  }, [deliveryConfig]);

  // Autofill recipient name and phone from customer info when changed
  useEffect(() => {
    if (customerName && !address.recipientName) {
      setAddress(prev => ({ ...prev, recipientName: customerName }));
    }
    if (customerPhone && !address.phone) {
      setAddress(prev => ({ ...prev, phone: customerPhone }));
    }
  }, [customerName, customerPhone, address.recipientName, address.phone]);

  // Dynamic Shipping Calculation based on state & merchant zones
  const { matchedZone, deliveryFee, isFreeShipping } = useMemo(() => {
    if (deliveryType === "STORE_PICKUP") {
      return { matchedZone: null, deliveryFee: 0, isFreeShipping: false };
    }

    const freeThreshold = deliveryConfig?.freeDeliveryThreshold;
    const isFree = Boolean(freeThreshold && subtotal >= freeThreshold);

    const zones = deliveryConfig?.deliveryZones || [];
    // 1. Check exact state match
    let zone = zones.find(z => z.states.includes(address.state));
    // 2. Fallback to nationwide / flat rate zone (states is empty)
    if (!zone) {
      zone = zones.find(z => z.states.length === 0);
    }

    const fee = isFree ? 0 : zone ? zone.fee : 0;

    return {
      matchedZone: zone,
      deliveryFee: fee,
      isFreeShipping: isFree,
    };
  }, [deliveryType, deliveryConfig, address.state, subtotal]);

  const grandTotal = subtotal + deliveryFee;

  // Sync CheckoutSession in background when contact info is typed (for lead recovery)
  const handleBlurContact = async () => {
    if (customerEmail || customerPhone) {
      try {
        const session = await syncCheckoutSession(
          slug,
          {
            customerName: customerName || null,
            customerEmail: customerEmail || null,
            customerPhone: customerPhone || null,
            cartSnapshot: items.map(i => ({
              productId: i.productId,
              variantId: i.variantId || undefined,
              quantity: i.quantity,
              selectedOptions: i.selectedOptions,
            })),
            subtotal,
          },
          sessionId || undefined
        );
        if (session?.id) {
          setSessionId(session.id);
        }
      } catch (_e) {}
    }
  };

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const order = await placeStorefrontOrder(slug, {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        notes: notes.trim() || null,
        deliveryType,
        shippingAddress: deliveryType === "HOME_DELIVERY" ? address : null,
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || null,
          quantity: i.quantity,
          price: i.price !== undefined ? i.price : Number(i.product.price),
        })),
        checkoutSessionId: sessionId || null,
      });

      setCreatedOrder(order);
      setStep("success");
      onOrderComplete?.(order);

      // Automatically initialize Paystack payment
      try {
        const paymentRes = await initializeOrderPayment({
          orderId: order.id,
          callbackUrl: typeof window !== "undefined" ? window.location.href : undefined,
        });
        if (paymentRes?.authorization_url) {
          setPaymentUrl(paymentRes.authorization_url);
        }
      } catch (_payErr) {
        // Merchant may not have subaccount yet; order is created as pending
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e5e7eb] overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f0f0f0] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#191c1d] tracking-tight">
              {step === "success" ? "Order Confirmed" : `Checkout — ${studioName}`}
            </h2>
            <p className="text-[11px] text-[#6b7280]">
              {step === "success"
                ? "Your order has been received."
                : "Complete your details below to place your order."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6b7280] hover:text-[#191c1d] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {step === "success" && createdOrder ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#191c1d]">Order Placed Successfully!</h3>
              <p className="text-xs text-[#6b7280] mt-1 font-mono">
                Order Reference: <b>{createdOrder.orderNumber}</b>
              </p>
            </div>

            <div className="bg-[#fafaf9] border border-[#e5e7eb] rounded-2xl p-4 text-xs text-left space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-[#6b7280]">Product Subtotal:</span>
                <span className="font-sans font-bold tabular-nums text-[#191c1d]">
                  {formatCurrency(Number(createdOrder.subtotal))}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-[#6b7280]">Delivery:</span>
                <span className="font-sans font-bold tabular-nums text-[#191c1d]">
                  {formatCurrency(Number(createdOrder.deliveryFee))}
                </span>
              </div>
              <div className="pt-2 border-t border-[#eee] flex justify-between font-bold text-[#191c1d]">
                <span>Total Amount:</span>
                <span className="font-sans font-bold tabular-nums text-sm">
                  {formatCurrency(Number(createdOrder.total))}
                </span>
              </div>
              <div className="pt-1 text-[11px] text-[#6b7280]">
                Confirmation details have been recorded for: <b>{createdOrder.customerEmail}</b>
              </div>
            </div>

            <p className="text-xs text-[#6b7280]">
              The merchant will fulfill your order shortly. Thank you for shopping with us!
            </p>

            <div className="space-y-2 pt-2">
              {paymentUrl ? (
                <a
                  href={paymentUrl}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <CreditCard size={15} />
                  <span>Pay Now with Paystack ({formatCurrency(Number(createdOrder.total))})</span>
                </a>
              ) : null}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-[#191c1d] hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmitOrder}
            className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs"
          >
            {error && (
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Order Items Summary */}
            <CheckoutOrderSummary
              items={items}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              isFreeShipping={isFreeShipping}
              grandTotal={grandTotal}
              deliveryConfig={deliveryConfig}
              matchedZone={matchedZone}
              deliveryType={deliveryType}
            />

            {/* Customer Contact */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#191c1d]">
                1. Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    onBlur={handleBlurContact}
                    placeholder="e.g. Funmi Adeleke"
                    className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    onBlur={handleBlurContact}
                    placeholder="funmi@example.com"
                    className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                    WhatsApp Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    onBlur={handleBlurContact}
                    placeholder="+234 801 234 5678"
                    className="w-full px-3.5 py-2 bg-[#fafaf9] border border-[#e5e7eb] rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method & Address */}
            <CheckoutDeliveryForm
              deliveryConfig={deliveryConfig}
              deliveryType={deliveryType}
              onDeliveryTypeChange={setDeliveryType}
              address={address}
              onAddressChange={setAddress}
              matchedZone={matchedZone}
              deliveryFee={deliveryFee}
              isFreeShipping={isFreeShipping}
            />

            {/* Actions */}
            <div className="pt-4 border-t border-[#eee] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#6b7280] hover:text-[#191c1d] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#191c1d] hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? "Placing Order..." : `Place Order (${formatCurrency(grandTotal)})`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

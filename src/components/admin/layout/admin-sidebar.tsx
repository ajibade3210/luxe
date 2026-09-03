"use client";

import {
  Eye,
  FileText,
  LogOut,
  Package,
  Receipt,
  ShoppingBag,
  Store,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import {
  useCustomersQuery,
  useExpensesQuery,
  useInvoicesQuery,
  useLeadsQuery,
  useOrderSummaryQuery,
  useProductsQuery,
} from "@/hooks/queries";
import { useCurrentStudio } from "@/hooks/use-current-studio";
import type { AdminSidebarProps } from "@/types";
import { LogoutConfirmModal } from "./logout-modal";

export function AdminSidebar({ path, open, onClose }: AdminSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isPreferencesActive = path === "/vendor/settings" || path === "/vendor/preferences";
  const [onlineStoreExpanded, setOnlineStoreExpanded] = useState<boolean>(
    () => isPreferencesActive
  );

  const { slug, userName, userRole, initials } = useCurrentStudio();
  const { data: leads } = useLeadsQuery();
  const { data: customers } = useCustomersQuery();
  const { data: invoices } = useInvoicesQuery();
  const { data: expenses } = useExpensesQuery();
  const { data: productsData } = useProductsQuery({ limit: 1 });
  const { data: orderSummary } = useOrderSummaryQuery();

  const leadCount = leads?.length ?? null;
  const customerCount = customers?.length ?? null;
  const invoiceCount = invoices?.length ?? null;
  const expenseCount = expenses?.length ?? null;
  const productCount = productsData?.meta?.total ?? null;
  const unfulfilledOrderCount =
    orderSummary?.unfulfilled ?? (orderSummary?.totalOrders ? orderSummary.totalOrders : null);

  // Close sidebar on click outside or Escape key when open
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement | null;
        if (target?.closest(".mobile-menu")) return;
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    setOnlineStoreExpanded(isPreferencesActive);
  }, [isPreferencesActive]);

  const navLinkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium font-sans rounded-lg transition-all w-full cursor-pointer text-decoration-none ${
      isActive
        ? "bg-white text-[#191c1d] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        : "text-[#6b7280] hover:text-[#191c1d] hover:bg-[#edeeef]"
    }`;

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 bottom-0 h-screen max-h-screen w-[240px] flex flex-col bg-[#f3f4f5] border-r border-[#e5e7eb] p-[28px_18px_22px] z-40 transition-transform duration-200 font-sans max-[750px]:w-[280px] max-[750px]:z-50 max-[750px]:-translate-x-full ${
          open ? "max-[750px]:!translate-x-0 max-[750px]:shadow-[10px_0_30px_rgba(0,0,0,0.12)]" : ""
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <BrandLogo className="brand" href="/" />
          <button
            className="hidden max-[750px]:grid place-items-center bg-transparent border-0 text-[#6b7280] hover:text-[#191c1d] cursor-pointer p-1 rounded-md font-sans"
            onClick={onClose}
            type="button"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 mt-14 font-sans">
          <Link
            className={navLinkClass(
              path === "/vendor/analytics" || path === "/vendor/overview" || path === "/vendor"
            )}
            href="/vendor/analytics"
            onClick={onClose}
          >
            <TrendingUp size={16} /> Analytics
          </Link>
          <Link
            className={navLinkClass(path?.startsWith("/vendor/orders"))}
            href="/vendor/orders"
            onClick={onClose}
          >
            <ShoppingBag size={16} /> Orders{" "}
            {unfulfilledOrderCount !== null && (
              <span className="ml-auto text-[11px] font-mono bg-[#e7e8e9] text-[#191c1d] px-1.5 py-0.5 rounded">
                {unfulfilledOrderCount}
              </span>
            )}
          </Link>
          <Link
            className={navLinkClass(path?.startsWith("/vendor/products"))}
            href="/vendor/products"
            onClick={onClose}
          >
            <Package size={16} /> Products{" "}
            {productCount !== null && (
              <span className="ml-auto text-[11px] font-mono bg-[#e7e8e9] text-[#191c1d] px-1.5 py-0.5 rounded">
                {productCount}
              </span>
            )}
          </Link>
          <Link
            className={navLinkClass(path === "/vendor/leads")}
            href="/vendor/leads"
            onClick={onClose}
          >
            <Users size={16} /> Leads{" "}
            {leadCount !== null && (
              <span className="ml-auto text-[11px] font-mono bg-[#e7e8e9] text-[#191c1d] px-1.5 py-0.5 rounded">
                {leadCount}
              </span>
            )}
          </Link>
          <Link
            className={navLinkClass(path === "/vendor/customers")}
            href="/vendor/customers"
            onClick={onClose}
          >
            <Users size={16} /> Customers{" "}
            {customerCount !== null && (
              <span className="ml-auto text-[11px] font-mono bg-[#e7e8e9] text-[#191c1d] px-1.5 py-0.5 rounded">
                {customerCount}
              </span>
            )}
          </Link>
          <Link
            className={navLinkClass(path === "/vendor/invoices")}
            href="/vendor/invoices"
            onClick={onClose}
          >
            <FileText size={16} /> Invoices{" "}
            {invoiceCount !== null && (
              <span className="ml-auto text-[11px] font-mono bg-[#e7e8e9] text-[#191c1d] px-1.5 py-0.5 rounded">
                {invoiceCount}
              </span>
            )}
          </Link>
          <Link
            className={navLinkClass(path === "/vendor/expenses")}
            href="/vendor/expenses"
            onClick={onClose}
          >
            <Receipt size={16} /> Expenses{" "}
            {expenseCount !== null && (
              <span className="ml-auto text-[11px] font-mono bg-[#e7e8e9] text-[#191c1d] px-1.5 py-0.5 rounded">
                {expenseCount}
              </span>
            )}
          </Link>

          {/* Collapsible Online Store Section */}
          <div className="pt-2">
            <button
              type="button"
              className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium font-sans rounded-lg transition-all cursor-pointer ${
                onlineStoreExpanded
                  ? "text-[#191c1d] hover:bg-[#edeeef]"
                  : "text-[#6b7280] hover:text-[#191c1d] hover:bg-[#edeeef]"
              }`}
              onClick={() => setOnlineStoreExpanded(prev => !prev)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Store size={16} className="shrink-0" />
                <span className="truncate text-[13px] font-medium font-sans">Online Store</span>
              </div>

              <a
                href={`/${slug}?from=settings`}
                target="_blank"
                rel="noreferrer"
                onClick={e => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1 text-[#6b7280] hover:text-[#191c1d] transition-colors shrink-0 ml-auto flex items-center justify-center rounded"
                title="View Online Store"
                aria-label="View Online Store"
              >
                <Eye size={16} />
              </a>
            </button>

            {onlineStoreExpanded && (
              <div className="relative flex flex-col mt-1 pl-8">
                {/* Curved branch line connecting parent to child */}
                <div
                  aria-hidden="true"
                  className="absolute left-[20px] -top-2.5 h-[27px] w-3.5 border-l-2 border-b-2 border-[#cbd5e1] rounded-bl-lg pointer-events-none"
                />
                <Link
                  href="/vendor/settings"
                  className={navLinkClass(isPreferencesActive)}
                  onClick={onClose}
                >
                  Preferences
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="mt-auto pt-3 border-t border-[#e5e7eb]">
          <div
            className={`group relative flex items-center justify-between p-2 rounded-xl transition-all ${
              path === "/vendor/profile"
                ? "bg-white text-[#191c1d] shadow-2xs border border-[#e5e7eb]"
                : "hover:bg-white/90 hover:shadow-2xs border border-transparent hover:border-[#e5e7eb]/80"
            }`}
          >
            <Link
              className="flex items-center gap-2.5 min-w-0 flex-1 text-decoration-none"
              href="/vendor/profile"
              aria-label="Open director profile and studio equity"
              title="Director Profile & Studio Equity"
              onClick={onClose}
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-lg bg-[#191c1d] text-white flex items-center justify-center font-serif text-xs italic font-bold shadow-2xs">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#16a34a] ring-2 ring-white" />
              </div>
              <div className="min-w-0 flex-1">
                <b className="text-xs font-semibold text-[#191c1d] block leading-tight truncate capitalize">
                  {userName}
                </b>
                <span className="text-[10px] text-[#6b7280] block leading-tight mt-0.5 truncate">
                  {userRole}
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9ca3af] hover:text-[#ef4444] hover:bg-red-50/80 transition-all shrink-0 cursor-pointer ml-1"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <LogoutConfirmModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </>
  );
}

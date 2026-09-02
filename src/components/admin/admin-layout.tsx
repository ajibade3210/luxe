"use client";

import {
  ArrowRight,
  Bell,
  Check,
  Eye,
  FileText,
  Loader2,
  LogOut,
  Menu,
  Receipt,
  Search,
  Store,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { APP_CONFIG } from "@/constants";
import {
  useCustomersQuery,
  useExpensesQuery,
  useInvoicesQuery,
  useLeadsQuery,
  useStudioProfileQuery,
} from "@/hooks/queries";
import { clearSession, getCurrentSession, publishChanges } from "@/lib/api";
import type {
  AdminHeaderProps,
  AdminLayoutProps,
  AdminSidebarProps,
  AdminToastContextType,
  MetricProps,
  PageTitleProps,
  ToastProps,
} from "@/types";

export { formatDate, formatMoney, formatStatusLabel } from "@/utils";

const AdminToastContext = createContext<AdminToastContextType>({
  showToast: () => {},
});

export function useAdminToast() {
  return useContext(AdminToastContext);
}

export function Brand() {
  return <BrandLogo className="brand" href="/" />;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast">
      <Check size={15} /> {message}
      <button type="button" onClick={onClose} aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
}

export function LogoutConfirmModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoggingOut) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoggingOut, onClose]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await clearSession();
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={() => !isLoggingOut && onClose()}
    >
      <div
        className="bg-white border border-[#eee7dc] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div>
          <h3 className="text-lg font-serif font-bold text-[#1f1d1a]">Log out?</h3>
          <p className="text-xs text-[#665e57] mt-1 leading-relaxed">
            Are you sure you want to sign out of your account?
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={onClose}
            className="bg-white hover:bg-[#f8f4ed] text-[#2a1d15] border border-[#ded5c8] hover:border-[#c59a78] px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="bg-[#191c1d] hover:bg-black !text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Logging out…</span>
              </>
            ) : (
              <span>Log out</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Metric({ label, value, detail }: MetricProps) {
  const isLong = typeof value === "string" && value.length > 12;
  return (
    <div className="metric">
      <span className="eyebrow">{label}</span>
      <strong
        className={isLong ? "!text-lg sm:!text-xl !leading-snug !font-semibold truncate" : ""}
      >
        {value}
      </strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

export function PageTitle({ title, action, children }: PageTitleProps) {
  return (
    <div className="page-title">
      <div>
        <h1>{title}</h1>
      </div>
      {(action || children) && (
        <div className="page-title-actions hidden lg:flex items-center gap-2.5">
          {action || children}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ path, open, onClose }: AdminSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [onlineStoreExpanded, setOnlineStoreExpanded] = useState<boolean>(
    () => path === "/vendor/settings"
  );

  const { data: profile } = useStudioProfileQuery();
  const { data: leads } = useLeadsQuery();
  const { data: customers } = useCustomersQuery();
  const { data: invoices } = useInvoicesQuery();
  const { data: expenses } = useExpensesQuery();

  const [session, setSession] = useState<ReturnType<typeof getCurrentSession>>(null);

  useEffect(() => {
    setSession(getCurrentSession());
  }, []);

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

  const slug = profile?.slug || session?.studioSlug || APP_CONFIG.defaultSlug;
  const userName = session?.name || profile?.businessName || "Vendor";
  const userRole = profile?.businessName || session?.studioName || "Store Owner";
  const initials =
    userName
      .split(" ")
      .map(p => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SW";

  const leadCount = leads?.length ?? null;
  const customerCount = customers?.length ?? null;
  const invoiceCount = invoices?.length ?? null;
  const expenseCount = expenses?.length ?? null;

  useEffect(() => {
    setOnlineStoreExpanded(path === "/vendor/settings");
  }, [path]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`sidebar ${open ? "is-open" : ""}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="sidebar-top">
          <Brand />
          <button className="mobile-close" onClick={onClose} type="button" aria-label="Close sidebar">
            <X />
          </button>
        </div>
        <nav>
          <Link
            className={
              path === "/vendor/analytics" || path === "/vendor/overview" || path === "/vendor"
                ? "active"
                : ""
            }
            href="/vendor/analytics"
            onClick={onClose}
          >
            <TrendingUp size={16} /> Analytics
          </Link>
          <Link
            className={path === "/vendor/leads" ? "active" : ""}
            href="/vendor/leads"
            onClick={onClose}
          >
            <Users size={16} /> Leads{" "}
            {leadCount !== null && <span className="nav-count">{leadCount}</span>}
          </Link>
          <Link
            className={path === "/vendor/customers" ? "active" : ""}
            href="/vendor/customers"
            onClick={onClose}
          >
            <Users size={16} /> Customers{" "}
            {customerCount !== null && <span className="nav-count">{customerCount}</span>}
          </Link>
          <Link
            className={path === "/vendor/invoices" ? "active" : ""}
            href="/vendor/invoices"
            onClick={onClose}
          >
            <FileText size={16} /> Invoices{" "}
            {invoiceCount !== null && <span className="nav-count">{invoiceCount}</span>}
          </Link>
          <Link
            className={path === "/vendor/expenses" ? "active" : ""}
            href="/vendor/expenses"
            onClick={onClose}
          >
            <Receipt size={16} /> Expenses{" "}
            {expenseCount !== null && <span className="nav-count">{expenseCount}</span>}
          </Link>
          {/* Online Store Section */}
          <div className="flex flex-col">
            <button
              type="button"
              className={`nav-item justify-between ${
                onlineStoreExpanded || path === "/vendor/settings" ? "active" : ""
              }`}
              onClick={() => setOnlineStoreExpanded(prev => !prev)}
            >
              <div className="flex items-center gap-[12px] min-w-0">
                <Store size={16} className="shrink-0" />
                <span className="truncate">Online Store</span>
              </div>

              <a
                href={`/${slug}?from=settings`}
                target="_blank"
                rel="noreferrer"
                onClick={e => {
                  e.stopPropagation();
                  onClose();
                }}
                className="!p-1 !h-auto !w-auto !gap-0 rounded text-[#9ca3af] hover:text-[#191c1d] transition-colors shrink-0 ml-auto"
                title="View Online Store"
                aria-label="View Online Store"
              >
                <Eye size={15} />
              </a>
            </button>

            {onlineStoreExpanded && (
              <div className="flex flex-col mt-1 pl-7">
                <Link
                  href="/vendor/settings"
                  className={path === "/vendor/settings" ? "active" : ""}
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

export function Header({ onMenu, onToast, path }: AdminHeaderProps) {
  const [busy, setBusy] = useState(false);
  const pathname = usePathname();
  const currentPath = path || pathname || "";
  const isSettingsPage =
    currentPath === "/vendor/settings" || currentPath === "/vendor/preferences";

  const { data: profile } = useStudioProfileQuery();
  const [session, setSession] = useState<ReturnType<typeof getCurrentSession>>(null);

  useEffect(() => {
    setSession(getCurrentSession());
  }, []);

  const slug = profile?.slug || session?.studioSlug || APP_CONFIG.defaultSlug;

  return (
    <header className="admin-header">
      <button className="mobile-menu" onClick={onMenu}>
        <Menu />
      </button>
      <div className="search">
        <Search size={16} />
        <input aria-label="Search" placeholder="Search anything..." />
      </div>
      <div className="header-actions">
        {isSettingsPage && (
          <>
            <a
              href={`/${slug}?from=settings`}
              target="_blank"
              rel="noreferrer"
              className="h-9 px-2.5 sm:px-3.5 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e5e7eb] hover:border-[#191c1d] bg-white text-[#191c1d] text-xs font-semibold transition-all shrink-0 whitespace-nowrap shadow-2xs hover:bg-neutral-50"
              title="View Public Profile"
            >
              <Eye size={14} className="text-[#191c1d] shrink-0" />
              <span className="hidden sm:inline">Profile </span>
              <span>View</span>
            </a>
            <button
              className="h-9 px-3 sm:px-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#000000] hover:bg-[#262626] text-white text-xs font-semibold transition-all shrink-0 whitespace-nowrap shadow-2xs cursor-pointer disabled:opacity-60"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await publishChanges();
                setBusy(false);
                onToast("Changes published successfully");
              }}
            >
              {busy ? (
                <span>Publishing…</span>
              ) : (
                <>
                  <span>
                    Publish<span className="hidden sm:inline"> changes</span>
                  </span>
                  <ArrowRight size={13} className="shrink-0" />
                </>
              )}
            </button>
          </>
        )}
        <button className="icon-button" aria-label="Notifications" title="Notifications">
          <Bell size={17} />
        </button>
      </div>
    </header>
  );
}

export function AdminLayout({ children, path, onToast }: AdminLayoutProps) {
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const pathname = usePathname();
  const currentPath = path || pathname || "/";

  // Automatically close sidebar whenever user switches between sections/routes
  useEffect(() => {
    if (currentPath) {
      setOpen(false);
    }
  }, [currentPath]);

  // Swipe right to open sidebar, swipe left to close on mobile and tablet
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let isTracking = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || window.innerWidth > 1024) return;
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest("input, textarea, select, [role='slider'], .no-swipe")) {
        return;
      }
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isTracking = true;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTracking || e.changedTouches.length !== 1) return;
      isTracking = false;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = Math.abs(touchEndY - touchStartY);

      // Must be predominantly horizontal gesture
      if (diffY > 80 || Math.abs(diffX) < diffY * 1.4) return;

      // Swipe right to open: moved right by >= 50px, starting from the left half of the screen
      if (diffX > 50 && touchStartX < window.innerWidth * 0.5) {
        setOpen(true);
      } else if (diffX < -50 && open) {
        // Swipe left to close when open
        setOpen(false);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [open]);

  const handleToast = (msg: string) => {
    setToastMessage(msg);
    if (onToast) onToast(msg);
  };

  return (
    <AdminToastContext.Provider value={{ showToast: handleToast }}>
      <div className="admin">
        {/* Mobile backdrop overlay to dismiss sidebar */}
        {open && (
          <div
            className="sidebar-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
        <Sidebar path={currentPath} open={open} onClose={() => setOpen(false)} />
        <div className="admin-main">
          <Header onMenu={() => setOpen(true)} onToast={handleToast} path={currentPath} />
          {children}
        </div>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
      </div>
    </AdminToastContext.Provider>
  );
}

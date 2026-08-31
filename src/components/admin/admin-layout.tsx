"use client";

import {
  ArrowRight,
  Bell,
  Check,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  LogOut,
  Menu,
  Receipt,
  Search,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { APP_CONFIG, CUSTOM_EVENTS } from "@/constants";
import { clearSession, getBusinessProfile, getCurrentSession, publishChanges } from "@/lib/api";
import type {
  AdminHeaderProps,
  AdminLayoutProps,
  AdminSidebarProps,
  AdminToastContextType,
  Customer,
  Expense,
  Invoice,
  Lead,
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
      {(action || children) && <div className="page-title-actions">{action || children}</div>}
    </div>
  );
}

export function Sidebar({ path, open, onClose }: AdminSidebarProps) {
  // Always start with the stable default so SSR and the initial client render agree,
  // then immediately update from the session cache and/or API.
  const [slug, setSlug] = useState<string>(APP_CONFIG.defaultSlug);
  const [userName, setUserName] = useState<string>("Elena Vance");
  const [userRole, setUserRole] = useState<string>("Lead Brand Designer");
  const [initials, setInitials] = useState<string>("EV");
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [invoiceCount, setInvoiceCount] = useState<number | null>(null);
  const [expenseCount, setExpenseCount] = useState<number | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Hydrate user and slug from session cache first (instant), then confirm from API if needed.
    const session = getCurrentSession();
    if (session) {
      if (session.studioSlug) setSlug(session.studioSlug);
      if (session.name) {
        setUserName(session.name);
        const inits = session.name
          .split(" ")
          .map(p => p[0])
          .filter(Boolean)
          .slice(0, 2)
          .join("")
          .toUpperCase();
        if (inits) setInitials(inits);
      }
      if (session.studioName) {
        setUserRole(`${session.studioName}`);
      }
    }

    getBusinessProfile()
      .then(profile => {
        if (profile?.slug) setSlug(profile.slug);
        if (profile?.businessName) {
          setUserRole(profile.businessName);
        }
      })
      .catch(() => {});

    const handleLeadsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Lead[]>;
      if (customEvent.detail) {
        setLeadCount(customEvent.detail.length);
      }
    };
    const handleCustomersUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Customer[]>;
      if (customEvent.detail) {
        setCustomerCount(customEvent.detail.length);
      }
    };
    const handleInvoicesUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Invoice[]>;
      if (customEvent.detail) {
        setInvoiceCount(customEvent.detail.length);
      }
    };
    const handleExpensesUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Expense[]>;
      if (customEvent.detail) {
        setExpenseCount(customEvent.detail.length);
      }
    };

    window.addEventListener(CUSTOM_EVENTS.leadsUpdated, handleLeadsUpdate);
    window.addEventListener(CUSTOM_EVENTS.customersUpdated, handleCustomersUpdate);
    window.addEventListener(CUSTOM_EVENTS.invoicesUpdated, handleInvoicesUpdate);
    window.addEventListener(CUSTOM_EVENTS.expensesUpdated, handleExpensesUpdate);
    return () => {
      window.removeEventListener(CUSTOM_EVENTS.leadsUpdated, handleLeadsUpdate);
      window.removeEventListener(CUSTOM_EVENTS.customersUpdated, handleCustomersUpdate);
      window.removeEventListener(CUSTOM_EVENTS.invoicesUpdated, handleInvoicesUpdate);
      window.removeEventListener(CUSTOM_EVENTS.expensesUpdated, handleExpensesUpdate);
    };
  }, []);

  return (
    <>
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="sidebar-top">
          <Brand />
          <button className="mobile-close" onClick={onClose}>
            <X />
          </button>
        </div>
        <nav>
          <Link
            className={path === "/analytics" || path === "/overview" ? "active" : ""}
            href="/analytics"
          >
            <TrendingUp size={16} /> Analytics
          </Link>
          <Link className={path === "/leads" ? "active" : ""} href="/leads">
            <Users size={16} /> Leads{" "}
            {leadCount !== null && <span className="nav-count">{leadCount}</span>}
          </Link>
          <Link className={path === "/customers" ? "active" : ""} href="/customers">
            <Users size={16} /> Customers{" "}
            {customerCount !== null && <span className="nav-count">{customerCount}</span>}
          </Link>
          <Link className={path === "/invoices" ? "active" : ""} href="/invoices">
            <FileText size={16} /> Invoices{" "}
            {invoiceCount !== null && <span className="nav-count">{invoiceCount}</span>}
          </Link>
          <Link className={path === "/expenses" ? "active" : ""} href="/expenses">
            <Receipt size={16} /> Expenses{" "}
            {expenseCount !== null && <span className="nav-count">{expenseCount}</span>}
          </Link>
          <a
            className="text-[#0058be] hover:bg-[#0058be]/10 font-medium"
            href={`/${slug}?from=settings`}
            target="_blank"
            rel="noreferrer"
          >
            <Eye size={15} /> Profile View <ExternalLink size={13} className="ml-auto opacity-70" />
          </a>
          <Link className={path === "/settings" ? "active" : ""} href="/settings">
            <Settings size={16} /> Settings
          </Link>
        </nav>

        <div className="mt-auto pt-3 border-t border-[#e5e7eb]">
          <div
            className={`group relative flex items-center justify-between p-2 rounded-xl transition-all ${
              path === "/profile"
                ? "bg-white text-[#191c1d] shadow-2xs border border-[#e5e7eb]"
                : "hover:bg-white/90 hover:shadow-2xs border border-transparent hover:border-[#e5e7eb]/80"
            }`}
          >
            <Link
              className="flex items-center gap-2.5 min-w-0 flex-1 text-decoration-none"
              href="/profile"
              aria-label="Open director profile and studio equity"
              title="Director Profile & Studio Equity"
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

export function Header({ onMenu, onToast }: AdminHeaderProps) {
  const [busy, setBusy] = useState(false);
  // Start with the stable default so SSR and the initial client render agree.
  const [slug, setSlug] = useState<string>(APP_CONFIG.defaultSlug);

  useEffect(() => {
    const cached = getCurrentSession()?.studioSlug;
    if (cached) setSlug(cached);
    else {
      getBusinessProfile()
        .then(profile => {
          if (profile?.slug) setSlug(profile.slug);
        })
        .catch(() => {});
    }
  }, []);

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
        <a
          href={`/${slug}?from=settings`}
          target="_blank"
          rel="noreferrer"
          className="outline-button hidden sm:inline-flex border-[#e5e7eb] hover:border-[#0058be] text-[#191c1d]"
          style={{ fontSize: "11px", padding: "9px 14px" }}
        >
          <Eye size={14} className="text-[#0058be]" /> Profile View
        </a>
        <button className="icon-button" aria-label="Notifications">
          <Bell size={17} />
        </button>
        <button
          className="publish bg-[#000000] hover:bg-[#262626]"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await publishChanges();
            setBusy(false);
            onToast("Changes published successfully");
          }}
        >
          {busy ? "Publishing…" : "Publish changes"}
          <ArrowRight size={15} />
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

  const handleToast = (msg: string) => {
    setToastMessage(msg);
    if (onToast) onToast(msg);
  };

  return (
    <AdminToastContext.Provider value={{ showToast: handleToast }}>
      <div className="admin">
        <Sidebar path={currentPath} open={open} onClose={() => setOpen(false)} />
        <div className="admin-main">
          <Header onMenu={() => setOpen(true)} onToast={handleToast} />
          {children}
        </div>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
      </div>
    </AdminToastContext.Provider>
  );
}

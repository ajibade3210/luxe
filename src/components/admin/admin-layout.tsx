"use client";

import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  ExternalLink,
  Eye,
  FileText,
  Menu,
  Receipt,
  Search,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { APP_CONFIG, CUSTOM_EVENTS } from "@/constants";
import { getCustomers, getExpenses, getInvoices, getLeads, publishChanges } from "@/lib/api";
import { businessProfile } from "@/lib/mock-data";
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
  const slug = businessProfile.slug || APP_CONFIG.defaultSlug;
  const [leadCount, setLeadCount] = useState(5);
  const [customerCount, setCustomerCount] = useState(3);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(5);

  useEffect(() => {
    getLeads().then(res => setLeadCount(res.length));
    getCustomers().then(res => setCustomerCount(res.length));
    getInvoices().then(res => setInvoiceCount(res.length));
    getExpenses().then(res => setExpenseCount(res.length));

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
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="sidebar-top">
        <Brand />
        <button className="mobile-close" onClick={onClose}>
          <X />
        </button>
      </div>
      <nav>
        <a
          className={path === "/analytics" || path === "/overview" ? "active" : ""}
          href="/analytics"
        >
          <TrendingUp size={16} /> Analytics
        </a>
        <a className={path === "/leads" ? "active" : ""} href="/leads">
          <Users size={16} /> Leads <span className="nav-count">{leadCount}</span>
        </a>
        <a className={path === "/customers" ? "active" : ""} href="/customers">
          <Users size={16} /> Customers <span className="nav-count">{customerCount}</span>
        </a>
        <a className={path === "/invoices" ? "active" : ""} href="/invoices">
          <FileText size={16} /> Invoices <span className="nav-count">{invoiceCount}</span>
        </a>
        <a className={path === "/expenses" ? "active" : ""} href="/expenses">
          <Receipt size={16} /> Expenses <span className="nav-count">{expenseCount}</span>
        </a>
        <a
          className="text-[#0058be] hover:bg-[#0058be]/10 font-medium"
          href={`/${slug}?from=settings`}
          target="_blank"
          rel="noreferrer"
        >
          <Eye size={15} /> Profile View <ExternalLink size={13} className="ml-auto opacity-70" />
        </a>
        <a className={path === "/settings" ? "active" : ""} href="/settings">
          <Settings size={16} /> Settings
        </a>
      </nav>

      <div className="mt-auto pt-4 border-t border-[#e5e7eb]">
        <a
          className={`flex items-center gap-3 p-3 rounded-xl text-decoration-none transition-all cursor-pointer ${
            path === "/profile"
              ? "bg-white text-[#191c1d] shadow-2xs"
              : "hover:bg-white/80 hover:shadow-2xs text-[#191c1d]"
          }`}
          href="/profile"
          aria-label="Open director profile and studio equity"
          title="Director Profile & Studio Equity"
        >
          <div className="w-8 h-8 rounded-lg bg-[#191c1d] text-white flex items-center justify-center font-serif text-xs italic font-bold shrink-0 shadow-2xs">
            EV
          </div>
          <div className="min-w-0 flex-1">
            <b className="text-xs font-bold text-[#191c1d] block leading-tight truncate">
              Elena Vance
            </b>
            <span className="text-[10px] text-[#6b7280] block leading-tight mt-0.5 truncate">
              Lead Brand Designer
            </span>
          </div>
          <ChevronRight size={14} className="text-[#9ca3af] shrink-0" />
        </a>
      </div>
    </aside>
  );
}

export function Header({ onMenu, onToast }: AdminHeaderProps) {
  const [busy, setBusy] = useState(false);
  const slug = businessProfile.slug || APP_CONFIG.defaultSlug;
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

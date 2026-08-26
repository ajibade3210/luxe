"use client";

import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  ExternalLink,
  Eye,
  Menu,
  Search,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { getCustomers, getLeads, publishChanges } from "@/lib/api";
import { businessProfile } from "@/lib/mock-data";
import type { Customer, Lead } from "@/lib/types";

export { formatDate, formatMoney, formatStatusLabel } from "@/utils";

export function Brand() {
  return <BrandLogo className="brand" href="/" />;
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="toast">
      <Check size={15} /> {message}
      <button onClick={onClose} aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
}

export function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="metric">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

export function PageTitle({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {(action || children) && <div className="page-title-actions">{action || children}</div>}
    </div>
  );
}

export function Sidebar({
  path,
  open,
  onClose,
}: {
  path: string;
  open: boolean;
  onClose: () => void;
}) {
  const slug = businessProfile.slug || "elan-events";
  const [leadCount, setLeadCount] = useState(5);
  const [customerCount, setCustomerCount] = useState(3);

  useEffect(() => {
    getLeads().then(res => setLeadCount(res.length));
    getCustomers().then(res => setCustomerCount(res.length));

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

    window.addEventListener("luxe_leads_updated", handleLeadsUpdate);
    window.addEventListener("luxe_customers_updated", handleCustomersUpdate);
    return () => {
      window.removeEventListener("luxe_leads_updated", handleLeadsUpdate);
      window.removeEventListener("luxe_customers_updated", handleCustomersUpdate);
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
          aria-label="Open profile settings"
        >
          <div className="w-8 h-8 rounded-lg bg-[#191c1d] text-white flex items-center justify-center font-serif text-xs italic font-bold shrink-0 shadow-2xs">
            AB
          </div>
          <div className="min-w-0 flex-1">
            <b className="text-xs font-bold text-[#191c1d] block leading-tight truncate">
              Amelia Bell
            </b>
            <span className="text-[10px] text-[#6b7280] block leading-tight mt-0.5 truncate">
              Studio Director
            </span>
          </div>
          <ChevronRight size={14} className="text-[#9ca3af] shrink-0" />
        </a>
      </div>
    </aside>
  );
}

export function Header({ onMenu, onToast }: { onMenu: () => void; onToast: (s: string) => void }) {
  const [busy, setBusy] = useState(false);
  const slug = businessProfile.slug || "elan-events";
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

export function AdminLayout({
  children,
  path,
  onToast,
}: {
  children: React.ReactNode;
  path: string;
  onToast: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="admin">
      <Sidebar path={path} open={open} onClose={() => setOpen(false)} />
      <div className="admin-main">
        <Header onMenu={() => setOpen(true)} onToast={onToast} />
        {children}
      </div>
    </div>
  );
}

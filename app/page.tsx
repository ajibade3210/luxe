"use client";

import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  ExternalLink,
  Eye,
  Lock,
  Mail,
  Menu,
  Search,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ElanEventsPage } from "@/components/elan-events-page";
import { HeroRotatingCard } from "@/components/hero-rotating-card";
import { EnhancedSettingsPage } from "@/components/settings-page";
import { SignupPage } from "@/components/signup-page";
import { SiteFooter } from "@/components/site-footer";
import { TrustedBusinesses } from "@/components/trusted-businesses";
import { WorkflowSection } from "@/components/workflow-section";
import { createSession, publishChanges, updateLeadStatus } from "@/lib/api";
import { businessProfile, customers, leads } from "@/lib/mock-data";
import type { LeadStatus } from "@/lib/types";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
const date = (s: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(s));
const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Brand() {
  return (
    <a href="/" className="brand">
      <span className="brand-mark">É</span>
      <span>LuxeAdmin</span>
    </a>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="toast">
      <Check size={15} /> {message}
      <button onClick={onClose} aria-label="Close notification">
        <X size={14} />
      </button>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="metric">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

function Sidebar({ path, open, onClose }: { path: string; open: boolean; onClose: () => void }) {
  const slug = businessProfile.slug || "elan-events";
  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="sidebar-top">
        <Brand />
        <button className="mobile-close" onClick={onClose}>
          <X />
        </button>
      </div>
      <nav>
        <a className={path === "/leads" ? "active" : ""} href="/leads">
          <Users size={16} /> Leads <span className="nav-count">{leads.length}</span>
        </a>
        <a className={path === "/customers" ? "active" : ""} href="/customers">
          <Users size={16} /> Customers
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
      <a className="account" href="/profile" aria-label="Open profile settings">
        <div className="avatar bg-[#000000] text-white">AB</div>
        <div>
          <b>Amelia Bell</b>
          <span>Studio Director</span>
        </div>
        <ChevronRight size={15} />
      </a>
    </aside>
  );
}

function Header({ onMenu, onToast }: { onMenu: () => void; onToast: (s: string) => void }) {
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

function Admin({
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

function Public() {
  const [isScrolled, setIsScrolled] = useState(false);
  const slug = businessProfile.slug || "elan-events";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="public">
      <header className={`public-nav ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="public-nav-left">
          <nav>
            <a href="#features">Features</a>
            <a href="#workflow">How it works</a>
            <a href={`/${slug}`}>Studio Demo</a>
          </nav>
        </div>
        <a href="/" className="public-logo" aria-label="LuxeAdmin home">
          <span className="brand-mark bg-[#000000] text-white">É</span>
          <span>LuxeAdmin</span>
        </a>
        <div className="nav-ctas">
          <a href="/login">Log in</a>
          <a className="dark-button bg-[#000000] border-[#000000]" href="/login">
            Enter Studio <ArrowRight size={15} />
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">For the exceptionally intentional</span>
          <h1>
            Make space for
            <br />
            <em>the remarkable.</em>
          </h1>
          <p>
            LuxeAdmin brings your luxury event studio, clientele, and creative storytelling into one
            considered place.
          </p>
          <div className="hero-ctas">
            <a className="dark-button bg-[#000000] border-[#000000]" href="/settings">
              Enter your studio <ArrowRight size={15} />
            </a>
          </div>
        </div>

        <HeroRotatingCard />
      </section>

      <TrustedBusinesses />
      <WorkflowSection />
      <SiteFooter />
    </main>
  );
}

function GoogleAuthIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function Login() {
  const [email, setEmail] = useState("hello@elanevents.com");
  const [password, setPassword] = useState("password");
  const [claimParam, setClaimParam] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const claim = params.get("claim");
      if (claim) setClaimParam(claim);
    }
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    createSession({
      name: "Amelia Bell",
      email: email || "hello@elanevents.com",
      role: "Studio Director",
      studioName: "Élan Events",
      studioSlug: "elan-events",
    });
    window.location.href = claimParam
      ? `/settings?claim=${encodeURIComponent(claimParam)}`
      : "/settings";
  };

  const handleGoogleSignIn = () => {
    createSession({
      name: "Amelia Bell",
      email: "hello@elanevents.com",
      role: "Studio Director",
      studioName: "Élan Events",
      studioSlug: "elan-events",
    });
    window.location.href = claimParam
      ? `/settings?claim=${encodeURIComponent(claimParam)}`
      : "/settings";
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#191c1d] flex flex-col justify-between selection:bg-[#d8e2ff] selection:text-[#0058be] font-sans antialiased relative overflow-hidden">
      {/* Ambient Glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none opacity-40 blur-3xl -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(214, 180, 138, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 text-decoration-none group">
          <div className="w-8 h-8 rounded-lg bg-[#191c1d] text-white flex items-center justify-center font-serif text-base italic font-bold">
            É
          </div>
          <span className="font-bold text-base tracking-tight text-[#191c1d]">LuxeAdmin</span>
        </Link>
        <Link
          href={`/signup${claimParam ? `?claim=${encodeURIComponent(claimParam)}` : ""}`}
          className="text-xs text-[#5c5f60] hover:text-[#191c1d] font-medium transition-colors"
        >
          Don&apos;t have a studio? <b className="text-[#191c1d] underline">Sign up</b>
        </Link>
      </header>

      {/* Main Login Form Container */}
      <div className="w-full max-w-md mx-auto px-6 py-8 my-auto z-10">
        <div className="bg-white border border-[#eae3d7] rounded-3xl p-7 sm:p-9 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f4f4] text-xs font-medium text-[#5c5f60] mb-5">
            <span>Studio Director Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif text-[#191c1d] font-bold mb-2">
            Return to your studio.
          </h1>
          <p className="text-xs sm:text-sm text-[#5c5f60] mb-6 leading-relaxed">
            Sign in to curate inquiries, review private client briefs, and publish atelier updates.
          </p>

          {/* Google Sign In Option */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[#ded7cb] bg-[#faf8f5] hover:bg-[#f2ece3] text-xs font-medium text-[#191c1d] transition-all cursor-pointer shadow-2xs mb-5"
          >
            <GoogleAuthIcon className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-[#ede7dc] w-full" />
            <span className="bg-white px-3 text-[10px] uppercase font-semibold text-[#8e9192] tracking-wider absolute">
              or continue with email
            </span>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5c5f60] mb-1.5">
                Work Email Address
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-2.5 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all gap-2.5">
                <Mail size={14} className="text-[#8e9192] shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="hello@elanevents.com"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5c5f60]">
                  Password
                </label>
                <span className="text-[10px] text-[#855e2e] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-2.5 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all gap-2.5">
                <Lock size={14} className="text-[#8e9192] shrink-0" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ color: "#ffffff" }}
              className="w-full mt-2 bg-[#191c1d] !text-white font-medium text-xs py-3 rounded-xl hover:bg-[#2d3032] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Sign in & Open Studio</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 mt-5 text-[11px] text-[#8e9192] justify-center">
            <Shield size={12} />
            <span>Encrypted with bank-grade 256-bit security.</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 text-center text-xs text-[#8e9192] z-10">
        © 2026 LuxeAdmin Atelier Suite. All rights reserved.
      </footer>
    </main>
  );
}

function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function Leads({ onToast }: { onToast: (s: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState(leads);
  const selectedLead = items.find(l => l.id === selected);
  const metrics = useMemo(
    () => ({
      total: items.length,
      newToday: items.filter(l => l.status === "new").length,
      conversion: Math.round(
        (items.filter(l => l.status === "converted").length / (items.length || 1)) * 100
      ),
    }),
    [items]
  );

  return (
    <section className="content">
      <PageTitle
        eyebrow="Relationship management"
        title="Leads & inquiries"
        description="A considered view of every client opportunity."
        action={
          <button className="outline-button">
            Export list <ArrowRight size={14} />
          </button>
        }
      />
      <div className="metrics">
        <Metric
          label="Total leads"
          value={String(metrics.total).padStart(2, "0")}
          detail="All time"
        />
        <Metric
          label="New today"
          value={String(metrics.newToday).padStart(2, "0")}
          detail="Needs attention"
        />
        <Metric label="Conversion rate" value={`${metrics.conversion}%`} detail="Last 30 days" />
      </div>
      <div className="table-card">
        <div className="table-head">
          <h2>Recent inquiries</h2>
          <span>{items.length} records</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Event date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map(lead => (
                <tr key={lead.id} onClick={() => setSelected(lead.id)}>
                  <td>
                    <b>{lead.name}</b>
                    <small>{lead.email}</small>
                  </td>
                  <td>{lead.service}</td>
                  <td>{date(lead.eventDate)}</td>
                  <td>
                    <span className={`status ${lead.status}`}>{statusLabel(lead.status)}</span>
                  </td>
                  <td>
                    <ChevronRight size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedLead && (
        <div className="drawer-backdrop" onClick={() => setSelected(null)}>
          <aside className="drawer" onClick={e => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setSelected(null)}>
              <X />
            </button>
            <span className="eyebrow">Inquiry details</span>
            <h2>{selectedLead.name}</h2>
            <p className="drawer-email">
              {selectedLead.email} · {selectedLead.phone}
            </p>
            <div className="detail-grid">
              <div>
                <span className="eyebrow">Service</span>
                <b>{selectedLead.service}</b>
              </div>
              <div>
                <span className="eyebrow">Event date</span>
                <b>{date(selectedLead.eventDate)}</b>
              </div>
              <div>
                <span className="eyebrow">Budget</span>
                <b>{money(selectedLead.budget || 0)}</b>
              </div>
              <div>
                <span className="eyebrow">Status</span>
                <b>{statusLabel(selectedLead.status)}</b>
              </div>
            </div>
            <blockquote>{selectedLead.message}</blockquote>
            <div className="drawer-actions">
              <button
                className="dark-button bg-[#000000] border-[#000000]"
                onClick={async () => {
                  await updateLeadStatus(selectedLead.id, "contacted");
                  setItems(
                    items.map(x => (x.id === selectedLead.id ? { ...x, status: "contacted" } : x))
                  );
                  onToast("Lead marked as contacted");
                }}
              >
                Mark contacted <Check size={15} />
              </button>
              <button
                className="outline-button"
                onClick={async () => {
                  await updateLeadStatus(selectedLead.id, "converted");
                  setItems(
                    items.map(x =>
                      x.id === selectedLead.id ? { ...x, status: "converted" as LeadStatus } : x
                    )
                  );
                  onToast("Lead converted to customer");
                }}
              >
                Convert to customer
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function Customers() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedCustomer = customers.find(c => c.id === selected);
  return (
    <section className="content">
      <PageTitle
        eyebrow="Client relationships"
        title="Customers"
        description="The people behind the remarkable moments."
      />
      <div className="metrics">
        <Metric label="Total customers" value="03" detail="Active relationships" />
        <Metric label="Active projects" value="02" detail="In progress" />
        <Metric
          label="Revenue"
          value={money(customers.reduce((a, c) => a + c.totalRevenue, 0))}
          detail="Across all projects"
        />
      </div>
      <div className="table-card">
        <div className="table-head">
          <h2>All customers</h2>
          <span>{customers.length} records</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Project</th>
                <th>Value</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {customers.map(c => {
                const p = c.projects[0];
                return (
                  <tr key={c.id} onClick={() => setSelected(c.id)}>
                    <td>
                      <b>{c.name}</b>
                      <small>{c.email}</small>
                    </td>
                    <td>
                      {p.name}
                      <small>{p.service}</small>
                    </td>
                    <td>{money(c.totalRevenue)}</td>
                    <td>
                      <span className={`status ${p.status}`}>{statusLabel(p.status)}</span>
                    </td>
                    <td>
                      <ChevronRight size={16} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selectedCustomer && (
        <div className="drawer-backdrop" onClick={() => setSelected(null)}>
          <aside className="drawer" onClick={e => e.stopPropagation()}>
            <button
              className="drawer-close"
              onClick={() => setSelected(null)}
              aria-label="Close customer details"
            >
              <X />
            </button>
            <span className="eyebrow">Customer details</span>
            <h2>{selectedCustomer.name}</h2>
            <p className="drawer-email">
              {selectedCustomer.email}
              {selectedCustomer.phone ? ` · ${selectedCustomer.phone}` : ""}
            </p>
            {selectedCustomer.company && (
              <p className="drawer-company">{selectedCustomer.company}</p>
            )}
            <div className="drawer-block">
              <span className="eyebrow">Projects</span>
              {selectedCustomer.projects.map(project => (
                <div className="drawer-project" key={project.id}>
                  <div>
                    <b>{project.name}</b>
                    <small>{project.service}</small>
                  </div>
                  <div className="drawer-project-meta">
                    <strong>{money(project.amount)}</strong>
                    <span className={`status ${project.status}`}>
                      {statusLabel(project.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-block">
              <span className="eyebrow">Client notes</span>
              <p>{selectedCustomer.notes}</p>
            </div>
            <div className="drawer-actions">
              <a
                className="dark-button bg-[#000000] border-[#000000]"
                href={`mailto:${selectedCustomer.email}`}
              >
                Email customer <ArrowRight size={15} />
              </a>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function ProfileSettings({ onToast }: { onToast: (s: string) => void }) {
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("Amelia Bell");
  const [email, setEmail] = useState("amelia@elanevents.com");
  const [phone, setPhone] = useState("+234 800 352 6847");

  const save = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    onToast("Profile settings saved");
  };

  return (
    <section className="content narrow profile-settings">
      <PageTitle
        eyebrow="Account settings"
        title="Your profile"
        description="Manage the details and preferences connected to your LuxeAdmin account."
      />
      <div className="profile-panel">
        <div className="profile-panel-heading">
          <div>
            <span className="eyebrow">Profile picture</span>
            <h2>Make it personal.</h2>
          </div>
          <div className="profile-avatar-large bg-[#000000] text-white">
            {photo ? <img src={photo} alt="Profile preview" /> : "AB"}
          </div>
        </div>
        <label className="upload-field">
          Profile picture
          <input
            type="file"
            accept="image/*"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) setPhoto(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>
      <div className="profile-panel">
        <div className="section-label">
          <span className="step">01</span>
          <div>
            <h2>Personal details</h2>
            <p>Your name and contact information.</p>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Full name
            <input value={name} onChange={event => setName(event.target.value)} />
          </label>
          <label>
            Email address
            <input type="email" value={email} onChange={event => setEmail(event.target.value)} />
          </label>
          <label>
            Phone number
            <input type="tel" value={phone} onChange={event => setPhone(event.target.value)} />
          </label>
        </div>
      </div>
      <div className="profile-panel">
        <div className="section-label">
          <span className="step">02</span>
          <div>
            <h2>Password</h2>
            <p>Use a unique password to keep your account secure.</p>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Current password
            <input type="password" placeholder="Enter current password" />
          </label>
          <label>
            New password
            <input type="password" placeholder="Enter new password" />
          </label>
          <label>
            Confirm new password
            <input type="password" placeholder="Confirm new password" />
          </label>
        </div>
      </div>
      <button
        className="dark-button bg-[#000000] border-[#000000]"
        disabled={saving}
        onClick={save}
      >
        {saving ? "Saving…" : "Save profile changes"} <ArrowRight size={15} />
      </button>
    </section>
  );
}

export default function Page() {
  const [toast, setToast] = useState("");
  const pathname = usePathname();
  const currentPath = pathname || "/";

  if (currentPath === "/signup") return <SignupPage />;
  if (currentPath === "/login") return <Login />;
  if (currentPath === "/") return <Public />;

  // If path is a public business profile slug (e.g. /elan-events, /maison-bell-events, etc.)
  const adminRoutes = ["/leads", "/customers", "/settings", "/profile", "/login", "/signup", "/"];
  if (!adminRoutes.includes(currentPath)) {
    const slug = currentPath.replace(/^\//, "").split("/")[0] || "elan-events";
    return <ElanEventsPage slug={slug} />;
  }

  const page =
    currentPath === "/leads" ? (
      <Leads onToast={setToast} />
    ) : currentPath === "/customers" ? (
      <Customers />
    ) : currentPath === "/profile" ? (
      <ProfileSettings onToast={setToast} />
    ) : (
      <EnhancedSettingsPage onToast={setToast} />
    );

  return (
    <Admin path={currentPath} onToast={setToast}>
      {page}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </Admin>
  );
}

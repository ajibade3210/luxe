"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
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
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { publishChanges, updateLeadStatus } from "@/lib/api";
import { businessProfile, customers, leads } from "@/lib/mock-data";
import type { LeadStatus } from "@/lib/types";
import { EnhancedSettingsPage } from "@/components/settings-page";
import { TrustedBusinesses } from "@/components/trusted-businesses";
import { SiteFooter } from "@/components/site-footer";
import { ElanEventsPage } from "@/components/elan-events-page";

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

function Metric({
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

function Sidebar({
  path,
  open,
  onClose,
}: {
  path: string;
  open: boolean;
  onClose: () => void;
}) {
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
          <Users size={16} /> Leads{" "}
          <span className="nav-count">{leads.length}</span>
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
          <Eye size={15} /> Profile View{" "}
          <ExternalLink size={13} className="ml-auto opacity-70" />
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

function Header({
  onMenu,
  onToast,
}: {
  onMenu: () => void;
  onToast: (s: string) => void;
}) {
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
          <a
            className="dark-button bg-[#000000] border-[#000000]"
            href="/login"
          >
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
            LuxeAdmin brings your luxury event studio, clientele, and creative
            storytelling into one considered place.
          </p>
          <div className="hero-ctas">
            <a
              className="dark-button bg-[#000000] border-[#000000]"
              href="/settings"
            >
              Enter your studio <ArrowRight size={15} />
            </a>
            <a className="text-link text-[#0058be]" href={`/${slug}`}>
              View Public Business Profile <ChevronRight size={15} />
            </a>
          </div>
        </div>

        <a
          href={`/${slug}`}
          className="profile-card group transition-transform hover:-translate-y-1 block text-decoration-none"
        >
          <div className="profile-image bg-[#f3f4f6] text-[#000000] font-mono">
            É
          </div>
          <div className="profile-meta">
            <span className="eyebrow">Luxury Event Studio · Lagos</span>
            <h2 className="group-hover:text-[#0058be] transition-colors">
              Élan Events
            </h2>
            <p>
              We design unforgettable weddings, corporate events, and private
              celebrations.
            </p>
          </div>
          <div className="profile-foot">
            <span>Bespoke Experiences</span>
            <span className="text-[#0058be] font-medium">
              View live profile <ArrowRight size={14} />
            </span>
          </div>
        </a>
      </section>

      <section className="workflow" id="workflow">
        <div className="section-intro">
          <span className="eyebrow">A better way to build</span>
          <h2>
            Everything in its
            <br />
            <em>right place.</em>
          </h2>
        </div>
        <div className="workflow-grid">
          <div>
            <span className="step">01</span>
            <h3>Create</h3>
            <p>
              Shape a public profile that feels like your work, and invite
              discerning clients in.
            </p>
          </div>
          <div>
            <span className="step">02</span>
            <h3>Curate</h3>
            <p>
              Keep your services, stories, and 10 social channels beautifully
              unified.
            </p>
          </div>
          <div>
            <span className="step">03</span>
            <h3>Convert</h3>
            <p>
              Turn a first consultation inquiry into a considered, lasting
              relationship.
            </p>
          </div>
        </div>
      </section>
      <TrustedBusinesses />
      <SiteFooter />
    </main>
  );
}

function Login() {
  return (
    <main className="login-page">
      <div className="login-box">
        <Brand />
        <span className="eyebrow">Welcome back</span>
        <h1>Return to your studio.</h1>
        <p>Sign in to manage your business with intention.</p>
        <button className="google">Continue with Google</button>
        <div className="or">
          <span>or continue with email</span>
        </div>
        <label>
          Email address
          <input type="email" defaultValue="hello@elanevents.com" />
        </label>
        <label>
          Password
          <input type="password" defaultValue="password" />
        </label>
        <a
          className="dark-button login-button bg-[#000000] border-[#000000]"
          href="/settings"
        >
          Sign in <ArrowRight size={15} />
        </a>
        <small>
          By continuing, you agree to LuxeAdmin&apos;s terms and privacy policy.
        </small>
      </div>
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
        (items.filter(l => l.status === "converted").length /
          (items.length || 1)) *
          100,
      ),
    }),
    [items],
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
        <Metric
          label="Conversion rate"
          value={`${metrics.conversion}%`}
          detail="Last 30 days"
        />
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
                    <span className={`status ${lead.status}`}>
                      {statusLabel(lead.status)}
                    </span>
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
                    items.map(x =>
                      x.id === selectedLead.id
                        ? { ...x, status: "contacted" }
                        : x,
                    ),
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
                      x.id === selectedLead.id
                        ? { ...x, status: "converted" as LeadStatus }
                        : x,
                    ),
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
        <Metric
          label="Total customers"
          value="03"
          detail="Active relationships"
        />
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
                      <span className={`status ${p.status}`}>
                        {statusLabel(p.status)}
                      </span>
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
            <input
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </label>
          <label>
            Phone number
            <input
              type="tel"
              value={phone}
              onChange={event => setPhone(event.target.value)}
            />
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

  if (currentPath === "/login") return <Login />;
  if (currentPath === "/") return <Public />;

  // If path is a public business profile slug (e.g. /elan-events, /maison-bell-events, etc.)
  const adminRoutes = [
    "/leads",
    "/customers",
    "/settings",
    "/profile",
    "/login",
    "/",
  ];
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

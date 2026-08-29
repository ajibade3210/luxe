import { ArrowUpRight } from "lucide-react";
import type { FooterNavSection } from "@/types";

export const NAVIGATION_SECTIONS: FooterNavSection[] = [
  {
    title: "Platform Suite",
    links: [
      { label: "Client Inquiries & CRM", href: "/leads" },
      { label: "Bespoke Proposal Engine", href: "/settings" },
      { label: "Visual Moodboards & Decks", href: "/settings" },
      { label: "Contracts & Milestones", href: "/customers" },
      { label: "Live Run of Show", href: "/settings" },
      { label: "Multi-Channel Sync", href: "/settings" },
      { label: "Client VIP Portals", href: "/elan-events" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Luxury Wedding Ateliers", href: "/elan-events" },
      { label: "Experiential Agencies", href: "#features" },
      { label: "Private Concierge & VIP", href: "#workflow" },
      { label: "Floral & Spatial Designers", href: "#features" },
      { label: "Destination Planners", href: "#workflow" },
    ],
    subsections: [
      {
        title: "Connect",
        links: [
          { label: "Instagram", href: "https://instagram.com", external: true },
          { label: "LinkedIn", href: "https://linkedin.com", external: true },
          { label: "Pinterest", href: "https://pinterest.com", external: true },
          { label: "Twitter / X", href: "https://x.com", external: true },
        ],
      },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Business Valuation Calculator", href: "/valuation-calculator", badge: "Free" },
      { label: "The Atelier Journal (Blog)", href: "/blog" },
      { label: "Studio Operating Guide", href: "#workflow" },
      { label: "Luxury Wedding Index 2026", href: "#features" },
      { label: "Contract Legal Frameworks", href: "/terms" },
      { label: "Changelog & Releases", href: "#workflow" },
    ],
    subsections: [
      {
        title: "Company",
        links: [
          { label: "About Shopwus", href: "#workflow" },
          { label: "The Atelier Journal", href: "/blog" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ],
      },
    ],
  },
];

export function FooterLinks() {
  return (
    <div className="footer-links-columns">
      {NAVIGATION_SECTIONS.map(section => (
        <div className="footer-nav-group" key={section.title}>
          <h3 className="footer-nav-title">{section.title}</h3>
          <ul className="footer-nav-list">
            {section.links.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="footer-nav-link group"
                  {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  <span>{link.label}</span>
                  {link.badge && <span className="footer-link-badge">{link.badge}</span>}
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#855e2e]"
                  />
                </a>
              </li>
            ))}
          </ul>

          {section.subsections?.map(subsection => (
            <div className="footer-subgroup" key={subsection.title}>
              <h4 className="footer-nav-subtitle">{subsection.title}</h4>
              <ul className="footer-nav-list">
                {subsection.links.map(subLink => (
                  <li key={subLink.label}>
                    <a
                      href={subLink.href}
                      className="footer-nav-link group"
                      {...(subLink.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      <span>{subLink.label}</span>
                      {subLink.badge && <span className="footer-link-badge">{subLink.badge}</span>}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[#855e2e]"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

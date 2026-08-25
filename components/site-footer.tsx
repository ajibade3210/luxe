"use client";

import { useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

const footerSections = [
  {
    title: "Company",
    links: [
      "About",
      "How it works",
      "Features",
      "Reviews",
      "Contact",
      "Careers",
      "Blog",
      "FAQs",
    ],
  },
  {
    title: "Resources",
    links: ["Documentation", "Guides", "Community"],
    subsections: [
      {
        title: "Partners",
        links: ["For Creators", "For Partners", "For Employers"],
      },
      { title: "Connect", links: ["Twitter / X", "Instagram", "LinkedIn"] },
    ],
  },
  {
    title: "Research",
    links: [
      "Research Overview",
      "Clinical Studies",
      "Biomarkers",
      "Reports",
      "Health Research",
      "Resources",
      "Complete Guide",
    ],
  },
];

export function SiteFooter() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main">
        <div className="footer-brand">
          <a href="/" className="footer-logo">
            LuxeAdmin
          </a>
          <p>
            Not sure where to start? Sign up to receive thoughtful guidance for
            building a more intentional event business.
          </p>
          <form
            className="footer-signup"
            onSubmit={event => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <input
              aria-label="Your email"
              type="email"
              placeholder="Your email"
              required
            />{" "}
            <button type="submit">{submitted ? "Thanks" : "Sign up"}</button>
          </form>
          <div className="footer-download">
            <div className="w-12 h-12 rounded-lg bg-white p-1 border border-[#e5ded2] flex items-center justify-center shrink-0">
              <img
                src="https://cdn.accessa.ng/test/accessa/joe-fitness/qrcodes/images/7343ffeb0bfd056e77e8e8d52edf0722.png"
                alt="Get LuxeAdmin app QR code"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <small>Get the LuxeAdmin app</small>
              <strong>Download on the App Store</strong>
            </div>
          </div>
          <div className="ask-ai">
            <span>Ask AI about LuxeAdmin</span>
            <div>
              {["✦", "✧", "◇", "AI", "✺"].map(icon => (
                <button key={icon} aria-label={`Ask AI ${icon}`}>
                  <Sparkles size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-links">
          {footerSections.map(section => (
            <div className="footer-column" key={section.title}>
              <h3>{section.title}</h3>
              {section.links.map(link => (
                <a href="#" key={link}>
                  {link}
                  <ArrowUpRight size={12} />
                </a>
              ))}
              {section.subsections?.map(subsection => (
                <div className="footer-subsection" key={subsection.title}>
                  <h3>{subsection.title}</h3>
                  {subsection.links.map(link => (
                    <a href="#" key={link}>
                      {link}
                      <ArrowUpRight size={12} />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 LuxeAdmin. All rights reserved.</span>
        <div className="footer-legal">
          <a href="#">Terms</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Medical Consent</a>
          <a href="#">Cookie Preferences</a>
        </div>
        <span>We are LuxeAdmin Certified</span>
      </div>
    </footer>
  );
}

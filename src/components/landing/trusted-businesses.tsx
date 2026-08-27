import Image from "next/image";
import { featuredOrganizations } from "@/lib/mock-data";
import type { OrganizationPreview } from "@/types";

interface LogoRowProps {
  organizations: OrganizationPreview[];
  reverse?: boolean;
}

function LogoRow({ organizations, reverse = false }: LogoRowProps) {
  const items = [...organizations, ...organizations, ...organizations];
  return (
    <div className={`logo-marquee ${reverse ? "logo-marquee-reverse" : ""}`}>
      <div className="logo-track">
        {items.map((org, index) => (
          <a
            key={`${org.id}-${index}`}
            href={`/${org.slug}`}
            className="business-logo group"
            title={`${org.name} — ${org.eyebrow}`}
            aria-label={`View ${org.name} studio showcase`}
          >
            <Image
              src={org.logoUrl}
              alt={`${org.name} logo`}
              width={120}
              height={40}
              className="object-contain"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export function TrustedBusinesses() {
  const midpoint = Math.ceil(featuredOrganizations.length / 2);
  const rowOne = featuredOrganizations.slice(0, midpoint);
  const rowTwo = featuredOrganizations.slice(midpoint);

  return (
    <section className="trusted-businesses" aria-labelledby="trusted-businesses-title">
      <div className="trusted-heading">
        <h2 id="trusted-businesses-title">Trusted by businesses like yours.</h2>
      </div>
      <div className="marquee-viewport">
        <LogoRow organizations={rowOne} />
        <LogoRow organizations={rowTwo} reverse />
      </div>
    </section>
  );
}

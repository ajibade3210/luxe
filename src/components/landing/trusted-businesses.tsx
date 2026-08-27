"use client";

const rowOneBusinesses = [
  "Nova Labs",
  "Vertex",
  "Lumio",
  "Northstar",
  "Orbit",
  "Arcwell",
  "Clover",
  "Meridian",
  "Atlas",
  "Elevate",
];
const rowTwoBusinesses = [
  "Brightline",
  "Vanta",
  "Flux",
  "Haven",
  "Monolith",
  "Bloom",
  "Apex",
  "Solace",
  "Pioneer",
  "Nimbus",
];

function LogoRow({ businesses, reverse = false }: { businesses: string[]; reverse?: boolean }) {
  const items = [...businesses, ...businesses];
  return (
    <div className={`logo-marquee ${reverse ? "logo-marquee-reverse" : ""}`}>
      <div className="logo-track">
        {items.map((business, index) => (
          <div className="business-logo" key={`${business}-${index}`}>
            <img
              src={reverse ? "/Shopwus-logo-set-b.png" : "/Shopwus-logo-set-a.png"}
              alt=""
              aria-hidden="true"
            />
            <span>{business}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrustedBusinesses() {
  return (
    <section className="trusted-businesses" aria-labelledby="trusted-businesses-title">
      <div className="trusted-heading">
        <h2 id="trusted-businesses-title">Trusted by businesses like yours.</h2>
      </div>
      <div className="marquee-viewport">
        <LogoRow businesses={rowOneBusinesses} />
        <LogoRow businesses={rowTwoBusinesses} reverse />
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { InvoiceGeneratorPage } from "@/components/calculator/invoice-generator-page";

export const metadata: Metadata = {
  title: "Free Invoice Generator | Shopwus",
  description:
    "Free online invoice generator for online vendors, merchants, independent businesses, and freelancers. Create, customize, print, and download professional client-ready PDF invoices in 60 seconds.",
  openGraph: {
    title: "Free Invoice Generator | Shopwus",
    description:
      "Craft polished, client-ready invoices directly in your browser. 100% free, no mandatory sign-up, instant PDF download.",
  },
};

export default function InvoiceGeneratorRoute() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Shopwus Free Invoice Generator",
    description:
      "Free interactive invoice maker for independent vendors, online businesses, and freelancers.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <InvoiceGeneratorPage />
    </>
  );
}

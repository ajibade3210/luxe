import type { Metadata } from "next";
import { BlogListingPage } from "@/components/blog/blog-listing-page";

export const metadata: Metadata = {
  title: "Blog | Shopwus Blog & Guides",
  description:
    "Illustrated visual guides on client retention, digital brand equity, multi-currency invoicing, and business valuation strategies for online vendors.",
  openGraph: {
    title: "Blog | Shopwus Blog & Guides",
    description:
      "Cartoon graphic breakdowns and strategic playbooks to multiply your studio's business valuation.",
  },
};

export default function BlogRoute() {
  return <BlogListingPage />;
}

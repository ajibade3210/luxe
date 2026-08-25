"use client";

import { useParams, usePathname } from "next/navigation";
import { ElanEventsPage } from "@/components/elan-events-page";
import Page from "../page";

export default function SlugPage() {
  const params = useParams();
  const pathname = usePathname();

  // If the pathname matches an admin dashboard sub-route, let the main Page component handle it
  const adminRoutes = [
    "/leads",
    "/customers",
    "/settings",
    "/profile",
    "/login",
  ];
  if (adminRoutes.includes(pathname)) {
    return <Page />;
  }

  // Extract the slug from params or pathname
  const slugParam = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const slug =
    slugParam ||
    (pathname ? pathname.replace(/^\//, "").split("/")[0] : "elan-events");

  return <ElanEventsPage slug={slug} />;
}

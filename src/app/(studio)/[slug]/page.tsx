"use client";

import { useParams } from "next/navigation";
import { ElanEventsPage } from "@/components/studio/elan-events-page";

export default function Page() {
  const params = useParams();
  const slugParam = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const slug = (slugParam as string) || "elan-events";

  return <ElanEventsPage slug={slug} />;
}

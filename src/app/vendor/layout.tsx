"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { isAuthenticated } from "@/lib/api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(
        `/login?redirect=${encodeURIComponent(pathname || "/vendor/overview")}`
      );
    } else {
      setAuthed(true);
    }
  }, [pathname, router]);

  if (!authed) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

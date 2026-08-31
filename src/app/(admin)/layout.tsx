"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { isAuthenticated } from "@/lib/api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/overview")}`);
    } else {
      setAuthed(true);
    }
  }, [pathname, router]);

  // Don't render protected dashboard content until authenticated
  if (!mounted || !authed) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

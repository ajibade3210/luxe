"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminLayout, Toast } from "@/components/admin/admin-layout";
import { AnalyticsPage } from "@/components/admin/analytics-page";
import { CustomersPage } from "@/components/admin/customers-page";
import { LeadsPage } from "@/components/admin/leads-page";
import { ProfileSettingsPage } from "@/components/admin/profile-settings-page";
import { EnhancedSettingsPage } from "@/components/admin/settings-page";
import { LoginPage } from "@/components/auth/login-page";
import { SignupPage } from "@/components/auth/signup-page";
import { PublicLandingPage } from "@/components/landing/public-landing-page";
import { ElanEventsPage } from "@/components/studio/elan-events-page";

export default function Page() {
  const [toast, setToast] = useState("");
  const pathname = usePathname();
  const currentPath = pathname || "/";

  if (currentPath === "/signup") return <SignupPage />;
  if (currentPath === "/login") return <LoginPage />;
  if (currentPath === "/") return <PublicLandingPage />;

  // If path is a public business profile slug (e.g. /elan-events, /maison-bell-events, etc.)
  const adminRoutes = [
    "/analytics",
    "/overview",
    "/leads",
    "/customers",
    "/settings",
    "/profile",
    "/login",
    "/signup",
    "/",
  ];
  if (!adminRoutes.includes(currentPath)) {
    const slug = currentPath.replace(/^\//, "").split("/")[0] || "elan-events";
    return <ElanEventsPage slug={slug} />;
  }

  const page =
    currentPath === "/analytics" || currentPath === "/overview" ? (
      <AnalyticsPage onToast={setToast} />
    ) : currentPath === "/leads" ? (
      <LeadsPage onToast={setToast} />
    ) : currentPath === "/customers" ? (
      <CustomersPage onToast={setToast} />
    ) : currentPath === "/profile" ? (
      <ProfileSettingsPage onToast={setToast} />
    ) : (
      <EnhancedSettingsPage onToast={setToast} />
    );

  return (
    <AdminLayout path={currentPath} onToast={setToast}>
      {page}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </AdminLayout>
  );
}

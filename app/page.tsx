"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminLayout, Toast } from "@/components/admin-layout";
import { CustomersPage } from "@/components/customers-page";
import { ElanEventsPage } from "@/components/elan-events-page";
import { LeadsPage } from "@/components/leads-page";
import { LoginPage } from "@/components/login-page";
import { ProfileSettingsPage } from "@/components/profile-settings-page";
import { PublicLandingPage } from "@/components/public-landing-page";
import { EnhancedSettingsPage } from "@/components/settings-page";
import { SignupPage } from "@/components/signup-page";

export default function Page() {
  const [toast, setToast] = useState("");
  const pathname = usePathname();
  const currentPath = pathname || "/";

  if (currentPath === "/signup") return <SignupPage />;
  if (currentPath === "/login") return <LoginPage />;
  if (currentPath === "/") return <PublicLandingPage />;

  // If path is a public business profile slug (e.g. /elan-events, /maison-bell-events, etc.)
  const adminRoutes = ["/leads", "/customers", "/settings", "/profile", "/login", "/signup", "/"];
  if (!adminRoutes.includes(currentPath)) {
    const slug = currentPath.replace(/^\//, "").split("/")[0] || "elan-events";
    return <ElanEventsPage slug={slug} />;
  }

  const page =
    currentPath === "/leads" ? (
      <LeadsPage onToast={setToast} />
    ) : currentPath === "/customers" ? (
      <CustomersPage />
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

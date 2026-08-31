"use client";

import { useEffect, useState } from "react";
import { calculateBusinessValuation, getCurrentUser, updateBusinessProfile } from "@/lib/api";
import type { BusinessValuation, ProfileSettingsPageProps } from "@/types";
import { useAdminToast } from "./admin-layout";
import { ValuationCard } from "./analytics/valuation-card";
import { ProfileIdentityCard } from "./profile/profile-identity-card";
import { ProfileSecurityCard } from "./profile/profile-security-card";

export function ProfileSettingsPage({ onToast }: ProfileSettingsPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [valuation, setValuation] = useState<BusinessValuation | null>(null);

  useEffect(() => {
    getCurrentUser().then(user => {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "+234 800 ELAN VIP");
      setAvatar(user.avatar || "AB");
    });
    calculateBusinessValuation().then(val => {
      setValuation(val);
    });
  }, []);

  const handleSaveProfile = async (updates: { name: string; email: string; phone: string }) => {
    await updateBusinessProfile({
      email: updates.email,
      phone: updates.phone,
    });
    setName(updates.name);
    setEmail(updates.email);
    setPhone(updates.phone);
    notify("Profile credentials updated successfully");
  };

  const handleRefreshValuation = async () => {
    const updated = await calculateBusinessValuation();
    setValuation(updated);
  };

  return (
    <section className="content profile-content max-w-5xl mx-auto space-y-7 pb-16">
      {/* Page Title */}
      <div className="page-title">
        <div>
          <h1>Admin Overview</h1>
        </div>
      </div>

      {/* Studio Equity & Business Valuation Estimator */}
      {valuation && (
        <ValuationCard valuation={valuation} onRefresh={handleRefreshValuation} onToast={notify} />
      )}

      {/* Director Identity Panel */}
      <ProfileIdentityCard
        name={name}
        email={email}
        phone={phone}
        avatar={avatar}
        onSave={handleSaveProfile}
      />

      {/* Authentication & Security Panel */}
      <ProfileSecurityCard email={email} />
    </section>
  );
}

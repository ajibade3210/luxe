"use client";

import { useEffect, useState } from "react";
import {
  calculateBusinessValuation,
  getBusinessProfile,
  getCurrentSession,
  getCurrentUser,
  updateBusinessProfile,
  updateUserProfile,
} from "@/lib/api";
import { logger } from "@/lib/logger";
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
  const [studioName, setStudioName] = useState(getCurrentSession()?.studioName || "");
  const [valuation, setValuation] = useState<BusinessValuation | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone || "+234 800 ELAN VIP");
        setAvatar(user.avatar || "AB");
      })
      .catch(err => {
        logger.warn("Failed to load user profile on mount", err);
      });
    getBusinessProfile()
      .then(profile => {
        if (profile?.businessName) {
          setStudioName(profile.businessName);
        }
      })
      .catch(err => {
        logger.warn("Failed to load business profile on mount", err);
      });
    calculateBusinessValuation()
      .then(val => {
        setValuation(val);
      })
      .catch(err => {
        logger.warn("Failed to load business valuation on mount", err);
      });
  }, []);

  const handleSaveProfile = async (updates: { name: string; email: string; phone: string }) => {
    try {
      await Promise.all([
        updateUserProfile({
          name: updates.name,
          phone: updates.phone,
        }),
        updateBusinessProfile({
          phone: updates.phone,
        }),
      ]);
      setName(updates.name);
      setPhone(updates.phone);
      notify("Profile credentials updated successfully");
    } catch (err) {
      logger.error("Failed to update profile credentials", err);
      notify("Failed to update profile credentials");
    }
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
      <ValuationCard valuation={valuation} onRefresh={handleRefreshValuation} onToast={notify} />

      {/* Director Identity Panel */}
      <ProfileIdentityCard
        name={name}
        email={email}
        phone={phone}
        avatar={avatar}
        studioName={studioName}
        onSave={handleSaveProfile}
      />

      {/* Authentication & Security Panel */}
      <ProfileSecurityCard email={email} />
    </section>
  );
}

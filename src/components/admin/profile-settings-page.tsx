"use client";

import { ArrowRight, Check, Pencil, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import { GoogleIcon } from "@/components/shared/icons";
import { calculateBusinessValuation, getCurrentUser, updateBusinessProfile } from "@/lib/api";
import type { BusinessValuation, ProfileSettingsPageProps } from "@/types";
import { useAdminToast } from "./admin-layout";
import { ValuationCard } from "./analytics/valuation-card";

export function ProfileSettingsPage({ onToast }: ProfileSettingsPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  const save = async () => {
    setSaving(true);
    await updateBusinessProfile({
      email,
      phone,
    });
    setSaving(false);
    setIsEditing(false);
    notify("Profile credentials updated successfully");
  };

  const handleRefreshValuation = async () => {
    const updated = await calculateBusinessValuation();
    setValuation(updated);
  };

  const isImageUrl =
    avatar &&
    (avatar.startsWith("http://") || avatar.startsWith("https://") || avatar.startsWith("/"));
  const initials = name
    ? name
        .split(" ")
        .map(w => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AB";

  return (
    <section className="content profile-content max-w-5xl mx-auto space-y-7 pb-16">
      {/* Page Title — Option 2: Executive Overview */}
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
      <div className="bg-white border border-[#eae3d7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-4">
          {/* Avatar and Leadership Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#191c1d] text-white flex items-center justify-center font-serif text-xl italic font-bold shadow-xs shrink-0 overflow-hidden border border-[#eae3d7]">
              {isImageUrl && !imageFailed ? (
                <img
                  src={avatar}
                  alt={name}
                  onError={() => setImageFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div>
              <b className="text-base text-[#191c1d] font-bold block">
                {name || "Studio Director"}
              </b>
              <span className="text-xs text-[#5c5f60] mt-0.5 block">
                Studio Director · Élan Events
              </span>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-[#faf7f2] hover:bg-[#f0ebe3] text-[#191c1d] border border-[#ded7cb] hover:border-[#c59a78] transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              <Pencil size={12} className="text-[#855e2e]" />
              <span>Edit profile</span>
            </button>
          )}
        </div>

        {/* Dynamic Display / Edit Form */}
        {isEditing ? (
          <div className="space-y-5 pt-1 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-2">
                  Full name
                </label>
                <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                  <input
                    value={name}
                    onChange={event => setName(event.target.value)}
                    placeholder="Amelia Bell"
                    className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-2">
                  Email
                </label>
                <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                  <input
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder="amelia@elanevents.com"
                    className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-2">
                  Phone number
                </label>
                <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs focus-within:border-[#855e2e] focus-within:ring-1 focus-within:ring-[#855e2e] focus-within:bg-white transition-all">
                  <input
                    type="tel"
                    value={phone}
                    onChange={event => setPhone(event.target.value)}
                    placeholder="+234 800 ELAN VIP"
                    className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2]"
                  />
                </div>
              </div>
            </div>

            {/* Localized Action Buttons */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#f0e8dc]">
              <button
                type="button"
                className="dark-button bg-[#191c1d] hover:bg-black !text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                disabled={saving}
                onClick={save}
              >
                <span>{saving ? "Saving…" : "Save profile changes"}</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className="px-4 py-3 rounded-xl text-xs font-semibold text-[#665e57] hover:text-[#191c1d] hover:bg-[#faf7f2] transition-all cursor-pointer flex items-center gap-1.5"
                onClick={() => setIsEditing(false)}
              >
                <X size={13} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 bg-[#faf8f5] border border-[#eee7dc] rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c827a] block">
                Full name
              </span>
              <strong className="text-xs font-bold text-[#191c1d] block mt-1">
                {name || "Amelia Bell"}
              </strong>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-[#eee7dc] rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c827a] block">
                Email address
              </span>
              <strong className="text-xs font-bold text-[#191c1d] block mt-1 truncate">
                {email || "director@elanatelier.com"}
              </strong>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-[#eee7dc] rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c827a] block">
                Phone number
              </span>
              <strong className="text-xs font-bold text-[#191c1d] block mt-1">
                {phone || "+234 800 ELAN VIP"}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Authentication & Security Panel */}
      <div className="bg-white border border-[#eae3d7] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="border border-[#ded7cb] bg-[#faf8f5] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#eae3d7] flex items-center justify-center shrink-0 shadow-2xs">
              <GoogleIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-xs text-[#191c1d] font-semibold">
                  Google Account Active
                </strong>
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] px-2 py-0.5 rounded-full font-medium">
                  <Check size={10} /> Verified
                </span>
              </div>
              <span className="text-xs text-[#5c5f60] font-mono mt-0.5 block">
                {email || "director@elanatelier.com"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#5c5f60] bg-white px-3 py-1.5 rounded-lg border border-[#eae3d7]">
            <Shield size={13} className="text-[#10b981]" />
            <span>Bank-grade 256-bit OAuth</span>
          </div>
        </div>
      </div>
    </section>
  );
}

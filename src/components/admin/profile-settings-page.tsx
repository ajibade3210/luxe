"use client";

import { ArrowRight, Check, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { GoogleIcon } from "@/components/shared/icons";
import { getCurrentUser, updateBusinessProfile } from "@/lib/api";

export function ProfileSettingsPage({ onToast }: { onToast: (message: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCurrentUser().then(user => {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "+234 800 ELAN VIP");
      setAvatar(user.avatar || "AB");
    });
  }, []);

  const save = async () => {
    setSaving(true);
    await updateBusinessProfile({
      email,
      phone,
    });
    setSaving(false);
    onToast("Profile credentials updated successfully");
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
      {/* Page Title */}
      <div className="page-title">
        <div>
          <span className="eyebrow">Studio credentials</span>
          <h1>Personal profile</h1>
          <p>
            Manage the director details, Google identity, and notification channels for your
            atelier.
          </p>
        </div>
      </div>

      {/* Director Identity Panel (No 01 Numbering) */}
      <div className="bg-white border border-[#eae3d7] rounded-3xl p-7 sm:p-9 shadow-sm space-y-7">
        <div className="border-b border-[#f0e8dc] pb-5">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#191c1d] tracking-tight">
            Director identity
          </h2>
          <p className="text-xs sm:text-sm text-[#5c5f60] mt-1">
            Your studio leadership and contact credentials.
          </p>
        </div>

        {/* Avatar and Leadership Title */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#191c1d] text-white flex items-center justify-center font-serif text-xl italic font-bold shadow-xs shrink-0 overflow-hidden border border-[#eae3d7]">
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
            <b className="text-base text-[#191c1d] font-bold block">{name || "Studio Director"}</b>
            <span className="text-xs text-[#5c5f60] mt-0.5 block">
              Studio Director · Élan Events
            </span>
          </div>
        </div>

        {/* Clean Input Grid with Generous Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
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
              Email address
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
      </div>

      {/* Authentication & Security Panel (No 02 Numbering) */}
      <div className="bg-white border border-[#eae3d7] rounded-3xl p-7 sm:p-9 shadow-sm space-y-6">
        <div className="border-b border-[#f0e8dc] pb-5">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#191c1d] tracking-tight">
            Authentication & Security
          </h2>
          <p className="text-xs sm:text-sm text-[#5c5f60] mt-1">
            Your account is authenticated and protected via Google OAuth.
          </p>
        </div>

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

      {/* Save Button */}
      <div className="pt-2">
        <button
          type="button"
          className="dark-button bg-[#191c1d] hover:bg-[#2d3032] !text-white px-7 py-3.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
          disabled={saving}
          onClick={save}
        >
          <span>{saving ? "Saving…" : "Save profile changes"}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}

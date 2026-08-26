"use client";

import { ArrowRight, Check, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { GoogleIcon } from "@/components/shared/icons";
import { getCurrentUser, updateBusinessProfile } from "@/lib/api";

export function ProfileSettingsPage({ onToast }: { onToast: (message: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCurrentUser().then(user => {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "+234 800 ELAN VIP");
      setAvatar(
        user.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
      );
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

  return (
    <section className="content profile-content">
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
      <div className="profile-panel">
        <div className="section-label">
          <span className="step">01</span>
          <div>
            <h2>Director identity</h2>
            <p>Your studio leadership and contact credentials.</p>
          </div>
        </div>
        <div className="avatar-row">
          <img src={avatar} alt={name} className="avatar-lg" />
          <div>
            <b>{name}</b>
            <span className="text-xs text-[#5c5f60] block">Studio Director · Élan Events</span>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Full name
            <input value={name} onChange={event => setName(event.target.value)} />
          </label>
          <label>
            Email address
            <input type="email" value={email} onChange={event => setEmail(event.target.value)} />
          </label>
          <label>
            Phone number
            <input type="tel" value={phone} onChange={event => setPhone(event.target.value)} />
          </label>
        </div>
      </div>

      <div className="profile-panel">
        <div className="section-label">
          <span className="step">02</span>
          <div>
            <h2>Authentication & Security</h2>
            <p>Your account is authenticated and protected via Google OAuth.</p>
          </div>
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

      <button
        className="dark-button bg-[#000000] border-[#000000]"
        disabled={saving}
        onClick={save}
      >
        {saving ? "Saving…" : "Save profile changes"} <ArrowRight size={15} />
      </button>
    </section>
  );
}

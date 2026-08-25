"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { PageTitle } from "./admin-layout";

export function ProfileSettingsPage({ onToast }: { onToast: (s: string) => void }) {
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("Amelia Bell");
  const [email, setEmail] = useState("amelia@elanevents.com");
  const [phone, setPhone] = useState("+234 800 352 6847");

  const save = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    onToast("Profile settings saved");
  };

  return (
    <section className="content narrow profile-settings">
      <PageTitle
        eyebrow="Account settings"
        title="Your profile"
        description="Manage the details and preferences connected to your Shopwus account."
      />
      <div className="profile-panel">
        <div className="profile-panel-heading">
          <div>
            <span className="eyebrow">Profile picture</span>
            <h2>Make it personal.</h2>
          </div>
          <div className="profile-avatar-large bg-[#000000] text-white">
            {photo ? <img src={photo} alt="Profile preview" /> : "AB"}
          </div>
        </div>
        <label className="upload-field">
          Profile picture
          <input
            type="file"
            accept="image/*"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) setPhoto(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>
      <div className="profile-panel">
        <div className="section-label">
          <span className="step">01</span>
          <div>
            <h2>Personal details</h2>
            <p>Your name and contact information.</p>
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
            <h2>Password</h2>
            <p>Use a unique password to keep your account secure.</p>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Current password
            <input type="password" placeholder="Enter current password" />
          </label>
          <label>
            New password
            <input type="password" placeholder="Enter new password" />
          </label>
          <label>
            Confirm new password
            <input type="password" placeholder="Confirm new password" />
          </label>
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

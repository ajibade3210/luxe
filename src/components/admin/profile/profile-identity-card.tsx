"use client";

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProfileIdentityCardProps } from "@/types";

export function ProfileIdentityCard({
  name,
  email,
  phone,
  avatar,
  studioName,
  bankName,
  accountName,
  accountNumber,
  onSave,
}: ProfileIdentityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editPhone, setEditPhone] = useState(phone);
  const [editBankName, setEditBankName] = useState(bankName || "");
  const [editAccountName, setEditAccountName] = useState(accountName || "");
  const [editAccountNumber, setEditAccountNumber] = useState(accountNumber || "");
  const [saving, setSaving] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Sync edits if parent state changes
  useEffect(() => {
    if (!isEditing) {
      setEditName(name);
      setEditPhone(phone);
      setEditBankName(bankName || "");
      setEditAccountName(accountName || "");
      setEditAccountNumber(accountNumber || "");
    }
  }, [name, phone, bankName, accountName, accountNumber, isEditing]);

  const handleStartEdit = () => {
    setEditName(name);
    setEditPhone(phone);
    setEditBankName(bankName || "");
    setEditAccountName(accountName || "");
    setEditAccountNumber(accountNumber || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        name: editName,
        email,
        phone: editPhone,
        bankName: editBankName,
        accountName: editAccountName,
        accountNumber: editAccountNumber,
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
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
    <div className="bg-white border border-[#eae3d7] rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Avatar and Leadership Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 lg:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-[#191c1d] text-white flex items-center justify-center font-serif text-base sm:text-lg lg:text-xl italic font-bold shadow-xs shrink-0 overflow-hidden border border-[#eae3d7]">
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
          <div className="min-w-0">
            <b className="text-[13px] sm:text-sm lg:text-base text-[#191c1d] font-bold block leading-snug whitespace-nowrap">
              {name || "Studio Director"}
            </b>
            <span className="text-[11px] sm:text-xs text-[#5c5f60] mt-0.5 block leading-tight whitespace-nowrap">
              {studioName}
            </span>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleStartEdit}
            className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#faf7f2] hover:bg-[#f0ebe3] text-[#191c1d] border border-[#ded7cb] hover:border-[#c59a78] transition-all cursor-pointer shrink-0 shadow-2xs"
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
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs transition-all">
                <input
                  value={editName}
                  onChange={event => setEditName(event.target.value)}
                  placeholder="Elena Vance"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-2">
                Email
              </label>
              <div className="signup-field flex items-center bg-[#f3efe8] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs opacity-80 cursor-not-allowed">
                <input
                  type="email"
                  value={email}
                  disabled
                  readOnly
                  className="w-full text-xs text-[#5c5f60] bg-transparent cursor-not-allowed outline-none border-none select-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#191c1d] mb-2">
                Phone number
              </label>
              <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-4 py-3 text-xs transition-all">
                <input
                  type="tel"
                  value={editPhone}
                  onChange={event => setEditPhone(event.target.value)}
                  placeholder="+234 800 FORMA VIP"
                  className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            {/* Banking Remittance Details */}
            <div className="md:col-span-2 pt-2 border-t border-[#f0e8dc]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#855e2e] block mb-3">
                Remittance Banking Details (For Invoices)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5c5f60] mb-1.5">
                    Bank Name
                  </label>
                  <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-2.5 text-xs transition-all">
                    <input
                      value={editBankName}
                      onChange={event => setEditBankName(event.target.value)}
                      placeholder="e.g. Standard Chartered"
                      className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5c5f60] mb-1.5">
                    Account Name
                  </label>
                  <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-2.5 text-xs transition-all">
                    <input
                      value={editAccountName}
                      onChange={event => setEditAccountName(event.target.value)}
                      placeholder="e.g. Élan Atelier Ltd"
                      className="w-full text-xs text-[#191c1d] placeholder:text-[#9ea1a2] bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5c5f60] mb-1.5">
                    Account Number
                  </label>
                  <div className="signup-field flex items-center bg-[#faf8f5] border border-[#ded7cb] rounded-xl px-3.5 py-2.5 text-xs transition-all">
                    <input
                      value={editAccountNumber}
                      onChange={event => setEditAccountNumber(event.target.value)}
                      placeholder="e.g. 0039281745"
                      className="w-full text-xs text-[#191c1d] font-mono placeholder:text-[#9ea1a2] bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Localized Action Buttons */}
          <div className="flex items-center gap-3 pt-2 border-t border-[#f0e8dc]">
            <button
              type="button"
              className="dark-button bg-[#191c1d] hover:bg-black !text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              disabled={saving}
              onClick={handleSave}
            >
              <span>{saving ? "Saving…" : "Save"}</span>
            </button>
            <button
              type="button"
              className="px-4 py-3 rounded-xl text-xs font-semibold text-[#665e57] hover:text-[#191c1d] hover:bg-[#faf7f2] transition-all cursor-pointer flex items-center gap-1.5"
              onClick={() => setIsEditing(false)}
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 bg-[#faf8f5] border border-[#eee7dc] rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c827a] block">
                Full name
              </span>
              <strong className="text-xs font-bold text-[#191c1d] block mt-1">
                {name || "Elena Vance"}
              </strong>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-[#eee7dc] rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c827a] block">
                Email address
              </span>
              <strong className="text-xs font-bold text-[#191c1d] block mt-1 truncate">
                {email || "elena@atelierforma.design"}
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

          <div className="p-4 bg-[#faf8f5] border border-[#eee7dc] rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#855e2e] block">
              Remittance Banking Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#191c1d]">
              <div>
                <span className="text-[10px] text-[#8c827a] block">Bank Name</span>
                <span className="font-semibold block mt-0.5">{bankName || "---"}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8c827a] block">Account Name</span>
                <span className="font-semibold block mt-0.5">{accountName || "---"}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8c827a] block">Account Number</span>
                <span className="font-mono font-semibold block mt-0.5">
                  {accountNumber || "---"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Check, Shield } from "lucide-react";
import { GoogleIcon } from "@/components/shared/icons";
import type { ProfileSecurityCardProps } from "@/types";

export function ProfileSecurityCard({ email }: ProfileSecurityCardProps) {
  return (
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
        </div>
      </div>
    </div>
  );
}

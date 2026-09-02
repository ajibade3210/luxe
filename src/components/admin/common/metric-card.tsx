import type { MetricProps } from "@/types";

export function Metric({
  label,
  value,
  detail,
  className = "",
}: MetricProps & { className?: string }) {
  const isLong = typeof value === "string" && value.length > 12;

  return (
    <div
      className={`flex flex-col justify-between bg-white border border-[#eee7dc] rounded-2xl p-5 sm:p-[20px_22px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#ded7cb] hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all ${className}`}
    >
      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#8c827a] mb-1.5 block">
        {label}
      </span>
      <strong
        className={`font-bold leading-tight text-[#191c1d] tabular-nums tracking-tight ${
          isLong ? "!text-lg sm:!text-xl !leading-snug !font-semibold truncate" : "text-[26px]"
        }`}
      >
        {value}
      </strong>
      {detail && <small className="text-[#8c827a] text-[11px] mt-1.5 block">{detail}</small>}
    </div>
  );
}

export function MetricsGrid({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-7 ${className}`}>{children}</div>
  );
}

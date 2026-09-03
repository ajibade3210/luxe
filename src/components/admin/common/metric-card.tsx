import type { MetricProps } from "@/types";

export function Metric({
  label,
  value,
  detail,
  isLoading = false,
  className = "",
}: MetricProps & { className?: string }) {
  const isLong = typeof value === "string" && value.length > 12;

  return (
    <div
      className={`flex flex-col justify-between bg-white border border-atelier-line rounded-2xl p-5 sm:p-[20px_22px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-atelier-subtle hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all ${className}`}
    >
      <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-atelier-muted mb-1.5 block">
        {label}
      </span>
      {isLoading ? (
        <div className="py-1">
          <div className="h-7 w-28 bg-[#f0eae1] animate-pulse rounded-md my-0.5" />
          <div className="h-3.5 w-36 bg-[#f0eae1]/70 animate-pulse rounded-md mt-2" />
        </div>
      ) : (
        <>
          <strong
            className={`font-bold leading-tight text-atelier-ink tabular-nums tracking-tight ${
              isLong ? "!text-lg sm:!text-xl !leading-snug !font-semibold truncate" : "text-[26px]"
            }`}
          >
            {value}
          </strong>
          {detail && (
            <small className="text-atelier-muted text-[11px] mt-1.5 block">{detail}</small>
          )}
        </>
      )}
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

import type { PageTitleProps } from "@/types";

export function PageTitle({
  title,
  action,
  children,
  className = "",
}: PageTitleProps & { className?: string }) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6 sm:mb-8 ${className}`}
    >
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-[#191c1d] my-1">
          {title}
        </h1>
      </div>
      {(action || children) && (
        <div className="hidden lg:flex items-center gap-2.5">{action || children}</div>
      )}
    </div>
  );
}

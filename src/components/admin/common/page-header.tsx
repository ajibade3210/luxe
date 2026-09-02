import type { PageTitleProps } from "@/types";

export function PageTitle({
  title,
  action,
  children,
  className = "",
}: PageTitleProps & { className?: string }) {
  return (
    <div className={`flex items-center justify-between gap-4 mb-6 sm:mb-8 ${className}`}>
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-[#191c1d] my-1">
          {title}
        </h1>
      </div>
      {(action || children) && (
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">{action || children}</div>
      )}
    </div>
  );
}

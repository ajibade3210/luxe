import type { PageTitleProps } from "@/types";

export function PageTitle({
  title,
  description,
  action,
  children,
  className = "",
}: PageTitleProps & { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-3 mb-6 sm:mb-8 ${className}`}
    >
      <div className="min-w-0">
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-[#191c1d] my-1">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-[#6b7280] mt-1 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {(action || children) && (
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto sm:ml-0">
          {action || children}
        </div>
      )}
    </div>
  );
}

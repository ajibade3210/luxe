import type { ReactNode } from "react";

export function TableCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-[#eee7dc] bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col min-h-[clamp(540px,65vh,850px)] ${className}`}
    >
      {children}
    </div>
  );
}

export function TableHead({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between border-b border-[#eee7dc] p-4 sm:p-[16px_22px] bg-white ${className}`}
    >
      {children}
    </div>
  );
}

export function TableWrap({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`overflow-x-auto flex-1 min-h-0 ${className}`}>{children}</div>;
}

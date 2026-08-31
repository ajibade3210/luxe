import Image from "next/image";
import type { TableEmptyStateProps } from "@/types";

export function TableEmptyState({
  title = "No records found",
  description = "Try adjusting your search query or filter.",
  imageSrc = "/images/empty-state.png",
  colSpan = 6,
  className = "",
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={`text-center py-12 text-[#8c827a] ${className}`}>
        <div className="flex flex-col items-center justify-center mx-auto mb-2">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 flex items-center justify-center">
            <Image
              src={imageSrc}
              alt="Empty list illustration"
              width={96}
              height={96}
              className="object-contain w-full h-full drop-shadow-xs select-none pointer-events-none"
              priority
            />
          </div>
          {title && (
            <b className="text-xs sm:text-sm font-semibold text-[#191c1d] block">{title}</b>
          )}
          {description && (
            <span className="text-[11px] sm:text-xs text-[#8c827a] block mt-0.5 max-w-sm">
              {description}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

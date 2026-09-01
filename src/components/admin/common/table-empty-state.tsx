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
    <tr className="empty-state-row !bg-transparent hover:!bg-transparent cursor-default">
      <td
        colSpan={colSpan}
        className={`!text-center !align-middle !bg-transparent !p-0 !border-0 text-[#8c827a] ${className}`}
        style={{
          textAlign: "center",
          verticalAlign: "middle",
          backgroundColor: "transparent",
        }}
      >
        <div className="w-full min-h-[420px] sm:min-h-[480px] md:min-h-[540px] lg:min-h-[600px] flex flex-col items-center justify-center text-center mx-auto my-auto px-6 py-12">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 mb-4 mx-auto flex items-center justify-center">
            <Image
              src={imageSrc}
              alt="Empty list illustration"
              width={208}
              height={208}
              className="object-contain w-full h-full mx-auto drop-shadow-sm select-none pointer-events-none"
              priority
            />
          </div>
          {title && (
            <b className="text-base sm:text-lg md:text-xl font-bold text-[#191c1d] block tracking-tight text-center">
              {title}
            </b>
          )}
          {description && (
            <span className="text-xs sm:text-sm text-[#8c827a] block mt-2 max-w-md mx-auto leading-relaxed text-center">
              {description}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

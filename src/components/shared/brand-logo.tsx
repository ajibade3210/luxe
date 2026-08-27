import Image from "next/image";
import Link from "next/link";
import { APP_CONFIG } from "@/constants";
import { cn } from "@/utils";

interface BrandLogoProps {
  monogram?: string;
  name?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "light" | "custom";
  href?: string;
  className?: string;
  monogramClassName?: string;
  textClassName?: string;
}

export function BrandLogo({
  name = APP_CONFIG.name,
  subtitle,
  size = "md",
  href = "/",
  className,
  monogramClassName,
  textClassName,
}: BrandLogoProps) {
  const sizeClasses = {
    sm: {
      box: "w-9 h-9",
      text: "text-base font-bold",
      sub: "text-[10px]",
      gap: "gap-2.5",
    },
    md: {
      box: "w-12 h-12",
      text: "text-lg font-bold tracking-tight",
      sub: "text-[11px]",
      gap: "gap-3",
    },
    lg: {
      box: "w-16 h-16",
      text: "text-2xl font-bold tracking-tight",
      sub: "text-xs",
      gap: "gap-3.5",
    },
  }[size];

  const content = (
    <div
      className={cn(
        "inline-flex items-center text-decoration-none group cursor-pointer select-none",
        sizeClasses.gap,
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shrink-0",
          sizeClasses.box,
          monogramClassName
        )}
      >
        <Image
          src="/shopwus-logo.png"
          alt={`${name} logo`}
          width={64}
          height={64}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "text-[#191c1d] group-hover:text-[#855e2e] transition-colors leading-tight",
            sizeClasses.text,
            textClassName
          )}
        >
          {name}
        </span>
        {subtitle && (
          <span
            className={cn("text-[#8e9192] uppercase tracking-wider font-mono", sizeClasses.sub)}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${name} Homepage`}
        className="text-decoration-none inline-flex"
      >
        {content}
      </Link>
    );
  }

  return content;
}

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
  monogram = "Ś",
  name = APP_CONFIG.name,
  subtitle,
  size = "md",
  theme = "dark",
  href = "/",
  className,
  monogramClassName,
  textClassName,
}: BrandLogoProps) {
  const sizeClasses = {
    sm: {
      box: "w-7 h-7 text-sm rounded-md",
      text: "text-sm",
      sub: "text-[9px]",
      gap: "gap-2",
    },
    md: {
      box: "w-8 h-8 text-base rounded-lg",
      text: "text-base",
      sub: "text-[10px]",
      gap: "gap-2.5",
    },
    lg: {
      box: "w-10 h-10 text-lg rounded-xl",
      text: "text-lg",
      sub: "text-xs",
      gap: "gap-3",
    },
  }[size];

  const themeClasses = {
    dark: "bg-[#191c1d] text-white",
    light: "bg-white text-[#191c1d] border border-[#e4dacf]",
    custom: "",
  }[theme];

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
          "flex items-center justify-center font-serif italic font-bold shadow-xs transition-transform group-hover:scale-105 shrink-0",
          sizeClasses.box,
          themeClasses,
          monogramClassName
        )}
      >
        {monogram}
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "font-bold tracking-tight text-[#191c1d] group-hover:text-black transition-colors",
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

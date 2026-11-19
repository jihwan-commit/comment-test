import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const VARIANT: Record<Variant, string> = {
  primary: "bg-mainBlue text-white hover:opacity-90 disabled:bg-cool300",
  secondary:
    "border border-cool300 bg-white text-achromaticBlack hover:bg-cool100 disabled:text-cool400",
  danger:
    "border border-lampRed bg-white text-lampRed hover:bg-red-50 disabled:border-cool300 disabled:text-cool400",
  ghost: "text-cool700 hover:bg-cool100",
};

export function Button({
  variant = "secondary",
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-md px-3 text-[13px] font-semibold whitespace-nowrap disabled:cursor-not-allowed",
        VARIANT[variant],
        className
      )}
    />
  );
}

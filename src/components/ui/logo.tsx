import { cn } from "@/utils";
import Link from "next/link";
import { HTMLAttributes, forwardRef } from "react";

export interface LogoProps extends HTMLAttributes<HTMLAnchorElement> {}

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>(function Logo(
  { className, ...props },
  ref
) {
  return (
    <Link href="/" className={cn("font-bold", className)} ref={ref} {...props}>
      <span className="text-primary">post</span>land
    </Link>
  );
});

export const CrazyLogo = forwardRef<
  HTMLAnchorElement,
  LogoProps & { radius: number }
>(function CrazyLogo({ className, radius, ...props }, ref) {
  return (
    <Link
      href="/"
      className={cn(
        className,
        "inline-block overflow-hidden select-none aspect-square bg-secondary font-bold relative"
      )}
      style={{ borderRadius: radius }}
      ref={ref}
      {...props}
    >
      <div
        className="absolute bottom-0 inset-x-0 bg-primary h-1/2"
        style={{ borderRadius: radius }}
      />
      <div className="flex items-center justify-center p-4 text-primary z-10 absolute top-0 inset-x-0 h-1/2">
        post
      </div>
      <div className="flex items-center justify-center p-4 text-primary-foreground z-10 absolute bottom-0 inset-x-0 h-1/2">
        land
      </div>
    </Link>
  );
});

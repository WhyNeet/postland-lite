import { cn } from "@/utils";
import { ClassValue } from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnchorHTMLAttributes, forwardRef } from "react";

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  activeClassName: ClassValue;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  function NavLink({ href, className, activeClassName, ...props }, ref) {
    const { pathname } = useRouter();

    return (
      <Link
        href={href ?? ""}
        className={cn(
          "font-semibold transition-colors",
          className,
          pathname === href ? activeClassName : ""
        )}
        ref={ref}
        {...props}
      ></Link>
    );
  }
);

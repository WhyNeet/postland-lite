import { AnchorHTMLAttributes, HTMLAttributes, forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "next-auth";
import Link from "next/link";

export interface AccountButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  user: User;
}

export const AccountButton = forwardRef<HTMLAnchorElement, AccountButtonProps>(
  function AccountButton({ user, ...props }, ref) {
    return (
      <Link href="/users/@me" ref={ref} {...props}>
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.image!} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>
    );
  }
);

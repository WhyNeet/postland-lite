import { AnchorHTMLAttributes, HTMLAttributes, forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Session } from "next-auth";

export interface AccountButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  user: Session["user"];
}

export const AccountButton = forwardRef<HTMLAnchorElement, AccountButtonProps>(
  function AccountButton({ user, ...props }, ref) {
    return (
      <Link href={`/@${user.username}`} ref={ref} {...props}>
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.image!} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>
    );
  }
);

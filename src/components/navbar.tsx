import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { CrazyLogo, Logo } from "./ui/logo";
import { Button, buttonVariants } from "./ui/button";
import { useSession } from "next-auth/react";
import { NavLink } from "./ui/navlink";
import { Spinner } from "./ui/spinner";
import { AccountButton } from "./account-button";

const components: { title: string; href: string }[] = [
  {
    title: "Posts",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
  },
];

export function NavBar() {
  const { status, data } = useSession();

  return (
    <header className="h-16 fixed inset-x-0 top-0 border-b border-b-border backdrop-blur-lg bg-background/40 flex items-center px-5 sm:px-10 lg:px-20">
      <Logo className="text-lg mr-10" />
      <nav className="flex items-center gap-6">
        {components.map(({ href, title }) => (
          <NavLink
            activeClassName="text-white"
            className="text-muted-foreground hover:text-white/80 text-sm"
            href={href}
            key={href}
          >
            {title}
          </NavLink>
        ))}
      </nav>
      <span className="flex-1" />
      {status === "loading" ? (
        <Spinner className="h-6 w-6" />
      ) : status === "unauthenticated" ? (
        <Link href="/auth/log-in" className={buttonVariants()}>
          Log in
        </Link>
      ) : (
        <AccountButton user={data!.user!} />
      )}
    </header>
  );
}

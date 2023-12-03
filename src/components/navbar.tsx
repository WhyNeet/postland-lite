import { Logo } from "./ui/logo";
import { NavLink } from "./ui/navlink";
import { AccountButton } from "./account-button";
import { Session } from "next-auth";

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

export function NavBar({ user }: { user: Session["user"] | null }) {
  return (
    <header className="h-16 fixed inset-x-0 top-0 backdrop-blur-lg bg-background/40 flex items-center px-5 sm:px-10 lg:px-20 z-50">
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
      {user ? <AccountButton user={user} /> : null}
    </header>
  );
}

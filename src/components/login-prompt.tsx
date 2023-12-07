import Link from "next/link";
import { buttonVariants } from "./ui/button";

export const LoginPrompt = () => (
  <div className="p-4 border border-border rounded-xl bg-secondary flex mb-6">
    <div>
      <div className="font-semibold">You are not logged in.</div>
      <p className="text-sm text-muted-foreground">Log in to start posting.</p>
    </div>
    <span className="flex-1" />
    <Link href="/auth/log-in" className={buttonVariants()}>
      Log in
    </Link>
  </div>
);

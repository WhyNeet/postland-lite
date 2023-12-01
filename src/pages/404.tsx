import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col">
      <h1 className="text-7xl font-bold">404</h1>
      <p className="text-sm text-muted-foreground">
        This page does not exist.{" "}
        <Link
          href="/"
          className={buttonVariants({ variant: "link" })}
          style={{ padding: 0 }}
        >
          Homepage
        </Link>
      </p>
    </div>
  );
}

import { cn } from "@/utils";
import { HTMLAttributes, forwardRef } from "react";
import { Spinner } from "./ui/spinner";

export const PostsLoader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { label: string }
>(function PostsLoader({ className, label, ...props }, ref) {
  return (
    <div
      className={cn(
        "h-20 w-full flex items-center justify-center gap-2 -mt-6",
        className
      )}
      ref={ref}
      {...props}
    >
      <Spinner className="h-5 w-5" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
});

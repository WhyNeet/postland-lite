import { cn } from "@/utils";
import { HTMLAttributes, forwardRef } from "react";

const h1 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function h1({ className, ...props }, ref) {
    return (
      <h1
        className={cn(
          "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

const h2 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function h2({ className, ...props }, ref) {
    return (
      <h2
        className={cn(
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

const h3 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function h3({ className, ...props }, ref) {
    return (
      <h3
        className={cn(
          "scroll-m-20 text-2xl font-semibold tracking-tight",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

const h4 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function h4({ className, ...props }, ref) {
    return (
      <h4
        className={cn(
          "scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

const p = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function p({ className, ...props }, ref) {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      ref={ref}
      {...props}
    />
  );
});

export const text = { h1, h2, h3, h4, p };

import { cn } from "@/utils";
import { HTMLAttributes, useEffect, useRef } from "react";

export const TextArea = ({
  className,
  content,
  ...props
}: HTMLAttributes<HTMLTextAreaElement> & { content: string }) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "0px";
    const scrollHeight = ref.current.scrollHeight;
    ref.current.style.height = scrollHeight + "px";
  }, [content]);

  return (
    <textarea
      ref={ref}
      className={cn(
        "bg-transparent w-full outline-none resize-none",
        className
      )}
      value={content}
      {...props}
    />
  );
};

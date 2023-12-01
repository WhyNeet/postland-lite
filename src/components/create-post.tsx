import { AccountButton } from "./account-button";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { trpc } from "@/utils/trpc";
import { useToast } from "./ui/use-toast";
import { EyeNoneIcon } from "@radix-ui/react-icons";
import { Toggle } from "./ui/toggle";
import { Progress } from "./ui/progress";

const maxChars = 1000;

export const CreatePost = ({ user }: { user: User }) => {
  const { toast } = useToast();

  const [content, setContent] = useState("");
  const [isDraft, setIsDraft] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutateAsync, isLoading } = trpc.post.create.useMutation({
    onSuccess() {
      toast({ description: "Post created." });
    },
  });

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "0px";
    const scrollHeight = inputRef.current.scrollHeight;
    inputRef.current.style.height = scrollHeight + "px";
  }, [content]);

  return (
    <div className="w-full border-b border-b-border pb-2 flex">
      <AccountButton user={user} className="mr-4" />
      <div className="w-full">
        <textarea
          placeholder="What's on your mind?"
          ref={inputRef}
          className="bg-transparent w-full outline-none mb-4 resize-none text-[15px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Toggle
              pressed={isDraft}
              onPressedChange={setIsDraft}
              aria-label="Toggle draft"
            >
              <EyeNoneIcon />
            </Toggle>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              <Progress
                strokeRatio={0.1}
                dims={{ width: 32, radius: 16 }}
                progress={(maxChars - content.length) / maxChars}
                className="mr-2"
              />
            </p>
            <Button
              className="self-end"
              disabled={
                isLoading ||
                !content.trim().length ||
                content.trim().length > 1000
              }
              onClick={() =>
                mutateAsync({ content, isDraft, parentPostId: null })
              }
            >
              {isDraft ? "Draft" : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

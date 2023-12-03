import { AccountButton } from "./account-button";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { useToast } from "./ui/use-toast";
import { EyeNoneIcon } from "@radix-ui/react-icons";
import { Toggle } from "./ui/toggle";
import { Progress } from "./ui/progress";
import { Spinner } from "./ui/spinner";
import { TextArea } from "./ui/textarea";

const maxChars = 1000;

export const CreatePost = ({
  user,
  onCreate,
  replyTo,
}: {
  user: Session["user"];
  onCreate?: () => void;
  replyTo?: string;
}) => {
  const { toast } = useToast();

  const [content, setContent] = useState("");
  const [isDraft, setIsDraft] = useState(false);

  const { mutateAsync, isLoading } = trpc.post.create.useMutation({
    onSuccess() {
      toast({ description: "Post created." });
      onCreate?.();
    },
  });

  return (
    <div className="w-full border-b border-b-border pb-2 flex">
      <AccountButton user={user} className="mr-4" />
      <div className="w-full">
        <TextArea
          placeholder="What's on your mind?"
          content={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          className="text-[15px] mb-4"
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
                mutateAsync({ content, isDraft, parentPostId: replyTo })
              }
            >
              {isLoading ? (
                <Spinner className="h-5 w-5" />
              ) : isDraft ? (
                "Draft"
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

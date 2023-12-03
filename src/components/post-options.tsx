import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { trpc } from "@/utils/trpc";
import { useToast } from "./ui/use-toast";
import { Post } from "./posts-list";

export const PostOptions = ({
  post: { isDraft, id, ...post },
  updatePost,
  setIsEditing,
  deletePost,
}: {
  post: Post;
  updatePost: (data: Post) => void;
  setIsEditing: (to: boolean) => void;
  deletePost: () => void;
}) => {
  const { toast } = useToast();

  const { mutateAsync, isLoading } = trpc.post.update.useMutation({
    onError: ({ message }) =>
      toast({ description: message, variant: "destructive" }),
    onSuccess: (message) => toast({ description: message }),
  });

  const toggleIsDraft = async () => {
    mutateAsync({ id, isDraft: !isDraft })
      .then(() => updatePost({ ...post, id, isDraft: false }))
      .catch(console.log);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2">
          <DotsVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isDraft ? (
          <DropdownMenuItem onClick={toggleIsDraft} disabled={isLoading}>
            Publish
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onClick={() => setIsEditing(true)}
          disabled={isLoading}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deletePost}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

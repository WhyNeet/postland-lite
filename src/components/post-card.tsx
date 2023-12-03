import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import {
  CalendarIcon,
  ChatBubbleIcon,
  CheckIcon,
  CornerBottomLeftIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import { timeSince } from "@/utils/time";
import { MouseEvent, useEffect, useState } from "react";
import { TextArea } from "./ui/textarea";
import { PostOptions } from "./post-options";
import { Post } from "./posts-list";
import { Button, buttonVariants } from "./ui/button";
import { trpc } from "@/utils/trpc";
import { useToast } from "./ui/use-toast";
import { Spinner } from "./ui/spinner";

export const PostCard = ({
  post: initialPost,
  userId,
  deletePost,
  withReply,
}: {
  post: Post;
  userId: string | null;
  deletePost: () => void;
  withReply?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [post, setPost] = useState(initialPost);

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  const { toast } = useToast();

  const { mutateAsync, isLoading } = trpc.post.update.useMutation({
    onError: ({ message }) =>
      toast({ description: message, variant: "destructive" }),
    onSuccess: (message) => toast({ description: message }),
  });

  const { mutateAsync: deleteAsync } = trpc.post.delete.useMutation({
    onError: () =>
      toast({ description: "Failed to delete post.", variant: "destructive" }),
    onSuccess: (message) => {
      toast({ description: message });
      deletePost();
    },
  });

  const updateContent = async () => {
    if (initialPost.content === post.content) return;
    mutateAsync({ id: post.id, content: post.content });
  };

  const createdAt = post.author.createdAt.toUTCString().split(" ");
  return (
    <li className="p-4 flex gap-4 border border-border rounded-xl mb-2 last:mb-0 relative w-full">
      <PostAvatar
        setIsFollowing={(isFollowed) =>
          setPost((prev) => ({
            ...prev,
            author: { ...prev.author, isFollowed },
          }))
        }
        userId={userId}
        author={post.author}
        createdAt={createdAt}
      />
      <div className="w-full">
        {withReply && post.parentPost ? (
          <Link
            href={`/post/${post.parentPost.id}`}
            className="text-sm mb-2 flex items-center gap-2 pl-2 text-muted-foreground"
          >
            <CornerBottomLeftIcon className="-translate-y-[2px]" />
            <span className="font-semibold text-foreground">
              @{post.parentPost.author.username}
            </span>
            <p className="line-clamp-1 overflow-hidden text-ellipsis">
              {post.parentPost.content}
            </p>
          </Link>
        ) : null}
        <Link
          className="mb-1 text-sm font-semibold flex items-center gap-2 w-fit"
          href={`/@${post.author.username}`}
        >
          {post.author.name}
          <span className="text-muted-foreground font-medium hover:underline">
            @{post.author.username}
          </span>
          <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
          <span
            className="text-muted-foreground font-normal"
            suppressHydrationWarning
          >
            {timeSince(new Date(post.createdAt as unknown as string))}
          </span>
          {post.isDraft ? (
            <>
              <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
              <span className="text-muted-foreground font-normal">Draft</span>
            </>
          ) : null}
        </Link>
        {isEditing ? (
          <TextArea
            content={post.content}
            onChange={(e) =>
              setPost((prev) => ({
                ...prev,
                content: (e.target as HTMLTextAreaElement).value,
              }))
            }
            className="text-[15px]"
          />
        ) : (
          <p
            className={`${
              post.isDraft ? "opacity-70" : "opacity-100"
            } text-[15px] mr-8`}
          >
            {post.content}
          </p>
        )}
        {isLoading ? (
          <Spinner className="h-5 w-5 absolute top-2 right-2" />
        ) : isEditing ? (
          <Button
            variant="ghost"
            className="absolute top-2 right-2 backdrop-blur"
            onClick={() => {
              setIsEditing(false);
              updateContent();
            }}
            size="icon"
          >
            <CheckIcon />
          </Button>
        ) : userId === post.authorId ? (
          <PostOptions
            setIsEditing={setIsEditing}
            post={post}
            updatePost={setPost}
            deletePost={() => {
              deleteAsync({ id: post.id });
            }}
          />
        ) : null}
        {userId && !post.isDraft && !isEditing ? (
          <PostActions post={post} setPost={setPost} />
        ) : null}
      </div>
    </li>
  );
};

const PostActions = ({
  post,
  setPost,
}: {
  post: Post;
  setPost: (post: Post | ((prev: Post) => Post)) => void;
}) => {
  const { toast } = useToast();

  const { mutateAsync, isLoading } = trpc.post.like.useMutation({
    onError() {
      toast({ description: "Something went wrong.", variant: "destructive" });
    },
  });

  const toggleLike = () =>
    mutateAsync({ id: post.id, isLiked: !post.isLiked })
      .then(() =>
        setPost((prev) => ({
          ...prev,
          isLiked: !prev.isLiked,
          _count: {
            ...prev._count,
            likes: prev.isLiked ? prev._count.likes - 1 : prev._count.likes + 1,
          },
        }))
      )
      .catch(console.log);

  return (
    <div className="flex items-center mt-2">
      <Button
        onClick={toggleLike}
        variant="ghost"
        className="text-red-500"
        disabled={isLoading}
      >
        {post.isLiked ? (
          <HeartFilledIcon className="mr-2" />
        ) : (
          <HeartIcon className="mr-2" />
        )}{" "}
        {post._count.likes}
      </Button>
      <Link
        href={`/post/${post.id}`}
        className={buttonVariants({
          className: "text-blue-500",
          variant: "ghost",
        })}
      >
        <ChatBubbleIcon className="mr-2" /> {post._count.comments}
      </Link>
    </div>
  );
};

export const PostAvatar = ({
  author,
  createdAt,
  userId,
  setIsFollowing,
}: {
  author: Post["author"];
  createdAt: string[];
  userId: string | null;
  setIsFollowing: (isFollowing: boolean) => void;
}) => {
  const { toast } = useToast();

  const { mutateAsync, isLoading } = trpc.user.follow.useMutation({
    onError: ({ message }) =>
      toast({ description: message, variant: "destructive" }),
    onSuccess: (isFollwing) => setIsFollowing(isFollwing),
  });

  const followAuthor = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (userId === author.id) return;
    mutateAsync({ id: author.id, isFollowing: !author.isFollowed }).catch(
      console.log
    );
  };

  return (
    <HoverCard>
      <HoverCardTrigger className="h-fit">
        <Avatar className="cursor-pointer">
          <AvatarImage src={author.image ?? ""} />
          <AvatarFallback>{author.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 relative">
        <Link href={`/@${author.username}`} className="flex space-x-4 h-fit">
          <Avatar>
            <AvatarImage src={author.image ?? ""} />
            <AvatarFallback>{author.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              @{author.username}
              {!userId || author.id === userId ? null : isLoading ? (
                <Spinner className="" />
              ) : (
                <button
                  onClick={followAuthor}
                  className={`rounded-full px-3 py-1 text-xs ${
                    author.isFollowed ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  {author.isFollowed ? "Following" : "Follow"}
                </button>
              )}
            </h4>
            <p className="text-sm line-clamp-2 text-ellipsis overflow-hidden">
              {author.bio ?? "No bio provided."}
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined {createdAt.slice(0, createdAt.length - 2).join(" ")}
              </span>
            </div>
          </div>
        </Link>
      </HoverCardContent>
    </HoverCard>
  );
};

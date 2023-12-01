import { appRouter } from "@/server/routers/_app";
import { inferProcedureOutput } from "@trpc/server";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { CalendarIcon } from "@radix-ui/react-icons";
import { timeSince } from "@/utils/time";
import { Badge } from "./ui/badge";

export const PostsList = ({
  posts,
}: {
  posts: inferProcedureOutput<(typeof appRouter)["post"]["getList"]>;
}) => {
  return posts.length ? (
    <ul className="my-6">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </ul>
  ) : (
    <div>no posts here yet...</div>
  );
};

export const PostCard = ({
  post,
}: {
  post: inferProcedureOutput<(typeof appRouter)["post"]["getList"]>[0];
}) => {
  const createdAt = post.author.createdAt.toUTCString().split(" ");
  return (
    <li className="p-4 flex gap-4 border border-border rounded-xl mb-2">
      <HoverCard>
        <HoverCardTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src={post.author.image ?? ""} />
            <AvatarFallback>{post.author.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <Link href={`/@${post.author.username}`} className="flex space-x-4">
            <Avatar>
              <AvatarImage src={post.author.image ?? ""} />
              <AvatarFallback>{post.author.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@{post.author.username}</h4>
              <p className="text-sm line-clamp-2 text-ellipsis overflow-hidden">
                {post.author.bio ?? "No bio provided."}
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
      <div className="relative w-full">
        <Link
          className="mb-1 text-sm font-semibold flex items-center gap-2"
          href={`/@${post.author.username}`}
        >
          {post.author.name}
          <span className="text-muted-foreground font-medium hover:underline">
            @{post.author.username}
          </span>
          <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
          <span className="text-muted-foreground font-normal">
            {timeSince(new Date(post.createdAt as unknown as string))}
          </span>
        </Link>
        <p
          className={`${
            post.isDraft ? "opacity-70" : "opacity-100"
          } text-[15px]`}
        >
          {post.content}
        </p>
        <div className="absolute top-0 right-0">
          {post.isDraft ? <Badge variant="secondary">Draft</Badge> : null}
        </div>
      </div>
    </li>
  );
};

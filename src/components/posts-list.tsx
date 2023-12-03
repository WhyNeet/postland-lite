import { appRouter } from "@/server/routers/_app";
import { inferProcedureOutput } from "@trpc/server";
import { PostCard } from "./post-card";
import { useEffect, useRef } from "react";
import { trpc } from "@/utils/trpc";
import { PostsLoader } from "./loader";

export type Post = inferProcedureOutput<
  (typeof appRouter)["post"]["getList"]
>[0];

export const InfinitePostsList = ({
  userId,
  withReplies,
  posts,
  refetch,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
}: {
  userId: string | null;
  withReplies?: boolean;
  posts: { pages: inferProcedureOutput<typeof trpc.post.getList>[] };
  refetch: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
}) => {
  return (
    <>
      {posts && (
        <PostsList
          deletePost={() => refetch()}
          posts={posts.pages.flat()}
          userId={userId}
          withReplies={withReplies}
          onEnd={() => (hasNextPage ? fetchNextPage() : null)}
        />
      )}
      {isFetchingNextPage || isLoading ? (
        <PostsLoader
          label={`Loading${isFetchingNextPage ? " more" : ""} posts...`}
        />
      ) : hasNextPage ? null : (
        <div className="h-20 w-full flex items-center justify-center text-muted-foreground text-sm">
          No posts left to show
        </div>
      )}
    </>
  );
};

export const PostsList = ({
  posts,
  userId,
  deletePost,
  withReplies,
  onEnd,
}: {
  posts: Post[];
  userId: string | null;
  deletePost: (id: string) => void;
  withReplies?: boolean;
  onEnd?: () => void;
}) => {
  const end = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!end.current) return;

    const observer = new IntersectionObserver((e) => {
      const entry = e[0];
      if (entry.isIntersecting) onEnd?.();
    });

    observer.observe(end.current!);

    return () => observer.disconnect();
  }, [onEnd]);

  return posts.length ? (
    <ul className="my-6 w-full">
      {posts.map((post) => (
        <PostCard
          deletePost={() => deletePost(post.id)}
          post={post}
          key={post.id}
          userId={userId}
          withReply={withReplies}
        />
      ))}
      <span ref={end} />
    </ul>
  ) : null;
};

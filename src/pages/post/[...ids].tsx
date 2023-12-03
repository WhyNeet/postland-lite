import { appRouter } from "@/server/routers/_app";
import { transformer } from "@/utils/transformer";
import { trpc } from "@/utils/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { prisma } from "@/utils/prisma";
import { NavBar } from "@/components/navbar";
import Head from "next/head";
import { CreatePost } from "@/components/create-post";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { InfinitePostsList } from "@/components/posts-list";
import { useRouter } from "next/router";
import { PostCard } from "@/components/post-card";
import { useEffect } from "react";

export async function getServerSideProps({
  query,
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  const rootPostId = query.ids!.at(-1)!;

  const helpers = createServerSideHelpers({
    router: appRouter,
    transformer,
    ctx: { prisma, session },
  });

  await helpers.post.getList.prefetch({
    cursor: 0,
    take: 20,
    rootPost: rootPostId,
  });

  await helpers.post.getById.prefetch({ id: rootPostId });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      user: session?.user ?? null,
      rootPostId,
    },
  };
}

export default function PostFeed({
  user,
  rootPostId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const { data: rootPost, refetch: refetchRoot } = trpc.post.getById.useQuery({
    id: router.query.ids ? router.query.ids.at(-1)! : rootPostId,
  });

  const {
    data: posts,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
  } = trpc.post.getList.useInfiniteQuery(
    {
      take: 20,
      rootPost: router.query.ids ? router.query.ids.at(-1)! : rootPostId,
    },
    {
      getNextPageParam: (_, all) => {
        if (all.at(-1)?.length === 0) return undefined;
        return all.length * 20;
      },
      initialCursor: 0,
    }
  );

  useEffect(() => {
    if (isError || !rootPost) router.replace("/");
  }, [posts, isError, rootPost, router]);

  return (
    <div>
      <Head>
        <title>postland</title>
      </Head>
      <NavBar user={user} />
      <div className="px-5 sm:px-10 lg:px-20 py-24 max-w-7xl mx-auto">
        <PostCard
          post={rootPost!}
          deletePost={() => router.replace("/")}
          userId={user?.id ?? null}
        />
        <div className="h-6 w-full"></div>
        {user ? (
          <CreatePost replyTo={rootPostId} user={user} onCreate={refetch} />
        ) : (
          <div className="p-4 border border-border rounded-xl bg-secondary flex">
            <div>
              <div className="font-semibold">You are not logged in.</div>
              <p className="text-sm text-muted-foreground">
                Log in to start posting.
              </p>
            </div>
            <span className="flex-1" />
            <Link href="/auth/log-in" className={buttonVariants()}>
              Log in
            </Link>
          </div>
        )}
        <InfinitePostsList
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          posts={posts as any}
          refetch={refetch}
          userId={user?.id ?? null}
        />
      </div>
    </div>
  );
}

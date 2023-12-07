import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { NavBar } from "@/components/navbar";
import Head from "next/head";
import { CreatePost } from "@/components/create-post";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { InfinitePostsList } from "@/components/posts-list";
import { useRouter } from "next/router";
import { PostCard } from "@/components/post-card";
import { PostsLoader } from "@/components/loader";
import { LoginPrompt } from "@/components/login-prompt";

export async function getServerSideProps({
  query,
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  const rootPostId = query.ids!.at(-1)!;

  // const helpers = createServerSideHelpers({
  //   router: appRouter,
  //   transformer,
  //   ctx: { prisma, session },
  // });

  // await helpers.post.getList.prefetchInfinite({
  //   cursor: 0,
  //   take: 20,
  //   rootPost: rootPostId,
  // });

  // await helpers.post.getById.prefetch({ id: rootPostId });

  return {
    props: {
      // trpcState: helpers.dehydrate(),
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

  const {
    data: rootPost,
    isLoading: isLoadingRoot,
    isError: isErrorRoot,
  } = trpc.post.getById.useQuery({
    id: router.query.ids ? router.query.ids.at(-1)! : rootPostId,
  });

  const {
    data: posts,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
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

  if (!isLoadingRoot && !rootPost)
    return (
      <div className="h-screen w-screen flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold">Cannot find this post.</h1>
        <p className="text-sm text-muted-foreground">
          Failed to find a post with this id.{" "}
          <Link
            href="/"
            className={buttonVariants({ variant: "link" })}
            style={{ padding: 0 }}
          >
            Homepage
          </Link>
        </p>
      </div>
    );

  return (
    <div>
      <Head>
        <title>postland</title>
      </Head>
      <NavBar user={user} />
      <div className="px-5 sm:px-10 lg:px-20 py-24 max-w-7xl mx-auto">
        {isLoadingRoot ? (
          <PostsLoader label="Loading..." />
        ) : (
          <PostCard
            post={rootPost!}
            deletePost={() => router.replace("/")}
            userId={user?.id ?? null}
          />
        )}
        <div className="h-6 w-full"></div>
        {user ? (
          <CreatePost replyTo={rootPostId} user={user} onCreate={refetch} />
        ) : (
          <LoginPrompt />
        )}
        <InfinitePostsList
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          posts={posts as any}
          refetch={refetch}
          isLoading={isLoading}
          userId={user?.id ?? null}
        />
      </div>
    </div>
  );
}

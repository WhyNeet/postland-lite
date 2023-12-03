import { NavBar } from "@/components/navbar";
import Head from "next/head";
import { InfinitePostsList } from "@/components/posts-list";
// import { text } from "@/components/ui/typography";
import { trpc } from "@/utils/trpc";
import { CreatePost } from "@/components/create-post";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
// import { createServerSideHelpers } from "@trpc/react-query/server";
// import { appRouter } from "@/server/routers/_app";
// import { prisma } from "@/utils/prisma";
// import { transformer } from "@/utils/transformer";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  // const helpers = createServerSideHelpers({
  //   router: appRouter,
  //   ctx: { session, prisma },
  //   transformer,
  // });

  // await helpers.post.getList.prefetchInfinite(
  //   {
  //     cursor: 0,
  //     take: 20,
  //   },
  //   { context: { session, prisma } }
  // );

  return {
    props: {
      user: session?.user ?? null,
      // trpcState: helpers.dehydrate(),
    },
  };
}

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    data: posts,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
  } = trpc.post.getList.useInfiniteQuery(
    { take: 20 },
    {
      getNextPageParam: (_, all) => {
        if (all.at(-1)?.length === 0) return undefined;
        return all.length * 20;
      },
      initialCursor: 0,
    }
  );

  return (
    <>
      <Head>
        <title>postland</title>
      </Head>
      <NavBar user={user} />
      <div className="px-5 sm:px-10 lg:px-20 py-24 max-w-7xl mx-auto">
        {user ? (
          <CreatePost user={user} onCreate={refetch} />
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
          isLoading={isLoading}
          refetch={refetch}
          userId={user?.id ?? null}
        />
      </div>
    </>
  );
}

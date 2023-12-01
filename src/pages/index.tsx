import { NavBar } from "@/components/navbar";
import Head from "next/head";
import { PostsList } from "@/components/posts-list";
import { trpc } from "@/utils/trpc";
import { CreatePost } from "@/components/create-post";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return { props: { user: null } };

  return { props: { user: session.user } };
}

export default function Home({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: posts, isLoading } = trpc.post.getList.useQuery({
    offset: 0,
    perPage: 20,
  });
  return (
    <>
      <Head>
        <title>postland</title>
      </Head>
      <NavBar user={user} />
      <div className="px-5 sm:px-10 lg:px-20 py-32 max-w-7xl mx-auto">
        {user ? <CreatePost user={user} /> : null}
        {isLoading ? (
          "loading..."
        ) : (
          <PostsList
            posts={posts!.map((post) => ({
              ...post,
              createdAt: new Date(post.createdAt),
              author: {
                ...post.author,
                createdAt: new Date(post.author.createdAt),
              },
            }))}
          />
        )}
      </div>
    </>
  );
}

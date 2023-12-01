import { NavBar } from "@/components/navbar";
import Head from "next/head";
import { PostsList } from "@/components/posts-list";
import { trpc } from "@/utils/trpc";

export default function Home() {
  const { data: posts, isLoading } = trpc.post.getList.useQuery({
    offset: 0,
    perPage: 20,
  });

  return (
    <>
      <Head>
        <title>postland</title>
      </Head>
      <NavBar />
      <div className="px-5 sm:px-10 lg:px-20 py-32">
        {isLoading ? (
          "loading..."
        ) : (
          <PostsList
            posts={posts!.map((post) => ({
              ...post,
              createdAt: new Date(post.createdAt),
            }))}
          />
        )}
      </div>
    </>
  );
}

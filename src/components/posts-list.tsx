import { appRouter } from "@/server/routers/_app";
import { inferProcedureOutput } from "@trpc/server";

export const PostsList = ({
  posts,
}: {
  posts: inferProcedureOutput<(typeof appRouter)["post"]["getList"]>;
}) => {
  return posts.length ? (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.content}</li>
      ))}
    </ul>
  ) : (
    <div>no posts here yet...</div>
  );
};

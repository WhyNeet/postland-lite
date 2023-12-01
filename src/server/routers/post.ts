import { createPostSchema } from "../schema/createPostSchema";
import { getPostsSchema } from "../schema/getPostsSchema";
import { privateProcedure, publicProcedure, router } from "../trpc";

export const postsRouter = router({
  getList: publicProcedure
    .input(getPostsSchema)
    .query(async ({ input: { offset, perPage }, ctx: { prisma, session } }) => {
      const posts = await prisma.post.findMany({
        skip: offset,
        take: perPage,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              bio: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        where: {
          OR: [
            {
              isDraft: false,
            },
            { authorId: session?.user.id },
          ],
        },
      });

      return posts;
    }),
  create: privateProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      const post = await prisma.post.create({
        data: {
          content: input.content,
          authorId: session.user.id,
          parentPostId: input.parentPostId,
          isDraft: input.isDraft,
        },
      });

      return post;
    }),
});

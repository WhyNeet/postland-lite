import { z } from "zod";
import {
  createPostSchema,
  getPostsSchema,
  updatePostSchema,
} from "../schema/post";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const postsRouter = router({
  getList: publicProcedure
    .input(getPostsSchema)
    .query(
      async ({
        input: { cursor, take, fromUser, rootPost, withReplies },
        ctx: { prisma, session },
      }) => {
        const posts = await prisma.post.findMany({
          skip: cursor,
          take,
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
                followers: {
                  select: { followerId: true },
                },
              },
            },
            parentPost: {
              select: {
                content: true,
                id: true,
                author: { select: { username: true, image: true } },
              },
            },
            likes: { select: { fromUserId: true } },
            _count: {
              select: {
                comments: true,
              },
            },
          },
          where: {
            authorId: fromUser,
            parentPostId:
              typeof rootPost === "string"
                ? rootPost
                : withReplies
                ? undefined
                : null,
            OR: [
              {
                isDraft: false,
              },
              { authorId: session?.user.id },
            ],
          },
        });

        if (!session)
          return posts.map((post) => ({
            ...post,
            likes: undefined,
            isLiked: false,
            _count: { ...post._count, likes: post.likes.length },
            author: {
              ...post.author,
              isFollowed: false,
              followers: undefined,
              _count: { followers: post.author.followers.length },
            },
          }));

        return posts.map((post) => ({
          ...post,
          likes: undefined,
          isLiked: !!post.likes.find(
            ({ fromUserId }) => fromUserId === session.user.id
          ),
          _count: { ...post._count, likes: post.likes.length },
          author: {
            ...post.author,
            isFollowed: !!post.author.followers.find(
              ({ followerId }) => session.user.id === followerId
            ),
            followers: undefined,
            _count: { followers: post.author.followers.length },
          },
        }));
      }
    ),
  getById: publicProcedure
    .input(z.object({ id: z.string().cuid("Id provided is not a CUID") }))
    .query(async ({ ctx: { prisma, session }, input: { id } }) => {
      const post = await prisma.post.findFirst({
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              bio: true,
              createdAt: true,
              followers: {
                select: { followerId: true },
              },
            },
          },
          parentPost: {
            select: {
              content: true,
              id: true,
              author: { select: { username: true, image: true } },
            },
          },
          likes: { select: { fromUserId: true } },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        where: {
          id,
          OR: [
            {
              isDraft: false,
            },
            { authorId: session?.user.id },
          ],
        },
      });

      if (!post) return null;
      if (!session)
        return {
          ...post,
          likes: undefined,
          isLiked: false,
          _count: { ...post._count, likes: post.likes.length },
          author: {
            ...post.author,
            isFollowed: false,
            followers: undefined,
            _count: { followers: post.author.followers.length },
          },
        };

      return {
        ...post,
        likes: undefined,
        isLiked: !!post.likes.find(
          ({ fromUserId }) => fromUserId === session.user.id
        ),
        _count: { ...post._count, likes: post.likes.length },
        author: {
          ...post.author,
          isFollowed: !!post.author.followers.find(
            ({ followerId }) => session.user.id === followerId
          ),
          followers: undefined,
          _count: { followers: post.author.followers.length },
        },
      };
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
  update: privateProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      input.isDraft !== undefined ? (input.isDraft = false) : null;
      await prisma.post.update({
        where: { id: input.id, authorId: session.user.id },
        data: input,
      });

      return "Post updated.";
    }),
  delete: privateProcedure
    .input(z.object({ id: z.string().cuid("In provided is not a CUID") }))
    .mutation(async ({ ctx: { prisma, session }, input: { id } }) => {
      await prisma.post.delete({ where: { id, authorId: session.user.id } });
      return "Post deleted.";
    }),
  like: privateProcedure
    .input(
      z.object({
        isLiked: z.boolean(),
        id: z.string().cuid("Id provided is not a CUID"),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input }) => {
      try {
        if (input.isLiked)
          await prisma.like.create({
            data: { fromUserId: session.user.id, toPostId: input.id },
          });
        else
          await prisma.like.delete({
            where: {
              fromUserId_toPostId: {
                fromUserId: session.user.id,
                toPostId: input.id,
              },
            },
          });
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Already liked/disliked.",
        });
      }
    }),
});

import { TRPCError } from "@trpc/server";
import { profileEditSchema } from "../schema/profileEditSchema";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  update: privateProcedure
    .input(profileEditSchema)
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      try {
        const data =
          input.bio === undefined
            ? {
                name: input.name,
                username: input.username,
                image: input.image,
              }
            : {
                name: input.name,
                username: input.username,
                image: input.image,
                bio: input.bio,
              };

        await prisma.user.update({
          where: { id: session?.user.id },
          data,
        });
      } catch (e: any) {
        if (e?.meta && e.meta?.target && e.meta.target[0] === "username")
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User with this username already exists.",
          });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occured.",
        });
      }

      return { message: "Profile updated." };
    }),

  follow: privateProcedure
    .input(
      z.object({
        id: z.string().cuid("Id provided is not a CUID"),
        isFollowing: z.boolean(),
      })
    )
    .mutation(async ({ ctx: { session, prisma }, input }) => {
      try {
        if (input.isFollowing)
          await prisma.follower.create({
            data: { followerId: session.user.id, followingId: input.id },
          });
        else
          await prisma.follower.delete({
            where: {
              followerId_followingId: {
                followerId: session.user.id,
                followingId: input.id,
              },
            },
          });
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already following/unfollowed this user.",
        });
      }

      return input.isFollowing;
    }),
});

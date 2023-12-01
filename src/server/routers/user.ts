import { TRPCError } from "@trpc/server";
import { profileEditSchema } from "../schema/profileEditSchema";
import { privateProcedure, router } from "../trpc";

export const userRouter = router({
  update: privateProcedure
    .input(profileEditSchema)
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      try {
        await prisma.user.update({
          where: { id: session?.user.id },
          data: {
            name: input.name,
            username: input.username,
            image: input.imageUrl,
          },
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
});

import { initTRPC, TRPCError } from "@trpc/server";
import { createContext } from "./context";

export const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not logged in.",
    });

  return next({ ctx: { ...ctx, session: ctx.session! } });
});

export const privateProcedure = publicProcedure.use(isAuthed);

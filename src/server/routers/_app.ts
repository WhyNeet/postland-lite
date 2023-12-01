import { router } from "@/server/trpc";
import { userRouter } from "./user";
import { postsRouter } from "./post";

export const appRouter = router({
  user: userRouter,
  post: postsRouter,
});

export type AppRouter = typeof appRouter;

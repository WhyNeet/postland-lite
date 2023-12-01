import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().trim().min(1).max(1000),
  isDraft: z.boolean(),
  parentPostId: z.string().trim().cuid("Id provided is not a CUID").nullable(),
});

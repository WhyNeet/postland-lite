import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().trim().min(1).max(1000),
  isDraft: z.boolean(),
  parentPostId: z.string().trim().cuid("Id provided is not a CUID").optional(),
});

export const updatePostSchema = z.object({
  id: z.string().cuid("Id provided is not a CUID"),
  content: z.string().trim().min(1).max(1000).optional(),
  isDraft: z.boolean().optional(),
});

export const getPostsSchema = z.object({
  cursor: z.number().min(0),
  take: z.number().min(1).max(20),
  fromUser: z.string().cuid("Id provided is not a CUID").optional(),
  rootPost: z.string().cuid("Id provided is not a CUID").optional(),
  withReplies: z.boolean().optional(),
});

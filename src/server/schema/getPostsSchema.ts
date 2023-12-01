import { z } from "zod";

export const getPostsSchema = z.object({
  offset: z.number().min(0),
  perPage: z.number().min(1).max(20),
});

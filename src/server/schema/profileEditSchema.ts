import { z } from "zod";

export const profileEditSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is too short.")
    .max(32, "Name is too long."),
  username: z
    .string()
    .trim()
    .min(2, "Username is too short.")
    .max(32, "Username is too long.")
    .refine((value) => /^[a-z0-9_.-]{2,32}$/gi.test(value)),
  imageUrl: z
    .string()
    .nullable()
    .refine((val) => {
      if (!val) return true;

      try {
        z.string().url("Invalid profile image URL provided.").parse(val);
        return true;
      } catch (e) {
        return false;
      }
    }),
});

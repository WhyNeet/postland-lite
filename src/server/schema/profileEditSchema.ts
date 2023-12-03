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
  image: z
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
  bio: z
    .string()
    .trim()
    .min(1, "Bio is too short.")
    .max(200, "Bio is too long.")
    .nullable()
    .optional()
    .transform((val) => {
      if (typeof val === "undefined") return undefined;

      return val ?? null;
    }),
});

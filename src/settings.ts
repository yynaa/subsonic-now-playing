import z from "zod";

export const settings = z.object({
  user: z.string("Missing user"),
  pass: z.string("Missing pass"),
  url: z.url("Missing url"),
});

export type Settings = z.infer<typeof settings>;

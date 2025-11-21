import { z } from "zod";

export const RateSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["技術者", "機械", "警備"]),
  rate: z.number().positive(),
  description: z.string().optional(),
});

export type Rate = z.infer<typeof RateSchema>;
import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number().positive(),
  image: z.string().url(),
  category: z.string().optional(),
  rating: z.number().min(0).max(5),
});
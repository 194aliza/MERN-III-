import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category required"),
  stock: z.number().int().nonnegative().default(0),
  images: z.array(z.string().url()).optional().default([]),
});

export const productUpdateSchema = productSchema.partial();

export type Product = z.infer<typeof productSchema> & { id?: string };

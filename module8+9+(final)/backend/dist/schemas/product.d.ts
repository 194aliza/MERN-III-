import { z } from "zod";
export declare const productSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    category: z.ZodString;
    stock: z.ZodDefault<z.ZodNumber>;
    images: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    category: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
    description?: string | undefined;
}, {
    category: string;
    name: string;
    price: number;
    description?: string | undefined;
    stock?: number | undefined;
    images?: string[] | undefined;
}>;
export declare const productUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    price: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
    stock: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    images: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    category?: string | undefined;
    name?: string | undefined;
    price?: number | undefined;
    stock?: number | undefined;
    images?: string[] | undefined;
}, {
    description?: string | undefined;
    category?: string | undefined;
    name?: string | undefined;
    price?: number | undefined;
    stock?: number | undefined;
    images?: string[] | undefined;
}>;
export type Product = z.infer<typeof productSchema> & {
    id?: string;
};
//# sourceMappingURL=product.d.ts.map
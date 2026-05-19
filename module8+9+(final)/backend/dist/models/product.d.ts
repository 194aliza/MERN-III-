import mongoose from "mongoose";
export declare const Product: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    price: number;
    stock: number;
    images: string[];
    ratings: number[];
    description?: string | undefined;
    category?: string | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    price: number;
    stock: number;
    images: string[];
    ratings: number[];
    description?: string | undefined;
    category?: string | undefined;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    price: number;
    stock: number;
    images: string[];
    ratings: number[];
    description?: string | undefined;
    category?: string | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    price: number;
    stock: number;
    images: string[];
    ratings: number[];
    description?: string | undefined;
    category?: string | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    price: number;
    stock: number;
    images: string[];
    ratings: number[];
    description?: string | undefined;
    category?: string | undefined;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    price: number;
    stock: number;
    images: string[];
    ratings: number[];
    description?: string | undefined;
    category?: string | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=product.d.ts.map
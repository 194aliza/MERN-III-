import mongoose from "mongoose";
export declare const Order: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: string;
    user: mongoose.Types.ObjectId;
    items: {
        product?: mongoose.Types.ObjectId | undefined;
        quantity?: number | undefined;
    }[];
    totalPrice: number;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: string;
    user: mongoose.Types.ObjectId;
    items: {
        product?: mongoose.Types.ObjectId | undefined;
        quantity?: number | undefined;
    }[];
    totalPrice: number;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: string;
    user: mongoose.Types.ObjectId;
    items: {
        product?: mongoose.Types.ObjectId | undefined;
        quantity?: number | undefined;
    }[];
    totalPrice: number;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: string;
    user: mongoose.Types.ObjectId;
    items: {
        product?: mongoose.Types.ObjectId | undefined;
        quantity?: number | undefined;
    }[];
    totalPrice: number;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: string;
    user: mongoose.Types.ObjectId;
    items: {
        product?: mongoose.Types.ObjectId | undefined;
        quantity?: number | undefined;
    }[];
    totalPrice: number;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: string;
    user: mongoose.Types.ObjectId;
    items: {
        product?: mongoose.Types.ObjectId | undefined;
        quantity?: number | undefined;
    }[];
    totalPrice: number;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=order.d.ts.map
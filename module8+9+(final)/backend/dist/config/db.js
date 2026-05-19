import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error("❌ DB connection failed", error);
        // Do not immediately exit in dev; surface error and exit to match previous behavior
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map
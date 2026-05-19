import mongoose from "mongoose";
import fs from "fs/promises";
import dotenv from "dotenv";
import { Product } from "./models/product.js";
dotenv.config();
const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const files = await fs.readdir("./data");
        const allProducts = await Promise.all(files.map(async (file) => {
            const data = await fs.readFile(`./data/${file}`, "utf-8");
            return JSON.parse(data);
        }));
        const products = allProducts
            .flat()
            .map(({ _id, id, ...rest }) => rest);
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log(" Database seeded successfully");
        process.exit();
    }
    catch (error) {
        console.error(" Seed failed:", error);
        process.exit(1);
    }
};
seed();
//# sourceMappingURL=seed.js.map
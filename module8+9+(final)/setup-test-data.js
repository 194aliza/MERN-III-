// Quick test data setup
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number,
  images: [String],
  ratings: [],
  timestamps: true
});

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);

async function setupTestData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Add admin user
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (!adminExists) {
      const admin = await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "Admin@123", // This will be hashed by the pre-save hook
        role: "admin"
      });
      console.log("Admin user created:", admin.email);
    }

    // Update product stock
    const updateResult = await Product.updateMany({}, { $set: { stock: 50 } });
    console.log("Updated products:", updateResult.modifiedCount);

    await mongoose.disconnect();
    console.log("Done!");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

setupTestData();

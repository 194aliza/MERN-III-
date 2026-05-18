import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  // Cloudinary types differ between versions; cast params to any for compatibility
  params: ({
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg"],
  } as any),
});

export const upload = multer({ storage });
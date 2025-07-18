import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary credentials in environment variables");
}
console.log("Cloudinary ENV check:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) throw new Error("File path is required");

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      timeout: 120000
    });
    fs.unlinkSync(filepath);
    return uploadResult.secure_url;
  } catch (error) {
    fs.unlinkSync(filepath);
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
};

export default uploadOnCloudinary;

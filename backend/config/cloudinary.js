/*
  config/cloudinary.js - Image Upload to Cloudinary
  =================================================================================
  PURPOSE:
  - Upload images (profile, cover, posts) to Cloudinary CDN
  - Supports both file paths (disk storage) and buffers (memory storage)
  
  EXPORTED FUNCTION:
  - uploadOnCloudinary(filePathOrBuffer): Uploads file and returns secure URL
  
  FEATURES:
  - Handles buffers from memory storage using streamifier
  - Handles file paths by uploading and then deleting local file
  - Returns Cloudinary secure_url for storing in database
  
  IMPORTANT:
  - Configure credentials from process.env (CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET)
  - Called from post, user profile controllers when images are uploaded
  - Throws error if upload fails; caller should handle gracefully
  - Always returns null if no file is provided
=================================================================================
*/
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import streamifier from 'streamifier'

const uploadOnCloudinary = async (filePathOrBuffer) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    try {
        if (!filePathOrBuffer) {
            return null
        }

        // Handle buffer from memory storage
        if (Buffer.isBuffer(filePathOrBuffer)) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({}, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
                streamifier.createReadStream(filePathOrBuffer).pipe(stream);
            });
            return uploadResult.secure_url;
        }

        // Handle file path from disk storage
        const uploadResult = await cloudinary.uploader.upload(filePathOrBuffer)
        fs.unlinkSync(filePathOrBuffer)
        return uploadResult.secure_url

    } catch (error) {
        console.log("Cloudinary upload error:", error);
        throw error;
    }
}

export default uploadOnCloudinary
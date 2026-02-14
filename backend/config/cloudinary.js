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
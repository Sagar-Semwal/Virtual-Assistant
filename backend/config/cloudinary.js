
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath);

        // Delete the local file after successful upload
        fs.unlinkSync(filePath);

        return uploadResult.secure_url;

    } catch (error) {
        console.log("Cloudinary upload error:", error);

        // Delete the local file if upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Pass the error back to the controller
        throw error;
    }
};

export default uploadOnCloudinary;


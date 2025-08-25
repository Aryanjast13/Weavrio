import { v2 as cloudinary } from "cloudinary";
import express from "express";
import multer from "multer";
import streamifier from "streamifier";

import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
//Cloudinary Confimation 
cloudinary.config({
    cloud_name: process.env.CLOUDNIARY_CLOUD_NAME,
    api_key: process.env.CLOUDNIARY_API_KEY,
    api_secret: process.env.CLOUDNIARY_API_SECRET,
});

//Multer setup using memory stoarge
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file Uploaded" });
        }
        //function to handle the stream upload to cloudinary 
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({folder:"weavrio"},(error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                })
                //User stremifier to convert file buffer to a stream
                streamifier.createReadStream(fileBuffer).pipe(stream);
            
            });1
        }
         //Call the streamUpload function
            const result = await streamUpload(req.file.buffer);

            //Respond with uploaded image url
            res.json({ imageUrl: result.secure_url });
    } catch (error) {
        console.log("Error ")
    }
})

export default router;
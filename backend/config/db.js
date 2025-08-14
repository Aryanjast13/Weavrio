import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
    } catch(err) {
        console.error("MongoDb connection failed,",err)
    }
}

export default connectDB;
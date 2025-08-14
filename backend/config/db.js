import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

// Remove this - dotenv.config() is already called in server.js
// dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000, // 45 seconds
            bufferMaxEntries: 0, // Disable mongoose buffering
            maxPoolSize: 10, // Maintain up to 10 socket connections
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from MongoDB');
        });

    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;

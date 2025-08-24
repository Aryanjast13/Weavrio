import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.model.js"
import User from "./models/User.model.js"
import products from "./data/products.js"

dotenv.config();

//connect to mongodb
mongoose.connect(process.env.MONGO_URI);

//Function  to seed data

const seedData = async () => {
    try {
        // Clear
        await Product.deleteMany();

        //Create a default admin User
        const createdUser = await User.create({
            name: "Admin",
            email: "admin@xample.com",
            password: "1234555",
            role:"admin",
        })

        //assign  the default userId to each product
        const userID = createdUser._id;
        

        const sampleProducts = products.map((product) => {
            return { ...product, user:userID };
        })

        //Insert the products into databases
        await Product.insertMany(sampleProducts);
        console.log("Product data seeded successfully!");
        
        process.exit();
    } catch (error) {
        console.log("Error seeding the data:", error);
        process.exit(1);
    }
}


seedData();
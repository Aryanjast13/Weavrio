import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { urlencoded } from "express";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/admin.routes.js";
import orderAdminRoutes from "./routes/adminOrder.route.js";
import cartRoutes from "./routes/cart.routes.js";
import checkoutRoutes from "./routes/checkout.route.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import productAdminRoutes from "./routes/productAdmin.routes.js";
import subscribeRoutes from "./routes/subscriber.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymnetRoutes from "./routes/payment.routes.js"
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));
app.use(cookieParser());
app.use(urlencoded({extended:true}));

const PORT = 8000;








// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB(); // Wait for DB connection
        
        // Routes setup after successful DB connection
        app.get("/", (req, res) => {
            res.send("Welcome to Weavrio");
        });

 

        app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes)
app.use("/api", subscribeRoutes);
app.use("/api/payment", paymnetRoutes);
//Admin
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes)
app.use("/api/admin/orders",orderAdminRoutes)



        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
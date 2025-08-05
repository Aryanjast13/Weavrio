import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express ,{urlencoded} from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js"
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(urlencoded());

const PORT = 8000;

//Connect to MongoDb
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to Weavrio");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log(`server is running on https://localhost:${PORT}`);
});



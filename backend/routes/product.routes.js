import express from "express";
import { admin, protectRoute } from "../middleware/auth.middleware";
import Product from "../models/Product.model";


const router = express.Router();

router.post("/create", protectRoute, admin, async (req, res) => {
    try {
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku, } = req.body;
        
        const product = new Product({
            name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku, user: req.user._id,
        });
        
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.log("Error in create product controller", error.message);
        res.status(500).json({ message: error.message });
    }
});


router.put("/:id", protectRoute, admin, async (req, res) => {
    try {
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku, } = req.body;
        
        //Find a product by ID
        const product = await Product.findById(req.params.id);
        if (product) {
            //Update product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;
            //Save the updated Product
            const updatedProduct = await product.save()
            res.json(updatedProduct);
            
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in update product controller", error.message);
        res.status(500).json({ message: error.message });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        //Find  the product  by ID
        const product = await Product.findById(req.params.id);
   
        if (product) {
            //Remove the product fro dB
            await product.deleteOne();
            res.json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
        
    } catch (error) {
        console.log("Error in delete product controller", error.message);
        res.status(500).json({ message: error.message });
    }
});







export default router;
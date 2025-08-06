import express from "express";
import { admin, protectRoute } from "../middleware/auth.middleware";
import Product from "../models/Product.model";


const router = express.Router();

//@route POST /api/products/
//@desc Create a new Product
//@access Private/Admin
router.post("/", protectRoute, admin, async (req, res) => {
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

//@route PUT /api/proudcts/:id
//@desc Update a exiting Product by ID
//@access Private/Admin
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

//@route DELETE /api/products/:id
//desc Delete a product by ID
//@access Private/Admin 
router.delete("/:id",protectRoute,admin, async (req, res) => {
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


//@route GET /api/products
//@desc Get all products with optional query filters
//@access Public
router.get("/", async (req, res) => {
    try {
        const { collection,category, size, color, gender, minPrice, maxPrice, sortBy, search, material, brand, limit } = req.query;
        let query = {}
        
        //filter logic
        if (collection && collection.toLocaleLowerCase() !== "all") {
            query.collections = collection;
        }
     
        if (category && category.toLocaleLowerCase() !== "all") {
            query.category = category;
        }
        if (material) {
        query.material = { $in: material.split(",") };
        }
        if (brand) {
            query.brand = { $in: brand.split(",") };
        }
        if (size) {
            query.sizes = { $in: size.split(",") };
        }
        if (color) {
            query.colors = { $in: color.split(",") };
        }
        if (gender) {
            query.gender = gender;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        //search logic
        if (search) {
            query.$or = [
                {
                    name: { $regex: search, $options: "i" },
                },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        //sort logic
        let sort ={}
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 };
                    break;
                case "priceDesc":
                    sort = { price: -1 };
                    break;
                case "popularity": 
                    sort = { rating: -1 };
                    break;
                default:
                    break;
           }
       }

        
        
        //Fetch products and applying sorting and limit 
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products);
    } catch (error) {
        console.log("Error in filter product controller", error.message);
        res.status(500).json({ message: error.message });
    }
})

//@route GET /api/products/new-arrivals
//@desc Retrieve latest 8 products - Creation date
//@access Public
router.get("/new-arrivals", async (req, res) => {
    try {
        //Fetch latest 8 products 
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.log("Error in new arrivals product controllers", error.message);
        res.status(500).json({ message: error.message });
    }
})

//@route GET /api/products/best-seller
//desc Retrieve the product with highest rating 
//@access Public 
router.get("/best-seller", async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 });
        if (bestSeller) {
            res.json(bestSeller);
        } else {
            res.status(404).json({ message: "No best seller found" });
        }
    } catch (error) {
        console.log("Error in best seller product controller", error.message);
        res.status(500).json({ message: error.message });
    }
})

//@route GET /api/products/:id
//desc GEt a single product by ID
//@access Public
router.get("/:id", async (req, res) => {
    try {
        //find product by id
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in get single product controller", error.message);
        res.status(500).json({ message: error.message })
    }
});




//@route GET /api/products/similar/:id
//@desc Retrieve similar products based on the current product's gender and category
//@acces Public
router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const similarProducts = await Product.find({
            _id: { $ne: id },//Exclude the current product ID
            gender: product.gender,
            category: product.category,
        }).limit(4);

        res.json(similarProducts);
        
    } catch (error) {
        console.log("Error in get similar product controller", error.message);
        res.status(500).json({ message: error.message });
    }
})






export default router;
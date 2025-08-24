import express from "express";
import { admin, protectRoute } from "../middleware/auth.middleware.js";
import Product from "../models/Product.model.js";


const router = express.Router();

//@route POST /api/products/
//@desc Create a new Product
//@access Private/Admin
router.post("/", protectRoute, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price, 
      discountPrice, 
      category,
      brand,
      size,
      color,
      countInStock,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      metaTitle,
     metaDescription
      
    } = req.body;

  
    if (!Array.isArray(size) || size.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one size is required" });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }


    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      size, color,
      countInStock,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      metaTitle,
     metaDescription,
      user: req.user._id,
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
    const {
      name,
      description,
      price, 
      discountPrice, 
      countInStock,
      category,
      brand,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,

    } = req.body;

      
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }


    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.collections = collections || product.collections;
    product.material = material || product.material;
    product.gender = gender || product.gender;
    product.images = images || product.images;
    product.isFeatured =
      isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isPublished =
      isPublished !== undefined ? isPublished : product.isPublished;
    product.tags = tags || product.tags;
    product.dimensions = dimensions || product.dimensions;
    product.weight = weight || product.weight;

   
    if (variants) {
      if (!Array.isArray(variants) || variants.length === 0) {
        return res
          .status(400)
          .json({ message: "Variants must be a non-empty array" });
      }

      for (const newVariant of variants) {
        if (newVariant._id) {
        
          const existingVariant = product.variants.id(newVariant._id);  
          if (existingVariant) {
            existingVariant.size = newVariant.size || existingVariant.size;
            existingVariant.color = newVariant.color || existingVariant.color;
            existingVariant.countInStock = newVariant.countInStock !== undefined ? newVariant.countInStock : existingVariant.countInStock;
            existingVariant.sku = newVariant.sku || existingVariant.sku;
            existingVariant.price = newVariant.price !== undefined ? newVariant.price : existingVariant.price;
            existingVariant.discountPrice = newVariant.discountPrice !== undefined ? newVariant.discountPrice : existingVariant.discountPrice;
            existingVariant.images = newVariant.images || existingVariant.images;
          } else {
           
            product.variants.push(newVariant);
          }
        } else {
      
          product.variants.push(newVariant);
        }
      }

   
      if (product.variants.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one variant is required after update" });
      }
        product.markModified("variants");
    }

    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
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
            //Remove the product from dB
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
        if (gender) {
            query.gender = gender;
        }

        if (size) {
          query.sizes = { $in: size.split(",") };
        }
        if (color) {
          query.colors = color;
        }
        if (gender) {
          query.gender = gender;
        }
        if (minPrice || maxPrice) {
          query.price = {};
          if (minPrice) query.price.$gte = Number(minPrice);
          if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        


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
        console.log(products);
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
    const newArrivals = await Product.find({
      isPublished: true, 
    })
      .sort({ createdAt: -1 }) 
      .limit(8);

    res.json(newArrivals);
  } catch (error) {
    console.log("Error in new arrivals product controller", error.message);
    res.status(500).json({ message: error.message });
  }
});

//@route GET /api/products/best-seller
//desc Retrieve the product with highest rating 
//@access Public 
router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne({
      isPublished: true,  
    }).sort({ rating: -1 }); 

    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "No best seller found" });
    }
  } catch (error) {
    console.log("Error in best seller product controller", error.message);
    res.status(500).json({ message: error.message });
  }
});


//@route GET /api/products/:id
//desc GEt a single product by ID
//@access Public
router.get("/:id", async (req, res) => {
  try {
    
    const product = await Product.findOne({
      _id: req.params.id,
      isPublished: true,  
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in get single product controller", error.message);
    res.status(500).json({ message: error.message });
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
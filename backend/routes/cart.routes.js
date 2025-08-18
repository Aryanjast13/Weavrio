import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

const router = express.Router();




//@route POST /api/cart
//desc Add a product to the cart for a  logged in user
//@access Private
router.post("/", protectRoute, async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  const userId = req.user._id;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

  
    const variant = product.variants.find(
      (v) => v.size === size && v.color === color
    );
    if (!variant)
      return res
        .status(400)
        .json({ message: "Selected size and color variant not found" });

    // Check stock availability
    if (variant.countInStock < quantity)
      return res
        .status(400)
        .json({ message: "Insufficient stock for this variant" });

    
    const productPrice = variant.price || product.price;

    
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      
      const productIndex = cart.products.findIndex((item) =>
        item.variantId.equals(variant._id)
      );

      if (productIndex > -1) {
      
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add new item
        cart.products.push({
          productId,
          variantId: variant._id,
          quantity,
          price: productPrice,
        });
      }

      

      await cart.save(); // This triggers the pre-save hook to recalculate totalPrice
      return res.status(200).json(cart);
    } else {
      // Create a new cart
      const newCart = new Cart({
        user: userId || undefined, // Optional for guests
        products: [
          {
            productId,
            variantId: variant._id,
            quantity,
            price: productPrice,
          },
        ],
        totalPrice: productPrice * quantity, 
      });

     

      await newCart.save();
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.log("Error in create cart controller", error.message);
    res.status(500).json({ message: error.message });
  }
});


//@route PUT /api/cart
//@desc Update product quantity in the cart for a  logged-in user
//@access Private
router.put("/", protectRoute, async (req, res) => {
  const { productId, quantity, size, color } = req.body; // Note: userId removed; use req.user from protectRoute
  const userId = req.user._id; // Assume protectRoute sets req.user for authenticated users

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Fetch the product to get variant details
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Find the matching variant by size and color
    const variant = product.variants.find(
      (v) => v.size === size && v.color === color
    );
    if (!variant)
      return res
        .status(400)
        .json({ message: "Selected size and color variant not found" });

    
    const itemIndex = cart.products.findIndex(
      (p) => p.productId.equals(productId) && p.variantId.equals(variant._id)
    );

    if (itemIndex > -1) {
      
      
      if (quantity <= 0) {
        cart.products.splice(itemIndex, 1);
      } else {
        
        if (quantity > 0 && variant.countInStock < quantity) {
          return res
            .status(400)
            .json({ message: "Insufficient stock for this variant" });
        }
       
        cart.products[itemIndex].quantity = quantity;
      }

    
     

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res
        .status(404)
        .json({ message: "Product variant not found in cart" });
    }
  } catch (error) {
    console.log("Error in cart update controller", error.message);
    res.status(500).json({ message: error.message });
  }
});



//@route DELETE /api/cart
//@desc Remove a product from the cart
//@access Private

router.delete("/", protectRoute, async (req, res) => {
  const { productId, size, color } = req.body;
  const userId = req.user._id; 

  try {
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

  
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    
    const variant = product.variants.find(
      (v) => v.size === size && v.color === color
    );
    if (!variant)
      return res
        .status(400)
        .json({ message: "Selected size and color variant not found" });

  
    const itemIndex = cart.products.findIndex(
      (p) => p.productId.equals(productId) && p.variantId.equals(variant._id)
    );

    if (itemIndex > -1) {
      const removedQuantity = cart.products[itemIndex].quantity; 

  
      cart.products.splice(itemIndex, 1);

      
      

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res
        .status(404)
        .json({ message: "Product variant not found in cart" });
    }
  } catch (error) {
    console.log("Error in cart delete controller", error.message); 
    res.status(500).json({ message: error.message });
  }
});



//@route GET /api/cart
//@desc Get logged-in user's cart
//@access Private

router.get("/", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id; 

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.productId",
      select: "name images price", 
    });

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.log("Error in get cart controller", error.message);
    res.status(500).json({ message: error.message });
  }
});



export default router;
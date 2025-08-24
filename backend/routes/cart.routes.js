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
    
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      
       const productIndex = cart.products.findIndex(
         (p) =>
           p.productId.toString() === productId &&
           p.size === size &&
           p.color === color
       );
       console.log(productIndex);

      if (productIndex > -1) {
      
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add new item
        cart.products.push({
          productId,
          size,color,
          quantity,
          price:product.price,
        });
      }

      

        const populateCart = await cart.save();
        const FinalCart = await populateCart.populate({
          path: "products.productId",
          select: "images",
        });
        return res.status(200).json(FinalCart);
    } else {
      // Create a new cart
      const newCart = new Cart({
        user: userId ,
        products: [
          {
            productId,
            size,
            color,
            quantity,
            price: product.price,
          },
        ],
        totalPrice: product.price * quantity, 
      });

     

       const populateCart = await newCart.save();
       const FinalCart = await populateCart.populate({
         path: "products.productId",
         select: "images",
       });
       return res.status(200).json(FinalCart);
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
  const { productId, quantity, size, color } = req.body; 
  const userId = req.user._id; 

  try {
   
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

  
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId &&
         p.size === size &&
         p.color === color
    );

    if (productIndex > -1) {
      if (quantity <= 0) {
        cart.products.splice(productIndex, 1);
      } else {
        cart.products[productIndex].quantity = quantity;
      }

      const populateCart = await cart.save();
      const FinalCart = await populateCart.populate({
        path: "products.productId",
        select: "images",
      });
      return res.status(200).json(FinalCart);
    } else {
      return res
        .status(404)
        .json({ message: "Product  not found in cart" });
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

     const productIndex = cart.products.findIndex(
       (p) =>
         p.productId.toString() === productId &&
         p.size === size &&
         p.color === color
     );

    

    if (productIndex > -1) {
      const removedQuantity = cart.products[productIndex].quantity;

      cart.products.splice(productIndex, 1);

      const populateCart = await cart.save();
      const FinalCart = await populateCart.populate({
        path: "products.productId",
        select: "images",
      });
      return res.status(200).json(FinalCart);
    } else {
      return res``
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
      path:"products.productId",
      select: "price", 
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
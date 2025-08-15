import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

const router = express.Router();




//@route POST /api/cart
//desc Add a product to the cart for a  logged in user
//@access Private
router.post("/", protectRoute,  async (req, res) => {
    const { productId, quantity, size, color, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        //Determine if the user is logged in or guest
        let cart =  await Cart.findOne({
            user:userId
        })

        //If the cart exists , update it
        if (cart) {
            const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);
            console.log(productIndex);
            if (productIndex > -1) {
                //If the product already exists ,update the quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                //add a new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }
            
            //Recalculate the total price 
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            
            await cart.save();
            return res.status(200).json(cart);
        } else {
            //create a  new cart for the guest  or user
            const newCart = await Cart.create({
                user : userId ? userId : undefined,
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[[0]].url,
                    price:product.price,
                    size,
                    color,
                    quantity,
                }],
                totalPrice: product.price * quantity,
            });
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
router.put("/",protectRoute, async (req, res) => {
    const { productId, quantity, size, color, userId } = req.body;
    
    try {
        let cart =  await Cart.findOne({
            user:userId
        })
        if (!cart) return res.status(404).json({ message: "cart not found" });
        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);

        if (productIndex > -1) {
            //update quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1);//Remove product if quantity is 0
            }
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" })
        }
    } catch (error) {
        console.log("Error in cart update controller", error.message);
        res.status(500).json({ message: error.message });
    }
});


//@route DELETE /api/cart
//@desc Remove a product from the cart
//@access Private

router.delete("/",protectRoute, async (req, res) => {
    const { productId, size, color,  userId } = req.body;
    try {
         let cart = await  await Cart.findOne({
            user:userId
        })
        if (!cart) return res.status(404).json({ message: "cart not found" });
        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
         }

    } catch (error) {
        console.log("Error in cart update controller", error.message);
        res.status(500).json({ message: error.message });
    }
})


//@route GET /api/cart
//@desc Get logged-in user's or guest user's cart
//@access Private

router.get("/",protectRoute, async (req, res) => {
    const { userId } = req.query;
    try {
        const cart =  await Cart.findOne({
            user:userId
        })
        
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.log("Error in get cart Controller", error.message);
        res.status(500).json({ message: error.message });
    }
} )



export default router;
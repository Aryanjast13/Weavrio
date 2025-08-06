import express from "express";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

const router = express.Router();


//Helper function to get a cart by user Id or guest ID
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({
            user:userId
        })
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
}


//@route POST /api/cart
//desc Add a product to the cart for a guest or logged in user
//@access Public
router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        //Determine if the user is logged in or guest
        let cart = await getCart(userId, guestId);

        //If the cart exists , update it
        if (cart) {
            const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);
            if (productIndex > -1) {
                //If the product already exists ,update the quantity
                cart.product[productIndex].qantity += quantity;
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
                userId: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [{
                    productId,
                    name: product.images[[0]].url,
                    image: product.price,
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
//@desc Update product quantity in the cart for a guest or logged-in user
//@access Public 
router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    
    try {
        let cart = await getCart(userId, guestId);
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
            return res.status(404).json({message:"Product not found in cart"})
       }
    } catch (error) {
        console.log("Error in cart update controller", error.message);
        res.status(500).json({ message: error.message });
    }
})

export default router;
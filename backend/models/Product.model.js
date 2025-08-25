import mongoose from "mongoose";



const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    size: {
      type: [String],
      required: true,
      validate: {
        validator: arr => Array.isArray(arr) && arr.length > 0,  
        message: "At least one size is required"
      }
    },
    color:String,
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    collections: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
    },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String },
      },
    ],
    countInStock: {
      type: Number,
      default:0,
      required:true
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


function arrayLimit(val) {
  return val.length > 0;
}


3

const Product = mongoose.model("Product", productSchema);

export default Product;

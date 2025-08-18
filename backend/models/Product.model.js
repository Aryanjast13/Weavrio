import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true, 
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0, 
  },
  sku: {
    type: String,
    unique: true, 
    required: true,
  },
  price: {
    type: Number,
  },
  discountPrice: {
    type: Number,
  },
  images: [
    {
      url: { type: String, required: true },
      altText: { type: String },
    },
  ],
  
});

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
    variants: {
      type: [variantSchema],
      required: true,
      validate: [arrayLimit, "At least one variant is required"],
    },
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
    tags: [String],
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
    metaKeywords: {
      type: String,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    weight: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);


function arrayLimit(val) {
  return val.length > 0;
}


productSchema.virtual("availableSizes").get(function () {
  if (!this.variants || !Array.isArray(this.variants)) return [];
  return [...new Set(this.variants.map((v) => v.size))];
});

productSchema.virtual("availableColors").get(function () {
  if (!this.variants || !Array.isArray(this.variants)) return [];
  return [...new Set(this.variants.map((v) => v.color))];
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

export default Product;

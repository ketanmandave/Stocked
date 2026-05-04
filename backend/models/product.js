import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: [String], // ✅ array of strings
      required: true,
      validate: [(arr) => arr.length > 0, "Description cannot be empty"],
    },

    price: {
      type: Number,
      required: true,
      min: 0, // ✅ prevents negative price
    },

    offerPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value == null || value <= this.price;
        },
        message: "Offer price cannot exceed price",
      },
    },

    image: {
      type: [String], // ✅ array of image URLs
      required: true,
      validate: [(arr) => arr.length > 0, "At least one image required"],
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;

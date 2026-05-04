import Product from "../models/product.js";
import { upload } from "../configs/multer.js";
import { v2 as cloudinary } from 'cloudinary';

// Add Products: /api/product/add
export const addProducts = async (req, res) => {
  try {
    const { name, description, category, price, offerPrice } = req.body;

    // basic validation
    if (!name || !price || !offerPrice || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // upload images
    const images = req.files || [];

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // create product
    await Product.create({
      name,
      description: Array.isArray(description)
        ? description
        : [description],
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image: imagesUrl,
    });

    res.status(201).json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get product: /api/product/list
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product: /api/product/:id
export const productById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change Product In Stock: /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(id, { inStock }, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product stock status updated", product });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete product: /api/product/delete
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 🔥 Delete images from Cloudinary
    await Promise.all(
      product.image.map(async (url) => {
        const publicId = url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      })
    );

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
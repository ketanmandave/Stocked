import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {

  // 🔹 Get global data from context (like backend response cache)
  const { products, navigate, currency, addToCart, cartItems } = useAppContext();

  // 🔹 Get product id from URL
  const { id } = useParams();

  // 🔹 State for thumbnail preview image
  const [thumbnail, setThumbnail] = useState(null);

  // 🔹 Find the product matching this id (like querying DB by _id)
  const product = useMemo(() => {
    return products.find(item => item._id === id);
  }, [products, id]);

  // 🔹 Set first image as default thumbnail when product loads
  useEffect(() => {
    if (product?.image?.length > 0) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  // 🔹 Get related products (same category, not current product)
  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(item =>
        item.category === product.category && item._id !== product._id
      )
      .slice(0, 4); // limit to 4 products
  }, [products, product]);

  // 🔹 If product not found
  if (!product) {
    return (
      <div className="mt-20 text-center text-gray-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="mt-16 px-4 md:px-12 lg:px-20">

      {/* 🔹 Breadcrumb Navigation */}
      <p className="text-sm text-gray-500 mb-6">
        <Link to="/">Home</Link> /
        <Link to="/products"> Products</Link> /
        <Link to={`/products/${product.category.toLowerCase()}`}>
          {" "} {product.category}
        </Link> /
        <span className="text-gray-800"> {product.name}</span>
      </p>

      {/* 🔹 Main Section */}
      <div className="flex flex-col lg:flex-row gap-12">

        {/* ===== Left: image ===== */}
        <div className="flex gap-4">

          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {product.image?.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className="w-20 h-20 border rounded cursor-pointer overflow-hidden hover:border-primary transition"
              >
                <img
                  src={image}
                  alt="thumb"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="w-80 h-96 border rounded overflow-hidden">
            <img
              src={thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ===== Right: Details ===== */}
        <div className="flex-1">

          <h1 className="text-3xl font-semibold text-gray-800">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {Array(5).fill("").map((_, i) => (
              <img
                key={i}
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="star"
                className="w-4 h-4"
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">
              ({product.rating})
            </span>
          </div>

          {/* Pricing */}
          <div className="mt-6">
            <p className="text-gray-400 line-through">
              MRP: {currency}{product.price}
            </p>
            <p className="text-2xl font-bold text-primary">
              {currency}{product.offerPrice}
            </p>
            <p className="text-xs text-gray-500">
              Inclusive of all taxes
            </p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <p className="font-medium mb-2">About this product</p>
            <ul className="list-disc ml-5 text-gray-600 text-sm space-y-1">
              {product.description?.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => addToCart(product._id)}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                if (!cartItems[product._id]) {
                  addToCart(product._id);
                }
                navigate("/cart");
              }}
              className="flex-1 py-3 bg-primary text-white hover:opacity-90 rounded transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ===== Related Products ===== */}
      <div className="mt-20">
        <div className="mb-6">
          <p className="text-xl font-semibold">Related Products</p>
          <div className="w-16 h-1 bg-primary rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts
            .filter(item => item.inStock)
            .map(item => (
              <ProductCard key={item._id} product={item} />
            ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => {
              navigate("/products");
              window.scrollTo(0, 0);
            }}
            className="px-6 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
          >
            See More
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;

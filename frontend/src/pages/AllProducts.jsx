import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

const AllProducts = () => {

  // 📦 Get products + search text from global context
  const { products, searchQuery, axios } = useAppContext();

  // 🧠 This state stores products that match search
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {

    // 1️⃣ Start with only in-stock products
    let updatedProducts = products.filter(product => product.inStock);

    // 2️⃣ If user typed something → filter by name
    if (searchQuery.trim() !== "") {
      updatedProducts = updatedProducts.filter(product =>
        product.name
          .toLowerCase()                 // make product name lowercase
          .includes(searchQuery.toLowerCase()) // match search text
      );
    }

    // 3️⃣ Save final filtered list
    setFilteredProducts(updatedProducts);

  }, [products, searchQuery]); // re-run when products or search changes

  return (
    <div className="mt-16 flex flex-col">

      {/* 🔹 Title Section */}
      <div>
        <p className="text-2xl font-semibold">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {/* 🔹 Product List */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* If nothing matches → show message */}
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 col-span-full">
            No products found.
          </p>
        ) : (
          // Render filtered products
          filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))
        )}

      </div>
    </div>
  );
};

export default AllProducts;

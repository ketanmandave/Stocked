import React from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { categories } from "../assets/assets";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

const ProductCategory = () => {
    const { products } = useAppContext(); // get all products from global context

    const params = useParams();       // get all URL params
    const category = params.category; // extract category only

    const lowerCategory = category ? category.toLowerCase() : "";

    // Get category info for heading
    const searchCategory = categories.find(
        item => item.path.toLowerCase() === lowerCategory
    );
    // Get only matching products
    const filteredProducts = products.filter(
        product => product.category?.toLowerCase() === lowerCategory
    );

    return (
        <div className="mt-16 px-4 md:px-10 lg:px-20">

            {/* ✅ Category Heading */}
            {searchCategory && (
                <div className="flex flex-col items-start mb-8">
                    <p className="text-2xl md:text-3xl font-semibold text-gray-800">
                        {searchCategory.text.toUpperCase()}
                    </p>
                    <div className="bg-primary rounded-full w-16 h-1 mt-2"></div>
                </div>
            )}

            {/* ✅ Products Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id} // unique key for React diffing
                            product={product} // pass product to card
                        />
                    ))}
                </div>
            ) : (
                // ❌ Empty state UI
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-gray-500 text-lg font-medium">
                        No products found in this category
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Try exploring other categories
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductCategory;

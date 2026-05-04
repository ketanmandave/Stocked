import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const BestSeller = () => {
  const { products } = useAppContext();

  const bestProducts = products
    .filter((product) => product.inStock)
    .slice(0, 8);

  return (
    <section className="mt-16 px-4 md:px-8 lg:px-12">
      {/* 🔥 Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Best Sellers
          </h2>
          <p className="text-sm text-gray-400">
            Most loved fresh picks
          </p>
        </div>
      </div>

      {/* 🧱 Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
      >
        {bestProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </motion.div>
    </section>
  );
};

export default BestSeller;

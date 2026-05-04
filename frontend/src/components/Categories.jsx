import React from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext.jsx";
import { motion } from "framer-motion";

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <section className="mt-16 px-4 md:px-8 lg:px-12">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Shop by Category
        </h2>

        <p className="text-sm text-gray-500 hidden md:block">
          Fresh picks for you
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -6, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0);
            }}
            className="group cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center text-center
                       shadow-sm hover:shadow-xl transition-all duration-300"
            style={{ backgroundColor: category.bgColor }}
          >
            {/* Image */}
            <div className="w-16 h-16 md:w-20 md:h-20 mb-3 flex items-center justify-center">
              <img
                src={category.image}
                alt={category.text}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Text */}
            <p className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-[#22A45D] transition-colors">
              {category.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;

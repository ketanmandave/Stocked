import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const {
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    navigate,
  } = useAppContext();

  const quantity = cartItems[product._id] || 0;

  return (
    <section className="mb-6" onClick={() => navigate(`/products/${product.category.toLowerCase()}/${product._id}`)}  >
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group relative bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 p-3 md:p-4 w-full min-w-[160px] max-w-[220px]"
    >
      {/* 🖼 IMAGE */}
      <div className="relative flex items-center justify-center bg-[#F6FBF8] rounded-xl overflow-hidden h-[120px] md:h-[140px]">
        <img
          src={product.image[0]}
          alt={product.name}
          className="max-h-[90%] object-contain group-hover:scale-110 transition duration-500"
        />

        {/* optional badge */}
        <span className="absolute top-2 left-2 text-[10px] bg-[#22A45D] text-white px-2 py-0.5 rounded-full">
          Fresh
        </span>
      </div>

      {/* 📄 CONTENT */}
      <div className="mt-3">
        <p className="text-xs text-gray-400 mb-0.5">
          {product.category}
        </p>

        <h3 className="text-sm md:text-[15px] font-semibold text-gray-800 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* ⭐ RATING */}
        <div className="flex items-center gap-0.5 mt-1">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                className="w-3.5"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="star"
              />
            ))}
          <span className="text-xs text-gray-400 ml-1">(4)</span>
        </div>

        {/* 💰 PRICE + CART */}
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-[#22A45D] font-bold text-base md:text-lg leading-none">
              {currency}{product.offerPrice}
            </p>
            <p className="text-gray-400 text-xs line-through">
              {currency}{product.price}
            </p>
          </div>

          {/* 🛒 CART ACTION */}
          {!quantity ? (
            <button
              onClick={() => addToCart(product._id)}
              className="flex items-center justify-center gap-1 bg-[#22A45D]/10 hover:bg-[#22A45D] border border-[#22A45D]/30 hover:border-[#22A45D] text-[#22A45D] hover:text-white px-3 h-[34px] rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95"
            >
              <img
                src={assets.cart_icon}
                alt="cart"
                className="w-3.5"
              />
              Add
            </button>
          ) : (
            <div className="flex items-center justify-between w-[90px] h-[34px] bg-[#22A45D]/10 rounded-lg border border-[#22A45D]/30 select-none">
              <button
                onClick={() => removeFromCart(product._id)}
                className="w-7 h-full flex items-center justify-center text-[#22A45D] font-bold hover:bg-[#22A45D]/20 transition"
              >
                −
              </button>

              <span className="text-sm font-semibold text-gray-800">
                {quantity}
              </span>

              <button
                onClick={() =>
                  updateCartItem(product._id, quantity + 1)
                }
                className="w-7 h-full flex items-center justify-center text-[#22A45D] font-bold hover:bg-[#22A45D]/20 transition"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  </section>
  );
};

export default ProductCard;

import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const BottomBanner = () => {
    return (
        <section className="mt-20 px-4 md:px-8 lg:px-12">
            <div className="relative overflow-hidden rounded-3xl">

                {/* 🖼 Desktop Image */}
                <img
                    src={assets.bottom_banner_image}
                    alt="Bottom Banner"
                    className="w-full hidden md:block object-cover"
                />

                {/* 🖼 Mobile Image */}
                <img
                    src={assets.bottom_banner_image_sm}
                    alt="Bottom Banner Mobile"
                    className="w-full md:hidden object-cover"
                />

                {/* 🌑 Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

                {/* ✨ Content */}
                {/* ✨ Content — hidden on mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="hidden md:flex absolute inset-0 flex-col justify-center px-6 md:px-14 lg:px-20 max-w-xl"
                >
                    <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight">
                        Fresh groceries delivered to your doorstep
                    </h2>

                    <p className="text-white/80 mt-3 text-sm md:text-base">
                        Farm-fresh vegetables, fruits, and daily essentials at the best prices.
                    </p>

                    <Link
                        to="/products"
                        className="mt-6 inline-flex items-center gap-2 bg-[#22A45D] hover:bg-[#1c8a4f] text-white px-6 py-3 rounded-xl font-semibold w-fit transition-all duration-200 active:scale-95 shadow-lg"
                    >
                        Shop Now
                        <img src={assets.white_arrow_icon} alt="arrow" className="w-4" />
                    </Link>
                </motion.div>

            </div>
        </section>
    );
};

export default BottomBanner;

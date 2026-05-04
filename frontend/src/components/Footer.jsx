import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-24 bg-[#0F172A] text-gray-300">

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14 py-14 
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* 🌿 Brand */}
        <div>
          <img src={assets.darkweblogo} alt="GroceryMart logo" className="w-32 mb-4" />
          <p className="text-sm text-gray-400 leading-relaxed">
            Fresh groceries delivered fast. Quality you trust, prices you love.
          </p>

          <div className="flex items-center gap-4 mt-6">
            <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#1877F2] hover:text-white transition">
              <FaFacebookF size={16} />
            </a>
            <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#1DA1F2] hover:text-white transition">
              <FaTwitter size={16} />
            </a>
            <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500 hover:text-white transition">
              <FaInstagram size={16} />
            </a>
          </div>
        </div>

        {/* 🔗 Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/" className="hover:text-[#22A45D]">Home</NavLink></li>
            <li><NavLink to="/products" className="hover:text-[#22A45D]">All Products</NavLink></li>
            <li><NavLink to="/about" className="hover:text-[#22A45D]">About Us</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-[#22A45D]">Contact</NavLink></li>
          </ul>
        </div>

        {/* 🛒 Categories */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-[#22A45D] cursor-pointer">Vegetables</li>
            <li className="hover:text-[#22A45D] cursor-pointer">Fruits</li>
            <li className="hover:text-[#22A45D] cursor-pointer">Dairy</li>
            <li className="hover:text-[#22A45D] cursor-pointer">Bakery</li>
          </ul>
        </div>

        {/* 📞 Contact */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📍 Mumbai, India</li>
            <li>📞 +91 98765 43210</li>
            <li>✉️ support@grocerymart.com</li>
            <li className="text-xs mt-3">Mon - Sun: 8:00 AM - 10:00 PM</li>
          </ul>
        </div>

        {/* 📜 Legal */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/privacy-policy" className="hover:text-[#22A45D]">Privacy Policy</NavLink></li>
            <li><NavLink to="/terms" className="hover:text-[#22A45D]">Terms & Conditions</NavLink></li>
            <li><NavLink to="/refund-policy" className="hover:text-[#22A45D]">Refund Policy</NavLink></li>
          </ul>
        </div>

      </div>

      {/* 🔻 Bottom bar */}
      <div className="border-t border-white/10 py-5 text-center text-sm text-gray-400 px-4">
        © {new Date().getFullYear()} GroceryMart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

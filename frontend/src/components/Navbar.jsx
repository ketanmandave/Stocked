import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("Detecting...");

  const {
    user,
    setUser,
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
    axios,
  } = useAppContext();

  /* =========================
     Logout
  ========================== */
  const logout = async() => {
    try {
      const { data } = await axios.post("/api/user/logout");
      if (data.success) {
        setUser(null);
        navigate("/");
        toast.success("Logged out successfully");
      } else {
        toast.error(data.message || "Failed to logout");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to logout");
    }
  };

  /* =========================
     Redirect on Search
  ========================== */
  useEffect(() => {
    if (searchQuery?.trim().length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  /* =========================
     Detect Location
  ========================== */
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Location unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.state ||
            "Your location";

          setLocation(city);
        } catch {
          setLocation("Your location");
        }
      },
      () => setLocation("Enable location")
    );
  }, []);

  /* =========================
     Cart Icon Component
  ========================== */
  const CartIcon = () => (
    <div
      onClick={() => navigate("/cart")}
      className="relative cursor-pointer group"
    >
      <img
        src={assets.nav_cart_icon}
        alt="cart"
        className="w-6 opacity-80 group-hover:opacity-100 transition"
      />
      {cartCount() > 0 && (
        <span className="absolute -top-2 -right-3 text-[10px] font-semibold text-white bg-primary w-5 h-5 rounded-full flex items-center justify-center">
          {cartCount()}
        </span>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-md">

      {/* =========================
         Main Navbar Row
      ========================== */}
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4">

        {/* Logo */}
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img
            src={assets.weblogo}
            alt="logo"
            className="w-28 md:w-32 object-contain"
          />
        </NavLink>

        {/* Desktop Location */}
        <div className="hidden md:flex flex-col text-xs ml-4">
          <span className="text-gray-500">Deliver to</span>
          <span className="font-semibold truncate max-w-[140px]">
            <img src={assets.location} alt="location" className="w-4 h-4 mr-1 inline" />{location}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8">

          <NavLink to="/" className="font-medium hover:text-primary transition">
            Home
          </NavLink>

          <NavLink to="/products" className="font-medium hover:text-primary transition">
            All Products
          </NavLink>

          <NavLink to="/contact" className="font-medium hover:text-primary transition">
            Contact
          </NavLink>

          {/* Search */}
          <div className="hidden lg:flex items-center gap-2 border px-3 py-1.5 rounded-full">
            <input
              type="text"
              placeholder="Search products"
              className="bg-transparent outline-none text-sm w-40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-70" />
          </div>

          {/* Cart */}
          <CartIcon />

          {/* Auth */}
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img
                src={assets.profile_icon}
                alt="profile"
                className="w-9 cursor-pointer"
              />
              <ul className="absolute right-0 top-11 w-40 bg-white border shadow-md rounded-lg text-sm opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
                <li
                  onClick={() => navigate("/my-orders")}
                  className="p-2 hover:bg-gray-100 cursor-pointer rounded-t-lg"
                >
                  My Orders
                </li>
                <li
                  onClick={logout}
                  className="p-2 hover:bg-gray-100 cursor-pointer rounded-b-lg"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Right Section */}
        <div className="flex items-center gap-5 sm:hidden">
          <CartIcon />
          <button onClick={() => setOpen(!open)}>
            <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* =========================
         Mobile Menu
      ========================== */}
      <div
        className={`sm:hidden bg-white border-t shadow-md transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col px-6 py-4 gap-4 text-sm">

          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/products" onClick={() => setOpen(false)}>
            All Products
          </NavLink>

          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>

          {user && (
            <NavLink to="/my-orders" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}

          {/* Mobile Location */}
          <div className="text-xs text-gray-500 pt-2">
            📍 {location}
          </div>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/login");
              }}
              className="mt-2 px-5 py-2 bg-primary text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="mt-2 px-5 py-2 bg-primary text-white rounded-full"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

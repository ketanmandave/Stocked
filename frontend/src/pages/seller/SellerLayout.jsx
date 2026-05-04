import React from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { Link, NavLink, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { navigate, setIsSeller, axios } = useAppContext();

  const sidebarLinks = [
    { name: "Add Products", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    { name: "Deliveries", path: "/seller/upcoming-deliveries", icon: assets.order_icon },
    { name: "Analytics", path: "/seller/analytics", icon: assets.order_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.post("/api/seller/logout");
      if (data.success === true) {
        toast.success(data.message || "Logged out successfully");
        setIsSeller(false);
      }
    } catch (error) {
      console.log(error);
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 md:px-8 h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={assets.weblogo}
              alt="Logo"
              className="h-8 object-contain"
            />
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <p className="hidden sm:block text-sm text-gray-600">
              Hi, <span className="font-semibold text-gray-800">Admin</span>
            </p>

            <button
              onClick={logout}
              className="px-4 py-1.5 text-sm font-medium rounded-full 
              border border-gray-300 hover:bg-red-50 hover:border-red-300 
              hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN SECTION ================= */}
      <div className="flex flex-1">

        {/* ================= SIDEBAR ================= */}
        <aside className="w-16 md:w-64 bg-white border-r border-gray-200 sticky top-16 h-[calc(100vh-4rem)]">
          <nav className="flex flex-col gap-1 p-2">

            {sidebarLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/seller"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:bg-primary/10 hover:text-primary"
                  }`
                }
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-5 h-5 shrink-0"
                />

                <span className="hidden md:block font-medium">
                  {item.name}
                </span>
              </NavLink>
            ))}

          </nav>
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SellerLayout;

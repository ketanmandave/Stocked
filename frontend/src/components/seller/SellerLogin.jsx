import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLogin = () => {
  // 🔐 Seller auth state from global context
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();

  // 📧 Stores seller email input
  const [email, setEmail] = useState("");

  // 🔑 Stores seller password input
  const [password, setPassword] = useState("");

  // ⏳ Controls login button loading state
  const [loading, setLoading] = useState(false);


  /* ===============================
     Handle Login Submit
  ================================ */
  const onSubmitHandler = async (e) => {
    try{
      e.preventDefault();
      setLoading(true);

      const {data} = await axios.post("/api/seller/login", { email, password });

      if(data.success){
        setIsSeller(true);
        navigate("/seller");
      }else{
        toast.error(data.message || "Login failed");
      }
    }catch(err){
      console.error("Login error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  /* ===============================
     Redirect if already seller
  ================================ */
  useEffect(() => {
    if (isSeller) {
      navigate("/seller/dashboard");
    }
  }, [isSeller, navigate]);

  if (isSeller) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/5 via-white to-primary/10">
      {/* ===== Card ===== */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">
            <span className="text-primary">Seller</span> Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Access your seller dashboard
          </p>
        </div>

        {/* ===== Form ===== */}
        <form onSubmit={onSubmitHandler} className="space-y-5">
          
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
              focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition"
              placeholder="seller@gmail.com"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
              focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium
            hover:scale-[1.02] active:scale-95 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login to Dashboard"}
          </button>
        </form>

        {/* Footer hint */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Demo credentials: seller@gmail.com / password123
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;

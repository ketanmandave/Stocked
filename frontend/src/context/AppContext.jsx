import { createContext, use, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets.js";
import toast from "react-hot-toast";
import axios from "axios";

// to send cookies in every request (for auth)
axios.defaults.withCredentials = true;
// base url foe any backend request (can be set in .env file)
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// 🧠 Create global context
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // 🌍 Global values
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();

  // 👤 Auth state
  const [user, setUser] = useState(false);
  const [isSeller, setIsSeller] = useState(false);


  // 📦 Product state
  const [products, setProducts] = useState([]);

  // 🛒 Cart state (object for O(1) lookup)
  const [cartItems, setCartItems] = useState({});

  // searchQuery, filters, etc can also be added here for global access
  const [searchQuery, setSearchQuery] = useState("");

  // 📂 Category state (GLOBAL — sellers can extend this)
  const [categoryList, setCategoryList] = useState([]);

  // fetch seller status like is-auth
  const checkSellerStatus = async () => {
    try {
      const {data} = await axios.get("/api/seller/is-auth");
      if(data.success === true){
        setIsSeller(true);
      }else{
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

  // fetch user status like is-auth and get cart-data along with it
  const checkUserStatus = async () => {
    try {
      const {data} = await axios.get("/api/user/is-auth");
      if(data.success === true){
        setUser(data.user);

        // set cart items
        setCartItems(data.user.cartItems || {});
      }
    } catch (error) {
      setUser(null);
    }
  };

  // --------------------------------------------------
  // 📥 Fetch products (currently dummy)
  // --------------------------------------------------
  const fetchProducts = async () => {
    try {
      const {data} = await axios.get("/api/product/list");
      console.log(data)
      if(data.success === true){
        setProducts(data.products);
      }else{
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  // --------------------------------------------------
  // ➕ Add to Cart
  // --------------------------------------------------
  const addToCart = (itemId) => {
    // ✅ NEVER mutate state directly
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      // product already exists → increase quantity
      cartData[itemId] += 1;
    } else {
      // new product → start with 1
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  // --------------------------------------------------
  // 🔼 Update quantity directly
  // --------------------------------------------------
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);

    // safety guard
    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }

    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  // --------------------------------------------------
  // ➖ Remove ONE quantity
  // --------------------------------------------------
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      // remove completely if 0
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    setCartItems(cartData);
    toast.success("Removed from Cart");
  };

  // Get Cart Item Count 
  const cartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  }

  // 🧮 Calculate total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;

    // 🔁 loop through each itemId in cart
    for (const itemId in cartItems) {
      const quantity = cartItems[itemId];

      if (quantity <= 0) continue;

      const productInfo = products.find(
        (product) => product._id === itemId
      )
      if (!productInfo) continue;
      totalAmount += productInfo.offerPrice * quantity;
    }

    return Math.floor(totalAmount * 100) / 100;
  };


  // --------------------------------------------------
  // 🚀 Initial load
  // --------------------------------------------------
  useEffect(() => {
    checkSellerStatus();
    fetchProducts();
    checkUserStatus();
  }, []);

  useEffect(() => {
    // update database cart items
    const updateCart = async () => {
      try {
        const {data} = await axios.post("/api/cart/update", {cartItems: cartItems, userId: user._id});
        if(data.success !== true){
          toast.error(data.message || "Failed to update cart");
        }
      } catch (error) {
        toast.error("Failed to update cart");
      }
    }
    if(user){
      updateCart();
    }

  }, [cartItems]);

  // --------------------------------------------------
  // 🌍 What components can access
  // --------------------------------------------------
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    products,
    currency,
    cartItems,
    addToCart,
    updateCartItem,
    setCartItems,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    cartCount,
    getCartAmount,
    axios,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ✅ custom hook (clean access)
export const useAppContext = () => useContext(AppContext);

import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";
import toast from "react-hot-toast";

const Cart = () => {

  const {
    cartItems,
    products,
    currency,
    cartCount,
    getCartAmount,
    removeFromCart,
    updateCartItem,
    setCartItems,
    navigate,
    axios,
    user,
  } = useAppContext();

  // Stores cart products in array form for easy rendering
  const [cartArray, setCartArray] = useState([]);

  // Stores all saved addresses
  const [addresses, setAddresses] = useState([]);


  // Controls address dropdown visibility
  const [showAddress, setShowAddress] = useState(false);

  // Stores currently selected delivery address
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Stores selected payment method
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Stores selected delivery date
  const [deliveryDate, setDeliveryDate] = useState("");

  /* ==============================
     Delivery Date Constraints
     min = today + 2 days
     max = today + 7 days
  ================================ */
  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();

    const min = new Date(today);
    min.setDate(min.getDate() + 2);

    const max = new Date(today);
    max.setDate(max.getDate() + 7);

    // Format as YYYY-MM-DD for input[type="date"]
    const format = (d) => d.toISOString().split("T")[0];

    return { minDate: format(min), maxDate: format(max) };
  }, []);

  /* ==============================
     Check if delivery is "tomorrow" relative to today
     (for the bonus badge — shows when selected date is day after tomorrow from today, i.e. 2 days out)
  ================================ */
  const isEarliestDelivery = deliveryDate === minDate;

  /* ==============================
     Convert cart object → array
  ================================ */
  const getCartProducts = () => {
    const cartProducts = Object.keys(cartItems).map((itemId) => {
      const productInfo = products.find((p) => p._id === itemId);
      if (!productInfo) return null;

      return {
        ...productInfo,
        quantity: cartItems[itemId],
      };
    }).filter(Boolean);

    setCartArray(cartProducts);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");

      if (data.success) {
        setAddresses(data.addresses); // 🔥 YOU MISSED THIS

        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error("Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
      toast.error("Failed to fetch addresses");
    }
  };




  useEffect(() => {
    if (products.length > 0) {
      getCartProducts();
    }
  }, [products, cartItems]);

  useEffect(() => {
    getUserAddress();
  }, []);


  /* ===============================
     Place Order
  ================================ */
  const placeOrder = async () => {
    try {
      // ❌ No address selected
      if (!selectedAddress) {
        toast.error("Please select a delivery address");
        return;
      }

      // ❌ No delivery date selected
      if (!deliveryDate) {
        toast.error("Please select a delivery date");
        return;
      }

      // ❌ No items in cart
      if (cartArray.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      // Only COD for now
      if (paymentMethod === "COD") {

        const payload = {
          items: cartArray.map((item) => ({
            product: item._id,   // ✅ correct key
            quantity: item.quantity
          })),
          address: selectedAddress._id, // ✅ only send id
          deliveryDate,
        };

        const { data } = await axios.post("/api/order/cod", payload);

        if (data.success) {
          toast.success(data.message || "Order placed successfully");

          // 🧹 Clear cart
          setCartItems({});

          // 🚀 Redirect
          navigate("/my-orders");

        } else {
          toast.error(data.message || "Failed to place order");
        }
      }

      if (paymentMethod === "Online") {

        const payload = {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity
          })),
          address: selectedAddress._id,
          deliveryDate,
        };

        const { data } = await axios.post("/api/order/razorpay", payload);

        if (!data.success) {
          toast.error("Failed to initiate payment");
          return;
        }

        const { order, dbOrderId } = data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // frontend key
          amount: order.amount,
          currency: order.currency,
          name: "Stocked",
          description: "Order Payment",
          order_id: order.id,

          handler: async function (response) {

            const verifyRes = await axios.post("/api/order/verify", {
              ...response,
              dbOrderId
            });

            if (verifyRes.data.success) {
              toast.success("Payment successful");

              setCartItems({});
              navigate("/my-orders");
            } else {
              toast.error("Payment verification failed");
            }
          },

          prefill: {
            name: user?.name,
            email: user?.email,
          },

          theme: {
            color: "#6366f1"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }


    } catch (error) {
      console.error("Order error:", error);

      toast.error(
        error.response?.data?.message || "Failed to place order"
      );
    }
  };


  if (!products.length) return null;

  return (
    <div className="mt-14 px-4 md:px-10 lg:px-20 flex flex-col lg:flex-row gap-10">

      {/* ================= LEFT SIDE ================= */}
      <div className="flex-1">

        <h1 className="text-2xl md:text-3xl font-semibold mb-6">
          Shopping Cart{" "}
          <span className="text-primary text-base">
            ({cartCount()} items)
          </span>
        </h1>

        {/* Header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-sm font-medium pb-3 border-b">
          <p>Product</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mt-4">
          {cartArray.map((product) => (
            <div
              key={product._id}
              className="grid md:grid-cols-[2fr_1fr_1fr] gap-4 items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              {/* Product Info */}
              <div className="flex gap-4">

                <div
                  onClick={() => {
                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                    scrollTo(0, 0);
                  }}
                  className="w-20 h-20 border rounded-xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.image?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between">
                  <p className="font-semibold text-gray-800">
                    {product.name}
                  </p>

                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>Qty:</span>

                    {/* Quantity selector */}
                    <select
                      value={product.quantity}
                      onChange={(e) =>
                        updateCartItem(product._id, Number(e.target.value))
                      }
                      className="border rounded px-2 py-1 outline-primary"
                    >
                      {Array(10)
                        .fill("")
                        .map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Subtotal */}
              <p className="text-center font-medium">
                {currency}
                {(product.offerPrice * product.quantity).toFixed(2)}
              </p>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(product._id)}
                className="mx-auto hover:scale-110 transition"
              >
                <img
                  src={assets.remove_icon}
                  alt="remove"
                  className="w-5 h-5"
                />
              </button>
            </div>
          ))}
        </div>

        {/* Continue shopping */}
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="mt-8 flex items-center gap-2 text-primary font-medium hover:gap-3 transition"
        >
          <img
            src={assets.arrow_right_icon_colored}
            className="rotate-180"
          />
          Continue Shopping
        </button>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="w-full lg:max-w-sm">

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">

          <h2 className="text-xl font-semibold">Order Summary</h2>

          {/* Address */}
          <div className="mt-6">
            <p className="text-sm font-medium uppercase text-gray-500">
              Delivery Address
            </p>

            <div className="relative mt-2">
              <p className="text-sm text-gray-600">
                {selectedAddress
                  ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.zipcode}, ${selectedAddress.country}`
                  : "No address"}
              </p>

              <button
                onClick={() => setShowAddress((prev) => !prev)}
                className="text-primary text-sm mt-1"
              >
                Change
              </button>

              {showAddress && (
                <div className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-lg text-sm">
                  {addresses.map((addr, i) => (
                    <p
                      key={i}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddress(false);
                      }}
                      className="p-2 hover:bg-gray-50 cursor-pointer"
                    >
                      {addr.street}, {addr.city},{addr.state},{addr.zipcode},{addr.country}
                    </p>
                  ))}

                  <p
                    onClick={() => navigate("/add-address")}
                    className="p-2 text-primary text-center cursor-pointer hover:bg-primary/5"
                  >
                    + Add address
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ======= Delivery Date Picker ======= */}
          <div className="mt-6">
            <p className="text-sm font-medium uppercase text-gray-500">
              Delivery Date
            </p>

            <div className="relative mt-2">
              <input
                id="delivery-date-picker"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-primary
                  focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer
                  bg-white"
              />

              {/* Hint text */}
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Select delivery date (2–7 days from today)
              </p>

              {/* Earliest Delivery Badge */}
              {isEarliestDelivery && deliveryDate && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Earliest Available Delivery
                </div>
              )}

              {/* Selected date preview */}
              {deliveryDate && (
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  📦 Expected Delivery:{" "}
                  <span className="text-primary">
                    {new Date(deliveryDate + "T00:00:00").toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="mt-6">
            <p className="text-sm font-medium uppercase text-gray-500">
              Payment Method
            </p>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-2 outline-primary"
            >
              <option value="COD">Cash On Delivery</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-2 text-sm">
            <p className="flex justify-between">
              <span>Price</span>
              <span>{currency}{getCartAmount()}</span>
            </p>

            <p className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </p>

            <p className="flex justify-between">
              <span>Tax (2%)</span>
              <span>{currency}{(getCartAmount() * 0.02).toFixed(2)}</span>
            </p>

            <hr className="my-2" />

            <p className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>
                {currency}
                {(getCartAmount() * 1.02).toFixed(2)}
              </span>
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={placeOrder}
            disabled={!deliveryDate || cartArray.length === 0}
            className={`w-full mt-6 py-3 rounded-xl font-medium transition
              ${!deliveryDate || cartArray.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:scale-[1.02] active:scale-95"
              }`}
          >
            {!deliveryDate
              ? "Select Delivery Date to Continue"
              : paymentMethod === "COD"
                ? "Place Order"
                : "Proceed to Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

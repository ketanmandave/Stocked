import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  // 📦 Stores user's orders list
  const [myOrders, setMyOrders] = useState([]);

  // 👤 Global user + currency from context
  const { user, currency, axios } = useAppContext();

  /* ===============================
     Fetch Orders (Mock for now)
  ================================ */
  const fetchMyOrders = async () => {
    try {
      const {data} = await axios.get("api/order/user")
      if(data.success){
        setMyOrders(data.orders)
      }
    } catch (error) {
      console.log(error)
    }
  };

  /* ===============================
     Load orders when user available
  ================================ */
  useEffect(() => {
    
      fetchMyOrders();
    
  }, []);

  /* ===============================
     Empty State
  ================================ */
  if (!myOrders.length) {
    return (
      <div className="mt-20 text-center text-gray-500">
        <p className="text-xl font-medium">No orders yet</p>
        <p className="text-sm mt-1">
          Your placed orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16 pb-20 px-4 md:px-10 lg:px-16">
      {/* ===== Header ===== */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold uppercase">
          My <span className="text-primary">Orders</span>
        </h1>
        <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
      </div>

      {/* ===== Orders List ===== */}
      <div className="space-y-6">
        {myOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 md:p-6"
          >
            {/* ===== Order Header ===== */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b pb-4 mb-4">
              <p className="text-sm text-gray-500">
                Order ID:
                <span className="font-medium text-gray-800 ml-1">
                  {order._id}
                </span>
              </p>

              <p className="text-sm text-gray-500">
                Payment:
                <span className="ml-1 font-medium text-primary">
                  {order.paymentType}
                </span>
              </p>

              <p className="text-sm font-semibold text-gray-800">
                Total: {currency}
                {order.amount}
              </p>
            </div>

            {/* ===== Delivery Date Info ===== */}
            {order.deliveryDate && (
              <div className="flex flex-wrap items-center gap-3 mb-4 px-1">
                <div className="flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-xl text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Expected Delivery:{" "}
                  {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                {/* Delivery Tomorrow Badge */}
                {(() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  const deliveryDay = new Date(order.deliveryDate).toDateString();
                  const tomorrowDay = tomorrow.toDateString();
                  return deliveryDay === tomorrowDay ? (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-200 animate-pulse">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Delivery Tomorrow
                    </span>
                  ) : null;
                })()}
              </div>
            )}

            {/* ===== Items ===== */}
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row md:items-center gap-4 bg-gray-50 rounded-xl p-4 hover:shadow-sm transition"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={item.product.image?.[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">
                      {item.product.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Category: {item.product.category}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      <p>Qty: {item.quantity || 1}</p>
                      <p>Status: {item.status}</p>
                      <p>
                        Date:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right font-semibold text-gray-800">
                    {currency}
                    {item.product.offerPrice *
                      (item.quantity || 1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;

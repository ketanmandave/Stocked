import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const {data} = await axios.get("/api/order/seller");

      if(data.success){
        setOrders(data.orders);
      }else{
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error(data.message || "Failed to fetch orders");  
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div className="flex-1 p-4 md:p-8">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Orders
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track customer orders
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-5">

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-400">
            No orders available
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="grid md:grid-cols-4 gap-6">

                {/* Products */}
                <div className="flex gap-4">
                  <img
                    className="w-12 h-12 object-cover opacity-70"
                    src={assets.box_icon}
                    alt="boxIcon"
                  />

                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <p key={i} className="font-medium text-gray-800">
                        {item.product.name}
                        <span className="text-primary ml-2">
                          × {item.quantity}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-800">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>
                    {order.address.street}, {order.address.city}
                  </p>
                  <p>
                    {order.address.state}, {order.address.zipcode}
                  </p>
                  <p>{order.address.country}</p>
                  <p className="pt-1">{order.address.phone}</p>
                </div>

                {/* Amount */}
                <div className="flex items-center md:justify-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {currency}
                    {order.amount}
                  </span>
                </div>

                {/* Meta Info */}
                <div className="text-sm space-y-2">

                  <p>
                    <span className="font-medium">Method:</span>{" "}
                    {order.paymentType}
                  </p>

                  <p>
                    <span className="font-medium">Ordered:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  {order.deliveryDate && (
                    <p>
                      <span className="font-medium">Delivery:</span>{" "}
                      <span className="text-primary font-medium">
                        {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {/* Tomorrow badge */}
                      {(() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        return new Date(order.deliveryDate).toDateString() === tomorrow.toDateString() ? (
                          <span className="ml-2 inline-flex items-center bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                            Tomorrow
                          </span>
                        ) : null;
                      })()}
                    </p>
                  )}

                  <div>
                    <span className="font-medium">Payment:</span>{" "}
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium
                      ${
                        order.isPaid
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>

                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;

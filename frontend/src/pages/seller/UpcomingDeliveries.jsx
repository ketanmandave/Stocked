import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const UpcomingDeliveries = () => {
  const { currency, axios } = useAppContext();
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcoming = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/upcoming");

      if (data.success) {
        setUpcoming(data.upcoming);
      } else {
        toast.error(data.message || "Failed to fetch upcoming deliveries");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch upcoming deliveries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
  }, []);

  /* ==============================
     Check if a date is tomorrow
  ================================ */
  const isTomorrow = (dateStr) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(dateStr).toDateString() === tomorrow.toDateString();
  };

  const isToday = (dateStr) => {
    return new Date(dateStr).toDateString() === new Date().toDateString();
  };

  /* ==============================
     Get relative label for a date
  ================================ */
  const getDateLabel = (dateStr) => {
    if (isToday(dateStr)) return "Today";
    if (isTomorrow(dateStr)) return "Tomorrow";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /* ==============================
     Total orders count
  ================================ */
  const totalOrders = upcoming.reduce((acc, day) => acc + day.orderCount, 0);
  const totalAmount = upcoming.reduce((acc, day) => acc + day.totalAmount, 0);

  return (
    <div className="flex-1 p-4 md:p-8">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Upcoming Deliveries
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Scheduled deliveries grouped by delivery date
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Upcoming Orders</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{totalOrders}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Delivery Days</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{upcoming.length}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-primary mt-1">
            {currency}{totalAmount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 text-gray-400">
          <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <p>Loading deliveries...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && upcoming.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">No upcoming deliveries</p>
          <p className="text-gray-400 text-sm mt-1">New orders with scheduled delivery dates will appear here</p>
        </div>
      )}

      {/* Delivery Groups */}
      {!loading && upcoming.length > 0 && (
        <div className="space-y-6">
          {upcoming.map((group, index) => (
            <div
              key={index}
              className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition hover:shadow-md
                ${isTomorrow(group.deliveryDate)
                  ? "border-amber-300 ring-2 ring-amber-100"
                  : isToday(group.deliveryDate)
                    ? "border-red-300 ring-2 ring-red-100"
                    : "border-gray-200"
                }`}
            >
              {/* Date Header */}
              <div className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
                ${isTomorrow(group.deliveryDate)
                  ? "bg-amber-50"
                  : isToday(group.deliveryDate)
                    ? "bg-red-50"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold
                    ${isTomorrow(group.deliveryDate)
                      ? "bg-amber-500"
                      : isToday(group.deliveryDate)
                        ? "bg-red-500"
                        : "bg-primary"
                    }`}
                  >
                    {new Date(group.deliveryDate).getDate()}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {getDateLabel(group.deliveryDate)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(group.deliveryDate).toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {isTomorrow(group.deliveryDate) && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Tomorrow
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{group.orderCount}</p>
                    <p className="text-xs text-gray-500">
                      {group.orderCount === 1 ? "Order" : "Orders"}
                    </p>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{currency}{group.totalAmount.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              </div>

              {/* Order List */}
              <div className="divide-y divide-gray-100">
                {group.orders.map((order, idx) => (
                  <div key={idx} className="px-6 py-3 flex items-center justify-between text-sm hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.paymentType} • {order.status}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {currency}{order.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingDeliveries;

import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const PIE_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#f43f5e", "#3b82f6"];
const BAR_COLOR = "#6366f1";
const LINE_COLOR = "#10b981";

const PERIODS = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "All Time", value: "all" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// Summary Card
const StatCard = ({ title, value, subtitle, icon, gradient }) => (
  <div
    className={`rounded-2xl p-6 text-white shadow-lg flex flex-col gap-2 ${gradient}`}
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium opacity-80">{title}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-3xl font-bold tracking-tight">{value}</p>
    {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
  </div>
);

// Section wrapper
const Section = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="mb-5">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// Empty state
const Empty = ({ message = "No data available for this period." }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <span className="text-4xl mb-3">📭</span>
    <p className="text-sm">{message}</p>
  </div>
);

// Loading skeleton
const Skeleton = ({ h = "h-64" }) => (
  <div className={`${h} bg-gray-100 rounded-xl animate-pulse`} />
);

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label, currency = "₹" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}:{" "}
          {typeof p.value === "number" && p.name.toLowerCase().includes("revenue")
            ? `${currency}${p.value.toLocaleString("en-IN")}`
            : p.value}
        </p>
      ))}
    </div>
  );
};

// Product table row
const ProductRow = ({ rank, item, currency, badge }) => (
  <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
    <span
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
        ${badge === "top" ? "bg-indigo-100 text-indigo-600" : "bg-orange-100 text-orange-600"}`}
    >
      {rank}
    </span>
    {item.image ? (
      <img
        src={item.image}
        alt={item.name}
        className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
      />
    ) : (
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">
        📦
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
      <p className="text-xs text-gray-400">{item.category || "—"}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-sm font-semibold text-gray-800">
        {item.totalQty} units
      </p>
      {item.offerPrice && (
        <p className="text-xs text-gray-400">
          {currency}
          {item.offerPrice}
        </p>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────
const SellerAnalytics = () => {
  const { axios, currency } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("all");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await axios.get(
        `/api/order/analytics?period=${period}`
      );
      if (res.success) {
        setData(res);
      } else {
        setError(res.message || "Failed to load analytics.");
      }
    } catch (err) {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const fmt = (n) =>
    `${currency}${(n ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            📊 Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time business insights from your store data
          </p>
        </div>

        {/* Period filter */}
        <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                ${
                  period === p.value
                    ? "bg-indigo-500 text-white shadow"
                    : "text-gray-500 hover:text-indigo-500"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error state ─────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-sm mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* ── Summary Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loading ? (
          <>
            <Skeleton h="h-32" />
            <Skeleton h="h-32" />
            <Skeleton h="h-32" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={fmt(data?.summary?.totalRevenue)}
              subtitle="Confirmed orders only"
              icon="💰"
              gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
            />
            <StatCard
              title="Total Orders"
              value={(data?.summary?.totalOrders ?? 0).toLocaleString("en-IN")}
              subtitle="COD + paid online"
              icon="📦"
              gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
            />
            <StatCard
              title="Avg Order Value"
              value={fmt(data?.summary?.avgOrderValue)}
              subtitle="Per confirmed order"
              icon="📈"
              gradient="bg-gradient-to-br from-amber-500 to-amber-600"
            />
          </>
        )}
      </div>

      {/* ── Charts Row 1 ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Monthly Revenue Line Chart */}
        <Section
          title="Monthly Revenue Trend"
          subtitle="Total revenue per calendar month"
        >
          {loading ? (
            <Skeleton />
          ) : !data?.monthlyRevenue?.length ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip currency={currency} />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke={LINE_COLOR}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: LINE_COLOR }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Section>

        {/* Category Revenue Bar Chart */}
        <Section
          title="Revenue by Category"
          subtitle="Which categories earn the most"
        >
          {loading ? (
            <Skeleton />
          ) : !data?.categoryRevenue?.length ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={data.categoryRevenue}
                layout="vertical"
                margin={{ left: 10, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={80}
                  tick={{ fontSize: 12, fill: "#374151" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip currency={currency} />} />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill={BAR_COLOR}
                  radius={[0, 8, 8, 0]}
                  barSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Section>
      </div>

      {/* ── Charts Row 2 ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Payment Distribution Pie */}
        <Section
          title="Payment Methods"
          subtitle="Order distribution by payment type"
        >
          {loading ? (
            <Skeleton />
          ) : !data?.paymentDistribution?.length ? (
            <Empty />
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.paymentDistribution}
                    dataKey="count"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {data.paymentDistribution.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value + " orders", name]}
                  />
                  <Legend
                    formatter={(value) => (
                      <span className="text-sm text-gray-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 w-full mt-2">
                {data.paymentDistribution.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="text-gray-600">{p.method}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-800">
                        {p.count} orders
                      </span>
                      <span className="text-gray-400 ml-2 text-xs">
                        {fmt(p.revenue)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Orders by City */}
        <Section
          title="Orders by City"
          subtitle="Top 10 cities by order volume"
          className="lg:col-span-2"
        >
          {loading ? (
            <Skeleton />
          ) : !data?.cityOrders?.length ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.cityOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="city"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip currency={currency} />} />
                <Bar
                  dataKey="orderCount"
                  name="Orders"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Section>
      </div>

      {/* ── Product Tables ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top 5 Products */}
        <Section
          title="🏆 Top Selling Products"
          subtitle="Highest quantity sold"
        >
          {loading ? (
            <Skeleton h="h-72" />
          ) : !data?.topProducts?.length ? (
            <Empty />
          ) : (
            <div>
              {data.topProducts.map((item, i) => (
                <ProductRow
                  key={item.productId}
                  rank={i + 1}
                  item={item}
                  currency={currency}
                  badge="top"
                />
              ))}
            </div>
          )}
        </Section>

        {/* Least 5 Products */}
        <Section
          title="⚠️ Least Selling Products"
          subtitle="Consider promotions or restocking decisions"
        >
          {loading ? (
            <Skeleton h="h-72" />
          ) : !data?.leastProducts?.length ? (
            <Empty />
          ) : (
            <div>
              {data.leastProducts.map((item, i) => (
                <ProductRow
                  key={item.productId}
                  rank={i + 1}
                  item={item}
                  currency={currency}
                  badge="least"
                />
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* ── Footer note ─────────────────────────────────────────────────── */}
      <p className="text-center text-xs text-gray-300 mt-8">
        Data refreshes on each page load · Showing {
          PERIODS.find((p) => p.value === period)?.label
        }
      </p>
    </div>
  );
};

export default SellerAnalytics;

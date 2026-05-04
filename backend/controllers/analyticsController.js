import Order from "../models/order.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build date filter for the ?period query param
// ─────────────────────────────────────────────────────────────────────────────
const buildDateFilter = (period) => {
  if (!period || period === "all") return {};
  const days = period === "7d" ? 7 : period === "30d" ? 30 : null;
  if (!days) return {};
  const since = new Date();
  since.setDate(since.getDate() - days);
  return { createdAt: { $gte: since } };
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared base match: only confirmed orders (COD or paid online)
// ─────────────────────────────────────────────────────────────────────────────
const BASE_MATCH = {
  $or: [{ paymentType: "COD" }, { isPaid: true }],
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/order/analytics
// ─────────────────────────────────────────────────────────────────────────────
export const getSellerAnalytics = async (req, res) => {
  try {
    const { period } = req.query; // "7d" | "30d" | "all"
    const dateFilter = buildDateFilter(period);
    const matchStage = { $match: { ...BASE_MATCH, ...dateFilter } };

    // ── Run all pipelines in parallel ────────────────────────────────────────
    const [
      summaryResult,
      monthlyRevenue,
      categoryRevenue,
      topProducts,
      leastProducts,
      cityOrders,
      paymentDist,
    ] = await Promise.all([

      // 1. Summary stats ──────────────────────────────────────────────────────
      Order.aggregate([
        matchStage,
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: "$amount" },
          },
        },
      ]),

      // 2. Monthly revenue trend ──────────────────────────────────────────────
      Order.aggregate([
        matchStage,
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
          $project: {
            _id: 0,
            month: {
              $let: {
                vars: {
                  months: [
                    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                  ],
                },
                in: { $arrayElemAt: ["$$months", "$_id.month"] },
              },
            },
            year: "$_id.year",
            revenue: { $round: ["$revenue", 2] },
          },
        },
      ]),

      // 3. Category-wise revenue ──────────────────────────────────────────────
      Order.aggregate([
        matchStage,
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            let: { productId: "$items.product" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", { $toObjectId: "$$productId" }],
                  },
                },
              },
              { $project: { category: 1, offerPrice: 1, price: 1 } },
            ],
            as: "productData",
          },
        },
        { $unwind: "$productData" },
        {
          $group: {
            _id: "$productData.category",
            revenue: {
              $sum: {
                $multiply: ["$productData.offerPrice", "$items.quantity"],
              },
            },
            unitsSold: { $sum: "$items.quantity" },
          },
        },
        { $sort: { revenue: -1 } },
        {
          $project: {
            _id: 0,
            category: "$_id",
            revenue: { $round: ["$revenue", 2] },
            unitsSold: 1,
          },
        },
      ]),

      // 4. Top 5 selling products ─────────────────────────────────────────────
      Order.aggregate([
        matchStage,
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            totalQty: { $sum: "$items.quantity" },
            totalRevenue: { $sum: { $multiply: ["$items.quantity", 1] } },
          },
        },
        { $sort: { totalQty: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            let: { productId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", { $toObjectId: "$$productId" }] },
                },
              },
              { $project: { name: 1, category: 1, offerPrice: 1, image: 1 } },
            ],
            as: "productData",
          },
        },
        { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            name: { $ifNull: ["$productData.name", "Unknown Product"] },
            category: "$productData.category",
            offerPrice: "$productData.offerPrice",
            image: { $arrayElemAt: ["$productData.image", 0] },
            totalQty: 1,
          },
        },
      ]),

      // 5. Least 5 selling products ───────────────────────────────────────────
      Order.aggregate([
        matchStage,
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            totalQty: { $sum: "$items.quantity" },
          },
        },
        { $sort: { totalQty: 1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            let: { productId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", { $toObjectId: "$$productId" }] },
                },
              },
              { $project: { name: 1, category: 1, offerPrice: 1, image: 1 } },
            ],
            as: "productData",
          },
        },
        { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            name: { $ifNull: ["$productData.name", "Unknown Product"] },
            category: "$productData.category",
            offerPrice: "$productData.offerPrice",
            image: { $arrayElemAt: ["$productData.image", 0] },
            totalQty: 1,
          },
        },
      ]),

      // 6. Orders by city ─────────────────────────────────────────────────────
      Order.aggregate([
        matchStage,
        {
          $lookup: {
            from: "addresses",
            let: { addressId: "$address" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", { $toObjectId: "$$addressId" }] },
                },
              },
              { $project: { city: 1, state: 1 } },
            ],
            as: "addressData",
          },
        },
        { $unwind: { path: "$addressData", preserveNullAndEmptyArrays: false } },
        {
          $group: {
            _id: "$addressData.city",
            orderCount: { $sum: 1 },
            totalRevenue: { $sum: "$amount" },
          },
        },
        { $sort: { orderCount: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            city: "$_id",
            orderCount: 1,
            totalRevenue: { $round: ["$totalRevenue", 2] },
          },
        },
      ]),

      // 7. Payment method distribution ────────────────────────────────────────
      Order.aggregate([
        matchStage,
        {
          $group: {
            _id: "$paymentType",
            count: { $sum: 1 },
            revenue: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            method: "$_id",
            count: 1,
            revenue: { $round: ["$revenue", 2] },
          },
        },
      ]),
    ]);

    // ── Format summary ────────────────────────────────────────────────────────
    const summary = summaryResult[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
    };

    return res.status(200).json({
      success: true,
      period: period || "all",
      summary: {
        totalRevenue: Math.round(summary.totalRevenue * 100) / 100,
        totalOrders: summary.totalOrders,
        avgOrderValue: Math.round(summary.avgOrderValue * 100) / 100,
      },
      monthlyRevenue,
      categoryRevenue,
      topProducts,
      leastProducts,
      cityOrders,
      paymentDistribution: paymentDist,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

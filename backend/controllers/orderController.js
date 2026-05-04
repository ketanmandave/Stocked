import Product from "../models/product.js";
import Order from "../models/order.js";
import razorpay from "../configs/razorpay.js";
import crypto from "crypto";

/* ==============================
   Delivery Date Validation Helper
   - Must be at least 2 days from today
   - Must NOT exceed 7 days from today
   - UTC-safe comparison (strips time portion)
================================ */
const validateDeliveryDate = (deliveryDateStr) => {
    if (!deliveryDateStr) {
        return { valid: false, message: "Delivery date is required" };
    }

    const deliveryDate = new Date(deliveryDateStr);

    // Check if it's a valid date
    if (isNaN(deliveryDate.getTime())) {
        return { valid: false, message: "Invalid delivery date format" };
    }

    // UTC-safe: strip time from both dates for day-level comparison
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    const deliveryUTC = new Date(Date.UTC(deliveryDate.getFullYear(), deliveryDate.getMonth(), deliveryDate.getDate()));

    const diffMs = deliveryUTC - todayUTC;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 2) {
        return {
            valid: false,
            message: "Delivery date must be at least 2 days from today"
        };
    }

    if (diffDays > 7) {
        return {
            valid: false,
            message: "Delivery date must be within 7 days from today"
        };
    }

    return { valid: true, date: deliveryUTC };
};


// place order COD: /api/order/cod 
export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, address, deliveryDate } = req.body;

        if (!items || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Validate delivery date
        const dateCheck = validateDeliveryDate(deliveryDate);
        if (!dateCheck.valid) {
            return res.status(400).json({
                success: false,
                message: dateCheck.message
            });
        }

        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            amount += product.offerPrice * item.quantity;
        }

        // add tax
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
            deliveryDate: dateCheck.date,
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully"
        });

    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, address, deliveryDate } = req.body;

    if (!items || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Validate delivery date
    const dateCheck = validateDeliveryDate(deliveryDate);
    if (!dateCheck.valid) {
        return res.status(400).json({
            success: false,
            message: dateCheck.message
        });
    }

    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      amount += product.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02);

    // ✅ create DB order FIRST
    const newOrder = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: false,
      deliveryDate: dateCheck.date,
    });

    // ✅ create razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: newOrder._id.toString(),
    });

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      dbOrderId: newOrder._id,
      amount
    });

  } catch (error) {
    console.error("Razorpay error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // ✅ mark order as paid
    await Order.findByIdAndUpdate(dbOrderId, {
      isPaid: true,
      status: "Paid"
    });

    res.json({
      success: true,
      message: "Payment successful"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        // 2️⃣ Fetch Orders
        const orders = await Order.find({
            userId,
            $or: [
                { paymentType: "COD" },  // COD orders
                { isPaid: true }         // Paid online orders
            ],
        }).populate("items.product address") // Replace IDs with full data
            .sort({ createdAt: -1 }); // Newest orders first

        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });

    }
};

// get all orders for admin: /api/order/seller
export const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { paymentType: "COD" },  // COD orders
                { isPaid: true }         // Paid online orders
            ],
        }).populate("items.product address") // Replace IDs with full data
            .sort({ createdAt: -1 }); // Newest orders first

        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Get upcoming deliveries (grouped by date): /api/order/upcoming
export const getUpcomingDeliveries = async (req, res) => {
    try {
        const today = new Date();
        const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

        const upcoming = await Order.aggregate([
            // Only valid orders (COD or paid online) with future delivery dates
            {
                $match: {
                    deliveryDate: { $gte: todayUTC },
                    $or: [
                        { paymentType: "COD" },
                        { isPaid: true }
                    ]
                }
            },
            // Group by delivery date
            {
                $group: {
                    _id: "$deliveryDate",
                    orderCount: { $sum: 1 },
                    totalAmount: { $sum: "$amount" },
                    orders: {
                        $push: {
                            _id: "$_id",
                            amount: "$amount",
                            status: "$status",
                            paymentType: "$paymentType",
                            items: "$items"
                        }
                    }
                }
            },
            // Sort by delivery date ascending (nearest first)
            { $sort: { _id: 1 } },
            // Rename _id to deliveryDate
            {
                $project: {
                    _id: 0,
                    deliveryDate: "$_id",
                    orderCount: 1,
                    totalAmount: 1,
                    orders: 1
                }
            }
        ]);

        res.json({ success: true, upcoming });
    } catch (error) {
        console.error("Upcoming deliveries error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
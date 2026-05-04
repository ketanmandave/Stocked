import express from 'express';
import authSeller from "../middlewares/authSeller.js";
import authUser from '../middlewares/authUser.js';
import { placeOrderCOD, getUserOrders, getSellerOrders, createRazorpayOrder, verifyRazorpayPayment, getUpcomingDeliveries } from '../controllers/orderController.js';
import { getSellerAnalytics } from '../controllers/analyticsController.js';


const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post("/razorpay", authUser, createRazorpayOrder);
orderRouter.post("/verify", authUser, verifyRazorpayPayment);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authSeller, getSellerOrders);
orderRouter.get('/analytics', authSeller, getSellerAnalytics);
orderRouter.get('/upcoming', authSeller, getUpcomingDeliveries);

export default orderRouter;
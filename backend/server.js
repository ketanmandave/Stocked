import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';

import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import sellerRouter from './routes/sellerRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import categoryRouter from "./routes/categoryRoutes.js";


const app = express();
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();


// allow multiple origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://stocked-frontend3.vercel.app'
].filter(Boolean);

// middleware configuration
app.use(cors({origin: 'https://stocked-frontend3.vercel.app', credentials: true}));
app.use(express.json());
app.use(cookieParser());



// routes
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use("/api/category", categoryRouter);



app.get('/', (req, res) => {
  res.send('Welcome to the Stocked API');
});

// Only listen when not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export for Vercel serverless
export default app;
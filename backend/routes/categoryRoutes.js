import express from "express";
import { addCategory, getCategories } from "../controllers/categoryController.js";
import authSeller from "../middlewares/authSeller.js";

const categoryRouter = express.Router();

// Add category (seller only)
categoryRouter.post("/add", authSeller, addCategory);

// Get all categories
categoryRouter.get("/list", getCategories);

export default categoryRouter;

import express from "express";
import { sellerLogin, logoutSeller, checkSellerAuth } from "../controllers/sellerController.js";
import authSeller from "../middlewares/authSeller.js";

const sellerRouter = express.Router();

sellerRouter.post("/login", sellerLogin);
sellerRouter.get("/is-auth", authSeller, checkSellerAuth);
sellerRouter.post("/logout", authSeller, logoutSeller);

export default sellerRouter;
import express from 'express';
import authUser from '../middlewares/authUser.js';
import {updateCartData} from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post('/update', authUser, updateCartData);

export default cartRouter;
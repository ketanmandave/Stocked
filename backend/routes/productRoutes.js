import express from "express";
const productRouter = express.Router();
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";
import { addProducts, getProducts, productById, changeStock, deleteProduct} from "../controllers/productController.js";

productRouter.post("/add", upload.array("images"),authSeller, addProducts);
productRouter.get("/list", getProducts);
productRouter.get("/:id", productById);
productRouter.post("/stock", authSeller, changeStock);
productRouter.delete("/delete/:id", authSeller, deleteProduct);

export default productRouter;
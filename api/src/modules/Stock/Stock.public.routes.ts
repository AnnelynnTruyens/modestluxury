import express from "express";
import { getStock, getStockByProduct } from "./Stock.controller";

const router = express.Router();

router.get("/stock", getStock);
router.get("/stock/:id", getStockByProduct);

export default router;

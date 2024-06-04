import express from "express";
import { createStock, updateStock, deleteStock } from "./Stock.controller";

const router = express.Router();

router.post("/stock", createStock);
router.patch("/stock/:id", updateStock);
router.delete("/stock/:id", deleteStock);

export default router;

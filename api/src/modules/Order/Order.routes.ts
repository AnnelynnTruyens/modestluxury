import express from "express";
import {
	getOrders,
	getOrdersByUser,
	getOrderById,
	createOrder,
	updateOrder,
	deleteOrder,
} from "./Order.controller";

const router = express.Router();

router.get("/orders/all", getOrders);
router.get("/orders", getOrdersByUser);
router.get("/orders/:id", getOrderById);
router.post("/orders", createOrder);
router.patch("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

export default router;

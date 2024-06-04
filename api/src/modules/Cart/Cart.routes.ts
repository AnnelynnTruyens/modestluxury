import express from "express";
import {
	getCartItems,
	getCartItemsByUser,
	getCartItemById,
	addCartItem,
	deleteCartItem,
	deleteCart,
} from "./Cart.controller";

const router = express.Router();

router.get("/cart/all", getCartItems);
router.get("/cart", getCartItemsByUser);
router.get("/cart/:id", getCartItemById);
router.post("/cart", addCartItem);
router.delete("/cart", deleteCart);
router.delete("/cart/:id", deleteCartItem);

export default router;

import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";
import { AuthRequest } from "../../middleware/auth/authMiddleware";

import Cart from "./Cart.model";

const getCartItems = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const cartItems = await Cart.find({});
		res.json(cartItems);
	} catch (err) {
		next(err);
	}
};

const getCartItemsByUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;

		const cartItems = await Cart.find({
			userId: user._id,
		});
		res.json(cartItems);
	} catch (err) {
		next(err);
	}
};

const getCartItemById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const cartItem = await Cart.findOne({
			_id: id,
		});
		if (!cartItem) {
			throw new NotFoundError("Product not found");
		}
		res.json(cartItem);
	} catch (err) {
		next(err);
	}
};

const addCartItem = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;
		const cartItem = new Cart({ ...req.body, userId: user._id });
		const result = await cartItem.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const deleteCartItem = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const cartItem = await Cart.findOneAndDelete({ _id: id });
		if (!cartItem) {
			throw new NotFoundError("Cart item not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;

		const cartItems = await Cart.deleteMany({ userId: user._id });
		if (!cartItems) {
			throw new NotFoundError("Cart items not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

export {
	getCartItems,
	getCartItemsByUser,
	getCartItemById,
	addCartItem,
	deleteCartItem,
	deleteCart,
};

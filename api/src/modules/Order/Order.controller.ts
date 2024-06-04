import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";
import { AuthRequest } from "../../middleware/auth/authMiddleware";

import Order from "./Order.model";
import { Product } from "../Product/Product.types";

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const orders = await Order.find({});
		res.json(orders);
	} catch (err) {
		next(err);
	}
};

const getOrdersByUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;

		const order = await Order.find({
			userId: user._id,
		});
		res.json(order);
	} catch (err) {
		next(err);
	}
};

const getOrderById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const order = await Order.findOne({
			_id: id,
		});
		if (!order) {
			throw new NotFoundError("Order not found");
		}
		res.json(order);
	} catch (err) {
		next(err);
	}
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user } = req as AuthRequest;

		const products = req.body.products.map((product: Product) => {
			return {
				_id: product._id,
				title: product.title,
				description: product.description,
				price: product.price,
				categoryId: product.categoryId,
			};
		});

		const order = new Order({
			...req.body,
			userId: user._id,
			products: products,
		});
		const result = await order.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const order = await Order.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!order) {
			throw new NotFoundError("Order not found");
		}
		res.json(order);
	} catch (err) {
		next(err);
	}
};

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const order = await Order.findOneAndDelete({ _id: id });
		if (!order) {
			throw new NotFoundError("Order not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

export {
	getOrders,
	getOrdersByUser,
	getOrderById,
	createOrder,
	updateOrder,
	deleteOrder,
};

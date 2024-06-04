import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";

import Product from "./Product.model";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { categoryId } = req.query;
		const { orderId } = req.query;

		const products = await Product.find({
			...(categoryId ? { categoryId: categoryId } : {}),
			...(orderId ? { orderId: orderId } : {}),
		});
		res.json(products);
	} catch (err) {
		next(err);
	}
};

const getProductById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const product = await Product.findOne({
			_id: id,
		});
		if (!product) {
			throw new NotFoundError("Product not found");
		}
		res.json(product);
	} catch (err) {
		next(err);
	}
};

const getProductsByCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const categoryId = req.params.id;
	req.query.categoryId = categoryId;
	return await getProducts(req, res, next);
};

const getProductsByOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const orderId = req.params.id;
	req.query.orderId = orderId;
	return await getProducts(req, res, next);
};

const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const product = new Product({ ...req.body });
		const result = await product.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!product) {
			throw new NotFoundError("Product not found");
		}
		res.json(product);
	} catch (err) {
		next(err);
	}
};

const deleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const product = await Product.findOneAndDelete({
			_id: id,
		});
		if (!product) {
			throw new NotFoundError("Product not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

export {
	getProducts,
	getProductById,
	getProductsByCategory,
	getProductsByOrder,
	createProduct,
	updateProduct,
	deleteProduct,
};

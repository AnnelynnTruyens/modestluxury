import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";

import Category from "./Category.model";

const getCategories = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const categories = await Category.find({});
		res.json(categories);
	} catch (err) {
		next(err);
	}
};

const getCategoryById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const category = await Category.findOne({
			_id: id,
		});
		if (!category) {
			throw new NotFoundError("Category not found");
		}
		res.json(category);
	} catch (err) {
		next(err);
	}
};

const getCategoryByProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const productId = req.params.id;
	req.query.productId = productId;
	return await getCategories(req, res, next);
};

const createCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const category = new Category({ ...req.body });
		const result = await category.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const category = await Category.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!category) {
			throw new NotFoundError("Category not found");
		}
		res.json(category);
	} catch (err) {
		next(err);
	}
};

const deleteCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const category = await Category.findOneAndDelete({
			_id: id,
		});
		if (!category) {
			throw new NotFoundError("Category not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

export {
	getCategories,
	getCategoryById,
	getCategoryByProduct,
	createCategory,
	updateCategory,
	deleteCategory,
};

import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";

import Stock from "./Stock.model";

const getStock = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const stock = await Stock.find({});
		res.json(stock);
	} catch (err) {
		next(err);
	}
};

const getStockByProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const productId = req.params.id;
	req.query.productId = productId;
	return await getStock(req, res, next);
};

const createStock = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const stock = new Stock({ ...req.body });
		const result = await stock.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateStock = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const stock = await Stock.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!stock) {
			throw new NotFoundError("Stock not found");
		}
		res.json(stock);
	} catch (err) {
		next(err);
	}
};

const deleteStock = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const stock = await Stock.findOneAndDelete({
			_id: id,
		});
		if (!stock) {
			throw new NotFoundError("Stock not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

export { getStock, getStockByProduct, createStock, updateStock, deleteStock };

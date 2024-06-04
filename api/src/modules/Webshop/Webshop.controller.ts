import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";

import Webshop from "./Webshop.model";

const getWebshops = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const webshops = await Webshop.find({});
		res.json(webshops);
	} catch (err) {
		next(err);
	}
};

const getWebshopById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const webshop = await Webshop.findOne({
			_id: id,
		});
		if (!webshop) {
			throw new NotFoundError("Webshop not found");
		}
		res.json(webshop);
	} catch (err) {
		next(err);
	}
};

const createWebshop = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const webshop = new Webshop({ ...req.body });
		const result = await webshop.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateWebshop = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const webshop = await Webshop.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!webshop) {
			throw new NotFoundError("Webshop not found");
		}
		res.json(webshop);
	} catch (err) {
		next(err);
	}
};

const deleteWebshop = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const webshop = await Webshop.findOneAndDelete({
			_id: id,
		});
		if (!webshop) {
			throw new NotFoundError("Webshop not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

export {
	getWebshops,
	getWebshopById,
	createWebshop,
	updateWebshop,
	deleteWebshop,
};

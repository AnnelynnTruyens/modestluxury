import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";
import { AuthRequest } from "../../middleware/auth/authMiddleware";

import Favorite from "./Favorite.model";

const getFavorites = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const favorites = await Favorite.find({});
		res.json(favorites);
	} catch (err) {
		next(err);
	}
};

const getFavoritesByUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const { productId } = req.query;

		const favorites = await Favorite.find({
			userId: user._id,
			...(productId ? { productId: productId } : {}),
		});
		res.json(favorites);
	} catch (err) {
		next(err);
	}
};

const findFavoriteByProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const productId = req.params.id;
	req.query.productId = productId;
	return await getFavoritesByUser(req, res, next);
};

const getFavoriteById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const favorite = await Favorite.findOne({
			_id: id,
		});
		if (!favorite) {
			throw new NotFoundError("Favorite not found");
		}
		res.json(favorite);
	} catch (err) {
		next(err);
	}
};

const createFavorite = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const favorite = new Favorite({ ...req.body, userId: user._id });
		const result = await favorite.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateFavorite = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const favorite = await Favorite.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!favorite) {
			throw new NotFoundError("Favorite not found");
		}
		res.json(favorite);
	} catch (err) {
		next(err);
	}
};

const deleteFavorite = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const favorite = await Favorite.findOneAndDelete({ _id: id });
		if (!favorite) {
			throw new NotFoundError("Favorite not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

export {
	getFavorites,
	getFavoritesByUser,
	findFavoriteByProduct,
	getFavoriteById,
	createFavorite,
	updateFavorite,
	deleteFavorite,
};

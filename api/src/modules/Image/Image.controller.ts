import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";

import Image from "./Image.model";

const getImages = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const images = await Image.find({});
		res.json(images);
	} catch (err) {
		next(err);
	}
};

const getImageById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const image = await Image.findOne({
			_id: id,
		});
		if (!image) {
			throw new NotFoundError("Image not found");
		}
		res.json(image);
	} catch (err) {
		next(err);
	}
};

const getImageByProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const productId = req.params.id;
	req.query.productId = productId;
	return await getImages(req, res, next);
};

const addImage = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const image = new Image({ ...req.body });
		const result = await image.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateImage = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const image = await Image.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!image) {
			throw new NotFoundError("Image not found");
		}
		res.json(image);
	} catch (err) {
		next(err);
	}
};

const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const image = await Image.findOneAndDelete({
			_id: id,
		});
		if (!image) {
			throw new NotFoundError("Image not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

export {
	getImages,
	getImageById,
	getImageByProduct,
	addImage,
	updateImage,
	deleteImage,
};

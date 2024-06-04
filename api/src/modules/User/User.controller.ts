import { NextFunction, Request, Response } from "express";

import { AuthRequest } from "../../middleware/auth/authMiddleware";
import NotFoundError from "../../middleware/error/NotFoundError";

import User from "./User.model";

const register = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = new User({ ...req.body });
		const result = await user.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const login = (req: Request, res: Response, next: NextFunction) => {
	const { user } = req as AuthRequest;

	res.json({
		token: user.generateToken(),
	});
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await User.find({});
		res.json(users);
	} catch (err) {
		next(err);
	}
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const user = await User.findOne({
			_id: id,
		});
		if (!user) {
			throw new NotFoundError("User not found");
		}
		res.json(user);
	} catch (err) {
		next(err);
	}
};

const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
	const { user } = req as AuthRequest;
	res.json(user);
};

const editCurrentUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;

		const editUser = await User.findOneAndUpdate({ _id: user._id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!user) {
			throw new NotFoundError("User not found");
		}
		res.json(editUser);
	} catch (err) {
		next(err);
	}
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const user = await User.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!user) {
			throw new NotFoundError("User not found");
		}
		res.json(user);
	} catch (err) {
		next(err);
	}
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const user = await User.findOneAndDelete({
			_id: id,
		});
		if (!user) {
			throw new NotFoundError("User not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

export {
	register,
	login,
	getUsers,
	getUserById,
	getCurrentUser,
	editCurrentUser,
	updateUser,
	deleteUser,
};

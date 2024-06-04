import { NextFunction, Request, Response } from "express";

import NotFoundError from "../../middleware/error/NotFoundError";
import { AuthRequest } from "../../middleware/auth/authMiddleware";

import Message from "./Message.model";

const getMessages = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const messages = await Message.find({});
		res.json(messages);
	} catch (err) {
		next(err);
	}
};

const getMessagesByUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;

		const messages = await Message.find({
			userId: user._id,
		});
		res.json(messages);
	} catch (err) {
		next(err);
	}
};

const getMessageById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const message = await Message.findOne({
			_id: id,
		});
		if (!message) {
			throw new NotFoundError("Message not found");
		}
		res.json(message);
	} catch (err) {
		next(err);
	}
};

const createMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req as AuthRequest;
		const message = new Message({ ...req.body, userId: user._id });
		const result = await message.save();
		res.status(200).json(result);
	} catch (err) {
		next(err);
	}
};

const updateMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const message = await Message.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
			runValidators: true,
		});
		if (!message) {
			throw new NotFoundError("Message not found");
		}
		res.json(message);
	} catch (err) {
		next(err);
	}
};

const deleteMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const message = await Message.findOneAndDelete({ _id: id });
		if (!message) {
			throw new NotFoundError("Message not found");
		}
		res.json({});
	} catch (err) {
		next(err);
	}
};

export {
	getMessages,
	getMessagesByUser,
	getMessageById,
	createMessage,
	updateMessage,
	deleteMessage,
};

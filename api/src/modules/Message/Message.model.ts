import mongoose from "mongoose";

import { Message } from "./Message.types";

import validateModel from "../../validation/validateModel";

const messageSchema = new mongoose.Schema<Message>(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
		},
		message: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

messageSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const messageModel = mongoose.model<Message>("Message", messageSchema);

export default messageModel;

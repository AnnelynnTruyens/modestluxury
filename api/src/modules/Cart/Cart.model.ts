import mongoose from "mongoose";

import { Cart } from "./Cart.types";

import validateModel from "../../validation/validateModel";

const cartSchema = new mongoose.Schema<Cart>(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
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

cartSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const cartModel = mongoose.model<Cart>("Cart", cartSchema);

export default cartModel;

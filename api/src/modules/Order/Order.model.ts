import mongoose from "mongoose";

import { Order } from "./Order.types";

import validateModel from "../../validation/validateModel";

const orderSchema = new mongoose.Schema<Order>(
	{
		status: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		products: [
			{
				_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				title: {
					type: String,
					required: true,
				},
				description: {
					type: String,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
				categoryId: {
					type: mongoose.Schema.Types.ObjectId,
					required: false,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

orderSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const orderModel = mongoose.model<Order>("Order", orderSchema);

export default orderModel;

import mongoose from "mongoose";

import { Stock } from "./Stock.types";

import validateModel from "../../validation/validateModel";

const stockSchema = new mongoose.Schema<Stock>(
	{
		size: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

stockSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const stockModel = mongoose.model<Stock>("Stock", stockSchema);

export default stockModel;

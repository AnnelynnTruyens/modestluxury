import mongoose from "mongoose";

import { Product } from "./Product.types";

import validateModel from "../../validation/validateModel";

const productSchema = new mongoose.Schema<Product>(
	{
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
	{
		timestamps: true,
	}
);

productSchema.virtual("category", {
	ref: "Category",
	localField: "categoryId",
	foreignField: "_id",
	justOne: true,
});

productSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const productModel = mongoose.model<Product>("Product", productSchema);

export default productModel;

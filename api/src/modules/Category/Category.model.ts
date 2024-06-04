import mongoose from "mongoose";

import { Category } from "./Category.types";

import validateModel from "../../validation/validateModel";

const categorySchema = new mongoose.Schema<Category>(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

categorySchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const categoryModel = mongoose.model<Category>("Category", categorySchema);

export default categoryModel;

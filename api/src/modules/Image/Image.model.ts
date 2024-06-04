import mongoose from "mongoose";

import { Image } from "./Image.types";

import validateModel from "../../validation/validateModel";

const imageSchema = new mongoose.Schema<Image>(
	{
		link: {
			type: String,
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

imageSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const imageModel = mongoose.model<Image>("Image", imageSchema);

export default imageModel;

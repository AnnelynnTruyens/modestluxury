import mongoose from "mongoose";

import { Webshop } from "./Webshop.types";

import validateModel from "../../validation/validateModel";

const webshopSchema = new mongoose.Schema<Webshop>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: Number,
			required: true,
		},
		logo: {
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

webshopSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const webshopModel = mongoose.model<Webshop>("Webshop", webshopSchema);

export default webshopModel;

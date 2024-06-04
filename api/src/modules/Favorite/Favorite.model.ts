import mongoose from "mongoose";

import { Favorite } from "./Favorite.types";

import validateModel from "../../validation/validateModel";

const favoriteSchema = new mongoose.Schema<Favorite>(
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

favoriteSchema.pre("save", function (next) {
	validateModel(this);
	next();
});

const favoriteModel = mongoose.model<Favorite>("Favorite", favoriteSchema);

export default favoriteModel;

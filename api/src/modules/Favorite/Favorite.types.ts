import { Document, ObjectId } from "mongoose";
import { User } from "../User/User.types";
import { Product } from "../Product/Product.types";

export type Favorite = Document & {
	_id?: string;
	productId: ObjectId;
	product?: Product;
	userId: ObjectId;
	user?: User;
};

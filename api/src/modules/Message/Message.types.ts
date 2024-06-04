import { Date, Document, ObjectId } from "mongoose";
import { User } from "../User/User.types";
import { Product } from "../Product/Product.types";

export type Message = Document & {
	_id?: string;
	productId?: ObjectId;
	product?: Product;
	message: string;
	status: string;
	userId: ObjectId;
	user?: User;
};

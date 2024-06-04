import { Document, ObjectId } from "mongoose";
import { Product } from "../Product/Product.types";

export type Stock = Document & {
	_id?: string;
	size: string;
	amount: Number;
	productId: ObjectId;
	product?: Product;
};

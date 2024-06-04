import { Document, ObjectId } from "mongoose";
import { Product } from "../Product/Product.types";

export type Image = Document & {
	_id?: string;
	link: string;
	productId: ObjectId;
	product?: Product;
};

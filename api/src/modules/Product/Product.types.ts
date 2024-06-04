import { Document, ObjectId } from "mongoose";

export type Product = Document & {
	_id?: string;
	title: string;
	description: string;
	price: Number;
	categoryId?: ObjectId;
	orderId?: ObjectId;
};

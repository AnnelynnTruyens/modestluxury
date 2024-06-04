import { Document, ObjectId } from "mongoose";

export type Category = Document & {
	_id?: string;
	name: string;
};

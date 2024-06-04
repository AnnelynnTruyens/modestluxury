import { Document, ObjectId } from "mongoose";
import { User } from "../User/User.types";

export type Order = Document & {
	_id?: string;
	status: string;
	userId: ObjectId;
	user?: User;
	products: ObjectId[];
};

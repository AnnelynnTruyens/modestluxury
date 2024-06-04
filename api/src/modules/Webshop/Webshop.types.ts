import { Document, ObjectId } from "mongoose";
import { User } from "../User/User.types";

export type Webshop = Document & {
	_id?: string;
	name: string;
	email: string;
	phone: Number;
	logo: string;
	userId: ObjectId;
	user?: User;
};

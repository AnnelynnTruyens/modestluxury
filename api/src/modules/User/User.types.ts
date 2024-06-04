import { Document } from "mongoose";

export type UserRegister = Document & {
	_id?: string;
	email: string;
	password: string;
	firstname: string;
	lastname: string;
	phone?: Number;
	street_number?: string;
	postal_code?: Number;
	city?: string;
	country?: string;
	role: string;
};

export type UserMethods = {
	comparePassword: (password: string) => Promise<boolean>;
	generateToken: () => string;
};

export type User = Document &
	UserMethods & {
		_id?: string;
		email: string;
		password: string;
		name: string;
		phone?: Number;
		street_number?: string;
		postal_code?: Number;
		city?: string;
		country?: string;
		role: string;
	};

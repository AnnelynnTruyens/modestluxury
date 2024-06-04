import { API } from "./ApiService";

export type User = {
	_id: string;
	email: string;
	firstname: string;
	lastname: string;
	phone?: string;
	street_number?: string;
	postal_code?: string;
	city?: string;
	country?: string;
	role: string;
};

export type UserBody = Omit<User, "_id">;

type Auth = {
	token: string;
};

type LoginBody = {
	email: string;
	password: string;
};

export type RegisterUser = {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	role: string;
};

const register = (user: RegisterUser) => {
	return API.post<RegisterUser>("/register", user);
};

const login = (body: LoginBody) => {
	return API.post<Auth>("/login", body);
};

const getCurrentUser = () => {
	return API.get<User>("/users/current");
};

const editCurrentUser = (user: User) => {
	return API.patch<User>("/users/current/edit", user);
};

const getUsers = () => {
	return API.get<User[]>(`/users`);
};

const getUserById = (id: string) => {
	return API.get<User>(`/users/${id}`);
};

const updateUser = (id: string, user: UserBody) => {
	return API.patch<User>(`/users/${id}`, user);
};

const deleteUser = (id: string) => {
	return API.delete<User>(`users/${id}`);
};

export {
	register,
	login,
	getCurrentUser,
	editCurrentUser,
	getUsers,
	getUserById,
	updateUser,
	deleteUser,
};

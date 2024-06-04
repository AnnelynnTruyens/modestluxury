import qs from "query-string";
import { API } from "./ApiService";
import { Product } from "./ProductService";
import { User } from "./AuthService";

export type Message = {
	_id: string;
	productId?: string;
	product?: Product;
	message: string;
	status: string;
	userId: string;
	user?: User;
	createdAt: string;
};

export type MessageBody = Omit<Message, "_id" | "createdAt">;

type Query = {
	userId?: string;
};

const getMessages = () => {
	return API.get<Message[]>(`/messages/all`);
};

const getMessagesByUser = (query: Query = {}) => {
	return API.get<Message[]>(`/messages?${qs.stringify(query)}`);
};

const getMessageById = (id: string) => {
	return API.get<Message>(`/messages/${id}`);
};

const createMessage = (message: MessageBody) => {
	return API.post<Message>("/messages", message);
};

const updateMessage = (id: string, message: MessageBody) => {
	return API.patch<Message>(`/messages/${id}`, message);
};

const deleteMessage = (id: string) => {
	return API.delete<Message>(`/messages/${id}`);
};

export {
	getMessages,
	getMessagesByUser,
	getMessageById,
	createMessage,
	updateMessage,
	deleteMessage,
};

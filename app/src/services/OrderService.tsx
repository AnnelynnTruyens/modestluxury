import { API } from "./ApiService";
import qs from "query-string";
import { User } from "./AuthService";
import { Product } from "./ProductService";

export type Order = {
	_id: string;
	status: string;
	userId: string;
	user?: User;
	products?: Product[];
	createdAt: string;
};

export type OrderBody = Omit<Order, "_id" | "createdAt">;

type Query = {
	userId?: string;
};

const getOrders = () => {
	return API.get<Order[]>(`/orders/all`);
};

const getOrdersByUser = (query: Query = {}) => {
	return API.get<Order[]>(`/orders?${qs.stringify(query)}`);
};

const getOrderById = (id: string) => {
	return API.get<Order>(`/orders/${id}`);
};

const createOrder = (order: OrderBody) => {
	return API.post<Order>("/orders", order);
};

const updateOrder = (id: string, order: OrderBody) => {
	return API.patch<Order>(`/orders/${id}`, order);
};

const deleteOrder = (id: string) => {
	return API.delete<Order>(`orders/${id}`);
};

export {
	getOrders,
	getOrdersByUser,
	getOrderById,
	createOrder,
	updateOrder,
	deleteOrder,
};

import { API } from "./ApiService";
import { Category } from "./CategoryService";
import qs from "query-string";

export type Product = {
	_id: string;
	title: string;
	description: string;
	price: string;
	categoryId?: string;
	category?: Category;
	createdAt: string;
};

export type ProductBody = Omit<Product, "_id" | "createdAt">;

type CategoryQuery = {
	categoryId?: string;
};

type OrderQuery = {
	orderId?: string;
};

const getProducts = () => {
	return API.get<Product[]>(`/products`);
};

const getProductById = (id: string) => {
	return API.get<Product>(`/products/${id}`);
};

const getProductsByCategory = (query: CategoryQuery = {}) => {
	return API.get<Product[]>(`/products?${qs.stringify(query)}`);
};

const getProductsByOrder = (query: OrderQuery = {}) => {
	return API.get<Product[]>(`/products?${qs.stringify(query)}`);
};

const createProduct = (product: ProductBody) => {
	return API.post<Product>("/products", product);
};

const updateProduct = (id: string, product: ProductBody) => {
	return API.patch<Product>(`/products/${id}`, product);
};

const deleteProduct = (id: string) => {
	return API.delete<Product>(`products/${id}`);
};

export {
	getProducts,
	getProductById,
	getProductsByCategory,
	getProductsByOrder,
	createProduct,
	updateProduct,
	deleteProduct,
};

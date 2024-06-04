import { API } from "./ApiService";

export type Category = {
	_id: string;
	name: string;
};

const getCategories = () => {
	return API.get<Category[]>(`/categories`);
};

const getCategoryById = (id: string) => {
	return API.get<Category>(`/categories/${id}`);
};

export { getCategories, getCategoryById };

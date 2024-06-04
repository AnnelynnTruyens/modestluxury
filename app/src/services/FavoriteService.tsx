import { User } from "./AuthService";
import { Product } from "./ProductService";
import { API } from "./ApiService";
import qs from "query-string";

export type Favorite = {
	_id: string;
	productId: string;
	product?: Product;
	userId: string;
	user?: User;
};

export type FavoriteBody = Omit<Favorite, "_id">;

type Query = {
	productId?: string;
};

const getFavoritesByUser = () => {
	return API.get<Favorite[]>(`/favorites`);
};

const findFavoriteByProduct = (query: Query = {}) => {
	return API.get<Favorite[]>(`/favorites?${qs.stringify(query)}`);
};

const createFavorite = (favorite: FavoriteBody) => {
	return API.post<Favorite>("/favorites", favorite);
};

const deleteFavorite = (id: string) => {
	return API.delete<Favorite>(`/favorites/${id}`);
};

export {
	getFavoritesByUser,
	findFavoriteByProduct,
	createFavorite,
	deleteFavorite,
};

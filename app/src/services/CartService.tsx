import { User } from "./AuthService";
import { Product } from "./ProductService";
import { API } from "./ApiService";

export type CartItem = {
	_id: string;
	productId: string;
	product?: Product;
	userId: string;
	user?: User;
};

export type CartItemBody = Omit<CartItem, "_id">;

const getCartItemsByUser = () => {
	return API.get<CartItem[]>(`/cart`);
};

const addCartItem = (cartItem: CartItemBody) => {
	return API.post<CartItem>("/cart", cartItem);
};

const deleteCartItem = (id: string) => {
	return API.delete<CartItem>(`/cart/${id}`);
};

const deleteCart = () => {
	return API.delete<CartItem[]>(`/cart`);
};

export { getCartItemsByUser, addCartItem, deleteCartItem, deleteCart };

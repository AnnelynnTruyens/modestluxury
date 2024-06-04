import style from "./Cart.module.css";

import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
	CartItem,
	deleteCartItem,
	getCartItemsByUser,
} from "../../services/CartService";
import { Product, getProductById } from "../../services/ProductService";
import { API } from "../../services/ApiService";
import { useAuthContext } from "../../contexts/AuthContainer";
import useStores from "../../hooks/useStores";
import ROUTES from "../../consts/Routes";

import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import NoResults from "../../components/NoResults/NoResults";

// Type CartItem with Product
interface CartItemWithProduct extends CartItem {
	product?: Product;
}

const Cart = () => {
	const navigate = useNavigate();

	const [cartData, setCartData] = useState<CartItemWithProduct[]>([]);
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { token, logout } = useAuthContext();
	const { UiStore } = useStores();

	// Wait for currentUser to be set
	useEffect(() => {
		const waitForUser = async () => {
			if (!UiStore.currentUser) {
				await new Promise<void>((resolve) => {
					const interval = setInterval(() => {
						if (UiStore.currentUser) {
							clearInterval(interval);
							resolve();
						}
					}, 100);
				});
			}
			setIsLoading(false);
		};

		waitForUser();
	}, [UiStore]);

	useEffect(() => {
		if (token) {
			// Set authorization header for API
			API.interceptors.request.use((config) => {
				config.headers["Authorization"] = `Bearer ${token}`;
				return config;
			});
			API.interceptors.response.use(
				(response: AxiosResponse) => response,
				(error: AxiosError) => {
					if (error.response?.status === 401) {
						logout();
					}
					return Promise.reject(error);
				}
			);

			// API call to get cart items of current user
			setIsLoading(true);
			getCartItemsByUser()
				.then(async ({ data }) => {
					// Get productinfo of products in cart items
					const cartItemsWithProduct: CartItemWithProduct[] = await Promise.all(
						data.map(async (cartItem: CartItem) => {
							if (cartItem.userId) {
								try {
									const productResponse = await getProductById(
										cartItem.productId
									);
									return { ...cartItem, product: productResponse.data };
								} catch (error) {
									console.error("Error fetching product details", error);
									return cartItem;
								}
							} else {
								return cartItem;
							}
						})
					);
					setCartData(cartItemsWithProduct);
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error);
					setIsLoading(false);
				});
		}
	}, [token, logout]);

	// Function to handle deleting an item from the cart
	const handleDeleteCartItem = (cartItemId: string) => {
		if (!cartData || !cartItemId) {
			return;
		}

		if (!UiStore.currentUser) {
			navigate(ROUTES.login);
		}

		setIsLoading(true);
		deleteCartItem(cartItemId)
			.then(() => {
				navigate(ROUTES.cart);
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	if (isLoading) return <Loading />;
	else if (error) return <Error />;
	else if (!cartData || cartData.length == 0)
		return (
			<div className={style.container}>
				<h1>Winkelwagen</h1>
				<div className={style.products}>
					<NoResults />
				</div>
			</div>
		);
	else
		return (
			<div className={style.container}>
				<h1>Winkelwagen</h1>
				<div className={style.products}>
					{cartData.map((cartItem: CartItem) => {
						return (
							<Link
								to={`${ROUTES.productDetail.to}${cartItem.productId}`}
								className={style.product__card}
								key={`cartItem_${cartItem._id}`}
							>
								<img
									className={style.product__card_img}
									src="/src/assets/ML-logo-small.svg"
									alt="product image"
								/>
								<div className={style.product__card_text}>
									<p className={style.product__card_title}>
										{cartItem.product?.title || "Unknown"}
									</p>
									<div className={style.flex_right}>
										<p className={style.product__card_price}>
											€ {cartItem.product?.price || "00"}
										</p>
										<button
											className={style.delete_btn}
											onClick={() => handleDeleteCartItem(cartItem._id)}
										>
											Verwijderen
										</button>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
				<button className={style.order_btn}>
					<Link to={ROUTES.cartDetail}>Bestellen</Link>
				</button>
			</div>
		);
};

export default Cart;

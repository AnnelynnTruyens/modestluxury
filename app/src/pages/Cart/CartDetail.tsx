import style from "./Cart.module.css";

import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import {
	CartItem,
	deleteCart,
	getCartItemsByUser,
} from "../../services/CartService";
import { Product, getProductById } from "../../services/ProductService";
import { editCurrentUser } from "../../services/AuthService";
import { createOrder } from "../../services/OrderService";
import { useAuthContext } from "../../contexts/AuthContainer";
import useStores from "../../hooks/useStores";
import { API } from "../../services/ApiService";
import ROUTES from "../../consts/Routes";

import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

// Type CartItem with Product
interface CartItemWithProduct extends CartItem {
	product?: Product;
}

const CartDetail = () => {
	const navigate = useNavigate();

	const [cartData, setCartData] = useState<CartItemWithProduct[]>([]);
	const [userId, setUserId] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [firstname, setFirstname] = useState<string>("");
	const [lastname, setLastname] = useState<string>("");
	const [phone, setPhone] = useState<string | undefined>();
	const [streetNumber, setStreetNumber] = useState<string | undefined>();
	const [postcode, setPostcode] = useState<string | undefined>();
	const [city, setCity] = useState<string | undefined>();
	const [country, setCountry] = useState<string | undefined>();
	const [role, setRole] = useState<string>("");
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { token, logout } = useAuthContext();
	const { UiStore } = useStores();

	// Define userBody to send with API call to make sure the address is up to date
	const userBody = {
		_id: userId,
		email: email,
		firstname: firstname,
		lastname: lastname,
		phone: phone,
		street_number: streetNumber,
		postal_code: postcode,
		city: city,
		country: country,
		role: role,
	};

	// Define orderBody to send with API call to send order
	const orderBody = {
		status: "besteld",
		userId: userId,
		products: cartData.map((item) => ({
			_id: item.product?._id || "",
			title: item.product?.title || "",
			description: item.product?.description || "",
			price: item.product?.price || "",
			createdAt: item.product?.createdAt || "",
		})),
	};

	// Wait for current user and set user data when loaded
	useEffect(() => {
		const waitForUser = async () => {
			if (!UiStore.currentUser) {
				await new Promise<void>((resolve) => {
					const interval = setInterval(() => {
						if (UiStore.currentUser) {
							setUserId(UiStore.currentUser._id);
							clearInterval(interval);
							resolve();
						}
					}, 100);
				});
			}
			setIsLoading(false);

			if (UiStore.currentUser) {
				setUserId(UiStore.currentUser._id);
				setEmail(UiStore.currentUser.email);
				setFirstname(UiStore.currentUser.firstname);
				setLastname(UiStore.currentUser.lastname);
				setPhone(UiStore.currentUser.phone);
				setStreetNumber(UiStore.currentUser.street_number);
				setPostcode(UiStore.currentUser.postal_code);
				setCity(UiStore.currentUser.city);
				setCountry(UiStore.currentUser.country);
				setRole(UiStore.currentUser.role);
			}
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

			// Get cart items of current user to be able to place order
			setIsLoading(true);
			getCartItemsByUser()
				.then(async ({ data }) => {
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

	// Function to place orders with cart items
	const handlePlaceOrder = (e: FormEvent) => {
		e.preventDefault();
		if (
			!cartData ||
			cartData.length == 0 ||
			!UiStore.currentUser ||
			!UiStore.currentUser._id
		) {
			return;
		}

		setIsLoading(true);
		editCurrentUser(userBody)
			.then(() => {
				// Update the UiStore with updated user info
				UiStore.setCurrentUser(userBody);
				createOrder(orderBody)
					.then(() => {
						navigate(ROUTES.orders);
						// Clear items in cart
						deleteCart();
						setIsLoading(false);
					})
					.catch((error) => {
						setError(error);
						setIsLoading(false);
					});
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	if (isLoading) return <Loading />;
	else if (error) return <Error />;
	return (
		<div className={style.container}>
			<form className={style.profile_form} onSubmit={handlePlaceOrder}>
				<div className={style.info}>
					<div className={style.personal_info}>
						{UiStore.currentUser ? (
							<>
								<label
									htmlFor="streetNumber"
									className={style.profile_form__label}
								>
									Straat en nummer
								</label>
								<input
									name="streetNumber"
									id="streetNumber"
									className={style.profile_form__input}
									value={streetNumber}
									onChange={(e) => setStreetNumber(e.target.value)}
									required
								></input>
								<label htmlFor="postcode" className={style.profile_form__label}>
									Postcode
								</label>
								<input
									name="postcode"
									id="postcode"
									value={postcode}
									onChange={(e) => setPostcode(e.target.value)}
									className={style.profile_form__input}
									required
								></input>
								<label htmlFor="city" className={style.profile_form__label}>
									Gemeente
								</label>
								<input
									name="city"
									id="city"
									className={style.profile_form__input}
									value={city}
									onChange={(e) => setCity(e.target.value)}
									required
								/>
								<label htmlFor="country" className={style.profile_form__label}>
									Land
								</label>
								<input
									name="country"
									id="country"
									className={style.profile_form__input}
									value={country}
									onChange={(e) => setCountry(e.target.value)}
									required
								/>
								<label htmlFor="phone" className={style.profile_form__label}>
									Telefoonnummer
								</label>
								<input
									type="phone"
									name="phone"
									id="phone"
									className={style.profile_form__input}
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
								/>
							</>
						) : (
							"Geen gebruiker gevonden"
						)}
					</div>
				</div>
				<div className={style.profile_form__buttons}>
					<Link className={style.profile_form__cancel} to={ROUTES.cart}>
						Annuleren
					</Link>
					<button className={style.edit_btn} type="submit">
						Bestelling plaatsen
					</button>
				</div>
			</form>
		</div>
	);
};

export default CartDetail;

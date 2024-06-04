import style from "./Order.module.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { format, parseISO } from "date-fns";

import { Order, getOrderById } from "../../services/OrderService";
import { useAuthContext } from "../../contexts/AuthContainer";
import useStores from "../../hooks/useStores";
import { API } from "../../services/ApiService";
import { Product } from "../../services/ProductService";
import { User, getUserById } from "../../services/AuthService";

import Loading from "../../components/Loading/Loading";
import NoResults from "../../components/NoResults/NoResults";
import Error from "../../components/Error/Error";
import Sidenav from "../../components/Sidenav/Sidenav";

// Type order with user
interface OrderWithUser extends Order {
	user?: User;
}

const OrderDetail = () => {
	const [orderData, setOrderData] = useState<OrderWithUser | null>(null);
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { token, logout } = useAuthContext();
	const { UiStore } = useStores();

	// Get orderId from URL
	const { id } = useParams();

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

			// Get order by id and user data if available when userId of order is userId of current user
			if (id && UiStore.currentUser) {
				setIsLoading(true);
				getOrderById(id)
					.then(async ({ data }) => {
						let userResponse = null;

						try {
							if (data.userId) {
								userResponse = await getUserById(data.userId);
							}
						} catch (error) {
							console.error("Error fetching user details", error);
						}
						if (data.userId == UiStore.currentUser?._id) {
							setOrderData({
								...data,
								user: userResponse ? userResponse.data : undefined,
							});
						}
						setIsLoading(false);
					})
					.catch((error) => {
						setError(error);
						setIsLoading(false);
					});
			}
		}
	}, [token, logout]);

	if (isLoading)
		return (
			<div className={style.container}>
				<Sidenav />
				<Loading />
			</div>
		);
	else if (error)
		return (
			<div className={style.container}>
				<Sidenav />
				<Error />
			</div>
		);
	else if (!orderData)
		return (
			<div className={style.container}>
				<Sidenav />
				<NoResults />
			</div>
		);
	else
		return (
			<div className={style.container}>
				<Sidenav />

				<div>
					<p>Datum: {format(parseISO(orderData.createdAt), "dd/MM/yyyy")}</p>
					<p>
						Gebruiker: {orderData.user?.firstname} {orderData.user?.lastname}
					</p>
					<p>Adres:</p>
					<p>{orderData.user?.street_number}</p>
					<p>
						{orderData.user?.postal_code} {orderData.user?.city}
					</p>
					<p>{orderData.user?.country}</p>
					<p>Bestelling:</p>
					{orderData.products && orderData.products.length !== 0 ? (
						orderData.products.map((product: Product) => {
							console.log(product);
							return <div key={`product_${product._id}`}>{product.title}</div>;
						})
					) : (
						<NoResults />
					)}
				</div>
			</div>
		);
};

export default OrderDetail;

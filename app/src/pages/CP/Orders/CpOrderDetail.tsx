import style from "./CpOrders.module.css";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { format, parseISO } from "date-fns";

import {
	Order,
	deleteOrder,
	getOrderById,
	updateOrder,
} from "../../../services/OrderService";
import { useAuthContext } from "../../../contexts/AuthContainer";
import { API } from "../../../services/ApiService";
import ROUTES from "../../../consts/Routes";
import useStores from "../../../hooks/useStores";
import { User, getUserById } from "../../../services/AuthService";
import { Product } from "../../../services/ProductService";

import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import NoResults from "../../../components/NoResults/NoResults";
import CpSidenav from "../../../components/Sidenav/CpSidenav";

// Type order with user
interface OrderWithUser extends Order {
	user?: User;
}

const CpOrderDetail = () => {
	const navigate = useNavigate();

	const [orderData, setOrderData] = useState<OrderWithUser | null>(null);
	const [status, setStatus] = useState<string>("");
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { token, logout } = useAuthContext();
	const { UiStore } = useStores();

	// Get the userId out of the URL
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

			if (!UiStore.currentUser || UiStore.currentUser.role !== "admin") {
				navigate(ROUTES.home);
			}
		};

		waitForUser();
	}, [UiStore, navigate]);

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
		}

		if (id) {
			setIsLoading(true);
			// Get order by id with user data if available
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
					setOrderData({
						...data,
						user: userResponse ? userResponse.data : undefined,
					});
					setStatus(data.status);
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error);
					setIsLoading(false);
				});
		}
	}, [token, logout]);

	// Function to update an order
	const handleEdit = (e: React.FormEvent) => {
		if (!orderData || !orderData._id) {
			return;
		}

		e.preventDefault();

		// Type orderBody to send with API call
		const orderBody = {
			status: status,
			userId: orderData.userId,
			createdAt: orderData.createdAt,
		};

		setIsLoading(true);
		// API call to update the order
		updateOrder(orderData._id, orderBody)
			.then(() => {
				setIsLoading(false);
				navigate(ROUTES.cpOrders);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	// Function to delete an order
	const handleDelete = () => {
		if (!orderData || !orderData._id) {
			return;
		}

		deleteOrder(orderData._id)
			.then(() => {
				navigate(ROUTES.cpOrders);
			})
			.catch((error) => {
				setError(error);
			});
	};

	if (isLoading)
		return (
			<div className={style.cp_container}>
				<CpSidenav />
				<Loading />
			</div>
		);
	else if (error)
		return (
			<div className={style.cp_container}>
				<CpSidenav />
				<Error />
			</div>
		);
	else if (!orderData)
		return (
			<div className={style.cp_container}>
				<CpSidenav />
				<NoResults />
			</div>
		);
	else if (UiStore.currentUser && UiStore.currentUser.role == "admin") {
		return (
			<div className={style.cp_container}>
				<CpSidenav />
				<div className={style.cp_main}>
					<div>
						<p>
							<span className={style.info__label}>Datum</span>:{" "}
							{format(parseISO(orderData.createdAt), "dd/MM/yyyy")}
						</p>
						<p>
							<span className={style.info__label}>Gebruiker</span>:{" "}
							{orderData.user?.firstname} {orderData.user?.lastname}
						</p>
						<p>
							<span className={style.info__label}>Adres</span>:
						</p>
						<p>{orderData.user?.street_number}</p>
						<p>
							{orderData.user?.postal_code} {orderData.user?.city}
						</p>
						<p>{orderData.user?.country}</p>
						<p>
							<span className={style.info__label}>Bestelling</span>:
						</p>
						{orderData.products && orderData.products.length !== 0 ? (
							orderData.products.map((product: Product) => {
								return (
									<div key={`product_${product._id}`}>{product.title}</div>
								);
							})
						) : (
							<NoResults />
						)}
					</div>
					<form className={style.cp_form} onSubmit={handleEdit}>
						<label htmlFor="status" className={style.cp_form__label}>
							Status
						</label>
						<select
							name="status"
							id="status"
							className={style.cp_form__input}
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							required
						>
							<option value="besteld">Besteld</option>
							<option value="verwerkt">Verwerkt</option>
							<option value="verzonden">Verzonden</option>
						</select>
						<div className={style.cp_form__buttons}>
							<Link to={ROUTES.cpOrders} className={style.cp_form__cancel}>
								Annuleren
							</Link>
							<div className={style.cp_form__buttons_right}>
								<button
									className={style.cp_form__delete}
									onClick={handleDelete}
								>
									Delete
								</button>
								<button className={style.cp_form__save} type="submit">
									Opslaan
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	} else return <Error />;
};

export default CpOrderDetail;

import style from "./CpOrders.module.css";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { format, parseISO } from "date-fns";

import ROUTES from "../../../consts/Routes";
import { Order, getOrders } from "../../../services/OrderService";
import { useAuthContext } from "../../../contexts/AuthContainer";
import { API } from "../../../services/ApiService";
import useStores from "../../../hooks/useStores";
import { User, getUserById } from "../../../services/AuthService";

import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import NoResults from "../../../components/NoResults/NoResults";
import CpSidenav from "../../../components/Sidenav/CpSidenav";

// Type order with user
interface OrderWithUser extends Order {
	user?: User;
}

const CpOrders = () => {
	const navigate = useNavigate();

	const [orderData, setOrderData] = useState<OrderWithUser[]>([]);
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

			setIsLoading(true);
			// Get orders with user data when available
			getOrders()
				.then(async ({ data }) => {
					const ordersWithUsers: OrderWithUser[] = await Promise.all(
						data.map(async (order: Order) => {
							if (order.userId) {
								try {
									const userResponse = await getUserById(order.userId);
									return { ...order, user: userResponse.data };
								} catch (error) {
									console.error("Error fetching user details", error);
									return order;
								}
							} else {
								return order;
							}
						})
					);
					setOrderData(ordersWithUsers);
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error);
					setIsLoading(false);
				});
		}
	}, [token, logout]);

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
					<table className={style.table}>
						<thead>
							<th className={style.table__header}>Datum</th>
							<th className={style.table__header}>Gebruiker</th>
							<th className={style.table__header}>Status</th>
						</thead>
						<tbody>
							{orderData.length !== 0 ? (
								orderData.map((order: Order) => {
									return (
										<tr className={style.table__row} key={`order_${order._id}`}>
											<td className={style.table__row_data}>
												{format(parseISO(order.createdAt), "dd/MM/yyyy")}
											</td>
											<td className={style.table__row_data}>
												{order.user?.firstname}
											</td>
											<td className={style.table__row_data}>{order.status}</td>
											<button className={style.table__row_btn}>
												<Link
													to={`${ROUTES.cpOrderDetail.to}${order._id}`}
													className={style.table__row_btn_link}
												>
													Bekijk
												</Link>
											</button>
										</tr>
									);
								})
							) : (
								<NoResults />
							)}
						</tbody>
					</table>
				</div>
			</div>
		);
	} else return <Error />;
};

export default CpOrders;

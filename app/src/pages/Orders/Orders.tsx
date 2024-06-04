import style from "./Order.module.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { format, parseISO } from "date-fns";

import { Order, getOrdersByUser } from "../../services/OrderService";
import { useAuthContext } from "../../contexts/AuthContainer";
import useStores from "../../hooks/useStores";
import { API } from "../../services/ApiService";
import ROUTES from "../../consts/Routes";

import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import NoResults from "../../components/NoResults/NoResults";
import Sidenav from "../../components/Sidenav/Sidenav";

const Orders = () => {
	const [orderData, setOrderData] = useState<Order[]>([]);
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

			// Get orders of current user
			setIsLoading(true);
			if (UiStore.currentUser) {
				let filters = { userId: UiStore.currentUser?._id };
				getOrdersByUser(filters)
					.then(async ({ data }) => {
						setOrderData(data);
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
				<div className={style.main}>
					<table className={style.table}>
						<thead>
							<th className={style.table__header}>Datum</th>
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
											<td className={style.table__row_data}>{order.status}</td>
											<button className={style.table__row_btn}>
												<Link
													to={`${ROUTES.orderDetail.to}${order._id}`}
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
};

export default Orders;

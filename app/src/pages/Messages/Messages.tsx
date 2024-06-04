import { useEffect, useState } from "react";
import Sidenav from "../../components/Sidenav/Sidenav";
import style from "./Message.module.css";
import { Message, getMessagesByUser } from "../../services/MessageService";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContainer";
import useStores from "../../hooks/useStores";
import { API } from "../../services/ApiService";
import { AxiosError, AxiosResponse } from "axios";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import { format, parseISO } from "date-fns";
import ROUTES from "../../consts/Routes";
import NoResults from "../../components/NoResults/NoResults";
import { Product, getProductById } from "../../services/ProductService";

// Type message with product
interface MessageWithProduct extends Message {
	product?: Product;
}

const Messages = () => {
	const [messageData, setMessageData] = useState<MessageWithProduct[]>([]);
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

			// Get messages of current user and product data of message when available
			setIsLoading(true);
			if (UiStore.currentUser) {
				let filters = { userId: UiStore.currentUser?._id };
				getMessagesByUser(filters)
					.then(async ({ data }) => {
						const messagesWithProducts: MessageWithProduct[] =
							await Promise.all(
								data.map(async (message: Message) => {
									if (message.productId) {
										try {
											const userResponse = await getProductById(
												message.productId
											);
											return { ...message, product: userResponse.data };
										} catch (error) {
											console.error("Error fetching user details", error);
											return message;
										}
									} else {
										return message;
									}
								})
							);
						setMessageData(messagesWithProducts);
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
	else if (!messageData)
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
							<th className={style.table__header}>Product</th>
							<th className={style.table__header}>Bericht</th>
						</thead>
						<tbody>
							{messageData.length !== 0 ? (
								messageData.map((message: Message) => {
									return (
										<tr
											className={style.table__row}
											key={`message_${message._id}`}
										>
											<td className={style.table__row_data}>
												{format(parseISO(message.createdAt), "dd/MM/yyyy")}
											</td>
											<td className={style.table__row_data}>
												{message.product?.title || ""}
											</td>
											<td className={style.table__row_data}>
												{message.message}
											</td>
											<button className={style.table__row_btn}>
												<Link
													to={`${ROUTES.messageDetail.to}${message._id}`}
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

export default Messages;

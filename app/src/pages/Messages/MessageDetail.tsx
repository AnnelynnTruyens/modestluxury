import style from "./Message.module.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { AxiosError, AxiosResponse } from "axios";

import { Message, getMessageById } from "../../services/MessageService";
import { Product, getProductById } from "../../services/ProductService";
import { useAuthContext } from "../../contexts/AuthContainer";
import useStores from "../../hooks/useStores";
import { API } from "../../services/ApiService";

import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import NoResults from "../../components/NoResults/NoResults";
import Sidenav from "../../components/Sidenav/Sidenav";

// Type message with product
interface MessageWithProduct extends Message {
	product?: Product;
}

const MessageDetail = () => {
	const [messageData, setMessageData] = useState<MessageWithProduct | null>(
		null
	);
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { token, logout } = useAuthContext();
	const { UiStore } = useStores();

	// Get messageId from URL
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

			// Get message by id and product data if available when userId for message is userId of current user
			if (id && UiStore.currentUser) {
				setIsLoading(true);
				getMessageById(id)
					.then(async ({ data }) => {
						let productResponse = null;

						try {
							if (data.productId) {
								productResponse = await getProductById(data.productId);
							}
						} catch (error) {
							console.error("Error fetching product details", error);
						}
						if (data.userId == UiStore.currentUser?._id) {
							setMessageData({
								...data,
								product: productResponse ? productResponse.data : undefined,
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
					<div>
						<p>Bericht: {messageData.message}</p>
						<p>
							Datum: {format(parseISO(messageData.createdAt), "dd/MM/yyyy")}
						</p>
						<p>
							Product: {messageData.product?.title || "Geen product gevonden"}
						</p>
					</div>
				</div>
			</div>
		);
};

export default MessageDetail;

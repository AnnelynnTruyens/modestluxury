import style from "./CpMessages.module.css";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { format, parseISO } from "date-fns";

import {
	Message,
	deleteMessage,
	getMessageById,
	updateMessage,
} from "../../../services/MessageService";
import { API } from "../../../services/ApiService";
import { User, getUserById } from "../../../services/AuthService";
import { Product, getProductById } from "../../../services/ProductService";
import { useAuthContext } from "../../../contexts/AuthContainer";
import useStores from "../../../hooks/useStores";
import ROUTES from "../../../consts/Routes";

import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import NoResults from "../../../components/NoResults/NoResults";
import CpSidenav from "../../../components/Sidenav/CpSidenav";

// Type message with user and product
interface MessageWithUserAndProduct extends Message {
	user?: User;
	product?: Product;
}

const CpMessageDetail = () => {
	const navigate = useNavigate();

	const [messageData, setMessageData] =
		useState<MessageWithUserAndProduct | null>(null);
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { token, logout } = useAuthContext();
	const { UiStore } = useStores();

	// Get the productId out of the URL
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

			if (id) {
				setIsLoading(true);
				// Get message by id and set user and product data when available
				getMessageById(id)
					.then(async ({ data }) => {
						let userResponse = null;
						let productResponse = null;

						try {
							if (data.userId) {
								userResponse = await getUserById(data.userId);
							}
							if (data.productId) {
								productResponse = await getProductById(data.productId);
							}
						} catch (error) {
							console.error("Error fetching user or product details", error);
						}
						setMessageData({
							...data,
							user: userResponse ? userResponse.data : undefined,
							product: productResponse ? productResponse.data : undefined,
						});

						setIsLoading(false);
					})
					.catch((error) => {
						setError(error);
						setIsLoading(false);
					});
			}
		}
	}, [token, logout]);

	// Function to update a message
	const handleEdit = (e: React.FormEvent) => {
		if (!messageData || !messageData._id) {
			return;
		}

		e.preventDefault();

		const messageBody = {
			createdAt: messageData.createdAt,
			userId: messageData.userId,
			message: messageData.message,
			status: "beantwoord",
		};

		setIsLoading(true);
		updateMessage(messageData._id, messageBody)
			.then(() => {
				setIsLoading(false);
				navigate(ROUTES.cpMessages);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	// Function to send email to sender of the message
	const SendEmail = () => {
		if (!messageData || !messageData._id) {
			return;
		}

		const email = messageData.user?.email;
		const subject = "Contactformulier ModestLuxury";

		window.location.href = `mailto:${email}?subject=${encodeURIComponent(
			subject
		)}`;
	};

	// Function to delete a message
	const handleDelete = () => {
		if (!messageData || !messageData._id) {
			return;
		}

		deleteMessage(messageData._id)
			.then(() => {
				navigate(ROUTES.cpMessages);
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
	else if (!messageData)
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
							<span className={style.info__label}>Bericht</span>:{" "}
							{messageData.message}
						</p>
						<p>
							<span className={style.info__label}>Datum</span>:{" "}
							{format(parseISO(messageData.createdAt), "dd/MM/yyyy")}
						</p>
						<p>
							<span className={style.info__label}>Product</span>:{" "}
							{messageData.product?.title || "Geen product gevonden"}
						</p>
						<p>
							<span className={style.info__label}>Gebruiker</span>:{" "}
							{`${messageData.user?.firstname} ${messageData.user?.lastname}` ||
								"Geen gebruiker gevonden"}
						</p>
					</div>
					<form className={style.cp_form} onSubmit={handleEdit}>
						<div className={style.cp_form__buttons}>
							<Link to={ROUTES.cpMessages} className={style.cp_form__cancel}>
								Annuleren
							</Link>
							<div className={style.cp_form__buttons_right}>
								<button
									className={style.cp_form__delete}
									onClick={handleDelete}
								>
									Delete
								</button>
								<button
									className={style.cp_form__save}
									type="submit"
									onClick={SendEmail}
								>
									Beantwoorden
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	} else return <Error />;
};

export default CpMessageDetail;

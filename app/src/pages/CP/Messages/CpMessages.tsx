import style from "./CpMessages.module.css";

import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

import { Message, getMessages } from "../../../services/MessageService";
import { useAuthContext } from "../../../contexts/AuthContainer";
import { API } from "../../../services/ApiService";
import ROUTES from "../../../consts/Routes";
import useStores from "../../../hooks/useStores";
import { User, getUserById } from "../../../services/AuthService";

import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import NoResults from "../../../components/NoResults/NoResults";
import CpSidenav from "../../../components/Sidenav/CpSidenav";

// Type message with user
interface MessageWithUser extends Message {
	user?: User;
}

const CpMessages = () => {
	const navigate = useNavigate();

	const [messageData, setMessageData] = useState<MessageWithUser[]>([]);
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
			// get messages with user data when available
			getMessages()
				.then(async ({ data }) => {
					const messagesWithUsers: MessageWithUser[] = await Promise.all(
						data.map(async (message: Message) => {
							if (message.userId) {
								try {
									const userResponse = await getUserById(message.userId);
									return { ...message, user: userResponse.data };
								} catch (error) {
									console.error("Error fetching user details", error);
									return message;
								}
							} else {
								return message;
							}
						})
					);
					setMessageData(messagesWithUsers);
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
					<table className={style.table}>
						<thead>
							<th className={style.table__header}>Datum</th>
							<th className={style.table__header}>Gebruiker</th>
							<th className={style.table__header}>Bericht</th>
							<th className={style.table__header}>Status</th>
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
												{message.user?.firstname || "Unknown"}
											</td>
											<td className={style.table__row_data}>
												{message.message}
											</td>
											<td className={style.table__row_data}>
												{message.status}
											</td>
											<button className={style.table__row_btn}>
												<Link
													to={`${ROUTES.cpMessageDetail.to}${message._id}`}
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

export default CpMessages;

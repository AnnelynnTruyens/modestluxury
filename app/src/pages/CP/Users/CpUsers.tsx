import style from "./CpUsers.module.css";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import ROUTES from "../../../consts/Routes";
import { useAuthContext } from "../../../contexts/AuthContainer";
import { API } from "../../../services/ApiService";
import { User, getUsers } from "../../../services/AuthService";
import useStores from "../../../hooks/useStores";

import CpSidenav from "../../../components/Sidenav/CpSidenav";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import NoResults from "../../../components/NoResults/NoResults";

const CpUsers = () => {
	const navigate = useNavigate();

	const [userData, setUserData] = useState<User[]>();
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
			// Get all users
			getUsers()
				.then(({ data }) => {
					setUserData(data);
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
	else if (!userData)
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
					<button className={style.button__new}>
						<Link to={ROUTES.cpUserCreate} className={style.button__new_link}>
							Nieuwe gebruiker
						</Link>
					</button>
					<table className={style.table}>
						<thead>
							<th className={style.table__header}>Voornaam</th>
							<th className={style.table__header}>Achternaam</th>
							<th className={style.table__header}>Email</th>
							<th className={style.table__header}>Rol</th>
						</thead>
						<tbody>
							{userData.length !== 0 ? (
								userData.map((user: User) => {
									return (
										<tr className={style.table__row} key={`user_${user._id}`}>
											<td className={style.table__row_data}>
												{user.firstname}
											</td>
											<td className={style.table__row_data}>{user.lastname}</td>
											<td className={style.table__row_data}>{user.email}</td>
											<td className={style.table__row_data}>{user.role}</td>
											<button className={style.table__row_btn}>
												<Link
													to={`${ROUTES.cpUserDetail.to}${user._id}`}
													className={style.table__row_btn_link}
												>
													Bewerk
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

export default CpUsers;

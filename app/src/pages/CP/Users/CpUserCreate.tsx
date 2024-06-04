import style from "./CpUsers.module.css";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import { useAuthContext } from "../../../contexts/AuthContainer";
import { API } from "../../../services/ApiService";
import { register } from "../../../services/AuthService";
import ROUTES from "../../../consts/Routes";
import useStores from "../../../hooks/useStores";

import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import CpSidenav from "../../../components/Sidenav/CpSidenav";

const CpUserCreate = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState<string>("");
	const [firstname, setFirstname] = useState<string>("");
	const [lastname, setLastname] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [role, setRole] = useState<string>("user");
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { token, logout } = useAuthContext();
	const { UiStore } = useStores();

	// Type registerUser to send with API call
	const registerUser = {
		email: email,
		firstname: firstname,
		lastname: lastname,
		password: password,
		role: role,
	};

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

	// Function to add new user
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			email == "" ||
			firstname == "" ||
			lastname == "" ||
			password == "" ||
			role == ""
		) {
			return;
		}

		// Set authorization header for API
		API.interceptors.request.use((config) => {
			if (token) {
				config.headers["Authorization"] = `Bearer ${token}`;
			}
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
		register(registerUser)
			.then(() => {
				setIsLoading(false);
				navigate(ROUTES.cpUsers);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
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
	else if (UiStore.currentUser && UiStore.currentUser.role == "admin") {
		return (
			<div className={style.cp_container}>
				<CpSidenav />
				<div className={style.cp_main}>
					<form className={style.cp_form} onSubmit={handleSubmit}>
						<label htmlFor="firstname" className={style.cp_form__label}>
							Voornaam
						</label>
						<input
							name="firstname"
							id="firstname"
							className={style.cp_form__input}
							value={firstname}
							onChange={(e) => setFirstname(e.target.value)}
							required
						></input>
						<label htmlFor="lastname" className={style.cp_form__label}>
							Achternaam
						</label>
						<input
							name="lastname"
							id="lastname"
							className={style.cp_form__input}
							value={lastname}
							onChange={(e) => setLastname(e.target.value)}
							required
						></input>
						<label htmlFor="email" className={style.cp_form__label}>
							Email
						</label>
						<input
							name="email"
							id="email"
							type="email"
							className={style.cp_form__input}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						></input>
						<label htmlFor="password" className={style.cp_form__label}>
							Wachtwoord
						</label>
						<input
							name="password"
							id="password"
							className={style.cp_form__input}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						></input>
						<label htmlFor="role" className={style.cp_form__label}>
							Rol
						</label>
						<select
							name="role"
							id="role"
							className={style.cp_form__input}
							onChange={(e) => setRole(e.target.value)}
							value={role}
							required
						>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
						<div className={style.cp_form__buttons}>
							<Link to={ROUTES.cpUsers} className={style.cp_form__cancel}>
								Annuleren
							</Link>
							<div className={style.cp_form__buttons_right}>
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

export default CpUserCreate;

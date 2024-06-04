import style from "./CpUsers.module.css";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import {
	User,
	deleteUser,
	getUserById,
	updateUser,
} from "../../../services/AuthService";
import { useAuthContext } from "../../../contexts/AuthContainer";
import { API } from "../../../services/ApiService";
import ROUTES from "../../../consts/Routes";
import useStores from "../../../hooks/useStores";

import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import NoResults from "../../../components/NoResults/NoResults";
import CpSidenav from "../../../components/Sidenav/CpSidenav";

const CpUserDetail = () => {
	const navigate = useNavigate();

	const [userData, setUserData] = useState<User>();
	const [email, setEmail] = useState<string>("");
	const [firstname, setFirstname] = useState<string>("");
	const [lastname, setLastname] = useState<string>("");
	const [phone, setPhone] = useState<string>();
	const [streetNumber, setStreetNumber] = useState<string>();
	const [postalCode, setPostalCode] = useState<string>();
	const [city, setCity] = useState<string>();
	const [country, setCountry] = useState<string>();
	const [role, setRole] = useState<string>("user");
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { token, logout } = useAuthContext();
	const { UiStore } = useStores();

	// Get the userId out of the URL
	const { id } = useParams();

	// Type userBody to send API call
	const userBody = {
		email: email,
		firstname: firstname,
		lastname: lastname,
		phone: phone,
		street_number: streetNumber,
		postal_code: postalCode,
		city: city,
		country: country,
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
				// Get user by id and set user data for form
				getUserById(id)
					.then(({ data }) => {
						setUserData(data);
						setEmail(data.email);
						setFirstname(data.firstname);
						setLastname(data.lastname);
						setPhone(data.phone);
						setStreetNumber(data.street_number);
						setPostalCode(data.postal_code);
						setCity(data.city);
						setCountry(data.country);
						setRole(data.role);
						setIsLoading(false);
					})
					.catch((error) => {
						setError(error);
						setIsLoading(false);
					});
			}
		}
	}, [token, logout]);

	// Function to edit user
	const handleEdit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!userData || !userData._id) {
			return;
		}

		setIsLoading(true);
		updateUser(userData._id, userBody)
			.then(() => {
				setIsLoading(false);
				navigate(ROUTES.cpUsers);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	// Function to delete user
	const handleDelete = () => {
		if (!userData || !userData._id) {
			return;
		}

		deleteUser(userData._id)
			.then(() => {
				navigate(ROUTES.cpUsers);
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
					<form className={style.cp_form} onSubmit={handleEdit}>
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
							<option value="user" selected={role == "user" ? true : false}>
								User
							</option>
							<option value="admin" selected={role == "admin" ? true : false}>
								Admin
							</option>
						</select>
						<div className={style.cp_form__buttons}>
							<Link to={ROUTES.cpUsers} className={style.cp_form__cancel}>
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

export default CpUserDetail;

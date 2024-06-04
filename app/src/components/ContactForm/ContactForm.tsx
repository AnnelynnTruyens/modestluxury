import style from "./ContactForm.module.css";

import { useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import { useAuthContext } from "../../contexts/AuthContainer";
import useStores from "../../hooks/useStores";
import ROUTES from "../../consts/Routes";
import { API } from "../../services/ApiService";
import { createMessage } from "../../services/MessageService";

import Loading from "../Loading/Loading";
import Error from "../Error/Error";

const ContactForm = () => {
	const navigate = useNavigate();

	const [message, setMessage] = useState<string>("");
	const [userId, setUserId] = useState<string>("");
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [error, setError] = useState<Error | undefined>();

	const { token } = useAuthContext();
	const { UiStore } = useStores();

	// Get productId from URL
	const { id } = useParams<{ id: string }>();

	// Define messageBody to send with API call to send message
	const messageBody = {
		message: message,
		productId: id,
		userId: userId,
		status: "onbeantwoord",
	};

	// Function to handle sending the contactform
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (message == "") {
			return;
		}

		// Redirect user to login page if not logged in, set userId if logged in
		if (!UiStore.currentUser) {
			navigate(ROUTES.login);
		} else {
			setUserId(UiStore.currentUser._id);
		}

		// Set authorization header for API call
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
					redirect(ROUTES.login);
				}
				return Promise.reject(error);
			}
		);

		// API call for sending the contactform
		setIsLoading(true);
		createMessage(messageBody)
			.then(() => {
				setIsLoading(false);
				navigate(ROUTES.messages);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	if (isLoading) return <Loading />;
	else if (error) return <Error />;
	else
		return (
			<div className={style.container}>
				<div className={style.heading}>Stel hier je vraag</div>
				<form onSubmit={handleSubmit} className={style.form}>
					<textarea
						name="message"
						id="message"
						className={style.form__textarea}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						required
					></textarea>
					<button type="submit" className={style.form__btn}>
						Verzenden
					</button>
				</form>
			</div>
		);
};

export default ContactForm;

import style from "./Register.module.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ROUTES from "../../consts/Routes";
import { login, register } from "../../services/AuthService";

import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

// Type register component
interface RegisterProps {
	onLogin: (token: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "user",
	});
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [error, setError] = useState<Error | undefined>();

	const { firstname, lastname, email, password, confirmPassword, role } =
		formData;

	// Function to handle in register form
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Function to handle register
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setIsLoading(true);
		register({ firstname, lastname, email, password, role })
			.then(() => {
				login({ email, password })
					.then(({ data }) => {
						onLogin(data.token);
						navigate(ROUTES.home);
						setIsLoading(false);
					})
					.catch((error) => {
						setError(error);
						navigate(ROUTES.login);
						setIsLoading(false);
					});
			})
			.catch((error) => {
				setError(error);
				navigate(ROUTES.register);
				setIsLoading(false);
			});
	};

	if (isLoading) return <Loading />;
	else if (error) return <Error />;
	else
		return (
			<div className={style.register_container}>
				<h1 className={style.register__heading}>Registreer</h1>
				<form onSubmit={handleSubmit} className={style.register__form}>
					<label htmlFor="firstname" className={style.register__form_label}>
						Voornaam:
					</label>
					<input
						type="text"
						id="firstname"
						name="firstname"
						value={firstname}
						onChange={handleChange}
						className={style.register__form_input}
						required
					/>
					<label htmlFor="lastname" className={style.register__form_label}>
						Achternaam:
					</label>
					<input
						type="text"
						id="lastname"
						name="lastname"
						value={lastname}
						onChange={handleChange}
						className={style.register__form_input}
						required
					/>
					<label htmlFor="email" className={style.register__form_label}>
						Email:
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={handleChange}
						className={style.register__form_input}
						required
					/>
					<label htmlFor="password" className={style.register__form_label}>
						Wachtwoord:
					</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={handleChange}
						className={style.register__form_input}
						required
					/>
					<label
						htmlFor="confirmPassword"
						className={style.register__form_label}
					>
						Herhaal wachtwoord:
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						value={confirmPassword}
						onChange={handleChange}
						className={style.register__form_input}
						required
					/>
					<div className={style.form__buttons}>
						<button type="submit" className={style.register_btn}>
							Registreer
						</button>
						<Link to={ROUTES.login} className={style.login_link}>
							Al een account? Log hier in!
						</Link>
					</div>
				</form>
			</div>
		);
};

export default Register;

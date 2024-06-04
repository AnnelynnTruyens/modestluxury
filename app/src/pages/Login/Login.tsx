import style from "./Login.module.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../services/AuthService";
import ROUTES from "../../consts/Routes";

import Loading from "../../components/Loading/Loading";

// Type login component
interface LoginProps {
	onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
	const navigate = useNavigate();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState<Boolean>(false);

	// Function to handle login
	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();

		setIsLoading(true);
		if (email !== "" && password !== "") {
			login({ email, password })
				.then(({ data }) => {
					onLogin(data.token);
					setIsLoading(false);
				})
				.catch((error) => {
					console.error(error.message);
					navigate(ROUTES.login);
					setIsLoading(false);
				});
		}
	};

	// Function to show password
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	if (isLoading) return <Loading />;
	else
		return (
			<div className={style.login_container}>
				<h1 className={style.login__heading}>Login</h1>
				<form className={style.login__form} onSubmit={handleLogin}>
					<label htmlFor="email" className={style.login__form_label}>
						Email:
					</label>
					<input
						type="text"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={style.login__form_input}
						required
					/>

					<label htmlFor="password" className={style.login__form_label}>
						Wachtwoord:
					</label>
					<input
						type={showPassword ? "text" : "password"}
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={style.login__form_input}
						required
					/>

					<label htmlFor="showPassword" className={style.login__form_label}>
						<input
							type="checkbox"
							id="showPassword"
							checked={showPassword}
							onChange={togglePasswordVisibility}
						/>
						Toon wachtwoord
					</label>

					<div className={style.form__buttons}>
						<button type="submit" className={style.login_btn}>
							Login
						</button>
						<Link to={ROUTES.register} className={style.register_link}>
							Nog geen account? Registreer hier.
						</Link>
					</div>
				</form>
			</div>
		);
};

export default Login;

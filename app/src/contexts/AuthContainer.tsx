import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import ROUTES from "../consts/Routes";
import useStores from "../hooks/useStores";
import { API } from "../services/ApiService";
import { getCurrentUser } from "../services/AuthService";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Home from "../pages/Home/Home";
import Categories from "../pages/Categories/Categories";
import Products from "../pages/Products/Products";
import ProductDetail from "../pages/Products/ProductDetail";
import AboutUs from "../pages/AboutUs/AboutUs";
import Shipment from "../pages/Shipment/Shipment";
import Privacy from "../pages/Privacy/Privacy";

import Loading from "../components/Loading/Loading";
import Error from "../components/Error/Error";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

// Define key for saving token in localStorage
const key = "AUTH_TOKEN";

// Type the context and container
interface AuthContextType {
	token: string | null;
	logout: () => void;
}

interface AuthContainerProps {
	children: ReactNode;
}

// Create context for authentication
const AuthContext = createContext<AuthContextType>({
	token: null,
	logout: () => {},
} as AuthContextType);

// Function to get token from localStorage
const getTokenFromStorage = (): string | null => {
	return localStorage.getItem(key);
};

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
	const navigate = useNavigate();
	// Get user when loading page
	const [token, setToken] = useState<string | null>(getTokenFromStorage());
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [error, setError] = useState<Error | undefined>();

	// Import UiStore to save current user
	const { UiStore } = useStores();

	// useEffect to save changes to token in localStorage
	useEffect(() => {
		if (token) {
			localStorage.setItem(key, token);
		} else {
			localStorage.removeItem(key);
		}
	}, [token]);

	// Set authorization header for API and get current user
	useEffect(() => {
		if (token) {
			setIsLoading(true);
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
						handleLogout();
					}
					return Promise.reject(error);
				}
			);

			getCurrentUser()
				.then(({ data }) => {
					UiStore.setCurrentUser(data);
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error);
					setIsLoading(false);
				});
			console.log(UiStore.currentUser);
		}
	}, [token, UiStore]);

	// Logout function
	const handleLogout = () => {
		setToken(null);
		UiStore.setCurrentUser(undefined);
		navigate(ROUTES.home);
	};

	// Login function
	const handleLogin = (token: string) => {
		setToken(token);
		setIsLoading(true);
	};

	if (isLoading) return <Loading />;
	else if (error) return <Error />;
	else
		return (
			<AuthContext.Provider value={{ token, logout: handleLogout }}>
				{token ? (
					children
				) : (
					<>
						<Header />
						<Routes>
							<Route
								path={ROUTES.login}
								element={<Login onLogin={handleLogin} />}
							/>
							<Route
								path={ROUTES.register}
								element={<Register onLogin={handleLogin} />}
							/>
							<Route
								path={ROUTES.notFound}
								element={<Login onLogin={handleLogin} />}
							/>
							<Route path={ROUTES.home} element={<Home />} />
							<Route path={ROUTES.categories} element={<Categories />} />
							<Route
								path={ROUTES.categoryOverview.path}
								element={<Products />}
							/>
							<Route path={ROUTES.products} element={<Products />} />
							<Route
								path={ROUTES.productDetail.path}
								element={<ProductDetail />}
							/>
							<Route path={ROUTES.aboutUs} element={<AboutUs />} />
							<Route path={ROUTES.shipment} element={<Shipment />} />
							<Route path={ROUTES.privacy} element={<Privacy />} />
						</Routes>
						<Footer />
					</>
				)}
			</AuthContext.Provider>
		);
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContainer;

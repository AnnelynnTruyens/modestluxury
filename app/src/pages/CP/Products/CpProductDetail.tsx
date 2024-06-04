import style from "./CpProducts.module.css";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import ROUTES from "../../../consts/Routes";
import {
	Product,
	deleteProduct,
	getProductById,
	updateProduct,
} from "../../../services/ProductService";
import { useAuthContext } from "../../../contexts/AuthContainer";
import { API } from "../../../services/ApiService";
import useStores from "../../../hooks/useStores";

import CpSidenav from "../../../components/Sidenav/CpSidenav";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import NoResults from "../../../components/NoResults/NoResults";

const CpProductDetail = () => {
	const navigate = useNavigate();

	const [productData, setProductData] = useState<Product | null>(null);
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [price, setPrice] = useState<string>("");
	const [categoryId, setCategoryId] = useState<string | undefined>();
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [error, setError] = useState<Error | undefined>();

	const { token, logout } = useAuthContext();
	const { UiStore } = useStores();

	// Get the productId out of the URL
	const { id } = useParams<{ id: string }>();

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
			if (id) {
				setIsLoading(true);
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

				// Get product by id and set product data for form
				getProductById(id)
					.then(({ data }) => {
						setProductData(data);
						setTitle(data.title);
						setDescription(data.description);
						setPrice(data.price);
						setCategoryId(data.categoryId);
						setIsLoading(false);
					})
					.catch((error) => {
						setError(error);
						setIsLoading(false);
					});
			}
		}
	}, [id, token]);

	// Type productBody to send with API call
	const productBody = {
		title: title,
		description: description,
		price: price,
		categoryId: categoryId,
	};

	// Function to edit a product
	const handleEdit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!productData || !productData._id) {
			return;
		}

		setIsLoading(true);
		updateProduct(productData._id, productBody)
			.then(() => {
				setIsLoading(false);
				navigate(ROUTES.cpProducts);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	// Function to delete a product
	const handleDelete = () => {
		if (!productData || !productData._id) {
			return;
		}

		deleteProduct(productData._id)
			.then(() => {
				navigate(ROUTES.cpProducts);
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
	else if (!productData)
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
						<input
							name="title"
							id="title"
							className={style.cp_form__title}
							placeholder="Titel"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						></input>
						<label htmlFor="description" className={style.cp_form__label}>
							Beschrijving
						</label>
						<textarea
							name="description"
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className={style.cp_form__textarea}
							required
						></textarea>
						<label htmlFor="price" className={style.cp_form__label}>
							Prijs
						</label>
						<p className={style.cp_form__currency}>€</p>
						<input
							type="number"
							name="price"
							id="price"
							className={(style.cp_form__input, style.cp_form__price)}
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							required
						/>
						<label htmlFor="category" className={style.cp_form__label}>
							Categorie
						</label>
						<select
							name="category"
							id="category"
							className={style.cp_form__input}
							onChange={(e) => setCategoryId(e.target.value)}
							required
						>
							<option disabled selected>
								Kies categorie
							</option>
							<option
								value="665c343e1403dcd940f3e155"
								selected={
									categoryId == "665c343e1403dcd940f3e155" ? true : false
								}
							>
								Jurken
							</option>
							<option
								value="665c34451403dcd940f3e158"
								selected={
									categoryId == "665c34451403dcd940f3e158" ? true : false
								}
							>
								Blouses
							</option>
							<option
								value="665c344b1403dcd940f3e15b"
								selected={
									categoryId == "665c344b1403dcd940f3e15b" ? true : false
								}
							>
								Truien
							</option>
							<option
								value="665c34521403dcd940f3e161"
								selected={
									categoryId == "665c34521403dcd940f3e161" ? true : false
								}
							>
								Rokken
							</option>
							<option
								value="665c34591403dcd940f3e164"
								selected={
									categoryId == "665c34591403dcd940f3e164" ? true : false
								}
							>
								Broeken
							</option>
						</select>
						<div className={style.cp_form__buttons}>
							<Link to={ROUTES.cpProducts} className={style.cp_form__cancel}>
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

export default CpProductDetail;

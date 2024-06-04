import style from "./CpProducts.module.css";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import ROUTES from "../../../consts/Routes";
import { Product, getProducts } from "../../../services/ProductService";
import { useAuthContext } from "../../../contexts/AuthContainer";
import { API } from "../../../services/ApiService";
import useStores from "../../../hooks/useStores";
import { Category, getCategoryById } from "../../../services/CategoryService";

import CpSidenav from "../../../components/Sidenav/CpSidenav";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import NoResults from "../../../components/NoResults/NoResults";

// Type product with category
interface ProductWithCategory extends Product {
	category?: Category;
}

const CpProducts = () => {
	const navigate = useNavigate();

	const [productData, setProductData] = useState<ProductWithCategory[]>([]);
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
			// Set authorization header for API call
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
			// Get products with category data when available
			getProducts()
				.then(async ({ data }) => {
					const productsWithCategory: ProductWithCategory[] = await Promise.all(
						data.map(async (product: Product) => {
							if (product.categoryId) {
								try {
									const categoryResponse = await getCategoryById(
										product.categoryId
									);
									return { ...product, category: categoryResponse.data };
								} catch (error) {
									console.error("Error fetching category details", error);
									return product;
								}
							} else {
								return product;
							}
						})
					);
					setProductData(productsWithCategory);
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
					<button className={style.button__new}>
						<Link
							to={ROUTES.cpProductCreate}
							className={style.button__new_link}
						>
							Nieuw product
						</Link>
					</button>
					<table className={style.table}>
						<thead>
							<th className={style.table__header}>Product</th>
							<th className={style.table__header}>Beschrijving</th>
							<th className={style.table__header}>Prijs</th>
							<th className={style.table__header}>Categorie</th>
						</thead>
						<tbody>
							{productData.length !== 0 ? (
								productData.map((product: Product) => {
									return (
										<tr
											className={style.table__row}
											key={`product_${product._id}`}
										>
											<td className={style.table__row_data}>{product.title}</td>
											<td className={style.table__row_data}>
												{product.description}
											</td>
											<td className={style.table__row_data}>{product.price}</td>
											<td className={style.table__row_data}>
												{product.category?.name}
											</td>
											<button className={style.table__row_btn}>
												<Link
													to={`${ROUTES.cpProductDetail.to}${product._id}`}
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

export default CpProducts;

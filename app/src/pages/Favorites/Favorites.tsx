import style from "./Favorites.module.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

import { Favorite, getFavoritesByUser } from "../../services/FavoriteService";
import useStores from "../../hooks/useStores";
import { useAuthContext } from "../../contexts/AuthContainer";
import ROUTES from "../../consts/Routes";
import { API } from "../../services/ApiService";
import { Product, getProductById } from "../../services/ProductService";

import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import NoResults from "../../components/NoResults/NoResults";

// Type favorite with product
interface FavoriteWithProduct extends Favorite {
	product?: Product;
}

const Favorites = () => {
	const [favoritesData, setFavoritesData] = useState<
		FavoriteWithProduct[] | null
	>(null);
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
		};

		waitForUser();
	}, [UiStore]);

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

			// Get favorites by user with product data
			setIsLoading(true);
			getFavoritesByUser()
				.then(async ({ data }) => {
					const favoritesWithProduct: FavoriteWithProduct[] = await Promise.all(
						data.map(async (favorite: Favorite) => {
							if (favorite.userId) {
								try {
									const productResponse = await getProductById(
										favorite.productId
									);
									return { ...favorite, product: productResponse.data };
								} catch (error) {
									console.error("Error fetching product details", error);
									return favorite;
								}
							} else {
								return favorite;
							}
						})
					);
					setFavoritesData(favoritesWithProduct);
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error);
					setIsLoading(false);
				});
		}
	}, [token, logout]);

	if (isLoading) return <Loading />;
	else if (error) return <Error />;
	else
		return (
			<div className={style.container}>
				<h1>Mijn favorieten</h1>
				<div className={style.products}>
					{favoritesData && favoritesData.length !== 0 ? (
						favoritesData.map((favorite: Favorite) => {
							return (
								<Link
									to={`${ROUTES.productDetail.to}${favorite.productId}`}
									className={style.product__card}
									key={`favorite_${favorite._id}`}
								>
									<img
										className={style.product__card_img}
										src="./ML-logo-small.svg"
										alt="product image"
									/>
									<div className={style.product__card_text}>
										<p>{favorite.product?.title || "Unknown"}</p>
										<p>{`€${favorite.product?.price || "00"}`}</p>
									</div>
								</Link>
							);
						})
					) : (
						<NoResults />
					)}
				</div>
			</div>
		);
};

export default Favorites;

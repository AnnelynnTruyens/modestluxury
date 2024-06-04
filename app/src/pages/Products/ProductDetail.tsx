import style from "./Product.module.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Product, getProductById } from "../../services/ProductService";
import {
	Favorite,
	createFavorite,
	deleteFavorite,
	findFavoriteByProduct,
} from "../../services/FavoriteService";
import useStores from "../../hooks/useStores";
import ROUTES from "../../consts/Routes";
import { addCartItem } from "../../services/CartService";

import Loading from "../../components/Loading/Loading";
import NoResults from "../../components/NoResults/NoResults";
import Error from "../../components/Error/Error";
import ContactForm from "../../components/ContactForm/ContactForm";

const ProductDetail = () => {
	const navigate = useNavigate();

	const [productData, setProductData] = useState<Product | null>(null);
	const [favoriteData, setFavoriteData] = useState<Favorite[] | null>(null);
	const [userId, setUserId] = useState<string>("");
	const [productId, setProductId] = useState<string>("");
	const [favoriteId, setFavoriteId] = useState<string | null>(null);
	const [isFavorite, setIsFavorite] = useState<Boolean>(false);
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [error, setError] = useState<Error | undefined>();

	const { UiStore } = useStores();

	// Get productId from URL
	const { id } = useParams<{ id: string }>();

	// Type product and user to send with API call
	const productUser = {
		userId: userId,
		productId: productId,
	};

	useEffect(() => {
		if (id) {
			// Get product by id and see if product is favorite of current user
			setIsLoading(true);
			getProductById(id)
				.then(({ data }) => {
					setProductData(data);
					setProductId(data._id);
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error);
					setIsLoading(false);
				});
			findFavorite();
		}
	}, [id]);

	// Function to see if product is favorite of current user
	const findFavorite = () => {
		let filters = { productId: id };
		findFavoriteByProduct(filters)
			.then(({ data }) => {
				setFavoriteData(data);
				const isFav = data.some(
					(favorite: Favorite) => favorite.productId === id
				);
				setIsFavorite(isFav);
				if (isFav) {
					const fav = data.find(
						(favorite: Favorite) => favorite.productId === id
					);
					setFavoriteId(fav?._id || null);
				}
			})
			.catch(() => {
				return;
			});
	};

	// Function to add product to favorites of current user
	const handleAddFavorite = () => {
		if (!productData || !productData._id) {
			return;
		}

		// If no current user, navigate to favorites page to see login page
		if (!UiStore.currentUser) {
			navigate(ROUTES.favorites);
		} else {
			setUserId(UiStore.currentUser._id);
		}

		// Add product to favorites
		setIsLoading(true);
		createFavorite(productUser)
			.then(() => {
				setIsFavorite(true);
				findFavorite();
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	// Function to remove product from favorites of current user
	const handleDeleteFavorite = () => {
		if (!productData || !productData._id || !favoriteData || !favoriteId) {
			return;
		}

		// If no current user, navigate to login page
		if (!UiStore.currentUser) {
			navigate(ROUTES.login);
		} else {
			setUserId(UiStore.currentUser._id);
		}

		// Remove product from favorites
		deleteFavorite(favoriteId)
			.then(() => {
				setIsFavorite(false);
			})
			.catch((error) => {
				setError(error);
			});
	};

	// Function to add product to cart of current user
	const handleAddCartItem = () => {
		if (!productData || !productData._id) {
			return;
		}

		// If no current user, navigate to cart page to see login page
		if (!UiStore.currentUser) {
			navigate(ROUTES.cart);
		} else {
			setUserId(UiStore.currentUser._id);
		}

		// Add product to cart
		setIsLoading(true);
		addCartItem(productUser)
			.then(() => {
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	};

	if (isLoading) return <Loading />;
	else if (error) return <Error />;
	else if (!productData) return <NoResults />;
	else
		return (
			<div className={style.container}>
				<h1 className={style.title}>{productData.title}</h1>
				<div className={style.product}>
					<img
						className={style.product__img}
						src="./ML-logo-small.svg"
						alt="product image"
					/>
					<div className={style.product_info}>
						<p className={style.product_info__price}>€ {productData.price}</p>
						<div className={style.buttons}>
							{isFavorite ? (
								<button
									className={style.button__fav}
									onClick={handleDeleteFavorite}
								>
									Verwijderen uit favorieten
								</button>
							) : (
								<button
									className={style.button__fav}
									onClick={handleAddFavorite}
								>
									Toevoegen aan favorieten
								</button>
							)}

							<button
								className={style.button__cart}
								onClick={handleAddCartItem}
							>
								Toevoegen aan winkelmandje
							</button>
						</div>
					</div>
				</div>
				<ContactForm />
			</div>
		);
};

export default ProductDetail;

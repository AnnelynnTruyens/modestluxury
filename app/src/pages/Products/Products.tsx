import style from "./Product.module.css";

import { ChangeEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
	Product,
	getProducts,
	getProductsByCategory,
} from "../../services/ProductService";
import ROUTES from "../../consts/Routes";
import { Category, getCategoryById } from "../../services/CategoryService";

import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import NoResults from "../../components/NoResults/NoResults";

// Type form data
type formData = {
	sort: string;
};

const Products = () => {
	const [productData, setProductData] = useState<Product[] | null>(null);
	const [categoryData, setCategoryData] = useState<Category | null>(null);
	const [formData, setFormData] = useState<formData>({ sort: "" });
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [error, setError] = useState<Error | undefined>();

	// Get categoryId from URL
	const { categoryId } = useParams();

	useEffect(() => {
		setIsLoading(true);

		// Set product data to null to prevent wrong products from showing
		setProductData(null);

		// If categoryId is found in URL, load product of that category and sort from newest to oldest
		if (categoryId) {
			const categoryFilters = { categoryId: categoryId };

			getProductsByCategory(categoryFilters)
				.then(({ data }) => {
					setProductData(data);
					getCategoryById(categoryId)
						.then(({ data }) => {
							setCategoryData(data);
						})
						.catch((error) => {
							setError(error);
						});
					setFormData({ sort: "van nieuw naar oud" });
					sort();
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error);
					setIsLoading(false);
				});
		} else {
			// Load all products if no cateoryId is found and sort from newest to oldest
			getProducts()
				.then(({ data }) => {
					setProductData(data);
					setFormData({ sort: "van nieuw naar oud" });
					sort();
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error);
					setIsLoading(false);
				});
			setCategoryData(null);
		}
	}, [categoryId]);

	// Function to sort product
	const sort = () => {
		if (productData && formData) {
			let sortedData = [...productData];

			sortedData = sortedData.sort((a, b) => {
				switch (formData.sort) {
					case "van nieuw naar oud":
						return (
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
						);
					case "van oud naar nieuw":
						return (
							new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
						);
					case "van laag naar hoog":
						return parseFloat(a.price) - parseFloat(b.price);
					case "van hoog naar laag":
						return parseFloat(b.price) - parseFloat(a.price);
					default:
						return (
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
						);
				}
			});

			setProductData(sortedData);
		}
	};

	// Sort products when formData changes
	useEffect(() => {
		sort();
	}, [formData]);

	// Function to set formData when it changes
	const handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
		setFormData({
			...formData,
			[e.currentTarget.name]: e.currentTarget.value,
		});
	};

	if (isLoading) return <Loading />;
	else if (error) return <Error />;
	else
		return (
			<div className={style.container}>
				<h1>
					{!categoryData ? "Producten" : `Producten: ${categoryData.name}`}
				</h1>
				<section className={style.sort}>
					<select
						name="sort"
						id="sort"
						className={style.sort_form__input}
						onChange={handleChange}
						value={formData.sort}
					>
						<option value="van nieuw naar oud">
							Datum: van nieuw naar oud
						</option>
						<option value="van oud naar nieuw">
							Datum: van oud naar nieuw
						</option>
						<option value="van laag naar hoog">
							Prijs: van laag naar hoog
						</option>
						<option value="van hoog naar laag">
							Prijs: van hoog naar laag
						</option>
					</select>
				</section>

				<div className={style.products}>
					{productData && productData.length !== 0 ? (
						productData.map((product: Product) => {
							return (
								<Link
									to={`${ROUTES.productDetail.to}${product._id}`}
									className={style.product__card}
									key={`product_${product._id}`}
								>
									<img
										className={style.product__card_img}
										src="./ML-logo-small.svg"
										alt="product image"
									/>
									<div className={style.product__card_text}>
										<p className={style.product__card_title}>{product.title}</p>
										<p className={style.product__card_price}>
											{`€${product.price}`}
										</p>
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

export default Products;

import style from "./Home.module.css";
import { Link } from "react-router-dom";
import ROUTES from "../../consts/Routes";

const Home = () => {
	return (
		<>
			<img
				src="./pexels-pnw-prod-8995824.jpg"
				alt="Group of six muslim women sitting around a table on the beach, all looking at the camera and wearing clothing in white and pink tones."
				className={style.hero}
			/>
			<div className={style.welcome}>
				<h1 className={style.welcome__heading}>Welkom op onze webshop!</h1>
				<p className={style.welcome__text}>
					Welkom bij Modest Luxury, de webshop voor liefhebbers van elegante
					mode.
				</p>
			</div>
			<div className={style.links}>
				<Link to={ROUTES.categories} className={style.links__card}>
					<img
						className={style.links__card_img1}
						src="./pexels-pnw-prod-8995985.jpg"
						alt="Group of six muslim women walking to the sea with their backs to the camera and wearing clothing in white and pink tones."
					/>
					<div className={style.links__card_textbox}>
						<h1 className={style.links__card_text1}>Shop per categorie</h1>
					</div>
				</Link>
				<Link to={ROUTES.products} className={style.links__card}>
					<div className={style.links__card_textbox}>
						<h1 className={style.links__card_text2}>Alle producten</h1>
					</div>
					<img
						className={style.links__card_img2}
						src="./pexels-pnw-prod-8995907.jpg"
						alt="Four muslim women standing on a beach with their eyes closed, all wearing clothes in white and pink tones."
					/>
				</Link>
			</div>
		</>
	);
};

export default Home;

import style from "./Categories.module.css";
import { Link } from "react-router-dom";
import ROUTES from "../../consts/Routes";

const Categories = () => {
	return (
		<div className={style.container}>
			<h1 className={style.title}>Categorieën</h1>
			<div className={style.links}>
				<Link
					to={`${ROUTES.categoryOverview.to}665c343e1403dcd940f3e155`}
					className={style.links__card1}
				>
					<img
						className={style.links__card_img1}
						src="/src/assets/pexels-pnw-prod-8995985.jpg"
						alt="Group of six muslim women walking to the sea with their backs to the camera and all wearing clothing in white and pink tones."
					/>
					<div className={style.links__card_textbox1}>
						<h1 className={style.links__card_text1}>Jurken</h1>
					</div>
				</Link>
				<Link
					to={`${ROUTES.categoryOverview.to}665c34451403dcd940f3e158`}
					className={style.links__card2}
				>
					<div className={style.links__card_textbox2}>
						<h1 className={style.links__card_text2}>Blouses</h1>
					</div>
					<img
						className={style.links__card_img2}
						src="/src/assets/pexels-pnw-prod-8995907.jpg"
						alt="Four muslim women standing on a beach with their eyes closed, all wearing clothes in white and pink tones."
					/>
				</Link>
				<Link
					to={`${ROUTES.categoryOverview.to}665c344b1403dcd940f3e15b`}
					className={style.links__card1}
				>
					<img
						className={style.links__card_img3}
						src="/src/assets/pexels-pnw-prod-8995974.jpg"
						alt="Group of six muslim women standing in front of the sea, laughing together and all wearing clothing in white and pink tones."
					/>
					<div className={style.links__card_textbox1}>
						<h1 className={style.links__card_text1}>Truien</h1>
					</div>
				</Link>
				<Link
					to={`${ROUTES.categoryOverview.to}665c34521403dcd940f3e161`}
					className={style.links__card2}
				>
					<div className={style.links__card_textbox2}>
						<h1 className={style.links__card_text2}>Rokken</h1>
					</div>
					<img
						className={style.links__card_img4}
						src="/src/assets/pexels-pnw-prod-8995983.jpg"
						alt="Six muslim women walking on the beach, talking and laughing, all wearing clothes in white and pink tones."
					/>
				</Link>
				<Link
					to={`${ROUTES.categoryOverview.to}665c34591403dcd940f3e164`}
					className={style.links__card1}
				>
					<img
						className={style.links__card_img5}
						src="/src/assets/pexels-pnw-prod-8995940.jpg"
						alt="Group of three muslim women standing in front of the sea, smiling into the camera and all wearing clothing in white and pink tones."
					/>
					<div className={style.links__card_textbox1}>
						<h1 className={style.links__card_text1}>Broeken</h1>
					</div>
				</Link>
			</div>
		</div>
	);
};

export default Categories;

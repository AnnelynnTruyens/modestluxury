import style from "./Footer.module.css";
import { Link } from "react-router-dom";
import ROUTES from "../../consts/Routes";

const Footer = () => {
	return (
		<footer className={style.footer}>
			<img
				src="/src/assets/pexels-pnw-prod-8995945.jpg"
				alt="Group of six muslim women sitting on the beach, looking at the sea with their backs to the camera and wearing clothing in white and pink tones."
				className={style.footer__img}
			/>
			<nav className={style.footer__nav}>
				<li className={style.footer__nav_item}>
					<Link to={ROUTES.products} className={style.footer__nav_link}>
						Alle producten
					</Link>
				</li>
				<li className={style.footer__nav_item}>
					<Link to={ROUTES.categories} className={style.footer__nav_link}>
						Categorieën
					</Link>
				</li>
				<li className={style.footer__nav_item}>
					<Link to={ROUTES.aboutUs} className={style.footer__nav_link}>
						Over ons
					</Link>
				</li>
				<li className={style.footer__nav_item}>
					<Link to={ROUTES.shipment} className={style.footer__nav_link}>
						Verzending en retour
					</Link>
				</li>
				<li className={style.footer__nav_item}>
					<Link to={ROUTES.contact} className={style.footer__nav_link}>
						Contact
					</Link>
				</li>
				<li className={style.footer__nav_item}>
					<Link to={ROUTES.profile} className={style.footer__nav_link}>
						Profiel
					</Link>
				</li>
				<li className={style.footer__nav_item}>
					<Link to={ROUTES.privacy} className={style.footer__nav_link}>
						Privacy policy
					</Link>
				</li>
			</nav>
			<img
				src="/src/assets/ML-logo-small.svg"
				alt="logo modest luxury"
				className={style.footer__logo}
			/>
		</footer>
	);
};

export default Footer;

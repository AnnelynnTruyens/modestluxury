import style from "./Header.module.css";
import { Link, NavLink } from "react-router-dom";
import ROUTES from "../../consts/Routes";

const Header = () => {
	return (
		<header className={style.header}>
			<Link to={ROUTES.home} className={style.header__logo}>
				<img
					src="./ML-logo.svg"
					alt="logo modest luxury"
					className={style.header__logo_img}
				/>
			</Link>
			<nav className={style.header__nav}>
				<NavLink
					to={ROUTES.favorites}
					className={({ isActive, isPending }) => {
						return isActive
							? style.header__nav_item_active
							: isPending
							? style.header__nav_item_pending
							: style.header__nav_item;
					}}
				>
					<img
						src="./favorite_icon.svg"
						alt="icon favorieten"
						className={style.header__nav_img}
					/>
				</NavLink>
				<NavLink
					to={ROUTES.cart}
					className={({ isActive, isPending }) => {
						return isActive
							? style.header__nav_item_active
							: isPending
							? style.header__nav_item_pending
							: style.header__nav_item;
					}}
				>
					<img
						src="./cart_icon.svg"
						alt="icon winkelwagen"
						className={style.header__nav_img}
					/>
				</NavLink>
				<NavLink
					to={ROUTES.profile}
					className={({ isActive, isPending }) => {
						return isActive
							? style.header__nav_item_active
							: isPending
							? style.header__nav_item_pending
							: style.header__nav_item;
					}}
				>
					<img
						src="./user_icon.svg"
						alt="icon gebruiker"
						className={style.header__nav_img}
					/>
				</NavLink>
			</nav>
		</header>
	);
};

export default Header;

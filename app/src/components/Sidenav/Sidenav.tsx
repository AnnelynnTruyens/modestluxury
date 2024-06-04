import style from "./Sidenav.module.css";
import { NavLink } from "react-router-dom";
import ROUTES from "../../consts/Routes";

const Sidenav = () => {
	return (
		<div>
			<nav className={style.side__nav}>
				<li className={style.side__nav_item1}>Profiel</li>
				<li className={style.side__nav_item}>
					<NavLink
						to={ROUTES.profile}
						end
						className={({ isActive, isPending }) => {
							return isActive
								? style.side__nav_link_active
								: isPending
								? style.side__nav_link_pending
								: style.side__nav_link;
						}}
					>
						Mijn gegevens
					</NavLink>
				</li>
				<li className={style.side__nav_item}>
					<NavLink
						to={ROUTES.messages}
						className={({ isActive, isPending }) => {
							return isActive
								? style.side__nav_link_active
								: isPending
								? style.side__nav_link_pending
								: style.side__nav_link;
						}}
					>
						Mijn berichten
					</NavLink>
				</li>
				<li className={style.side__nav_item}>
					<NavLink
						to={ROUTES.orders}
						className={({ isActive, isPending }) => {
							return isActive
								? style.side__nav_link_active
								: isPending
								? style.side__nav_link_pending
								: style.side__nav_link;
						}}
					>
						Mijn bestellingen
					</NavLink>
				</li>
			</nav>
		</div>
	);
};

export default Sidenav;

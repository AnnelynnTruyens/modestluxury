import style from "./Sidenav.module.css";
import { Link, NavLink } from "react-router-dom";
import ROUTES from "../../consts/Routes";

const CpSidenav = () => {
	return (
		<>
			<nav className={style.side__nav}>
				<li className={style.side__nav_item1}>
					<Link to={ROUTES.cpDashboard} className={style.side__nav_link}>
						Dashboard
					</Link>
				</li>
				<li className={style.side__nav_item}>
					<NavLink
						to={ROUTES.cpProducts}
						className={({ isActive, isPending }) => {
							return isActive
								? style.side__nav_link_active
								: isPending
								? style.side__nav_link_pending
								: style.side__nav_link;
						}}
					>
						Producten
					</NavLink>
				</li>
				<li className={style.side__nav_item}>
					<NavLink
						to={ROUTES.cpMessages}
						className={({ isActive, isPending }) => {
							return isActive
								? style.side__nav_link_active
								: isPending
								? style.side__nav_link_pending
								: style.side__nav_link;
						}}
					>
						Berichten
					</NavLink>
				</li>
				<li className={style.side__nav_item}>
					<NavLink
						to={ROUTES.cpOrders}
						className={({ isActive, isPending }) => {
							return isActive
								? style.side__nav_link_active
								: isPending
								? style.side__nav_link_pending
								: style.side__nav_link;
						}}
					>
						Bestellingen
					</NavLink>
				</li>
				<li className={style.side__nav_item}>
					<NavLink
						to={ROUTES.cpUsers}
						className={({ isActive, isPending }) => {
							return isActive
								? style.side__nav_link_active
								: isPending
								? style.side__nav_link_pending
								: style.side__nav_link;
						}}
					>
						Gebruikers
					</NavLink>
				</li>
			</nav>
		</>
	);
};

export default CpSidenav;

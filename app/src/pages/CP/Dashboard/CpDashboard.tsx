import style from "./CpDashboard.module.css";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ROUTES from "../../../consts/Routes";
import useStores from "../../../hooks/useStores";

import Error from "../../../components/Error/Error";
import Loading from "../../../components/Loading/Loading";
import CpSidenav from "../../../components/Sidenav/CpSidenav";

const CpDashboard = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<Boolean>(true);
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

	if (isLoading) return <Loading />;
	else if (UiStore.currentUser && UiStore.currentUser.role == "admin") {
		return (
			<div className={style.cp_container}>
				<CpSidenav />
				<div className={style.cp_main}>
					<Link to={ROUTES.cpProducts} className={style.cp_main__card}>
						Producten
					</Link>
					<Link to={ROUTES.cpMessages} className={style.cp_main__card}>
						Berichten
					</Link>
					<Link to={ROUTES.cpOrders} className={style.cp_main__card}>
						Bestellingen
					</Link>
					<Link to={ROUTES.cpUsers} className={style.cp_main__card}>
						Gebruikers
					</Link>
				</div>
			</div>
		);
	} else return <Error />;
};

export default CpDashboard;

const ROUTES = {
	home: "/",
	categories: "/categorieen",
	categoryOverview: { path: "/categorieen/:categoryId", to: "/categorieen/" },
	products: "/producten",
	productDetail: {
		path: "/producten/detail/:id",
		to: "/producten/detail/",
	},
	aboutUs: "/over-ons",
	shipment: "/verzending-retour",
	privacy: "/privacy-policy",

	login: "/login",
	register: "/registreer",

	contact: "/contact",
	cart: "/winkelwagen",
	cartDetail: "/bestellen",
	favorites: "/favorieten",
	profile: "/profiel",
	orders: "/profiel/bestellingen",
	orderDetail: {
		path: "/profiel/bestellingen/detail/:id",
		to: "/profiel/bestellingen/detail/",
	},
	messages: "/profiel/berichten",
	messageDetail: {
		path: "/profiel/berichten/detail/:id",
		to: "/profiel/berichten/detail/",
	},

	cpDashboard: "/cp",
	cpProducts: "/cp/producten",
	cpProductCreate: "/cp/producten/nieuw",
	cpProductDetail: {
		path: "/cp/producten/detail/:id",
		to: "/cp/producten/detail/",
	},
	cpUsers: "/cp/gebruikers/",
	cpUserCreate: "/cp/gebruikers/nieuw",
	cpUserDetail: {
		path: "/cp/gebruikers/detail/:id",
		to: "/cp/gebruikers/detail/",
	},
	cpMessages: "/cp/berichten",
	cpMessageDetail: {
		path: "/cp/berichten/detail/:id",
		to: "/cp/berichten/detail/",
	},
	cpOrders: "/cp/bestellingen",
	cpOrderDetail: {
		path: "/cp/bestellingen/detail/:id",
		to: "/cp/bestellingen/detail/",
	},

	notFound: "*",
};

export default ROUTES;

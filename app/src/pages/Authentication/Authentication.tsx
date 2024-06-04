import { Route, Routes } from "react-router-dom";
import ROUTES from "../../consts/Routes";

import Home from "../Home/Home";
import Categories from "../Categories/Categories";
import Products from "../Products/Products";
import ProductDetail from "../Products/ProductDetail";
import AboutUs from "../AboutUs/AboutUs";
import Shipment from "../Shipment/Shipment";
import Privacy from "../Privacy/Privacy";

import Cart from "../Cart/Cart";
import CartDetail from "../Cart/CartDetail";
import Favorites from "../Favorites/Favorites";
import Contact from "../Contact/Contact";
import Profile from "../Profile/Profile";
import Orders from "../Orders/Orders";
import OrderDetail from "../Orders/OrderDetail";
import Messages from "../Messages/Messages";
import MessageDetail from "../Messages/MessageDetail";

import CpDashboard from "../CP/Dashboard/CpDashboard";
import CpProducts from "../CP/Products/CpProducts";
import CpProductDetail from "../CP/Products/CpProductDetail";
import CpProductCreate from "../CP/Products/CpProductCreate";
import CpUsers from "../CP/Users/CpUsers";
import CpUserDetail from "../CP/Users/CpUserDetail";
import CpUserCreate from "../CP/Users/CpUserCreate";
import CpMessages from "../CP/Messages/CpMessages";
import CpMessageDetail from "../CP/Messages/CpMessageDetail";
import CpOrders from "../CP/Orders/CpOrders";
import CpOrderDetail from "../CP/Orders/CpOrderDetail";

import NotFound from "../NotFound/NotFound";

const Authentication = () => {
	return (
		<>
			<Routes>
				<Route path={ROUTES.home} element={<Home />} />
				<Route path={ROUTES.categories} element={<Categories />} />
				<Route path={ROUTES.categoryOverview.path} element={<Products />} />
				<Route path={ROUTES.products} element={<Products />} />
				<Route path={ROUTES.productDetail.path} element={<ProductDetail />} />
				<Route path={ROUTES.aboutUs} element={<AboutUs />} />
				<Route path={ROUTES.shipment} element={<Shipment />} />
				<Route path={ROUTES.privacy} element={<Privacy />} />

				<Route path={ROUTES.cart} element={<Cart />} />
				<Route path={ROUTES.cartDetail} element={<CartDetail />} />
				<Route path={ROUTES.favorites} element={<Favorites />} />
				<Route path={ROUTES.contact} element={<Contact />} />
				<Route path={ROUTES.profile} element={<Profile />} />
				<Route path={ROUTES.orders} element={<Orders />} />
				<Route path={ROUTES.orderDetail.path} element={<OrderDetail />} />
				<Route path={ROUTES.messages} element={<Messages />} />
				<Route path={ROUTES.messageDetail.path} element={<MessageDetail />} />

				<Route path={ROUTES.cpDashboard} element={<CpDashboard />} />
				<Route path={ROUTES.cpProducts} element={<CpProducts />} />
				<Route path={ROUTES.cpProductCreate} element={<CpProductCreate />} />
				<Route
					path={ROUTES.cpProductDetail.path}
					element={<CpProductDetail />}
				/>
				<Route path={ROUTES.cpUsers} element={<CpUsers />} />
				<Route path={ROUTES.cpUserCreate} element={<CpUserCreate />} />
				<Route path={ROUTES.cpUserDetail.path} element={<CpUserDetail />} />
				<Route path={ROUTES.cpMessages} element={<CpMessages />} />
				<Route
					path={ROUTES.cpMessageDetail.path}
					element={<CpMessageDetail />}
				/>
				<Route path={ROUTES.cpOrders} element={<CpOrders />} />
				<Route path={ROUTES.cpOrderDetail.path} element={<CpOrderDetail />} />

				<Route path={ROUTES.notFound} element={<NotFound />} />
			</Routes>
		</>
	);
};

export default Authentication;

import { Express, Router } from "express";

import { errorHandler } from "../middleware/error/errorHandlerMiddleware";
import { authJwt } from "../middleware/auth/authMiddleware";

import userPublicRoutes from "../modules/User/User.public.routes";
import userPrivateRoutes from "../modules/User/User.private.routes";
import productPublicRoutes from "../modules/Product/Product.public.routes";
import productPrivateRoutes from "../modules/Product/Product.private.routes";
import categoryPublicRoutes from "../modules/Category/Category.public.routes";
import categoryPrivateRoutes from "../modules/Category/Category.private.routes";
import imagePublicRoutes from "../modules/Image/Image.public.routes";
import imagePrivateRoutes from "../modules/Image/Image.private.routes";
import stockPublicRoutes from "../modules/Stock/Stock.public.routes";
import stockPrivateRoutes from "../modules/Stock/Stock.private.routes";
import webshopPublicRoutes from "../modules/Webshop/Webshop.public.routes";
import webshopPrivateRoutes from "../modules/Webshop/Webshop.private.routes";
import messageRoutes from "../modules/Message/Message.routes";
import orderRoutes from "../modules/Order/Order.routes";
import favoriteRoutes from "../modules/Favorite/Favorite.routes";
import cartRoutes from "../modules/Cart/Cart.routes";

const registerRoutes = (app: Express) => {
	const publicRoutes = Router();
	publicRoutes.use("/", userPublicRoutes);
	publicRoutes.use("/", productPublicRoutes);
	publicRoutes.use("/", categoryPublicRoutes);
	publicRoutes.use("/", imagePublicRoutes);
	publicRoutes.use("/", stockPublicRoutes);
	publicRoutes.use("/", webshopPublicRoutes);

	const authRoutes = Router();
	authRoutes.use("/", userPrivateRoutes);
	authRoutes.use("/", productPrivateRoutes);
	authRoutes.use("/", categoryPrivateRoutes);
	authRoutes.use("/", imagePrivateRoutes);
	authRoutes.use("/", stockPrivateRoutes);
	authRoutes.use("/", webshopPrivateRoutes);
	authRoutes.use("/", messageRoutes);
	authRoutes.use("/", orderRoutes);
	authRoutes.use("/", favoriteRoutes);
	authRoutes.use("/", cartRoutes);

	app.use(publicRoutes);
	app.use(authJwt, authRoutes);

	// after all routes
	app.use(errorHandler);
};

export { registerRoutes };

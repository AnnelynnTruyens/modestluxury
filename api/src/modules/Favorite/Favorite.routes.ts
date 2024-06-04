import express from "express";
import {
	getFavorites,
	getFavoritesByUser,
	getFavoriteById,
	createFavorite,
	updateFavorite,
	deleteFavorite,
} from "./Favorite.controller";

const router = express.Router();

router.get("/favorites/all", getFavorites);
router.get("/favorites", getFavoritesByUser);
router.get("/favorites/:id", getFavoriteById);
router.post("/favorites", createFavorite);
router.patch("/favorites/:id", updateFavorite);
router.delete("/favorites/:id", deleteFavorite);

export default router;

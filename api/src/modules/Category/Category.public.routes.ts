import express from "express";
import { getCategories, getCategoryById } from "./Category.controller";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);

export default router;

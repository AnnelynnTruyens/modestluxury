import express from "express";
import {
	createWebshop,
	updateWebshop,
	deleteWebshop,
} from "./Webshop.controller";

const router = express.Router();

router.post("/webshops", createWebshop);
router.patch("/webshops/:id", updateWebshop);
router.delete("/webshops/:id", deleteWebshop);

export default router;

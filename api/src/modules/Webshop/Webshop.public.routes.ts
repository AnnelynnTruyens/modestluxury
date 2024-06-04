import express from "express";
import { getWebshops, getWebshopById } from "./Webshop.controller";

const router = express.Router();

router.get("/webshops", getWebshops);
router.get("/webshops/:id", getWebshopById);

export default router;

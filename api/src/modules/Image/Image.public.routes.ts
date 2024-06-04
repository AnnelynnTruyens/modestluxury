import express from "express";
import { getImages, getImageById } from "./Image.controller";

const router = express.Router();

router.get("/images", getImages);
router.get("/images/:id", getImageById);

export default router;

import express from "express";
import { addImage, updateImage, deleteImage } from "./Image.controller";

const router = express.Router();

router.post("/images", addImage);
router.patch("/images/:id", updateImage);
router.delete("/images/:id", deleteImage);

export default router;

import { Router } from "express";
import {
	deleteUser,
	editCurrentUser,
	getCurrentUser,
	getUserById,
	getUsers,
	updateUser,
} from "./User.controller";

const router = Router();
router.get("/users", getUsers);
router.get("/users/current", getCurrentUser);
router.patch("/users/current/edit", editCurrentUser);
router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;

import express from "express";
import {
	getMessages,
	getMessagesByUser,
	getMessageById,
	createMessage,
	updateMessage,
	deleteMessage,
} from "./Message.controller";

const router = express.Router();

router.get("/messages/all", getMessages);
router.get("/messages", getMessagesByUser);
router.get("/messages/:id", getMessageById);
router.post("/messages", createMessage);
router.patch("/messages/:id", updateMessage);
router.delete("/messages/:id", deleteMessage);

export default router;

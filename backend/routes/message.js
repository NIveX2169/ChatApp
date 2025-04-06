import express from "express";
import {
  createMessage,
  getMessagesBetweenUsers,
  markMessageAsRead,
} from "../controller/message/message.js";

const router = express.Router();

// router.post("/", createMessage);
router.post("/get-message", getMessagesBetweenUsers);
router.patch("/read", markMessageAsRead);
// router.delete("/messages/:id", deleteMessage );

export const messageRoutes = router;

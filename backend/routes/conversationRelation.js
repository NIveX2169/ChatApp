import express from "express";
import {
  createOrUpdateConversation,
  deleteConversation,
  getAllConversationsForUser,
  getConversationBetweenUsers,
} from "../controller/conversationRelation/conversationRelation.js";

const router = express.Router();

// router.post("/", createOrUpdateConversation);
router.get("/between-user/:user1/:user2", getConversationBetweenUsers);
router.get("/user/:userId", getAllConversationsForUser);
// router.delete("/conversations/:id", deleteConversation);

export const conversationRoutes = router;

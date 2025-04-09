import mongoose, { Mongoose } from "mongoose";
import { conversationModel } from "../../models/conversationRelation.js";

// POST /api/conversations
export const createOrUpdateConversation = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const participants = [senderId, receiverId].sort();

    const updatedConversation = await conversationModel.findOneAndUpdate(
      { participants },
      {
        participants,
        lastMessage: {
          message,
          senderId,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({ status: true, data: updatedConversation });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// GET /api/conversations/user/:userId
export const getAllConversationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("asdasdasd", userId);
    const mongoUserId = mongoose.Types.ObjectId.createFromHexString(userId);
    console.log("mongoUserId", mongoUserId);
    const conversations = await conversationModel
      .find({ participants: mongoUserId })
      .populate("lastMessage.senderId", "username email") // optional
      .sort({ updatedAt: -1 });

    res.status(200).json({ status: true, data: conversations });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// GET /api/conversations/:user1/:user2
export const getConversationBetweenUsers = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const participants = [user1, user2]
      .sort()
      .map((id) => new mongoose.Types.ObjectId(id));

    console.log("participants", participants);
    const conversation = await conversationModel.findOne({ participants });

    if (!conversation) {
      return res
        .status(404)
        .json({ status: false, message: "Conversation not found" });
    }

    res.status(200).json({ status: true, data: conversation });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// DELETE /api/conversations/:id
export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await conversationModel.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ status: false, message: "Conversation not found" });
    }

    res.status(200).json({ status: true, message: "Conversation deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

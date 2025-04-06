import { messageModel } from "../../models/message.js";

// POST /api/messages
export const createMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    const message = await messageModel.create({ sender, receiver, content });

    res.status(201).json({ status: true, data: message });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// GET /api/messages/:user1/:user2
export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    console.log("userId1", user1);
    console.log("userId1", user2);
    const messages = await messageModel
      .find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
      })
      .sort({ createdAt: 1 });

    res.status(200).json({ status: true, data: messages });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// PATCH /api/messages/:id/read
export const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await messageModel.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res
        .status(404)
        .json({ status: false, message: "Message not found" });
    }

    res.status(200).json({ status: true, data: message });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

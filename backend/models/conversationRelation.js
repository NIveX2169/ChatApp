import mongoose from "mongoose";

const conversationRelationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Optional: only if you're using population
          required: true,
        },
      ],
    },
    lastMessage: {
      type: {
        message: String,
        senderId: mongoose.Schema.Types.ObjectId,
      },
    },
  },
  {
    timestamps: true,
  }
);

conversationRelationSchema.index(
  { "participants.0": 1, "participants.1": 1 },
  { unique: true }
);
conversationRelationSchema.pre("save", function () {
  if (Array.isArray(this.participants)) {
    this.participants.sort();
  }
});

conversationRelationSchema.pre(["find", "findOne"], function (next) {
  const query = this.getQuery();

  if (Array.isArray(query.participants)) {
    query.participants.sort();
    this.setQuery(query); // Update the query with sorted participants
  }

  next();
});
export const conversationModel = mongoose.model(
  "Conversation",
  conversationRelationSchema
);

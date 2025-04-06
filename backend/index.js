import express from "express";
import chalk from "chalk";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { instrument } from "@socket.io/admin-ui";
import { UserAuthRoutes } from "./controller/auth/auth.js";
import { connectDB } from "./kitchensink/mongoConnect.js";
import { configDotenv } from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { activeConnection } from "./middleware/activeConnection.js";
import { socketAuthMiddleware } from "./middleware/socketAuthMiddleware.js";
import { activeUsersMap } from "./utils/activeUserStore.js";
import { conversationModel } from "./models/conversationRelation.js";
import { messageModel } from "./models/message.js";
import { messageRoutes } from "./routes/message.js";
import { conversationRoutes } from "./routes/conversationRelation.js";
configDotenv();
const app = express();
const server = createServer(app);
app.use(cookieParser());

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
connectDB();

app.get("/api", (req, res) => {
  res.status(200).json({ status: true, message: "Backend is working !!" });
});

app.use("/api/v1/auth", UserAuthRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/conversation-relation", conversationRoutes);

// socket imp
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// instrument(io, { auth: false });

// const activeUsers = new Set();
// const activeUsersMap = new Map();
io.use(socketAuthMiddleware);
io.use(activeConnection);

io.on("connection", (socket) => {
  // console.log("Socket is connected ", socket.handshake);

  socket.on("send-msg", async (data) => {
    console.log("Message IS Send man ", data);
    const { conversationMetaData, message } = data;
    const { senderData, receipentData } = conversationMetaData;
    if (activeUsersMap.has(receipentData?.id)) {
      console.log(
        chalk.bgGreenBright(
          "Im sending this messag to the person : ",
          receipentData.username
        )
      );
      const receipentSocketId = activeUsersMap.get(receipentData.id);
      const participants = [receipentData.id, senderData.id].sort();
      const conversationUpdate = await conversationModel.findOneAndUpdate(
        { participants },
        {
          participants,
          lastMessage: { message, senderId: senderData.id },
        },
        {
          new: true,
          upsert: true,
        }
      );

      // console.log("conversationUpdate", conversationUpdate);
      const currMessage = await messageModel.create({
        sender: senderData.id,
        receiver: receipentData.id,
        content: message,
      });
      console.log("currMessage", currMessage);

      socket
        .to(receipentSocketId.socketId)
        .emit("receive-msg", { message: currMessage, conversationMetaData });
    }
  });

  // socket.on("receive-msg", (data) => {
  //   console.log("message-receive", data);
  // });

  console.log("activeUsersMap", activeUsersMap);

  socket.on("disconnect", () => {
    console.log("This Socket Id Is Disconnected !!", socket.id);
    activeUsersMap.delete(socket.handshake.user.id);
  });
});

io.on("error", (err) => {
  console.log("Error Occured !!", err);
});

server.listen(8080, () => {
  console.log(chalk.bgBlue("Server Is Running at 8080"));
});

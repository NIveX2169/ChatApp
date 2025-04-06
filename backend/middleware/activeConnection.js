import { activeUsersMap } from "../utils/activeUserStore.js";

export const activeConnection = async (socket, next) => {
  try {
    const { email, username, id } = socket.handshake.user;

    activeUsersMap.set(id, {
      email,
      username,
      socketId: socket.id,
      id,
    });

    const activeUserExceptCurrUser = [...activeUsersMap.values()]?.filter(
      (el) => el.socketId !== socket.id
    );

    console.log("Active MAp", activeUsersMap);

    socket.emit("activeUsers", activeUserExceptCurrUser);
    next();
  } catch (err) {
    console.log("Error Occured", err);
  }
};

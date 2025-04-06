import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  connectSocket,
  disconnectSocket,
} from "../features/slices/socketSlice";

const Chat = () => {
  const dispatch = useDispatch();
  const [activePeople, setActivePeople] = useState(null);
  const { socket } = useSelector((state) => state?.socket);
  useEffect(() => {
    // if (!socket) {
    //   dispatch(connectSocket());
    // }

    if (socket) {
      socket.on("activePeople", (data) => {
        console.log("Listener :activePeople", data);
        setActivePeople(data);
      });
    }
  }, [socket]);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            dispatch(connectSocket());
          }}
        >
          Connect socket
        </button>
      </div>
      {activePeople &&
        activePeople.map((el) => {
          return el.name;
        })}
    </div>
  );
};

export default Chat;

import React, { use } from "react";

import { useState, useRef, useEffect } from "react";
import { CheckCheck, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { appendMessage } from "../../features/slices/currentChatSlice";
import { v4 as uuidv4 } from "uuid";
export default function ChatApp() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! How are you?",
      sender: "other",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 2,
      text: "I'm good, thanks! How about you?",
      sender: "user",
      timestamp: new Date(Date.now() - 3500000),
    },
    {
      id: 3,
      text: "Doing well! What are you up to today?",
      sender: "other",
      timestamp: new Date(Date.now() - 3400000),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { conversationMetaData, messages: tempMessage } = useSelector(
    (state) => state.currentChat
  );
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("receive-msg", (data) => {
        console.log("Well i received something right", data);
        dispatch(appendMessage(data.message));
      });
    }
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    console.log("conversationMetaData", conversationMetaData);

    socket.emit("send-msg", {
      conversationMetaData,
      message: newMessage.trim(),
    });

    dispatch(
      appendMessage({
        _id: uuidv4(),
        sender: userData.id,
        receiver: conversationMetaData.receipentData.id,
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
      })
    );

    // const message = {
    //   id: messages.length + 1,
    //   text: newMessage,
    //   sender: "user",
    //   timestamp: new Date(),
    // };

    // setMessages([...messages, message]);
    setNewMessage("");

    // Simulate a reply after 1 second
    // setTimeout(() => {
    //   const reply = {
    //     id: messages.length + 2,
    //     text: "That's great! I'm just working on some code right now.",
    //     sender: "other",
    //     timestamp: new Date(),
    //   };
    //   setMessages((prev) => [...prev, reply]);
    // }, 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col border-2 border-dotted h-screen bg-gray-100">
      {/* Chat header */}
      <div className="bg-white shadow-sm p-4 flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
          {conversationMetaData?.receipentData?.username?.[0]}
        </div>
        <div className="ml-3">
          <h2 className="font-semibold">
            {conversationMetaData?.receipentData?.username}
          </h2>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>

      {/* Chat messages */}

      {tempMessage && tempMessage.length > 0 ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {tempMessage.map((message) => (
            <div
              key={message?._id || message?.id}
              className={`flex ${
                message.sender === userData.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.sender === userData.id
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                }`}
              >
                <p>{message.content}</p>
                <div className="flex items-center justify-end gap-2">
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === userData.id
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(new Date(message.createdAt))}
                  </p>
                  <p className="">
                    <CheckCheck size={22} />
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

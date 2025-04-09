"use client";

import { useState } from "react";
import SearchBar from "../SearchBar";
import { useSelector } from "react-redux";
const formatMessageDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isYesterday = (d1, d2) => {
    const yesterday = new Date(d2);
    yesterday.setDate(d2.getDate() - 1);
    return isSameDay(d1, yesterday);
  };

  const isThisWeek = (d1, d2) => {
    const startOfWeek = new Date(d2);
    startOfWeek.setDate(d2.getDate() - d2.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return d1 >= startOfWeek && d1 < d2;
  };

  if (isSameDay(date, now)) return "Today";
  if (isYesterday(date, now)) return "Yesterday";
  if (isThisWeek(date, now)) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" }); // like "6 Apr"
};

const Chatui = () => {
  // Sample data for chat users
  const [chatUsers, setChatUsers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Hey, are we still meeting today?",
      timestamp: "10:30 AM",
      unread: 3,
      online: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I've sent you the documents you requested",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Emma Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for your help!",
      timestamp: "Yesterday",
      unread: 1,
      online: true,
    },
    {
      id: 4,
      name: "James Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Let's discuss the project tomorrow",
      timestamp: "Monday",
      unread: 0,
      online: false,
    },
    {
      id: 5,
      name: "Olivia Parker",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Can you share the presentation slides?",
      timestamp: "Sunday",
      unread: 2,
      online: true,
    },
    // {
    //   id: 6,
    //   name: "Olivia Parker",
    //   avatar: "/placeholder.svg?height=40&width=40",
    //   lastMessage: "Can you share the presentation slides?",
    //   timestamp: "Sunday",
    //   unread: 2,
    //   online: true,
    // },
  ]);

  // Active filter state
  const [activeFilter, setActiveFilter] = useState("all");
  const { previousChatPreview } = useSelector((state) => state.chatPreviews);

  return (
    <div className="w-full h-full  bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Chats</h1>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <SearchBar />
      </div>

      {/* Filters */}
      <div className="flex px-4 pb-2 border-b border-gray-100">
        <button
          className={`mr-4 pb-2 text-sm font-medium ${
            activeFilter === "all"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveFilter("all")}
        >
          All Chats
        </button>
        <button
          className={`mr-4 pb-2 text-sm font-medium ${
            activeFilter === "unread"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveFilter("unread")}
        >
          Unread
        </button>
        <button
          className={`mr-4 pb-2 text-sm font-medium ${
            activeFilter === "archived"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveFilter("archived")}
        >
          Archived
        </button>
      </div>

      {/* Chat List */}
      {previousChatPreview && previousChatPreview.length > 0 ? (
        <div className="overflow-y-auto min-h-[400px] max-h-[400px] border-4">
          {previousChatPreview.map((user) => (
            <div
              key={user._id}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
            >
              {/* User Avatar with online indicator */}
              <div className="relative">
                <img
                  src={user.avatar || "/placeholder.jpg"}
                  alt={user?.participants?.[0].username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* User Info and Last Message */}
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    {user?.participants?.[0].username}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatMessageDate(user.updatedAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {user.lastMessage.message}
                </p>
              </div>

              {/* Unread Count */}
              {(user?.unread || 2) > 0 && (
                <div className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {user?.unread || 1}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-y-auto min-h-[400px] max-h-[400px] border-4">
          {chatUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
            >
              {/* User Avatar with online indicator */}
              <div className="relative">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              {/* User Info and Last Message */}
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <span className="text-xs text-gray-500">
                    {user.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {user.lastMessage}
                </p>
              </div>

              {/* Unread Count */}
              {user.unread > 0 && (
                <div className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {user.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Supporting Tags */}
      <div className="p-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Supporting Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            Work
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            Friends
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            Family
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            Important
          </span>
        </div>
      </div>

      {/* Archived */}
      <div className="p-4 border-t border-gray-100">
        <button className="text-sm font-medium text-gray-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"
            />
          </svg>
          Archived Chats (3)
        </button>
      </div>
    </div>
  );
};

export default Chatui;

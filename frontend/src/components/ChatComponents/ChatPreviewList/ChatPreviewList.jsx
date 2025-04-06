import { MessageSquare, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessages,
  setCurrentChatMetaData,
} from "../../../features/slices/currentChatSlice";
import { getMessages } from "../../../features/actions/conversationActions";

const ChatPreviewList = ({ activeUsers }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { conversationMetaData } = useSelector((state) => state.currentChat);
  function handleChat(receipentData) {
    // console.log("receipentData", receipentData);
    // if (
    //   conversationMetaData != null &&
    //   conversationMetaData?.receipentData?.id == receipentData.id
    // )
    //   return;

    const conversationData = {
      senderData: userData,
      receipentData,
    };

    dispatch(clearMessages());
    dispatch(getMessages({ user1: userData.id, user2: receipentData.id }));
    dispatch(setCurrentChatMetaData(conversationData));
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare size={24} className="text-blue-500" />
        <h2 className="text-lg font-semibold text-white">Messages</h2>
      </div>

      {/* Active Users Section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Users size={18} className="text-blue-500 mr-2" />
          <p className="text-sm font-medium text-white">Active Users</p>
        </div>

        {/* Active Users Avatars */}
        <div className="flex flex-wrap gap-2 mb-4">
          {activeUsers && activeUsers.length > 0 ? (
            activeUsers.slice(0, 5).map((user, idx) => (
              <div key={idx} className="relative group" title={user.username}>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium border-2 border-blue-700 hover:border-blue-400 transition-all cursor-pointer">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#222E35] rounded-full"></span>

                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {user.username}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">No active users</p>
          )}

          {activeUsers && activeUsers.length > 5 && (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-medium border-2 border-gray-600 cursor-pointer">
              +{activeUsers.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* All Users List */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <p className="text-sm font-medium text-white mb-3">All Users</p>

        <div className="space-y-2">
          {activeUsers && activeUsers.length > 0 ? (
            activeUsers.map((user, idx) => (
              <div
                onClick={() => handleChat(user)}
                key={idx}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer group flex items-center"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium mr-3">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{user.username}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 ml-2"></div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">No users available</p>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="mt-auto pt-4 border-t border-gray-700/50">
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium mr-3">
            ME
          </div>
          <div>
            <p className="text-white text-sm font-medium">My Profile</p>
            <p className="text-gray-400 text-xs">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPreviewList;

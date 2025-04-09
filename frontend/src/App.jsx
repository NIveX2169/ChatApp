import { useEffect, useState } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Chatui from "./components/ChatComponents/Chatui";
import MainChat from "./components/ChatComponents/MainChat";
import ChatPreviewList from "./components/ChatComponents/ChatPreviewList/ChatPreviewList";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket } from "./features/slices/socketSlice";
import Login from "./pages/login";
import { Menu, X, MessageSquare } from "lucide-react";
import { getChatPreviews } from "./features/actions/previousChatActions";

function App() {
  const dispatch = useDispatch();
  const [activeUserState, setActiveUserState] = useState(null);
  const { socket } = useSelector((state) => state.socket);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { isLoggedIn, userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(connectSocket());
      dispatch(getChatPreviews(userData.id));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (socket) {
      socket.on("activeUsers", (activeUsers) => {
        console.log("Active Users", activeUsers);
        setActiveUserState(activeUsers);
      });
    }
  }, [socket]);

  return (
    <>
      {isLoggedIn ? (
        <div className="h-screen bg-[#222E35] overflow-hidden">
          {/* Mobile Header - Only visible on small screens */}
          <div className="lg:hidden flex items-center justify-between bg-[#1c272e] p-4 border-b border-gray-700/50">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white p-2 rounded-lg hover:bg-gray-700/50"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-white font-medium">Chat App</h1>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="text-white p-2 rounded-lg hover:bg-gray-700/50"
            >
              {chatOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
          </div>

          <div className="flex h-[calc(100vh-56px)] lg:h-screen">
            {/* Sidebar - Users List */}
            <div
              className={`${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } 
          lg:translate-x-0 transition-transform duration-300 absolute lg:relative z-20 lg:z-auto
          w-64 h-[calc(100vh-56px)] lg:h-screen bg-[#222E35] border-r border-gray-700/50 lg:block`}
            >
              <div className="h-full p-4">
                <ChatPreviewList activeUsers={activeUserState} />
              </div>
            </div>

            {/* Main Content - Chat List */}
            <div
              className={`${
                (sidebarOpen || chatOpen) && "hidden"
              } lg:block flex-1 bg-[#1c272e]`}
            >
              <div className="h-full border-2 border-dotted border-red-500 justify-center flex items-center">
                <Chatui />
              </div>
            </div>

            {/* Chat Window */}
            <div
              className={`${chatOpen ? "translate-x-0" : "translate-x-full"} 
          lg:translate-x-0 transition-transform duration-300 absolute right-0 lg:relative z-20 lg:z-auto
          w-full lg:w-auto lg:flex-1 h-[calc(100vh-56px)] lg:h-screen bg-[#1c272e] lg:block`}
            >
              <div className="h-full">
                <MainChat />
              </div>
            </div>
          </div>

          {/* Overlay for mobile */}
          {(sidebarOpen || chatOpen) && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-10"
              onClick={() => {
                setSidebarOpen(false);
                setChatOpen(false);
              }}
            ></div>
          )}
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;

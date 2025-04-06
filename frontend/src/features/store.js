import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import socketReducer from "./slices/socketSlice.js";
import authReducer from "./slices/authSlice.js";
import currentChatReducer from "./slices/currentChatSlice.js";
import chatPreviewsReducer from "./slices/previousChatPreviews.js";
import storage from "redux-persist/lib/storage";
const rootReducer = combineReducers({
  socket: socketReducer,
  auth: authReducer,
  currentChat: currentChatReducer,
  chatPreviews: chatPreviewsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["socket"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false });
  },
});

export const persistor = persistStore(store);

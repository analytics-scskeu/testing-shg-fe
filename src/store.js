import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/store/user.js";
import configReducer from "@/store/config.js";
import notificationReducer from "@/store/notification.js";

let _store = null;
export const makeStore = () => {
    const store = configureStore({
        reducer: {
            user: userReducer,
            config: configReducer,
            notification: notificationReducer,
        },
        devTools: process.env.APP_ENV === "local",
    });
    _store = store;
    return store;
};

export const getStore = () => _store;

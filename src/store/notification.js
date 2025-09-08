import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.messages.push(action.payload);
        },
        deleteNotifications: (state, action) => {
            state[action.payload || "messages"] = [];
        },
    },
});

export const { addNotification, deleteNotifications } = notificationSlice.actions;
export const selectorNotification = (state) => state.notification;

export default notificationSlice.reducer;

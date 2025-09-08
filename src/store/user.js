import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    isGuest: true,
    permissions: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload ? { ...action.payload } : null;
            if (!state.data) {
                state.isGuest = true;
                state.permissions = [];
            }
        },
        setIsGuest: (state, action) => {
            state.isGuest = action.payload;
        },
        setPermissions: (state, action) => {
            state.permissions = action.payload;
        },
    },
});

export const { setUser, setIsGuest, setPermissions } = userSlice.actions;
export const selectorUser = (state) => state.user;

export default userSlice.reducer;

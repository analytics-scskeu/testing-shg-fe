import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    availableStores: {},
    storeConfig: {},
    config: {},
};

export const configSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        setAvailableStores: (state, action) => {
            state.availableStores = action.payload ? { ...action.payload } : {};
        },
        setStoreConfig: (state, action) => {
            state.storeConfig = action.payload ? { ...action.payload } : {};
        },
        setConfig: (state, action) => {
            state.config = action.payload ? { ...action.payload } : {};
        },
    },
});

export const { setAvailableStores, setStoreConfig, setConfig } = configSlice.actions;
export const selectorAvailableStores = (state) => state.config.availableStores;
export const selectorStoreConfig = (state) => state.config.storeConfig;
export const selectorConfig = (state) => state.config.config;

export default configSlice.reducer;

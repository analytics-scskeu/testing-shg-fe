"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/store";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/api/apolloClient";
import { useRef } from "react";
import { setIsGuest, setPermissions, setUser } from "@/store/user";
import { setAvailableStores, setConfig, setStoreConfig } from "@/store/config";

export default function RootProviders({ children, initialState }) {
    const storeRef = useRef(null);
    if (!storeRef.current) {
        storeRef.current = makeStore();
        storeRef.current.dispatch(setUser(initialState.user));
        storeRef.current.dispatch(setAvailableStores(initialState.availableStores));
        storeRef.current.dispatch(setStoreConfig(initialState.storeConfig));
        storeRef.current.dispatch(setConfig(initialState.config));
        storeRef.current.dispatch(setIsGuest(initialState.isGuest));
        storeRef.current.dispatch(setPermissions(initialState.permissions));
    }
    return (
        <Provider store={storeRef.current}>
            <ApolloProvider client={client}>{children}</ApolloProvider>
        </Provider>
    );
}

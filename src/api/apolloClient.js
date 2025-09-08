import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { getCookie, removeCookie } from "@/utils/session";
import { redirect } from "next/navigation";
import { getStore } from "@/store";
import { setUser } from "@/store/user";
import { getSubdomain } from "@/utils/helper";

const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors[0]?.extensions?.category === "graphql-authorization" && typeof localStorage !== "undefined") {
        localStorage.removeItem("auth_token");
        removeCookie("auth_token").then(() => {
            getStore().dispatch(setUser(null));
            client.clearStore().then(() => redirect("/login"));
        });
    }
});

export const getApiUrl = (host) => {
    if (!host && typeof window !== "undefined") {
        host = window.location.host;
    }

    const apiUrl = process.env.API_ENDPOINT;

    if (!host) {
        return apiUrl;
    }

    const subdomain = getSubdomain(host);
    if (subdomain) {
        const url = new URL(apiUrl);
        return `${url.protocol}//${subdomain}.${url.hostname}`;
    }

    return apiUrl;
};

const httpLinkClient = createHttpLink({
    uri: getApiUrl() + "/graphql",
});

const requestConfig = setContext((_, { headers }) => {
    let token = "";
    if (typeof localStorage !== "undefined") {
        token = localStorage?.getItem("auth_token");
    }

    let subdomain = null;
    let locale = "en"; // fallback

    if (typeof window !== "undefined") {
        subdomain = getSubdomain(window.location.hostname);
        locale = window.location.pathname.split("/")[1];
    }

    return {
        headers: {
            ...headers,
            ...(subdomain &&
                locale && {
                    store: `${subdomain.toUpperCase()}_${locale}`,
                }),
            ...(token && { authorization: `Bearer ${token}` }),
        },
    };
});

const client = new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: requestConfig.concat(errorLink).concat(httpLinkClient),
    cache: new InMemoryCache(),
    defaultOptions: {
        mutate: {
            errorPolicy: "all",
        },
        query: {
            errorPolicy: "all",
        },
    },
});

const serverClient = async (requestHeaders) => {
    const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
    const subdomain = getSubdomain(host);
    const locale = requestHeaders.get("x-locale");
    const httpLinkServer = createHttpLink({
        uri: getApiUrl(host) + "/graphql",
    });

    const requestConfigServer = setContext(async (_, { headers }) => {
        const token = await getCookie("auth_token");
        return {
            headers: {
                ...headers,
                ...(subdomain &&
                    locale && {
                        store: `${subdomain.toUpperCase()}_${locale}`,
                    }),
                ...(token && { authorization: `Bearer ${token}` }),
            },
        };
    });

    return new ApolloClient({
        ssrMode: true,
        link: requestConfigServer.concat(httpLinkServer),
        cache: new InMemoryCache(),
        defaultOptions: {
            mutate: {
                errorPolicy: "all",
            },
            query: {
                errorPolicy: "all",
            },
        },
    });
};

export { client, serverClient };

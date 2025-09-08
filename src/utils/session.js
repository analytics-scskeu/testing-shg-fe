"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { GET_CUSTOMER, GET_CUSTOMER_ROLES } from "@/api/queries/customer";

const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function encrypt(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decrypt(session) {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        console.log("Failed to verify session");
        console.log(error);
    }
}

export async function getCookie(name) {
    const cookiesList = await cookies();

    if (cookiesList.has(name)) {
        return cookiesList.get(name)?.value;
    }

    return null;
}

export async function removeCookie(name) {
    const cookiesList = await cookies();

    if (cookiesList.has(name)) {
        cookiesList.delete(name);
    }
}

export async function setCookie(name, value, expires, httpOnly = true) {
    const cookiesList = await cookies();

    cookiesList.set(name, value, {
        path: "/",
        expires: expires,
        httpOnly: httpOnly,
        sameSite: "strict",
        secure: process.env.APP_ENV === "production",
    });
}

export async function getUserSession(client) {
    const token = await getCookie("auth_token");
    if (!token) {
        return null;
    }

    try {
        const { data: response } = await client.query({
            query: GET_CUSTOMER,
        });

        if (!response?.customer) {
            return null;
        }

        return response.customer;
    } catch {
        return null;
    }
}

export async function getUserPermissions(client, userSession) {
    try {
        const { data: response } = await client.query({ query: GET_CUSTOMER_ROLES });

        if (!response?.getCustomerRoles || !userSession.company_id) {
            return [];
        }

        return response.getCustomerRoles.roles.find((role) => parseInt(role.role_id) === parseInt(userSession.role_id))
            .permissions;
    } catch {
        return [];
    }
}

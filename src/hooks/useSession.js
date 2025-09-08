"use client";

import { useRouter } from "@/i18n/routing";
import { client } from "@/api/apolloClient";
import { removeCookie } from "@/utils/session";
import { setUser } from "@/store/user";
import { useDispatch } from "react-redux";

export default function useSession() {
    const router = useRouter();
    const dispatch = useDispatch();

    const logout = async (redirect = null) => {
        localStorage.removeItem("auth_token");
        await removeCookie("auth_token");

        await client.clearStore();
        dispatch(setUser(null));

        if (redirect) {
            router.push(redirect);
        } else {
            router.refresh();
        }
    };

    return { logout };
}

"use client";

import { CustomerDashboard, GuestDashboard } from "@/components/customer/dashboard";
import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";

export default function Dashboard() {
    const customer = useSelector(selectorUser);

    if (!customer.isGuest) {
        return <CustomerDashboard />;
    } else {
        return <GuestDashboard />;
    }
}

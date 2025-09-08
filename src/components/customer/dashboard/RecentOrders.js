"use client";

import { useMutation, useQuery } from "@apollo/client";
import { GET_COMPANY_ORDERS, REORDER_ITEMS } from "@/api/queries/companyOrders";
import { Button } from "@/components/form";
import { useTranslations } from "next-intl";
import Table from "@/components/table/Table";
import { useState } from "react";
import dayjs from "dayjs";
import { formatPrice } from "@/utils/helper";
import { SvgIcon } from "@/components/icons";
import { CartIcon, CloudArrowDownIcon } from "@/resources/images/icons";
import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";

export default function RecentOrders() {
    const user = useSelector(selectorUser);
    const canViewPrice = user.permissions.includes("view_price");

    const t = useTranslations();

    const { data: orders, loading } = useQuery(GET_COMPANY_ORDERS, {
        variables: {
            pageSize: 5,
            currentPage: 1,
        },
    });

    const [reorderItems] = useMutation(REORDER_ITEMS);

    const [sortBy, setSortBy] = useState({
        property: "id",
        direction: "DESC",
    });

    if (!canViewPrice) {
        return null;
    }

    const handleReorder = (orderNumber) => {
        reorderItems({
            variables: {
                orderNumber: parseInt(orderNumber),
            },
        }).catch((e) => {
            // TODO: Display notification
            console.log("await reorderItems", e.message);
        });
    };

    const columns = [
        {
            label: t("customer.orders.table.numbers.purchase"),
            property: "purchase_number",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (item) => item.purchase_number ?? "—",
        },
        {
            label: t("customer.orders.table.numbers.additional"),
            property: "additional_number",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (item) => item.additional_number ?? "—",
        },
        {
            label: t("customer.orders.table.numbers.sumitomo"),
            property: "number",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (item) => item.number,
        },
        {
            label: t("customer.orders.table.initiator"),
            property: "order_by",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (item) => item.order_by,
        },
        {
            label: t("customer.orders.table.date"),
            property: "order_date",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (item) => dayjs(item.order_date).format("DD/mm/YYYY"),
        },
        {
            label: t("customer.orders.table.total"),
            property: "price",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (item) => formatPrice(item.total.grand_total.currency, item.total.grand_total.value),
        },
        {
            label: t("general.status"),
            labelClassName: "ml-8",
            property: "status",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (item) => (
                <span
                    className={`ml-36 lg:ml-0 px-2 lg:px-3 py-[5px] lg:py-2 border border-status-${item.status.toLowerCase()} bg-status-${item.status.toLowerCase()}/10 text-status-${item.status.toLowerCase()} text-[10px] md:text-xs`}
                >
                    {item.status}
                </span>
            ),
        },
        {
            label: t("general.actions"),
            labelClassName: "ml-auto",
            property: "actions",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (item) => (
                <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex align-middle gap-6">
                        <Button
                            href={`/customer/orders/view/${item.id}`}
                            styling="secondary"
                            className="min-w-auto px-2b lg:px-[calc(1.5rem-2px)]! py-2b lg:py-[calc(1rem-2px)]!"
                        >
                            <SvgIcon icon={CloudArrowDownIcon} className="xl:mr-2" />
                            <span className="hidden xl:inline">{t("customer.orders.table.invoice")}</span>
                        </Button>
                    </span>
                    <span className="inline-flex align-middle gap-6">
                        <Button
                            onClick={() => handleReorder(item.number)}
                            styling="primary"
                            className="min-w-auto px-2 lg:px-6 py-2! lg:py-4!"
                        >
                            <SvgIcon icon={CartIcon} className="xl:mr-2" />
                            <span className="hidden xl:inline">{t("customer.orders.table.reorder")}</span>
                        </Button>
                    </span>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg md:text-2xl font-medium">{t("customer.orders.table.recent.title")}</h2>
                <Button href="/customer/orders/index" styling="secondary">
                    {t("customer.orders.table.recent.button")}
                </Button>
            </div>
            <Table
                columns={columns}
                items={orders?.companyOrders.items ?? []}
                loading={loading}
                sortBy={sortBy}
                setSortBy={setSortBy}
                showHeaderOnMobile={true}
                noItems={t("customer.orders.table.empty")}
            />
        </>
    );
}

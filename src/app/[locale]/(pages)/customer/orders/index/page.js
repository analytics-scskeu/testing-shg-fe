"use client";

import { Button, Checkbox } from "@/components/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "@apollo/client";
import { GET_COMPANY_ORDERS, REORDER_ITEMS } from "@/api/queries/companyOrders";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Table from "@/components/table/Table";
import dayjs from "dayjs";
import { formatPrice } from "@/utils/helper";
import { SvgIcon } from "@/components/icons";
import { CartIcon } from "@/resources/images/icons";
import TablePagination from "@/components/table/TablePagination";

export default function Orders() {
    const t = useTranslations();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [checkedItems, setCheckedItems] = useState([]);

    const { data: orders, loading } = useQuery(GET_COMPANY_ORDERS, {
        variables: {
            currentPage: currentPage,
            pageSize: pageSize,
        },
    });
    const [reorderItems] = useMutation(REORDER_ITEMS);

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

    const [sortBy, setSortBy] = useState({
        property: "id",
        direction: "DESC",
    });

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg md:text-3xl font-medium">{t("customer.orders.index.title")}</h2>
                <div className="flex items-center gap-4 lg:gap-2">
                    <Checkbox
                        label={t("customer.orders.index.show_all")}
                        labelClassName="text-sm md:text-base font-medium mr-4 lg:mr-10"
                    />
                    <Button styling="secondary" className="hidden lg:block min-w-auto w-14 h-14 p-0!">
                        <FontAwesomeIcon icon={faFilter} size="xl" className="h-6 w-6" />
                    </Button>
                    <Button styling="secondary" className="min-w-auto w-10 lg:w-14 h-10 lg:h-14 p-0!" href="/contact">
                        <FontAwesomeIcon icon={faComments} size="xl" className="h-6 w-6" />
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                items={orders?.companyOrders.items ?? []}
                loading={loading}
                sortBy={sortBy}
                setSortBy={setSortBy}
                showHeaderOnMobile={true}
                noItems={t("customer.orders.table.empty")}
                checkbox={true}
                checkedItems={checkedItems}
                setCheckedItems={setCheckedItems}
            />
            <TablePagination
                totalPages={orders?.companyOrders.page_info.total_pages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                itemsPerPage={pageSize}
                onItemsPerPageChange={setPageSize}
            />
        </>
    );
}

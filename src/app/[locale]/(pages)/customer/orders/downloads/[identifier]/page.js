"use client";

import { useTranslations } from "next-intl";
import { use, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ORDER_DOCUMENT_FILE, GET_ORDER_DOCUMENT_TYPES } from "@/api/queries/documents";
import Table from "@/components/table/Table";
import dayjs from "dayjs";
import { Button } from "@/components/form";
import { SvgIcon } from "@/components/icons";
import { CloudArrowDownIcon, CommentBorderlessIcon } from "@/resources/images/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ButtonFilters from "@/components/table/ButtonFilters";

export default function Files({ params }) {
    const { identifier } = use(params);
    const t = useTranslations();

    const [sortBy, setSortBy] = useState({ property: "date", direction: "DESC" });
    const [checkedItems, setCheckedItems] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});

    const { data: list, loading: listLoading } = useQuery(GET_ORDER_DOCUMENT_TYPES, {
        variables: {
            identifier: identifier,
            filter: selectedFilters,
        },
    });
    const [getOrderDocumentFile] = useLazyQuery(GET_ORDER_DOCUMENT_FILE);

    const downloadDocuments = async (items, type) => {
        await items.map(async (item) => {
            const doc = list.biztalkDocTypeList.items.find((doc) => doc.doc_no === item);
            const identifier = type === "pdf" ? doc.identifier : doc.doc_identifier;
            const response = await getOrderDocumentFile({
                variables: {
                    identifier: identifier,
                    doc_no: doc.doc_no,
                    type: type,
                },
            });
            const base64Data = response.data.biztalkDocType.data;

            const base64 = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
            const dataUrl = `data:${type};base64,${base64}`;

            const blob = await fetch(dataUrl).then((res) => res.blob());

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${identifier}.${type}`;
            link.click();

            URL.revokeObjectURL(url);
        });
    };

    const columns = [
        {
            label: t("customer.orders.downloads.table.issue_date"),
            property: "date",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (item) => dayjs(item.date).format("DD/MM/YYYY"),
        },
        {
            label: t("customer.orders.downloads.table.doc_no"),
            property: "doc_no",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (item) => item.doc_no,
        },
        {
            label: t("customer.orders.downloads.table.order_no"),
            property: "order_no",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (item) => item.order_no,
        },
        {
            label: t("general.actions"),
            labelClassName: "ml-auto",
            labelCentered: true,
            property: "button",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (item) => (
                <div className="flex flex-col gap-2">
                    <Button
                        styling="clean"
                        className="min-w-auto p-0!"
                        onClick={() => downloadDocuments([item.doc_no], "pdf")}
                    >
                        <SvgIcon icon={CloudArrowDownIcon} className="mr-2" />
                        <span className="hidden lg:inline">{t("customer.orders.downloads.table.download_pdf")}</span>
                        <span className="inline lg:hidden">PDF</span>
                    </Button>
                    <Button
                        styling="clean"
                        className="min-w-auto p-0!"
                        onClick={() => downloadDocuments([item.doc_no], "xml")}
                    >
                        <SvgIcon icon={CloudArrowDownIcon} className="mr-2" />
                        <span className="hidden lg:inline">{t("customer.orders.downloads.table.download_xml")}</span>
                        <span className="inline lg:hidden">XML</span>
                    </Button>
                </div>
            ),
        },
    ];

    const filters = [
        {
            id: "doc_no",
            label: t("customer.orders.downloads.table.doc_no"),
            type: "TEXT",
        },
        {
            id: "order_no",
            label: t("customer.orders.downloads.table.order_no"),
            type: "TEXT",
        },
        {
            id: "date",
            label: t("customer.orders.downloads.table.issue_date"),
            type: "DATE",
        },
    ];

    return (
        <div className="flex flex-col items-start gap-6">
            <Button href="/customer/orders/downloads" styling="clean" className="p-0!">
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="font-bold text-primary ml-2">{t("customer.orders.downloads.back")}</span>
            </Button>
            <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
                <div className="w-full flex items-center justify-between grow flex-wrap">
                    <h2 className="text-lg md:text-3xl font-medium">
                        {checkedItems.length === 0
                            ? t("customer.orders.downloads.title")
                            : t("general.items_selected", { count: checkedItems.length })}
                    </h2>
                    {checkedItems.length > 0 && (
                        <Button styling="clean" className="min-w-auto p-2!" onClick={() => setCheckedItems([])}>
                            {t("general.cancel")}
                        </Button>
                    )}
                    {checkedItems.length === 0 && (
                        <>
                            <ButtonFilters
                                filters={filters}
                                selectedFilters={selectedFilters}
                                setSelectedFilters={setSelectedFilters}
                                buttonClassName="ml-auto mr-4"
                                containerClassName="order-last"
                            />
                            <Button
                                styling="secondary"
                                className="min-w-auto w-10 lg:w-14 h-10 lg:h-14 p-0!"
                                href="/contact"
                            >
                                <SvgIcon icon={CommentBorderlessIcon} width={32} height={32} className="mx-auto" />
                            </Button>
                        </>
                    )}
                </div>
                <div className="w-full lg:w-auto flex items-center gap-2 min-w-fit">
                    {checkedItems.length > 0 && (
                        <div className="flex flex-col lg:flex-row lg:items-center gap-2 gap-y-6 grow">
                            <Button
                                styling="secondary"
                                className="grow lg:grow-0"
                                onClick={() => {
                                    downloadDocuments(checkedItems, "pdf").then(() => setCheckedItems([]));
                                }}
                            >
                                <SvgIcon icon={CloudArrowDownIcon} className="mr-2" />
                                {t("customer.orders.downloads.download_all_pdf")}
                            </Button>
                            <Button
                                styling="secondary"
                                className="grow lg:grow-0"
                                onClick={() => {
                                    downloadDocuments(checkedItems, "xml").then(() => setCheckedItems([]));
                                }}
                            >
                                <SvgIcon icon={CloudArrowDownIcon} className="mr-2" />
                                {t("customer.orders.downloads.download_all_xml")}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <Table
                items={list?.biztalkDocTypeList.items ?? []}
                columns={columns}
                sortBy={sortBy}
                setSortBy={setSortBy}
                loading={listLoading}
                rowKey={"doc_no"}
                showHeaderOnMobile={true}
                checkbox={true}
                checkedItems={checkedItems}
                setCheckedItems={setCheckedItems}
            />
        </div>
    );
}

"use client";

import { Button } from "@/components/form";
import { useTranslations } from "next-intl";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ORDER_DOCUMENT_FILE, GET_ORDER_DOCUMENTS } from "@/api/queries/documents";
import dayjs from "dayjs";
import Table from "@/components/table/Table";
import { useState } from "react";
import { CloudArrowDownIcon, CommentBorderlessIcon, EyeIcon } from "@/resources/images/icons";
import { SvgIcon } from "@/components/icons";

export default function Downloads() {
    const t = useTranslations();

    const [sortBy, setSortBy] = useState({ property: "date", direction: "DESC" });
    const { data: documents, loading: documentsLoading } = useQuery(GET_ORDER_DOCUMENTS);

    const [getOrderDocumentFile] = useLazyQuery(GET_ORDER_DOCUMENT_FILE);

    const downloadDocument = async (doc) => {
        const response = await getOrderDocumentFile({
            variables: {
                identifier: doc.identifier,
                doc_no: "",
                type: "xml",
            },
        });
        const base64Data = response.data.biztalkDocType.data;

        const base64 = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
        const dataUrl = `data:xml;base64,${base64}`;

        const blob = await fetch(dataUrl).then((res) => res.blob());

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${doc.identifier}.xml`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const columns = [
        {
            label: t("customer.orders.downloads.table.last_date"),
            property: "date",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (document) => dayjs(document.date).format("DD/MM/YYYY"),
        },
        {
            label: t("customer.orders.downloads.table.title"),
            property: "title",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (document) => document.title,
        },
        {
            label: t("general.actions"),
            labelClassName: "ml-auto",
            labelCentered: true,
            property: "button",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (document) => (
                <div className="flex flex-col gap-2">
                    {document.button !== "view" && (
                        <Button styling="clean" className="min-w-auto p-0!" onClick={() => downloadDocument(document)}>
                            <SvgIcon icon={CloudArrowDownIcon} className="mr-2" />
                            <span className="hidden lg:inline">
                                {t("customer.orders.downloads.table.download_xml")}
                            </span>
                        </Button>
                    )}
                    {document.button === "view" && (
                        <Button
                            styling="clean"
                            className="min-w-auto p-0!"
                            href={`/customer/orders/downloads/${document.identifier}`}
                        >
                            <SvgIcon icon={EyeIcon} className="lg:mr-2" />
                            <span className="hidden lg:inline">
                                {t(`customer.orders.downloads.table.${document.button}`)}
                            </span>
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg md:text-3xl font-medium">{t("customer.orders.downloads.title")}</h2>
                <div className="flex items-center gap-4 lg:gap-2">
                    <Button styling="secondary" className="min-w-auto w-10 lg:w-14 h-10 lg:h-14 p-0!" href="/contact">
                        <SvgIcon icon={CommentBorderlessIcon} width={32} height={32} className="mx-auto" />
                    </Button>
                </div>
            </div>
            <Table
                items={documents?.biztalkDocsList.items ?? []}
                columns={columns}
                sortBy={sortBy}
                setSortBy={setSortBy}
                loading={documentsLoading}
                rowKey={"identifier"}
                showHeaderOnMobile={true}
            />
        </>
    );
}

"use client";

import Table from "@/components/table/Table";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DEACTIVATE_COMPANY_CUSTOMER, GET_COMPANY_CUSTOMERS } from "@/api/queries/company";
import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { Button } from "@/components/form";
import { PencilIcon } from "@/resources/images/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/Modal";
import { GET_CUSTOMER_ROLES } from "@/api/queries/customer";

export default function UsersTable() {
    const t = useTranslations();
    const customer = useSelector(selectorUser);

    const { data: roles } = useQuery(GET_CUSTOMER_ROLES);
    const { data: customers, loading: customersLoading } = useQuery(GET_COMPANY_CUSTOMERS, {
        variables: {
            companyId: customer.data.company_id,
        },
    });
    const [deactivateCompanyCustomer, { loading: deactivatingCompanyCustomer }] = useMutation(
        DEACTIVATE_COMPANY_CUSTOMER,
        {
            update(cache, { data }) {
                const deactivatedCustomer = data.deactivateCompanyCustomer.customer;

                cache.updateQuery(
                    {
                        query: GET_COMPANY_CUSTOMERS,
                        variables: {
                            companyId: customer.data.company_id,
                        },
                    },
                    (data) => {
                        if (!data?.getCompanyCustomers?.customers) return data;

                        return {
                            ...data,
                            getCompanyCustomers: {
                                ...data.getCompanyCustomers,
                                customers: data.getCompanyCustomers.customers.map((item) =>
                                    item.customer_id === deactivatedCustomer.customer_id
                                        ? { ...deactivatedCustomer }
                                        : item
                                ),
                            },
                        };
                    }
                );
            },
        }
    );

    const columns = [
        {
            label: t("customer.company.index.table.number"),
            property: "customer_id",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (customer) => customer.customer_id,
        },
        {
            label: t("customer.company.index.table.date"),
            property: "date_added",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (customer) => dayjs(customer.date_added).format("DD/mm/YYYY"),
        },
        {
            label: t("customer.company.index.table.name"),
            property: "firstname",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (customer) => customer.firstname + " " + customer.lastname,
        },
        {
            label: t("customer.company.index.table.email"),
            property: "email",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (customer) => customer.email,
        },
        {
            label: t("customer.company.index.table.role"),
            property: "role_name",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (customer) => (
                <span className="bg-body/10 lg:bg-transparent px-3 lg:px-0 leading-7 lg:leading-2">
                    {roles.getCustomerRoles.roles.find((role) => parseInt(role.role_id) === parseInt(customer.role_id))
                        ?.name ?? "Super Admin"}
                </span>
            ),
        },
        {
            label: t("general.status"),
            property: "status",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (customer) => (
                <span
                    className={`text-sm text-center inline-block leading-7 px-3
                        ${!customer.status ? "bg-status-canceled/10 text-status-canceled" : !customer.last_login_at ? "bg-status-pending/10 text-status-pending" : "bg-status-complete/10 text-status-complete"}
                    `}
                >
                    {!customer.status
                        ? t("customer.company.index.table.inactive")
                        : !customer.last_login_at
                          ? t("customer.company.index.table.pending")
                          : t("customer.company.index.table.active")}
                </span>
            ),
        },
        {
            label: t("general.actions"),
            property: "actions",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (companyCustomer) =>
                companyCustomer.status && customer?.data.email !== companyCustomer.email ? (
                    <div className="flex">
                        {customer?.permissions.includes("users_edit") && (
                            <Button
                                className="min-w-auto p-2! w-9 h-9"
                                styling="clean"
                                href={`/customer/company/user/${companyCustomer.customer_id}/edit`}
                            >
                                <PencilIcon />
                            </Button>
                        )}
                        {customer?.permissions.includes("users_delete") && (
                            <Button
                                className="min-w-auto p-2! w-9 h-9"
                                styling="clean"
                                onClick={() => setDeleteDialogFor(companyCustomer.customer_id)}
                            >
                                <FontAwesomeIcon icon={faBan} className="text-danger" />
                            </Button>
                        )}
                    </div>
                ) : null,
        },
    ];

    const [sortBy, setSortBy] = useState({
        property: "customer_id",
        direction: "DESC",
    });

    const [deleteDialogFor, setDeleteDialogFor] = useState(false);

    const sortedCustomers = useMemo(() => {
        return [...(customers?.getCompanyCustomers.customers ?? [])].sort((a, b) => {
            const { property, direction } = sortBy;
            const aVal = a[property];
            const bVal = b[property];

            // Handle null values
            if (aVal === null && bVal === null) return 0;
            if (aVal === null) return direction === "ASC" ? -1 : 1;
            if (bVal === null) return direction === "ASC" ? 1 : -1;

            // Handle non-null values
            if (aVal < bVal) {
                return direction === "ASC" ? -1 : 1;
            }
            if (aVal > bVal) {
                return direction === "ASC" ? 1 : -1;
            }
            return 0;
        });
    }, [customers, sortBy]);

    const handleDeactivateCustomer = async (companyId, customerId) => {
        await deactivateCompanyCustomer({
            variables: {
                input: { company_id: companyId, customer_id: customerId, self_deactivation: false },
            },
        });
        setDeleteDialogFor(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex w-full justify-between">
                <h2 className="text-lg md:text-3xl font-medium">{t("customer.company.index.table.title")}</h2>
                {customer?.permissions.includes("users_add") && (
                    <Button href="/customer/company/user/create">{t("customer.company.index.table.create")}</Button>
                )}
            </div>
            <Table
                columns={columns}
                items={sortedCustomers}
                loading={customersLoading || deactivatingCompanyCustomer}
                sortBy={sortBy}
                setSortBy={setSortBy}
                rowKey={"customer_id"}
            />

            <Modal
                show={deleteDialogFor}
                onConfirmText={t("general.yes")}
                onConfirm={() => handleDeactivateCustomer(customer.data.company_id, deleteDialogFor)}
                onCancelText={t("general.no")}
                onClose={() => setDeleteDialogFor(false)}
            >
                <div className="max-w-[388px] mx-auto">
                    <h3 className="text-[32px] font-bold text-body mb-4">{t("customer.company.user.delete.title")}</h3>
                    <p className="text-base font-normal text-center opacity-80 mb-10">
                        {t("customer.company.user.delete.details")}
                    </p>
                </div>
            </Modal>
        </div>
    );
}

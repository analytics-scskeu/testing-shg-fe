"use client";

import Table from "@/components/table/Table";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DEACTIVATE_COMPANY_ADDRESS, GET_COMPANY, GET_COMPANY_ADDRESSES } from "@/api/queries/company";
import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";
import { useTranslations } from "next-intl";
import { Button, Input } from "@/components/form";
import { PencilIcon } from "@/resources/images/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import Modal from "@/components/Modal";

export default function AddressesTable() {
    const t = useTranslations();
    const customer = useSelector(selectorUser);

    const { data: company, loading: companyLoading } = useQuery(GET_COMPANY, {
        variables: {
            companyId: customer.data?.company_id,
        },
    });

    const { data: addresses, loading: addressesLoading } = useQuery(GET_COMPANY_ADDRESSES, {
        variables: {
            superUserId: company?.getCompany?.super_user_id,
        },
        skip: !company?.getCompany?.super_user_id,
    });
    const [deactivateCompanyAddress, { loading: deactivatingCompanyAddress }] = useMutation(
        DEACTIVATE_COMPANY_ADDRESS,
        {
            refetchQueries: [
                {
                    query: GET_COMPANY_ADDRESSES,
                    variables: {
                        superUserId: company?.getCompany?.super_user_id,
                    },
                },
            ],
        }
    );

    const columns = [
        {
            label: t("customer.company.addresses.table.number"),
            property: "id",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: true,
            renderCell: (address) => address.id,
        },
        {
            label: t("customer.company.addresses.table.address"),
            property: "address",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (address) =>
                `${address.street.join(", ")}, ${address.region.region}, ${address.city}, ${address.country_id}`,
        },
        {
            label: t("general.status"),
            property: "address_status",
            sortable: true,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (address) => (
                <span
                    className={`text-sm text-center inline-block leading-7 px-3
                        ${address.address_status === 1 ? "bg-status-complete/10 text-status-complete" : address.address_status === 2 ? "bg-status-pending/10 text-status-pending" : "bg-status-canceled/10 text-status-canceled"}
                    `}
                >
                    {address.address_status === 1
                        ? t("customer.company.index.table.active")
                        : address.address_status === 2
                          ? t("customer.company.index.table.pending")
                          : t("customer.company.index.table.inactive")}
                </span>
            ),
        },
        {
            label: t("general.actions"),
            property: "actions",
            sortable: false,
            visibleWhenMobile: true,
            collapsedWhenMobile: false,
            renderCell: (address) => (
                <div className="flex">
                    <Button
                        className="min-w-auto p-2! w-9 h-9"
                        styling="clean"
                        href={`/customer/company/addresses/${address.id}/edit`}
                    >
                        <PencilIcon />
                    </Button>
                    {address.address_status !== 0 && (
                        <Button
                            className="min-w-auto p-2! w-9 h-9"
                            styling="clean"
                            onClick={() => setDeleteDialogFor(address.id)}
                        >
                            <FontAwesomeIcon icon={faBan} className="text-danger" />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const [sortBy, setSortBy] = useState({
        property: "id",
        direction: "DESC",
    });

    const [searchBy, setSearchBy] = useState("");

    const [deleteDialogFor, setDeleteDialogFor] = useState(false);

    const searchAddresses = (companyAddresses, searchBy) => {
        return [...companyAddresses].filter((company) => {
            return (
                company.city.match(searchBy) ||
                company.country_id.match(searchBy) ||
                company.region.region_code.match(searchBy) ||
                company.region.region.match(searchBy) ||
                company.street[0]?.match(searchBy) ||
                company.street[1]?.match(searchBy)
            );
        });
    };

    const sortAddresses = (companyAddresses, sortBy) => {
        return [...companyAddresses].sort((a, b) => {
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
    };

    const adjustedAddresses = useMemo(() => {
        const searchedAddresses = searchAddresses(addresses?.getCompanyCustomer.addresses ?? [], searchBy);
        return sortAddresses(searchedAddresses, sortBy);
    }, [addresses, sortBy, searchBy]);

    const handleDeactivateAddress = async (companyId, addressId) => {
        await deactivateCompanyAddress({
            variables: {
                input: { company_id: companyId, address_id: addressId },
            },
        });
        setDeleteDialogFor(false);
    };

    return (
        <div className="flex flex-col gap-6">
            <Input
                placeholder={t("customer.company.addresses.table.search")}
                onChange={setSearchBy}
                className="lg:max-w-1/3"
                inputClassName="py-3 pl-10"
                customIcon={
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-[11px] pointer-events-none"
                    />
                }
            />
            <Table
                columns={columns}
                items={adjustedAddresses}
                loading={companyLoading || addressesLoading || deactivatingCompanyAddress}
                sortBy={sortBy}
                setSortBy={setSortBy}
                rowKey={"id"}
            />

            <Modal
                show={deleteDialogFor}
                onConfirmText={t("general.yes")}
                onConfirm={() => handleDeactivateAddress(customer.data.company_id, deleteDialogFor)}
                onCancelText={t("general.no")}
                onClose={() => setDeleteDialogFor(false)}
            >
                <div className="max-w-[388px] mx-auto">
                    <h3 className="text-[32px] font-bold text-body mb-4">
                        {t("customer.company.addresses.delete.title")}
                    </h3>
                    <p className="text-base font-normal text-center opacity-80 mb-10">
                        {t("customer.company.addresses.delete.details")}
                    </p>
                </div>
            </Modal>
        </div>
    );
}

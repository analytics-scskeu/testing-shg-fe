"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CREATE_COMPANY_USER_SCHEMA } from "@/utils/validation";
import { Button, Input, Select } from "@/components/form";
import { useTranslations } from "next-intl";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_COUNTRIES, GET_COUNTRY_DATA } from "@/api/queries/general";
import flags from "@/resources/images/flags.png";
import { useEffect, useState } from "react";
import { GET_ATTRIBUTES_FORM } from "@/api/queries/auth";
import { GET_CUSTOMER_ROLES } from "@/api/queries/customer";
import { CREATE_COMPANY_CUSTOMER, GET_COMPANY_CUSTOMER, GET_COMPANY_CUSTOMERS } from "@/api/queries/company";
import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";
import { addNotification } from "@/store/notification";
import { useRouter } from "@/i18n/routing";
import { useNotifications } from "@/hooks";

export default function UserForm({ customerId = null }) {
    const section = customerId ? "update" : "create";
    const [getCompanyCustomer] = useLazyQuery(GET_COMPANY_CUSTOMER, {
        variables: {
            customerId: customerId,
        },
    });

    const t = useTranslations();
    const { notifications, setNotifications, RenderNotifications } = useNotifications();
    const [countryDetails, setCountryDetails] = useState(null);
    const customer = useSelector(selectorUser);
    const router = useRouter();

    const { data: fields } = useQuery(GET_ATTRIBUTES_FORM, {
        variables: {
            form_code: "customer_account_create",
        },
    });
    const { data: countries } = useQuery(GET_COUNTRIES);
    const [getCountryData] = useLazyQuery(GET_COUNTRY_DATA);
    const { data: roles } = useQuery(GET_CUSTOMER_ROLES);

    const [createCustomer] = useMutation(CREATE_COMPANY_CUSTOMER, {
        update(cache, { data }) {
            const changedCustomer = data.createOrUpdateCompanyCustomer.customer;

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
                            customers: [...data.getCompanyCustomers.customers, changedCustomer],
                        },
                    };
                }
            );
        },
    });

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(CREATE_COMPANY_USER_SCHEMA),
        mode: "onChange",
        defaultValues: {
            email: "",
            firstname: "",
            lastname: "",
            role_id: "",
            company_role: "",
            origin_country_id: "",
            origin_phone_number: "",
        },
    });

    useEffect(() => {
        if (customerId) {
            const loadData = async () => {
                const companyCustomer = (await getCompanyCustomer()).data.getCompanyCustomer;
                getCountryData({ variables: { country_id: companyCustomer.origin_country_id } }).then((response) => {
                    setCountryDetails(response.data?.countryData || null);
                });
                reset({
                    ...companyCustomer,
                    role_id: companyCustomer.role_id.toString(),
                });
            };
            loadData();
        }
    }, [customerId, getCompanyCustomer, getCountryData, reset]);

    const handleCountryChange = (value) => {
        getCountryData({ variables: { country_id: value } }).then((response) => {
            setCountryDetails(response.data?.countryData || null);
            if (!getValues("origin_phone_number"))
                setValue("origin_phone_number", response.data?.countryData.phone_prefix || "");
        });
    };

    const handleUpdateDetails = async (formData) => {
        setNotifications([]);

        const inputCreateCustomer = {
            input: {
                ...formData,
                company_id: customer.data.company_id,
                customer_id: customerId,
            },
        };
        const createCustomerResponse = await createCustomer({
            variables: inputCreateCustomer,
        });
        if (await hasMutationErrors(createCustomerResponse)) return;

        addNotification({
            type: "success",
            message: createCustomerResponse.data.createOrUpdateCompanyCustomer.message,
        });
        router.push("/customer/company/index");
    };

    const hasMutationErrors = async (response) => {
        const { errors } = response;
        if (errors) {
            errors.map((notification) => {
                setNotifications([
                    ...notifications,
                    {
                        type: "error",
                        message: notification.message,
                    },
                ]);
            });
            return true;
        }
        return false;
    };

    return (
        <>
            <h2 className="text-lg md:text-3xl font-medium">{t(`customer.company.user.${section}.title`)}</h2>
            <RenderNotifications />
            <form className="w-full lg:w-1/2" onSubmit={handleSubmit(handleUpdateDetails)}>
                <Input
                    error={errors.email?.message}
                    control={control}
                    type="email"
                    name="email"
                    label={t("fields.email")}
                    required={true}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 mt-6">
                    <Input
                        error={errors.firstname?.message}
                        control={control}
                        type="text"
                        name="firstname"
                        label={t("fields.first_name")}
                        required={true}
                    />
                    <Input
                        error={errors.lastname?.message}
                        control={control}
                        type="text"
                        name="lastname"
                        label={t("fields.last_name")}
                        required={true}
                    />
                    <Select
                        control={control}
                        options={roles?.getCustomerRoles.roles.map((elem) => {
                            return {
                                value: elem.role_id,
                                label: elem.name,
                            };
                        })}
                        emptyOption={false}
                        label={t("fields.role")}
                        required={true}
                        name={"role_id"}
                        placeholder={t("fields.role_placeholder")}
                    />
                    <Select
                        control={control}
                        options={fields?.attributesForm.items.find((elem) => elem.code === "company_role").options}
                        emptyOption={true}
                        label={t("fields.job_title")}
                        required={false}
                        name={"company_role"}
                    />
                    <Select
                        options={countries?.countries.map((elem) => {
                            return {
                                value: elem.id,
                                label: elem.full_name_locale,
                            };
                        })}
                        label={t("fields.country")}
                        emptyOption={false}
                        required={true}
                        name={"origin_country_id"}
                        control={control}
                        onChange={handleCountryChange}
                        placeholder={t("fields.country_placeholder")}
                    />
                    <Input
                        error={errors.origin_phone_number?.message}
                        control={control}
                        onlyNumbers={true}
                        labelClassName="text-xs md:text-sm"
                        inputClassName={watch("origin_country_id") && "pl-8"}
                        label={t("fields.phone_number")}
                        name={"origin_phone_number"}
                        customIcon={
                            countryDetails?.background_position && (
                                <span
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-[11px] pointer-events-none"
                                    style={{
                                        backgroundImage: `url(${flags.src})`,
                                        backgroundPosition: countryDetails.background_position,
                                    }}
                                ></span>
                            )
                        }
                    />
                </div>
                <div className="flex flex-wrap lg:flex-nowrap gap-6 mt-10">
                    <Button
                        styling="clean"
                        className="min-w-auto w-full lg:w-auto"
                        onClick={(e) => {
                            e.preventDefault();
                            reset();
                        }}
                    >
                        <span>{t(`customer.company.user.${section}.cancel`)}</span>
                    </Button>
                    <Button type="submit" styling="primary" className="min-w-auto w-full lg:w-auto">
                        <span>{t(`customer.company.user.${section}.submit`)}</span>
                    </Button>
                </div>
            </form>
        </>
    );
}

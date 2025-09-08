"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
    CUSTOMER_EMAIL_UPDATE,
    CUSTOMER_PASSWORD_UPDATE,
    CUSTOMER_UPDATE,
    GET_CUSTOMER_ROLES,
} from "@/api/queries/customer";
import { GET_COUNTRIES, GET_COUNTRY_DATA } from "@/api/queries/general";
import { removeCookie } from "@/utils/session";
import { Button, Checkbox, Input, Select } from "@/components/form";
import flags from "@/resources/images/flags.png";
import { useRouter } from "@/i18n/routing";
import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UPDATE_ACCOUNT_DETAILS_SCHEMA, UPDATE_ACCOUNT_DETAILS_WITH_PASS_SCHEMA } from "@/utils/validation";
import { useNotifications } from "@/hooks";
import { addNotification } from "@/store/notification";
import { GET_ATTRIBUTES_FORM } from "@/api/queries/auth";

export default function Details() {
    const t = useTranslations();
    const { notifications, setNotifications, RenderNotifications } = useNotifications();
    const [changePassword, setChangePassword] = useState(false);

    const router = useRouter();
    const { data: customer } = useSelector(selectorUser);
    const { data: countries } = useQuery(GET_COUNTRIES);
    const { data: roles } = useQuery(GET_CUSTOMER_ROLES);
    const { data: fields } = useQuery(GET_ATTRIBUTES_FORM, {
        variables: {
            form_code: "customer_account_edit",
        },
    });

    const formatCustomerData = (customer) => {
        if (!customer) {
            return {};
        }

        const { custom_attributes, ...rest } = customer;
        return {
            ...rest,
            ...(custom_attributes?.reduce((acc, attr) => {
                if (attr.selected_options) {
                    return { ...acc, [attr.code]: attr.selected_options.map((option) => option.value) };
                }
                return { ...acc, [attr.code]: attr.value };
            }, {}) || {}),
        };
    };
    const [data] = useState(formatCustomerData(customer));

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(changePassword ? UPDATE_ACCOUNT_DETAILS_WITH_PASS_SCHEMA : UPDATE_ACCOUNT_DETAILS_SCHEMA),
        mode: "onChange",
        defaultValues: {
            email: data?.email ?? "",
            firstname: data?.firstname ?? "",
            lastname: data?.lastname ?? "",
            company_role: data?.company_role[0] ?? "",
            origin_country_id: data?.origin_country_id ?? "",
            origin_phone_number: data?.origin_phone_number ?? "",
            password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    const { data: countryData, refetch: refetchCountryData } = useQuery(GET_COUNTRY_DATA, {
        variables: { country_id: data.origin_country_id },
    });

    const handleCountryChange = (value) => {
        refetchCountryData({
            country_id: value,
        }).then((r) => {
            setValue("origin_phone_number", r.data.countryData?.phone_prefix + " " || "");
        });
    };

    const [updateCustomerEmail] = useMutation(CUSTOMER_EMAIL_UPDATE);
    const [updateCustomer] = useMutation(CUSTOMER_UPDATE);
    const [updateCustomerPassword] = useMutation(CUSTOMER_PASSWORD_UPDATE);

    const handleUpdateDetails = async (formData) => {
        setNotifications([]);

        const inputEmail = {
            email: formData.email,
            password: formData.password,
        };
        const updateCustomerEmailResponse = await updateCustomerEmail({
            variables: inputEmail,
        });
        if (await hasMutationErrors(updateCustomerEmailResponse)) return;

        const inputCustomer = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            custom_attributes: {
                origin_country_id: {
                    attribute_code: "origin_country_id",
                    value: formData.origin_country_id,
                },
                origin_phone_number: {
                    attribute_code: "origin_phone_number",
                    value: formData.origin_phone_number,
                },
                company_role: {
                    attribute_code: "company_role",
                    value: formData.company_role,
                },
            },
        };
        const updateCustomerResponse = await updateCustomer({
            variables: {
                input: inputCustomer,
            },
        });
        if (await hasMutationErrors(updateCustomerResponse)) return;

        if (changePassword) {
            const inputPassword = {
                currentPassword: formData.password,
                newPassword: formData.new_password,
            };
            const updateCustomerPasswordResponse = await updateCustomerPassword({
                variables: inputPassword,
            });
            if (await hasMutationErrors(updateCustomerPasswordResponse)) return;
        }

        addNotification({
            type: "success",
            message: t("customer.account.edit.success"),
        });
        await removeCookie("auth_token");
        localStorage.removeItem("auth_token");
        router.refresh();
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
            <RenderNotifications />
            <form className="w-full lg:w-1/2" onSubmit={handleSubmit(handleUpdateDetails)}>
                <fieldset>
                    <h2 className="text-lg md:text-3xl font-medium mb-6 lg:mb-8">{t("customer.account.edit.title")}</h2>
                    <h3 className="text-base md:text-2xl font-medium mb-6">
                        {t("customer.account.edit.details.title")}
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <span className="text-xs md:text-sm font-medium text-gray-300">
                                {t("customer.account.edit.details.created")}
                            </span>
                            <span className="text-sm md:text-base font-medium mt-2">{data.created_at}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs md:text-sm font-medium text-gray-300">
                                {t("customer.account.edit.details.active")}
                            </span>
                            <span className="text-sm md:text-base font-medium mt-2">TODO</span>
                        </div>
                    </div>
                    <div className="customer-information">
                        <div className="mt-4 lg:mt-6 email required" id="email-fields">
                            <Input
                                error={errors.email?.message}
                                control={control}
                                type="email"
                                name="email"
                                required={true}
                                label={t("fields.email")}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 ">
                        <div className="mt-4 lg:mt-6 w-full field-name-firstname required">
                            <Input
                                error={errors.firstname?.message}
                                control={control}
                                type="text"
                                name="firstname"
                                required={true}
                                label={t("fields.first_name")}
                            />
                        </div>
                        <div className="mt-4 lg:mt-6 w-full field-name-lastname required">
                            <Input
                                error={errors.lastname?.message}
                                control={control}
                                type="text"
                                name="lastname"
                                required={true}
                                label={t("fields.last_name")}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 ">
                        <div className="mt-4 lg:mt-6 company_role w-full required">
                            <Select
                                control={control}
                                name="company_role"
                                label={t("fields.job_title")}
                                required={true}
                                emptyOption={false}
                                placeholder={t("fields.loading")}
                                options={
                                    fields?.attributesForm.items.find((elem) => elem.code === "company_role").options
                                }
                            />
                        </div>
                        <div className="mt-4 lg:mt-6 role_id w-full required">
                            <Select
                                value={data?.role_id}
                                options={roles?.getCustomerRoles.roles.map((elem) => {
                                    return {
                                        value: parseInt(elem.role_id),
                                        label: elem.name,
                                    };
                                })}
                                emptyOption={false}
                                label={t("fields.account_type")}
                                disabled={true}
                                placeholder={t("fields.loading")}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="mt-4 lg:mt-6 w-full required">
                            <Select
                                control={control}
                                name="origin_country_id"
                                label={t("fields.country")}
                                required={true}
                                onChange={(value) => {
                                    handleCountryChange(value);
                                }}
                                placeholder={t("fields.loading")}
                                options={
                                    countries?.countries.map((country) => ({
                                        value: country.id,
                                        label: country.full_name_english,
                                    })) ?? []
                                }
                            />
                        </div>
                        <div className="mt-4 lg:mt-6 w-full">
                            <Input
                                error={errors.origin_phone_number?.message}
                                control={control}
                                name="origin_phone_number"
                                label={t("fields.phone_optional")}
                                inputClassName={watch("origin_country_id") && "pl-8"}
                                autoComplete="tel"
                                customIcon={
                                    data.origin_country_id &&
                                    countryData?.countryData.background_position && (
                                        <span
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-[11px] pointer-events-none"
                                            style={{
                                                backgroundImage: `url(${flags.src})`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: countryData?.countryData.background_position,
                                            }}
                                        ></span>
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className="mt-4 lg:mt-6 password w-full current required" id="password-fields">
                        <Input
                            value={data?.role_id}
                            error={errors.password?.message}
                            control={control}
                            type="password"
                            name="password"
                            required={true}
                            label={t("fields.current_password")}
                            autoComplete="password"
                        />
                    </div>
                    <div className="mt-4 lg:mt-6 flex items-center">
                        <Checkbox
                            onChange={(value) => {
                                setChangePassword(value);
                            }}
                            name="change_password"
                            label={t("fields.change_password")}
                            labelClassName="font-medium"
                        />
                        <span className="sr-only" id="change_password_description">
                            {t("fields.change_password_description")}
                        </span>
                    </div>
                    {changePassword && (
                        <div>
                            <div className="mt-4 lg:mt-6 password w-full current required" id="password-fields">
                                <Input
                                    error={errors.new_password?.message}
                                    control={control}
                                    type="password"
                                    name="new_password"
                                    required={true}
                                    autoComplete={"off"}
                                    label={t("fields.new_password")}
                                />
                            </div>
                            <div className="mt-4 lg:mt-6 password w-full current required" id="password-fields">
                                <Input
                                    error={errors.confirm_password?.message}
                                    control={control}
                                    type="password"
                                    name="confirm_password"
                                    required={true}
                                    autoComplete={"off"}
                                    label={t("fields.confirm_new_password")}
                                />
                            </div>
                        </div>
                    )}
                </fieldset>
                <div className="flex flex-wrap lg:flex-nowrap gap-6 mt-10">
                    <Button type="submit" styling="primary" className="min-w-auto w-full lg:w-auto">
                        <span>{t("customer.account.edit.fields.save")}</span>
                    </Button>
                    <Button styling="secondary" className="min-w-auto w-full lg:w-auto" onClick={() => reset()}>
                        <span>{t("customer.account.edit.fields.cancel")}</span>
                    </Button>
                </div>
            </form>
        </>
    );
}

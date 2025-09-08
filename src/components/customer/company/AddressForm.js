"use client";

import { useNotifications } from "@/hooks";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_COUNTRIES, GET_COUNTRY_DATA } from "@/api/queries/general";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CREATE_COMPANY_ADDRESS_SCHEMA } from "@/utils/validation";
import { Button, Input } from "@/components/form";
import Select from "../../form/Select";
import flags from "@/resources/images/flags.png";
import {
    CREATE_COMPANY_ADDRESS,
    GET_COMPANY,
    GET_COMPANY_ADDRESSES,
    UPDATE_COMPANY_ADDRESS,
} from "@/api/queries/company";
import { useSelector } from "react-redux";
import { selectorUser } from "@/store/user";
import { addNotification } from "@/store/notification";
import { useRouter } from "@/i18n/routing";

export default function AddressFrom({ addressId = null }) {
    const section = addressId ? "update" : "create";

    const t = useTranslations();
    const router = useRouter();
    const { notifications, setNotifications, RenderNotifications } = useNotifications();

    const [countryDetails, setCountryDetails] = useState(null);
    const { data: countries } = useQuery(GET_COUNTRIES);
    const [getCountryData] = useLazyQuery(GET_COUNTRY_DATA);

    const customer = useSelector(selectorUser);
    const { data: company } = useQuery(GET_COMPANY, {
        variables: {
            companyId: customer.data?.company_id,
        },
    });
    const [createAddress, { loading: addressCreating }] = useMutation(
        addressId ? UPDATE_COMPANY_ADDRESS : CREATE_COMPANY_ADDRESS,
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
    const [getCompanyAddresses] = useLazyQuery(GET_COMPANY_ADDRESSES, {
        variables: {
            superUserId: company?.getCompany?.super_user_id,
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
        resolver: zodResolver(CREATE_COMPANY_ADDRESS_SCHEMA),
        disabled: addressCreating,
        mode: "onChange",
        defaultValues: {
            firstname: "",
            lastname: "",
            street: ["", ""],
            region_id: "",
            city: "",
            postcode: "",
            country_id: "",
            telephone: "",
            factory_nr: "",
            gate_nr: "",
        },
    });

    useEffect(() => {
        if (company && addressId) {
            const loadData = async () => {
                const companyAddress = (await getCompanyAddresses()).data.getCompanyCustomer.addresses.find(
                    (address) => address.id === parseInt(addressId)
                );
                getCountryData({ variables: { country_id: companyAddress.country_id } }).then((response) => {
                    setCountryDetails(response.data?.countryData || null);
                });
                reset({
                    firstname: companyAddress.firstname ?? "",
                    lastname: companyAddress.lastname ?? "",
                    street: companyAddress.street ?? ["", ""],
                    region_id: companyAddress.region.region_id ?? "",
                    city: companyAddress.city ?? "",
                    postcode: companyAddress.postcode ?? "",
                    country_id: companyAddress.country_id ?? "",
                    telephone: companyAddress.telephone ?? "",
                    factory_nr: companyAddress.factory_nr ?? "",
                    gate_nr: companyAddress.gate_nr ?? "",
                });
            };
            loadData();
        }
    }, [company, addressId, getCompanyAddresses, getCountryData, reset]);

    const handleCountryChange = (value) => {
        getCountryData({ variables: { country_id: value } }).then((response) => {
            setCountryDetails(response.data?.countryData || null);
            if (!getValues("telephone")) setValue("telephone", response.data?.countryData.phone_prefix || "");
        });
    };

    const handleUpdateAddress = async (formData) => {
        setNotifications([]);

        const inputCreateAddress = addressId
            ? {
                  input: {
                      address_id: addressId,
                      json_fields: JSON.stringify(formData),
                  },
              }
            : {
                  input: {
                      company_id: customer.data.company_id,
                      json_fields: JSON.stringify(formData),
                  },
              };
        const createAddressResponse = await createAddress({
            variables: inputCreateAddress,
        });
        if (await hasMutationErrors(createAddressResponse)) return;

        addNotification({
            type: "success",
            message: addressId
                ? createAddressResponse.data.editCompanyAddress.message
                : createAddressResponse.data.createCompanyAddress.message,
        });
        router.push("/customer/company/addresses");
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
            <h2 className="text-lg md:text-3xl font-medium">{t(`customer.company.addresses.${section}.title`)}</h2>
            <RenderNotifications />
            <form className="w-full lg:w-1/2" onSubmit={handleSubmit(handleUpdateAddress)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 my-6">
                    <Input
                        control={control}
                        error={errors.firstname?.message}
                        label={t("fields.company_address")}
                        name={"firstname"}
                        type={"text"}
                        required={true}
                    />
                    <Input
                        control={control}
                        error={errors.lastname?.message}
                        label={t("fields.contact_person")}
                        name={"lastname"}
                        type={"text"}
                        required={true}
                    />
                    <Input
                        error={errors.telephone?.message}
                        control={control}
                        onlyNumbers={true}
                        blockDigits={countryDetails?.phone_prefix}
                        disabled={!watch("country_id")}
                        inputClassName={watch("country_id") && "pl-8"}
                        label={t("fields.phone_number")}
                        name={"telephone"}
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
                    <Select
                        control={control}
                        error={errors.country_id?.message}
                        label={t("fields.country")}
                        name={"country_id"}
                        emptyOption={false}
                        required={true}
                        placeholder={t("fields.country_placeholder")}
                        options={countries?.countries.map((elem) => {
                            return {
                                value: elem.id,
                                label: elem.full_name_locale,
                            };
                        })}
                        onChange={handleCountryChange}
                    />
                </div>
                {countries?.countries.find((country) => country.id === watch("country_id"))?.available_regions ? (
                    <Select
                        control={control}
                        error={errors.region_id?.message}
                        label={t("fields.region")}
                        name={"region_id"}
                        emptyOption={true}
                        required={false}
                        options={countries?.countries
                            .find((country) => country.id === watch("country_id"))
                            ?.available_regions.map((region) => {
                                return {
                                    value: region.id,
                                    label: region.name,
                                };
                            })}
                    />
                ) : (
                    <Input
                        control={control}
                        disabled={!watch("country_id")}
                        error={errors.region_id?.message}
                        label={t("fields.region")}
                        name={"region_id"}
                        type={"text"}
                        required={false}
                    />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 my-6">
                    <Input
                        control={control}
                        error={errors.city?.message}
                        label={t("fields.city")}
                        name={"city"}
                        type={"text"}
                        required={true}
                    />
                    <Input
                        control={control}
                        error={errors.postcode?.message}
                        label={t("fields.postcode")}
                        name={"postcode"}
                        type={"text"}
                        required={true}
                    />
                </div>
                <Input
                    control={control}
                    error={errors.street?.[0]?.message}
                    label={t("fields.address")}
                    name={"street[0]"}
                    type={"text"}
                    required={true}
                />
                <Input
                    control={control}
                    error={errors.street?.[1]?.message}
                    name={"street[1]"}
                    type={"text"}
                    required={true}
                    labelClassName={"mt-6"}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 my-6">
                    <Input
                        control={control}
                        error={errors.factory_nr?.message}
                        label={t("fields.factory_nr")}
                        name={"factory_nr"}
                        type={"text"}
                        labelClassName={"mt-6"}
                    />
                    <Input
                        control={control}
                        error={errors.gate_nr?.message}
                        label={t("fields.gate_nr")}
                        name={"gate_nr"}
                        type={"text"}
                        labelClassName={"mt-6"}
                    />
                </div>
                <div className="flex flex-wrap lg:flex-nowrap gap-6 mt-10">
                    <Button
                        styling="clean"
                        className="min-w-auto w-full lg:w-auto"
                        onClick={(e) => {
                            e.preventDefault();
                            setCountryDetails(null);
                            reset();
                        }}
                    >
                        <span>{t(`customer.company.addresses.${section}.cancel`)}</span>
                    </Button>
                    <Button type="submit" styling="primary" className="min-w-auto w-full lg:w-auto">
                        <span>{t(`customer.company.addresses.${section}.submit`)}</span>
                    </Button>
                </div>
            </form>
        </>
    );
}

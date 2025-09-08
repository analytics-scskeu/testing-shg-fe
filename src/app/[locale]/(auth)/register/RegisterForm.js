"use client";

import { Button, Checkbox, Input } from "@/components/form";
import { useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_COUNTRIES, GET_COUNTRY_DATA } from "@/api/queries/general";
import { MUTATION_REGISTER } from "@/api/queries/auth";
import Select from "@/components/form/Select";
import flags from "@/resources/images/flags.png";
import { encrypt, setCookie } from "@/utils/session";
import Notify from "@/components/form/Notify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGISTER_SCHEMA } from "@/utils/validation";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function RegisterForm({ fields }) {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(REGISTER_SCHEMA),
        mode: "onChange",
        defaultValues: {
            email: "",
            firstname: "",
            lastname: "",
            company_name: "",
            company_role: "",
            origin_country_id: "",
            origin_phone_number: "",
            how_did_you_find_us: "",
            password: "",
            confirm_password: "",
            terms_agree: false,
        },
    });

    const t = useTranslations();
    const [notifications, setNotifications] = useState([]);
    const [countryDetails, setCountryDetails] = useState(null);
    const { data: countries } = useQuery(GET_COUNTRIES);
    const [getCountryData] = useLazyQuery(GET_COUNTRY_DATA);
    const [registerCustomer] = useMutation(MUTATION_REGISTER);
    const router = useRouter();

    const handleRegister = async (formData) => {
        try {
            const response = await registerCustomer({
                variables: formData,
            });

            const { data: registerData, errors } = response;
            const registerResponse = registerData?.createCustomerWithOtp;
            if (registerResponse?.success) {
                const expire = new Date(Date.now() + registerResponse.remaining_time * 1000).getTime();
                const encryptedData = await encrypt({
                    customer_id: registerResponse.customer_id,
                    purpose: "register",
                    remaining_time: expire,
                });
                await setCookie("session", encryptedData, expire);
                router.push("/verify/register");
            } else if (errors.length) {
                if (errors[0].extensions?.category === "graphql-input") {
                    setNotifications([
                        {
                            type: "error",
                            message: errors[0].extensions.message,
                        },
                    ]);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {notifications.map((notification, key) => {
                return (
                    <Notify
                        className={"mb-4"}
                        key={key}
                        type={notification.type}
                        onClose={() => {
                            setNotifications(notifications.filter((_, index) => index !== key));
                        }}
                        text={notification.message}
                    />
                );
            })}
            <form className={"space-y-4 mt-10"} onSubmit={handleSubmit(handleRegister)}>
                <Input
                    error={errors.email?.message}
                    control={control}
                    type="email"
                    name="email"
                    label={t("fields.email")}
                    required={true}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Input
                        error={errors.company_name?.message}
                        control={control}
                        type="text"
                        name="company_name"
                        label={t("fields.company_name")}
                        required={true}
                    />
                    <Select
                        control={control}
                        options={fields.items.find((elem) => elem.code === "company_role").options}
                        emptyOption={true}
                        label={t("fields.role")}
                        required={true}
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
                        emptyOption={true}
                        required={true}
                        name={"origin_country_id"}
                        control={control}
                        onChange={(value) => {
                            getCountryData({ variables: { country_id: value } }).then((response) => {
                                setCountryDetails(response.data?.countryData || null);
                                setValue("origin_phone_number", response.data?.countryData.phone_prefix || "");
                            });
                        }}
                    />
                    <Input
                        error={errors.origin_phone_number?.message}
                        control={control}
                        onlyNumbers={true}
                        disabled={!watch("origin_country_id")}
                        inputClassName={watch("origin_country_id") && "pl-8"}
                        label={t("fields.phone_number")}
                        name={"origin_phone_number"}
                        blockDigits={countryDetails?.phone_prefix}
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

                <Select
                    error={errors.how_did_you_find_us?.message}
                    control={control}
                    options={fields.items.find((elem) => elem.code === "how_did_you_find_us").options}
                    label={t("fields.how_did_you_find_us")}
                    emptyOption={true}
                    required={true}
                    name={"how_did_you_find_us"}
                />

                <Input
                    error={errors.password?.message}
                    control={control}
                    type="password"
                    name="password"
                    label={t("fields.password")}
                    required={true}
                    autoComplete={"password"}
                />

                {/*<p className={"mb-5"}>Password Strength: No Password</p>*/}

                <Input
                    error={errors.confirm_password?.message}
                    control={control}
                    type="password"
                    name="confirm_password"
                    label={t("fields.confirm_password")}
                    required={true}
                    autoComplete={"confirm_password"}
                />

                <div className="flex items-center justify-between mb-10">
                    <Checkbox
                        control={control}
                        name={"terms_agree"}
                        label={t.rich("general.agree_terms_and_conditions", {
                            terms: (chunks) => (
                                <Link href={"#"} className={"text-link underline"}>
                                    {chunks}
                                </Link>
                            ),
                            privacy: (chunks) => (
                                <Link href={"#"} className={"text-link underline"}>
                                    {chunks}
                                </Link>
                            ),
                        })}
                    />
                </div>

                <Button type={"submit"} disabled={!watch("terms_agree")} className={"mb-10 w-full md:w-auto"}>
                    {t("auth.register.create_account")}
                </Button>
            </form>
        </>
    );
}

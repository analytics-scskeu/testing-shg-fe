"use client";

import { useForm } from "react-hook-form";
import { Button, Checkbox, Input, Radio, Select, Textarea } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CONTACT_SCHEMA } from "@/utils/validation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_COUNTRIES, GET_COUNTRY_DATA } from "@/api/queries/general";
import { useState } from "react";
import flags from "@/resources/images/flags.png";

export default function ContactForm() {
    const t = useTranslations();
    const {
        control,
        watch,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(CONTACT_SCHEMA),
        defaultValues: {
            contact_inquiry: "",
            industry: "",
            email: "",
            name: "",
            country: "",
            phone_number: "",
            company_address: "",
            company_name: "",
            interested_in: "",
            using_sumitomo_tools: true,
            buying_from_us: "",
            distributor_name: "",
            message: "",
            agree_to_terms: false,
        },
    });

    const { data: countries } = useQuery(GET_COUNTRIES);
    const [getCountryData] = useLazyQuery(GET_COUNTRY_DATA);
    const [countryDetails, setCountryDetails] = useState(null);

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form
            className="bg-white shadow-xl p-8 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete={"off"}
        >
            <h2 className="text-2xl font-bold text-primary-shade1">{t("contact.complete_form")}</h2>

            <Select
                error={errors.contact_inquiry?.message}
                labelClassName={"md:text-sm"}
                control={control}
                label={t("fields.contact_inquiry")}
                name={"contact_inquiry"}
                options={[]}
            />
            <Select
                error={errors.industry?.message}
                labelClassName={"md:text-sm"}
                control={control}
                label={t("fields.industry")}
                name={"industry"}
                options={[]}
            />
            <div className="grid md:grid-cols-2 gap-4">
                <Input
                    error={errors.email?.message}
                    labelClassName={"md:text-sm"}
                    control={control}
                    label={t("fields.email")}
                    name={"email"}
                />
                <Input
                    error={errors.name?.message}
                    labelClassName={"md:text-sm"}
                    control={control}
                    label={t("fields.name")}
                    name={"name"}
                />
                <Select
                    error={errors.country?.message}
                    labelClassName={"md:text-sm"}
                    control={control}
                    label={t("fields.country")}
                    name={"country"}
                    options={countries?.countries.map((elem) => {
                        return {
                            value: elem.id,
                            label: elem.full_name_locale,
                        };
                    })}
                    onChange={(value) => {
                        getCountryData({ variables: { country_id: value } }).then((response) => {
                            setCountryDetails(response.data?.countryData || null);
                            setValue("phone_number", response.data?.countryData.phone_prefix || "");
                        });
                    }}
                />
                <Input
                    error={errors.phone_number?.message}
                    labelClassName={"md:text-sm"}
                    control={control}
                    label={t("fields.phone_number")}
                    name={"phone_number"}
                    onlyNumbers={true}
                    inputClassName={watch("country") && "pl-8"}
                    blockDigits={countryDetails?.phone_prefix}
                    disabled={!watch("country")}
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
                <Input
                    error={errors.company_address?.message}
                    labelClassName={"md:text-sm"}
                    control={control}
                    label={t("fields.company_address")}
                    name={"company_address"}
                />
                <Input
                    error={errors.company_name?.message}
                    labelClassName={"md:text-sm"}
                    control={control}
                    label={t("fields.company_name")}
                    name={"company_name"}
                />
            </div>
            <Input
                error={errors.interested_in?.message}
                labelClassName={"md:text-sm"}
                control={control}
                label={t("fields.interested_in")}
                name={"interested_in"}
            />
            <span className={"text-sm"}>Are you using Sumitomo tools already?</span>
            <div className="mt-4 flex gap-20">
                <Radio
                    labelClassName={"md:text-sm"}
                    control={control}
                    label={t("general.yes")}
                    value={true}
                    name={"using_sumitomo_tools"}
                />
                <Radio
                    labelClassName={"md:text-sm"}
                    control={control}
                    label={t("general.no")}
                    value={false}
                    name={"using_sumitomo_tools"}
                />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <Select
                    error={errors.buying_from_us?.message}
                    labelClassName={"md:text-sm"}
                    control={control}
                    label={t("fields.buying_from_us")}
                    name={"buying_from_us"}
                    options={[]}
                />
                <Input
                    error={errors.distributor_name?.message}
                    labelClassName={"md:text-sm"}
                    control={control}
                    label={t("fields.distributor_name")}
                    name={"distributor_name"}
                />
            </div>
            <Textarea
                error={errors.message?.message}
                labelClassName={"md:text-sm"}
                control={control}
                label={t("fields.message")}
                name={"message"}
            />
            <Checkbox
                error={errors.agree_to_terms?.message}
                labelClassName={"md:text-sm"}
                control={control}
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
                name={"agree_to_terms"}
            />
            <Button
                disabled={!watch("agree_to_terms")}
                className={"max-md:w-full mt-10"}
                styling={"primary"}
                type={"submit"}
            >
                {t("contact.submit_message")}
            </Button>
        </form>
    );
}

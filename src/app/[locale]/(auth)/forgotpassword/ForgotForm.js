"use client";

import { Button, Input } from "@/components/form";
import { encrypt, setCookie } from "@/utils/session";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FORGOT_SCHEMA } from "@/utils/validation";
import { useTranslations } from "next-intl";
import { useMutation } from "@apollo/client";
import { MUTATION_FORGET_PASSWORD } from "@/api/queries/auth";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import Notify from "@/components/form/Notify";

export default function ForgotForm() {
    const {
        control,
        handleSubmit,
        watch,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(FORGOT_SCHEMA),
        defaultValues: {
            email: "",
        },
    });

    const [notifications, setNotifications] = useState([]);
    const [forgetPassword] = useMutation(MUTATION_FORGET_PASSWORD);
    const t = useTranslations();
    const router = useRouter();

    const handleForgot = async (formData) => {
        setNotifications([]);

        try {
            const response = await forgetPassword({
                variables: formData,
            });

            const { data: responseData, errors } = response;

            const forgetResponse = responseData?.requestPasswordResetOtp;
            if (forgetResponse?.success) {
                const expire = new Date(Date.now() + forgetResponse.remaining_time * 1000).getTime();
                const encryptedData = await encrypt({
                    customer_id: forgetResponse.customer_id,
                    email: getValues("email"),
                    purpose: "reset",
                    remaining_time: expire,
                });
                await setCookie("session", encryptedData, expire);
                router.push("/verify/forget");
            } else if (errors.length) {
                const invalidCredentials = ["graphql-no-such-entity", "graphql-authentication"];
                if (invalidCredentials.includes(errors[0].extensions?.category)) {
                    setNotifications([
                        {
                            type: "error",
                            message: errors[0].message,
                        },
                    ]);
                } else {
                    setNotifications([
                        {
                            type: "error",
                            message: t("something_went_wrong") + " " + t("try_again"),
                        },
                    ]);
                }
            }
        } catch (error) {
            setNotifications([
                {
                    type: "error",
                    message: t("something_went_wrong") + " " + t("try_again"),
                },
            ]);
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
            <form className={"space-y-10"} onSubmit={handleSubmit(handleForgot)}>
                <Input
                    control={control}
                    type="email"
                    name="email"
                    label={t("fields.email")}
                    required={true}
                    error={errors.email?.message}
                />

                <Button disabled={!watch("email")} type={"submit"} className={"mb-10 w-full md:w-auto"}>
                    {t("continue")}
                </Button>
            </form>
        </>
    );
}

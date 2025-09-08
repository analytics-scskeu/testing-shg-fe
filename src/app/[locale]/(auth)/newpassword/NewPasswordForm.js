"use client";

import { Button, Input } from "@/components/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RESET_PASSWORD_SCHEMA } from "@/utils/validation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Notify from "@/components/form/Notify";
import { useMutation } from "@apollo/client";
import { MUTATION_RESET_PASSWORD } from "@/api/queries/auth";
import { removeCookie } from "@/utils/session";
import { useRouter } from "@/i18n/routing";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/notification";

export default function NewPasswordForm({ sessionCookie, resetToken }) {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(RESET_PASSWORD_SCHEMA),
        mode: "onChange",
        defaultValues: {
            password: "",
            confirm_password: "",
        },
    });

    const dispatch = useDispatch();
    const router = useRouter();
    const t = useTranslations();
    const [notifications, setNotifications] = useState([]);
    const [resetPassword] = useMutation(MUTATION_RESET_PASSWORD);

    const handleReset = async (formData) => {
        setNotifications([]);
        try {
            const response = await resetPassword({
                variables: {
                    new_password: formData.password,
                    customer_id: sessionCookie.customer_id,
                    reset_token: resetToken,
                    email: sessionCookie.email,
                },
            });

            const { data: resetData } = response;
            const resetResponse = resetData?.resetPassword;
            if (resetResponse?.success) {
                await removeCookie("session");
                await removeCookie("reset_token");
                dispatch(
                    addNotification({
                        type: "success",
                        message: resetResponse.message,
                    })
                );
                router.push("/login");
            } else {
                setNotifications([
                    {
                        type: "error",
                        message: t("something_went_wrong") + " " + t("try_again"),
                    },
                ]);
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
            <form className={"space-y-10"} onSubmit={handleSubmit(handleReset)}>
                <Input
                    control={control}
                    type="password"
                    name="password"
                    label={t("fields.new_password")}
                    autoComplete={"off"}
                    required={true}
                    error={errors.password?.message}
                />

                <Input
                    control={control}
                    type="password"
                    name="confirm_password"
                    label={t("fields.confirm_new_password")}
                    required={true}
                    autoComplete={"off"}
                    error={errors.confirm_password?.message}
                />

                <Button
                    disabled={!watch("password") || !watch("confirm_password")}
                    type={"submit"}
                    className={"mb-10 w-full md:w-auto"}
                >
                    {t("auth.reset.button")}
                </Button>
            </form>
        </>
    );
}

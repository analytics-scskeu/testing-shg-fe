"use client";

import { Button, Checkbox, Input } from "@/components/form";
import { Link, useRouter } from "@/i18n/routing";
import { useMutation } from "@apollo/client";
import { MUTATION_LOGIN } from "@/api/queries/auth";
import { encrypt, setCookie } from "@/utils/session";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LOGIN_SCHEMA } from "@/utils/validation";
import { useTranslations } from "next-intl";
import { useNotifications } from "@/hooks";

export default function LoginForm() {
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(LOGIN_SCHEMA),
        defaultValues: {
            email: "",
            password: "",
            remember_me: false,
        },
    });

    const t = useTranslations();
    const { setNotifications, RenderNotifications } = useNotifications();
    const [login] = useMutation(MUTATION_LOGIN);
    const router = useRouter();

    const handleLogin = async (formData) => {
        setNotifications([]);

        try {
            const response = await login({
                variables: formData,
            });

            const { data: loginData, errors } = response;
            const loginResponse = loginData?.generateLoginOtp;
            if (loginResponse?.success) {
                const expire = new Date(Date.now() + loginResponse.remaining_time * 1000).getTime();
                const encryptedData = await encrypt({
                    customer_id: loginResponse.customer_id,
                    purpose: "login",
                    remaining_time: expire,
                });
                await setCookie("session", encryptedData, expire);
                router.push("/verify/login");
            } else if (errors.length) {
                const invalidCredentials = ["graphql-no-such-entity", "graphql-authentication"];
                if (invalidCredentials.includes(errors[0].extensions?.category)) {
                    setValue("password", "");
                    setNotifications([
                        {
                            type: "error",
                            message: errors[0].message,
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
            <RenderNotifications />
            <form className={"space-y-6"} onSubmit={handleSubmit(handleLogin)}>
                <Input
                    control={control}
                    type="email"
                    name="email"
                    label={t("fields.email")}
                    required={true}
                    error={errors.email?.message}
                />

                <Input
                    type="password"
                    name="password"
                    label={t("fields.password")}
                    required={true}
                    autoComplete={"password"}
                    control={control}
                    error={errors.password?.message}
                />

                <div className="flex items-center justify-between mb-10">
                    <Checkbox
                        name={"remember_me"}
                        label={t("fields.remember_me")}
                        labelClassName={"font-medium text-shade1"}
                        control={control}
                    />
                    <Link href="/forgotpassword" className="text-shade1 font-medium text-sm md:text-base">
                        {t("auth.login.forgot_password")}?
                    </Link>
                </div>

                <Button
                    disabled={!watch("email") || !watch("password")}
                    type={"submit"}
                    className={"mb-10 w-full md:w-auto"}
                >
                    {t("auth.sign_in")}
                </Button>
            </form>
        </>
    );
}

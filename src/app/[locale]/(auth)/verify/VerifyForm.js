"use client";

import { useState } from "react";
import { Button, DigitCode } from "@/components/form";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
    RESEND_LOGIN_OTP,
    RESEND_REGISTRATION_OTP,
    RESEND_RESEND_PASSWORD_OTP,
    VALIDATE_OTP,
    VALIDATE_REGISTER_OTP,
    VALIDATE_RESEND_PASSWORD_OTP,
} from "@/api/queries/auth";
import { encrypt, removeCookie, setCookie } from "@/utils/session";
import { setIsGuest, setPermissions, setUser } from "@/store/user";
import { useDispatch } from "react-redux";
import { useCountdown } from "@/hooks";
import { Link, useRouter } from "@/i18n/routing";
import Arrow from "@/components/icons/Arrow";
import Notify from "@/components/form/Notify";
import { useTranslations } from "next-intl";
import { GET_CUSTOMER, GET_CUSTOMER_ROLES, GET_IS_GUEST_CUSTOMER } from "@/api/queries/customer";

const getConstByPurpose = (purpose) => {
    switch (purpose) {
        case "register":
            return {
                mutation_validate: VALIDATE_REGISTER_OTP,
                mutation_resend: RESEND_REGISTRATION_OTP,
                responseKey: "validateRegistrationOtp",
                responseResendKey: "resendRegistrationOtp",
                redirect: "/",
                back: "/login",
                back_text: "button_back",
            };
        case "login":
            return {
                mutation_validate: VALIDATE_OTP,
                mutation_resend: RESEND_LOGIN_OTP,
                responseKey: "validateLoginOtp",
                responseResendKey: "resendLoginOtp",
                redirect: "/",
                back: "/login",
                back_text: "button_back",
            };
        case "reset":
            return {
                mutation_validate: VALIDATE_RESEND_PASSWORD_OTP,
                mutation_resend: RESEND_RESEND_PASSWORD_OTP,
                responseKey: "validateResetPasswordOtp",
                responseResendKey: "resendResetPasswordOtp",
                redirect: "/newpassword",
                back: "/forgotpassword",
                back_text: "button_back_forgot",
            };
        default:
            return {};
    }
};

export default function VerifyForm({ sessionCookie }) {
    const constantsByPurpose = getConstByPurpose(sessionCookie.purpose);
    const t = useTranslations();
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [errors, setErrors] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [validateOtp] = useMutation(constantsByPurpose.mutation_validate);
    const [resendOtp] = useMutation(constantsByPurpose.mutation_resend);
    const [getCustomer] = useLazyQuery(GET_CUSTOMER);
    const [getIsGuest] = useLazyQuery(GET_IS_GUEST_CUSTOMER);
    const [getCustomerRoles] = useLazyQuery(GET_CUSTOMER_ROLES);
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        remainingTime = "",
        isExpired,
        reset,
    } = useCountdown({
        time: sessionCookie.remaining_time,
    });

    const isComplete = (arr) => arr.every((d) => d !== "");

    const handleChangeDigit = (value, index) => {
        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);
        isComplete(newDigits) && submitOtp(newDigits);
    };

    const handlePaste = (newDigits) => {
        setDigits(newDigits);
        isComplete(newDigits) && submitOtp(newDigits);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        isComplete(digits) && submitOtp(digits);
    };

    const submitOtp = async (arrayOfDigits) => {
        try {
            const response = await validateOtp({
                variables: {
                    customer_id: sessionCookie.customer_id,
                    otp_code: arrayOfDigits.join(""),
                    purpose: sessionCookie.purpose,
                },
            });

            const { data: dataResponse, errors } = response;
            const validateOtpResponse = dataResponse[constantsByPurpose.responseKey];
            if (validateOtpResponse?.success) {
                setErrors({});
                if (sessionCookie.purpose === "reset") {
                    const expire = new Date(Date.now() + 600 * 1000).getTime();
                    const encryptedData = await encrypt({
                        customer_id: sessionCookie.customer_id,
                        email: sessionCookie.email,
                        purpose: "reset",
                        remaining_time: expire,
                    });
                    await setCookie("session", encryptedData, expire);
                    await setCookie("reset_token", validateOtpResponse.reset_token, expire);
                } else {
                    await removeCookie("session");
                    const expire = new Date(Date.now() + 356 * 24 * 60 * 60 * 1000).getTime();
                    await setCookie("auth_token", validateOtpResponse.token, expire);
                    localStorage.setItem("auth_token", validateOtpResponse.token);
                    const customer = await getCustomer();
                    const isGuest = await getIsGuest();
                    const roles = await getCustomerRoles();
                    await dispatch(setUser(customer.data.customer));
                    await dispatch(setIsGuest(isGuest.data.isGuestCustomer));
                    await dispatch(
                        setPermissions(
                            roles.data.getCustomerRoles.roles.find(
                                (role) => parseInt(role.role_id) === parseInt(customer.data.customer.role_id)
                            )?.permissions ?? []
                        )
                    );
                }
                router.push(constantsByPurpose.redirect);
            } else {
                clearDigits();
                setErrors({
                    ...errors,
                    otp: t("auth.verify.invalid_code"),
                });
            }
        } catch {
            clearDigits();
            setErrors({
                ...errors,
                otp: t("auth.verify.invalid_code"),
            });
        }
    };

    const clearDigits = () => {
        setDigits(digits.map(() => ""));
    };

    const resendCode = async (e) => {
        e.preventDefault();
        try {
            const response = await resendOtp({
                variables: {
                    customer_id: sessionCookie.customer_id,
                    purpose: sessionCookie.purpose,
                },
            });
            const { data: dataResponse, errors } = response;
            const resendOtpResponse = dataResponse[constantsByPurpose.responseResendKey];
            if (resendOtpResponse?.success) {
                const expire = new Date(Date.now() + resendOtpResponse.remaining_time * 1000).getTime();
                const encryptedData = await encrypt({
                    customer_id: sessionCookie.customer_id,
                    purpose: sessionCookie.purpose,
                    remaining_time: expire,
                });
                await setCookie("session", encryptedData, expire);
                reset(expire);
            } else if (errors.length) {
                setNotifications([
                    {
                        type: "error",
                        message: t("something_went_wrong"),
                    },
                ]);
            }
        } catch {
            setNotifications([
                {
                    type: "error",
                    message: t("something_went_wrong"),
                },
            ]);
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
            <form onSubmit={handleSubmit}>
                <div className="flex flex-row gap-3 justify-start mb-2">
                    <DigitCode
                        digits={digits}
                        onPaste={handlePaste}
                        onChange={handleChangeDigit}
                        className={errors.otp && "border-danger-shade1 focus:border-danger-shade2"}
                    />
                </div>
                {errors.otp && <span className="text-danger-shade1">{errors.otp}</span>}
                <Button type={"submit"} disabled={!isComplete(digits)} className={"mt-15 justify-center"}>
                    {t("auth.verify.button_verify")}
                </Button>
            </form>
            <div className={"mb-20 mt-15 flex justify-between"}>
                <Link href={constantsByPurpose.back} className="flex text-link font-bold">
                    <Arrow className={"mt-1"} />
                    {t(`auth.verify.${constantsByPurpose.back_text}`)}
                </Link>
                {(isExpired && (
                    <Link href="#" onClick={resendCode} className="flex text-gray-shade1 hover:underline">
                        {t("auth.verify.button_resend")}
                    </Link>
                )) || (
                    <span className={"text-gray-shade1"}>
                        {t("auth.verify.resend_in_text") + " "}
                        <span suppressHydrationWarning className={"font-bold"}>
                            {remainingTime}
                        </span>
                    </span>
                )}
            </div>
        </>
    );
}

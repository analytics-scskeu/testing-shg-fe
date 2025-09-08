"use client";

import { useState } from "react";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { GET_NEWSLETTER_FIELDS, SUBMIT_NEWSLETTER_FORM } from "@/api/queries/newsletter";
import { Button, Input } from "./form";
import { useTranslations } from "next-intl";

export default function Newsletter() {
    const t = useTranslations();
    const { data: fieldsData } = useSuspenseQuery(GET_NEWSLETTER_FIELDS);
    const fields = fieldsData?.hubspotNewsletterForm?.fields || [];

    const [data, setData] = useState(
        fields.reduce((obj, field) => {
            obj[field.name] = "";
            return obj;
        }, {})
    );

    const [responseMessage, setResponseMessage] = useState("");
    const [isFormResponseVisible, setIsFormResponseVisible] = useState(false);
    const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

    const [submitNewsletter] = useMutation(SUBMIT_NEWSLETTER_FORM);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsFormResponseVisible(false);
        setResponseMessage("");
        try {
            const response = await submitNewsletter({
                variables: {
                    input: {
                        fields: Object.entries(data).map(([key, value]) => ({
                            name: key,
                            value: value,
                        })),
                    },
                },
            });
            const newsletterResponse = response?.data?.submitHubspotNewsletterForm;

            if (newsletterResponse?.success) {
                setResponseMessage(newsletterResponse.message || "Thank you for subscribing!");
                setIsSubmittedSuccessfully(true);
            } else {
                setResponseMessage("An error occurred. Please try again.");
                setIsSubmittedSuccessfully(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFormResponseVisible(true);
        }
    };

    return (
        <div className="hubspot-footer-newsletter mx-auto container -mb-16 z-10 relative px-5 lg:px-24 xl:px-32 mt-8 md:mt-16">
            <div className="hubspot-footer-newsletter-inner flex flex-col md:flex-row md:items-center justify-end p-6 md:p-10 bg-white shadow-xl">
                <div className="hubspot-footer-newsletter-content text-left mb-2.5 md:mb-0 md:pr-12 md:w-1/2">
                    <h2 className="text-lg lg:text-[32px] font-medium mb-4">{t("newsletter.title")}</h2>
                    <p className="text-base font-normal">{t("newsletter.content")}</p>
                </div>
                <div className="flex-grow flex justify-end">
                    {!isSubmittedSuccessfully && (
                        <form
                            id={`hubspot-form-newsletter`}
                            className="form hubspot-form flex flex-col sm:flex-row flex-wrapß items-center justify-center w-full "
                            onSubmit={handleSubmit}
                        >
                            {fields.map((field) => (
                                <div key={field.name} className="flex-1 w-full mb-2.5 sm:mb-0 sm:mr-4">
                                    <Input
                                        value={data[field.name]}
                                        type={field.type || "text"}
                                        name={field.name}
                                        placeholder={
                                            field.label == "Email"
                                                ? t("newsletter.email_address")
                                                : field.label || field.name
                                        }
                                        className="mt-0 py-3.5"
                                        required={true}
                                        onChange={(value, name) => {
                                            setData({
                                                ...data,
                                                [name]: value,
                                            });
                                        }}
                                    />
                                </div>
                            ))}

                            <div className="actions w-full sm:w-auto">
                                <Button
                                    type={"submit"}
                                    className="py-3.5 text-base hover:from-primary-shade1 hover:to-primary-shade1 max-sm:w-full max-sm:block"
                                >
                                    {t("newsletter.subscribe")}
                                </Button>
                            </div>
                        </form>
                    )}
                    {isFormResponseVisible && (
                        <div
                            id={`form-response-newsletter`}
                            className={`message text-lg font-medium
                                    ${responseMessage.includes("success") ? "text-primary-shade1" : "text-red-700"}`}
                            role="alert"
                        >
                            {responseMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

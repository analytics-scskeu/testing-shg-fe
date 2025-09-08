import { z } from "zod";

const passwordValidation = (val, ctx) => {
    const checks = [
        /[a-z]/.test(val), // lowercase
        /[A-Z]/.test(val), // uppercase
        /[0-9]/.test(val), // number
        /[^a-zA-Z0-9]/.test(val), // symbol
    ];
    const matchedCount = checks.filter(Boolean).length;
    const required = 3;
    const missing = required - matchedCount;

    if (missing > 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: {
                key: `password_pattern`,
                params: { missing: missing },
            },
        });
    }
};

const minLength = (min) => {
    return z.string().refine((val) => val.length >= min, {
        message: { key: "min_char", params: { chars: min } },
    });
};

const getPasswordValidation = () => {
    return minLength(8).superRefine((val, ctx) => {
        passwordValidation(val, ctx);
    });
};

const booleanRequired = (shouldBe, message = "field_no_match") => {
    return z.boolean().refine((val) => val === shouldBe, {
        message: message,
    });
};

export const REGISTER_SCHEMA = z
    .object({
        email: z.string().min(1, "required").email("email"),
        password: getPasswordValidation(),
        confirm_password: z.string(),
        firstname: z.string().min(1, "required"),
        lastname: z.string().min(1, "required"),
        company_name: z.string().min(1, "required"),
        company_role: z.string().min(1, "required"),
        origin_country_id: z.string().min(1, "required"),
        origin_phone_number: z.string(),
        how_did_you_find_us: z.string().min(1, "required"),
        terms_agree: z.boolean(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "same_as_password",
        path: ["confirm_password"],
    });

export const LOGIN_SCHEMA = z.object({
    email: z.string().min(1, "required").email("email"),
    password: z.string().min(1, "required"),
    remember_me: z.boolean(),
});

export const FORGOT_SCHEMA = z.object({
    email: z.string().min(1, "required").email("email"),
});

export const RESET_PASSWORD_SCHEMA = z
    .object({
        password: getPasswordValidation(),
        confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "same_as_password",
        path: ["confirm_password"],
    });

export const UPDATE_ACCOUNT_DETAILS_SCHEMA = z.object({
    email: z.string().min(1, "required").email("email"),
    firstname: z.string().min(1, "required"),
    lastname: z.string().min(1, "required"),
    company_role: z.string().min(1, "required"),
    origin_country_id: z.string().min(1, "required"),
    origin_phone_number: z.string().min(1, "required"),
    password: z.string().min(1, "required"),
});

export const UPDATE_ACCOUNT_DETAILS_WITH_PASS_SCHEMA = z
    .object({
        email: z.string().min(1, "required").email("email"),
        firstname: z.string().min(1, "required"),
        lastname: z.string().min(1, "required"),
        company_role: z.string().min(1, "required"),
        origin_country_id: z.string().min(1, "required"),
        origin_phone_number: z.string().min(1, "required"),
        password: z.string().min(1, "required"),
        new_password: getPasswordValidation(),
        confirm_password: z.string(),
    })
    .refine(
        (data) => {
            return data.new_password === data.confirm_password;
        },
        {
            message: "same_as_password",
            path: ["confirm_password"],
        }
    );

export const CREATE_COMPANY_USER_SCHEMA = z.object({
    email: z.string().min(1, "required").email("email"),
    firstname: z.string().min(1, "required"),
    lastname: z.string().min(1, "required"),
    role_id: z.string().min(1, "required"),
    company_role: z.string(),
    origin_country_id: z.string().min(1, "required"),
    origin_phone_number: z.string(),
});

export const ADD_WISHLIST_SCHEMA = z.object({
    wishlist: z.union([z.string().min(1, "required"), z.number()]),
    newWishlist: z.boolean(),
});

export const CREATE_COMPANY_ADDRESS_SCHEMA = z.object({
    firstname: z.string().min(1, "required"),
    lastname: z.string().min(1, "required"),
    street: z.array(z.string().min(1, "required")).length(2),
    region_id: z.union([z.string(), z.number()]),
    city: z.string().min(1, "required"),
    postcode: z.string().min(1, "required"),
    country_id: z.string().min(1, "required"),
    telephone: z.string().min(1, "required"),
    factory_nr: z.string(),
    gate_nr: z.string(),
});

export const CONTACT_SCHEMA = z.object({
    contact_inquiry: z.string().min(1, "required"),
    industry: z.string().min(1, "required"),
    email: z.string().min(1, "required").email("email"),
    name: z.string().min(1, "required"),
    country: z.string().min(1, "required"),
    phone_number: z.string(),
    company_address: z.string(),
    company_name: z.string(),
    interested_in: z.string().min(1, "required"),
    using_sumitomo_tools: z.boolean(),
    buying_from_us: z.string(),
    distributor_name: z.string(),
    message: z.string().min(1, "required"),
    agree_to_terms: booleanRequired(true, "accept_terms"),
});

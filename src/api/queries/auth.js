import { gql } from "@apollo/client";

export const MUTATION_REGISTER = gql`
    mutation CreateCustomerWithOtp(
        $firstname: String!
        $lastname: String!
        $email: String!
        $password: String!
        $company_name: String!
        $company_role: String!
        $how_did_you_find_us: String!
        $origin_country_id: String!
    ) {
        createCustomerWithOtp(
            input: {
                firstname: $firstname
                lastname: $lastname
                email: $email
                password: $password
                company_name: $company_name
                company_role: $company_role
                how_did_you_find_us: $how_did_you_find_us
                origin_country_id: $origin_country_id
            }
        ) {
            success
            message
            customer_id
            remaining_time
        }
    }
`;

export const GET_ATTRIBUTES_FORM = gql`
    query AttributesForm($form_code: String!) {
        attributesForm(formCode: $form_code) {
            errors {
                message
                type
            }
            items {
                code
                default_value
                entity_type
                frontend_class
                frontend_input
                is_required
                is_unique
                label
                options {
                    value
                    label
                }
            }
        }
    }
`;

export const MUTATION_LOGIN = gql`
    mutation LoginOtp($email: String!, $password: String!, $remember_me: Boolean!) {
        generateLoginOtp(input: { email: $email, password: $password, remember_me: $remember_me }) {
            success
            message
            customer_id
            remaining_time
        }
    }
`;

export const VALIDATE_OTP = gql`
    mutation ValidateOtp($customer_id: Int!, $otp_code: String!, $purpose: String!) {
        validateLoginOtp(input: { customer_id: $customer_id, otp_code: $otp_code, purpose: $purpose }) {
            success
            message
            token
        }
    }
`;

export const VALIDATE_REGISTER_OTP = gql`
    mutation ValidateOtp($customer_id: Int!, $otp_code: String!, $purpose: String!) {
        validateRegistrationOtp(input: { customer_id: $customer_id, otp_code: $otp_code, purpose: $purpose }) {
            success
            message
            token
        }
    }
`;

export const RESEND_LOGIN_OTP = gql`
    mutation ResendLoginOtp($customer_id: Int!, $purpose: String!) {
        resendLoginOtp(input: { customer_id: $customer_id, purpose: $purpose }) {
            success
            message
            remaining_time
        }
    }
`;

export const RESEND_REGISTRATION_OTP = gql`
    mutation ResendLoginOtp($customer_id: Int!, $purpose: String!) {
        resendRegistrationOtp(input: { customer_id: $customer_id, purpose: $purpose }) {
            success
            message
            remaining_time
        }
    }
`;

export const MUTATION_FORGET_PASSWORD = gql`
    mutation RequestPasswordResetEmail($email: String!) {
        requestPasswordResetOtp(input: { email: $email }) {
            customer_id
            message
            remaining_time
            success
        }
    }
`;

export const VALIDATE_RESEND_PASSWORD_OTP = gql`
    mutation RequestPasswordResetEmail($customer_id: Int!, $otp_code: String!, $purpose: String!) {
        validateResetPasswordOtp(input: { customer_id: $customer_id, otp_code: $otp_code, purpose: $purpose }) {
            message
            reset_token
            success
        }
    }
`;

export const RESEND_RESEND_PASSWORD_OTP = gql`
    mutation ResendResetPasswordOtp($customer_id: Int!, $purpose: String!) {
        resendResetPasswordOtp(input: { customer_id: $customer_id, purpose: $purpose }) {
            success
            message
            remaining_time
        }
    }
`;

export const MUTATION_RESET_PASSWORD = gql`
    mutation ResetPassword($customer_id: Int!, $reset_token: String!, $new_password: String!, $email: String!) {
        resetPassword(
            email: $email
            resetPasswordToken: $reset_token
            newPassword: $new_password
            input: { customer_id: $customer_id, reset_token: $reset_token, new_password: $new_password }
        ) {
            success
            message
        }
    }
`;

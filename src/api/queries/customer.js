import { gql } from "@apollo/client";

export const GET_IS_GUEST_CUSTOMER = gql`
    query GetIsGuestCustomer {
        isGuestCustomer
    }
`;

export const GET_CUSTOMER = gql`
    query GetCustomer {
        customer {
            id
            firstname
            middlename
            lastname
            gender
            email
            date_of_birth
            confirmation_status
            role_id
            company_id
            created_at
            custom_attributes {
                code
                ... on AttributeValue {
                    value
                }
                ... on AttributeSelectedOptions {
                    selected_options {
                        label
                        value
                    }
                }
            }
        }
    }
`;

export const CUSTOMER_EMAIL_UPDATE = gql`
    mutation customerEmailUpdate($email: String!, $password: String!) {
        updateCustomerEmail(email: $email, password: $password) {
            customer {
                email
            }
        }
    }
`;

export const CUSTOMER_UPDATE = gql`
    mutation customerUpdate($input: CustomerUpdateInput!) {
        updateCustomerV2(input: $input) {
            customer {
                firstname
                lastname
                custom_attributes {
                    code
                    ... on AttributeValue {
                        value
                    }
                    ... on AttributeSelectedOptions {
                        selected_options {
                            label
                            value
                        }
                    }
                }
            }
        }
    }
`;

export const CUSTOMER_PASSWORD_UPDATE = gql`
    mutation customerPasswordUpdate($currentPassword: String!, $newPassword: String!) {
        changeCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
            email
        }
    }
`;

export const GET_SUMMARIES = gql`
    query GetSummaries {
        summaries {
            total_orders
            incomplete_orders
            complete_orders
            wishlist_items
        }
    }
`;

export const GET_CUSTOMER_ROLES = gql`
    query GetCustomerRoles {
        getCustomerRoles {
            roles {
                role_id
                name
                permissions
            }
            permissions {
                permission_id
                name
                description
            }
            role_permissions_matrix
        }
    }
`;

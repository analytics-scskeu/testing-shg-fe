import { gql } from "@apollo/client";

export const GET_COMPANY = gql`
    query GetCompany($companyId: Int!) {
        getCompany(companyId: $companyId) {
            company_id
            company_name
            status
            legal_name
            company_email
            vat_tax_id
            reseller_id
            comment
            street
            city
            country_id
            region
            region_id
            postcode
            telephone
            customer_group_id
            admin_email_store
            sales_representative_id
            super_user_id
            reject_reason
            reject_at
            customer_ids
            restricted_payments
            use_company_group
            is_active
            is_rejected
            is_pending
            has_roles
        }
    }
`;

export const GET_COMPANY_CUSTOMERS = gql`
    query GetCompanyCustomers($companyId: Int!) {
        getCompanyCustomers(companyId: $companyId) {
            total_count
            customers {
                customer_id
                company_id
                job_title
                status
                telephone
                role_id
                role_name
                role_type_id
                email
                firstname
                lastname
                middlename
                prefix
                suffix
                dob
                taxvat
                gender
                group_id
                website_id
                store_id
                created_at
                updated_at
                is_active
                default_billing
                default_shipping
                company_role
                company_role_id
                origin_country_id
                origin_phone_number
                last_login_at
            }
        }
    }
`;

export const GET_COMPANY_CUSTOMER = gql`
    query GetCompanyCustomer($customerId: Int!) {
        getCompanyCustomer(customerId: $customerId) {
            customer_id
            company_id
            job_title
            status
            telephone
            role_id
            role_name
            role_type_id
            email
            firstname
            lastname
            middlename
            prefix
            suffix
            dob
            taxvat
            gender
            group_id
            website_id
            store_id
            created_at
            updated_at
            is_active
            default_billing
            default_shipping
            company_role
            company_role_id
            origin_country_id
            origin_phone_number
            last_login_at
        }
    }
`;

export const CREATE_COMPANY_CUSTOMER = gql`
    mutation CreateOrUpdateCompanyCustomer($input: CreateOrUpdateCustomerInput!) {
        createOrUpdateCompanyCustomer(input: $input) {
            success
            message
            is_new_customer
            customer {
                customer_id
                company_id
                job_title
                status
                telephone
                role_id
                role_name
                role_type_id
                email
                firstname
                lastname
                middlename
                prefix
                suffix
                dob
                taxvat
                gender
                group_id
                website_id
                store_id
                created_at
                updated_at
                is_active
                default_billing
                default_shipping
                company_role
                company_role_id
                origin_country_id
                origin_phone_number
            }
        }
    }
`;

export const DEACTIVATE_COMPANY_CUSTOMER = gql`
    mutation DeactivateCompanyCustomer($input: DeactivateCustomerInput!) {
        deactivateCompanyCustomer(input: $input) {
            success
            message
            customer {
                customer_id
                company_id
                job_title
                status
                telephone
                role_id
                role_name
                role_type_id
                email
                firstname
                lastname
                middlename
                prefix
                suffix
                dob
                taxvat
                gender
                group_id
                website_id
                store_id
                created_at
                updated_at
                is_active
                default_billing
                default_shipping
                company_role
                company_role_id
                origin_country_id
                origin_phone_number
            }
        }
    }
`;

export const GET_COMPANY_ADDRESSES = gql`
    query GetCompanyAddresses($superUserId: Int!) {
        getCompanyCustomer(customerId: $superUserId) {
            addresses {
                id
                customer_id
                region {
                    region_code
                    region
                    region_id
                }
                country_id
                street
                company
                telephone
                fax
                postcode
                city
                firstname
                lastname
                middlename
                prefix
                suffix
                address_status
                gate_nr
                factory_nr
            }
        }
    }
`;

export const CREATE_COMPANY_ADDRESS = gql`
    mutation CreateCompanyAddress($input: CreateCompanyAddressInput!) {
        createCompanyAddress(input: $input) {
            success
            message
        }
    }
`;

export const UPDATE_COMPANY_ADDRESS = gql`
    mutation EditCompanyAddress($input: EditCompanyAddressInput!) {
        editCompanyAddress(input: $input) {
            success
            message
        }
    }
`;

export const DEACTIVATE_COMPANY_ADDRESS = gql`
    mutation DeactivateCompanyAddress($input: DeactivateCompanyAddressInput!) {
        deactivateCompanyAddress(input: $input) {
            message
            success
        }
    }
`;

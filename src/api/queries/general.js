import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
    {
        countries {
            available_regions {
                code
                id
                name
            }
            full_name_english
            full_name_locale
            id
            three_letter_abbreviation
            two_letter_abbreviation
        }
    }
`;

export const GET_COUNTRY_DATA = gql`
    query CountryData($country_id: String!) {
        countryData(country_id: $country_id) {
            background_position
            country_id
            phone_prefix
        }
    }
`;

export const GET_MENU_DATA = gql`
    query menuData {
        menuData {
            menu_items
            store_code
            store_id
        }
    }
`;

import { gql } from "@apollo/client";

export const GET_AVAILABLE_STORES = gql`
    query GetAvailableStores {
        storeSelector {
            items {
                id
                code
                display_name
                default_store_url
                sort_order
                selected
                stores {
                    id
                    code
                    lang_code
                    display_name
                    image
                    sort_order
                    url
                    selected
                }
            }
        }
    }
`;

export const GET_STORE_CONFIG = gql`
    query GetStoreConfig {
        storeConfig {
            header_logo_src
            logo_alt
            logo_width
            logo_height
            base_url
            base_media_url
            base_link_url
            copyright
        }
    }
`;

export const GET_CONFIG_DATA = gql`
    query RowebConfiguration {
        RowebConfiguration {
            json
            store_code
            store_id
        }
    }
`;

import { gql } from "@apollo/client";

export const GET_HOMEPAGE_BLOCKS = gql`
    query Homepage {
        homepage {
            sections
            store_base_url
            store_code
            store_id
        }
    }
`;

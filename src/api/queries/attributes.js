import { gql } from "@apollo/client";

export const GET_ATTRIBUTES = gql`
    query AttributesList {
        attributesList(filters: { is_filterable: { eq: "true" } }, entityType: CATALOG_PRODUCT) {
            items {
                code
                label
                frontend_input
                options {
                    label
                    value
                }
            }
        }
    }
`;

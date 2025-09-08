import { gql } from "@apollo/client";

export const GET_ORDER_DOCUMENTS = gql`
    query GetOrderDocuments {
        biztalkDocsList {
            items {
                date
                title
                identifier
                doc_identifier
                button
            }
        }
    }
`;

export const GET_ORDER_DOCUMENT_TYPES = gql`
    query GetOrderDocumentTypes($identifier: String!, $filter: BiztalkDocFilterInput) {
        biztalkDocTypeList(identifier: $identifier, filter: $filter) {
            items {
                identifier
                doc_identifier
                date
                doc_no
                order_no
                button
            }
        }
    }
`;

export const GET_ORDER_DOCUMENT_FILE = gql`
    query GetOrderDocumentFile($identifier: String!, $doc_no: String!, $type: String!) {
        biztalkDocType(identifier: $identifier, doc_no: $doc_no, type: $type) {
            success
            message
            data
        }
    }
`;

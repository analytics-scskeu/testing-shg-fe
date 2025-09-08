import { gql } from "@apollo/client";

export const GET_CATEGORY_WITH_CHILDREN = gql`
    query Categories($categoryId: Int!) {
        category(id: $categoryId) {
            id
            name
            children {
                id
                name
                carousel_image
                url_path
            }
        }
    }
`;

export const GET_CATEGORIES = gql`
    query Categories($categoriesIds: [String]!) {
        categories(filters: { ids: { in: $categoriesIds } }) {
            items {
                id
                name
                url_path
            }
            total_count
        }
    }
`;

export const GET_SUBCATEGORIES = gql`
    query Categories($url_key: String) {
        categories(filters: { url_key: { eq: $url_key } }) {
            items {
                name
                children_count
                children {
                    id
                    name
                    url_path
                }
            }
        }
    }
`;

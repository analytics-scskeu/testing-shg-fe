// /api/queries/searchProducts.js
import { gql } from "@apollo/client";

export const SEARCH_PRODUCTS = gql`
    query SearchProducts($search: String!) {
        products: xsearchProducts(search: $search) {
            items {
                id
                name
                sku
                url_key
                url_suffix
                small_image {
                    url
                    label
                }
                short_description {
                    html
                }
            }
        }
    }
`;

export const SEARCH_NEWS = gql`
    query SearchNews($search: String!) {
        sumitomoBlogPosts(
            pageSize: 10
            currentPage: 1
            filter: { is_active: { eq: "1" }, title: { like: $search }, category_id: { in: [1, 2] } }
            sort: { publish_time: DESC }
        ) {
            total_count
            page_info {
                page_size
                current_page
                total_pages
            }
            items {
                post_id
                title
                identifier
                is_active
                featured_img
                categories {
                    category_id
                    title
                    category_label_color
                }
            }
        }
    }
`;

//TODO: Update the query and use in Search component when magento rdy (after client decide if they want to use it individually or not)
export const SEARCH_VIDEOS_BROCHURES = gql`
    query SearchVideosBrochures($search: String!) {
        blogPosts(
            filter: { category_id: { in: [1, 2] }, title: { like: $search }, is_active: { eq: true } }
            sort: { views_count: DESC, publish_time: DESC }
            pageSize: 10
        ) {
            total_count
            items {
                post_id
                title
                identifier
                short_content
                featured_img
                publish_time
                views_count
                categories {
                    category_id
                    title
                    identifier
                }
                tags {
                    tag_id
                    title
                    identifier
                }
            }
        }
    }
`;

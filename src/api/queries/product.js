import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
    query GetProducts(
        $currentPage: Int!
        $pageSize: Int!
        $search: String
        $sort: ProductAttributeSortInput
        $filter: ProductAttributeFilterInput
    ) {
        products(search: $search, filter: $filter, sort: $sort, currentPage: $currentPage, pageSize: $pageSize) {
            items {
                id
                sku
                short_description {
                    html
                }
                url_key
                url_path
                url_suffix
                name
                description {
                    html
                }
                image {
                    url
                    label
                }
                price {
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                }
                special_price
                meta_description
                attribute_set_id
                country_of_manufacture
                created_at
                gift_message_available
                grade
                grade_class
                id
                iso_an
                iso_apmx
                iso_b
                iso_bd
                iso_bdx
                iso_bs
                iso_cbdp
                iso_cdx
                iso_chw
                iso_crks
                iso_cw
                iso_d1
                iso_dbc
                iso_dc
                iso_dcb
                iso_dcon
                iso_dcsfms
                iso_dcx
                iso_df
                iso_dmin
                iso_dmm
                iso_dn
                iso_gamf
                iso_gamp
                iso_h
                iso_hbh
                iso_hbkl
                iso_hbkw
                iso_hbl
                iso_hf
                iso_ic
                iso_insl
                iso_kdp
                iso_kww
                iso_l
                iso_lbx
                iso_lcf
                iso_lf
                iso_lfa
                iso_lfs
                iso_lh
                iso_lhd
                iso_lpr
                iso_ls
                iso_lscx
                iso_lu
                iso_lux
                iso_oal
                iso_pdx
                iso_pdy
                iso_pl
                iso_pna
                iso_re
                iso_rel
                iso_rer
                iso_rmpx
                iso_s
                iso_thub
                iso_w1
                iso_wbthk
                iso_wf
                jp_article_no
                jp_catalog_no
                manufacturer
                meta_keyword
                meta_title
                name
                new_from_date
                new_to_date
                only_x_left_in_stock
                options_container
                rating_summary
                review_count
                sales_qty_per_unit
                series_name
                sku
                special_from_date
                special_price
                special_to_date
                status
                stock_status
                swatch_image
                tier_price
                type_id
                uid
                updated_at
                url_key
                url_path
                url_suffix
                visibility
                applications
            }
            aggregations {
                attribute_code
                label
            }
            total_count
            page_info {
                current_page
                total_pages
            }
        }
    }
`;

export const GET_PRODUCT = gql`
    query GetProduct($url_key: String!) {
        products(filter: { url_key: { eq: $url_key } }) {
            items {
                image {
                    disabled
                    label
                    position
                    url
                }
                id
                description {
                    html
                }
                color
                canonical_url
                media_gallery {
                    disabled
                    label
                    position
                    url
                }
                price {
                    maximalPrice {
                        amount {
                            currency
                            value
                        }
                    }
                    minimalPrice {
                        amount {
                            currency
                            value
                        }
                    }
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                short_description {
                    html
                }
                meta_description
                attribute_set_id
                country_of_manufacture
                created_at
                gift_message_available
                grade
                grade_class
                iso_an
                iso_apmx
                iso_b
                iso_bd
                iso_bdx
                iso_bs
                iso_cbdp
                iso_cdx
                iso_chw
                iso_crks
                iso_cw
                iso_d1
                iso_dbc
                iso_dc
                iso_dcb
                iso_dcon
                iso_dcsfms
                iso_dcx
                iso_df
                iso_dmin
                iso_dmm
                iso_dn
                iso_gamf
                iso_gamp
                iso_h
                iso_hbh
                iso_hbkl
                iso_hbkw
                iso_hbl
                iso_hf
                iso_ic
                iso_insl
                iso_kdp
                iso_kww
                iso_l
                iso_lbx
                iso_lcf
                iso_lf
                iso_lfa
                iso_lfs
                iso_lh
                iso_lhd
                iso_lpr
                iso_ls
                iso_lscx
                iso_lu
                iso_lux
                iso_oal
                iso_pdx
                iso_pdy
                iso_pl
                iso_pna
                iso_re
                iso_rel
                iso_rer
                iso_rmpx
                iso_s
                iso_thub
                iso_w1
                iso_wbthk
                iso_wf
                jp_article_no
                jp_catalog_no
                manufacturer
                meta_keyword
                meta_title
                name
                new_from_date
                new_to_date
                only_x_left_in_stock
                options_container
                rating_summary
                review_count
                sales_qty_per_unit
                series_name
                sku
                special_from_date
                special_price
                special_to_date
                status
                stock_status
                swatch_image
                tier_price
                type_id
                uid
                updated_at
                url_key
                url_path
                url_suffix
                visibility
                related_products {
                    sku
                }
                crosssell_products {
                    sku
                    categories {
                        id
                    }
                }
            }
        }
    }
`;

/** Fields with subselections for when we will need it on product details*/
// categories
// crosssell_products
// custom_attributesV2(filters: {})
// price_range
// price_tiers
// product_links
// related_products
// reviews(pageSize: 20, currentPage: 1)
// small_image
// thumbnail
// tier_prices
// upsell_products
// url_rewrites
// websites

export const GET_PRODUCT_ATTRIBUTES = gql`
    query GetProduct {
        attributesList(entityType: CATALOG_PRODUCT, filters: { is_visible_on_front: true }) {
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
                table_header
            }
        }
    }
`;

export const ADD_PRODUCT_TO_COMPARE = gql`
    mutation addProductToCompare($input: [ID!]!) {
        createCompareList(input: { products: $input }) {
            attributes {
                code
                label
            }
            item_count
            items {
                uid
                product {
                    uid
                    name
                    sku
                    price_range {
                        minimum_price {
                            regular_price {
                                value
                                currency
                            }
                        }
                    }
                }
            }
            uid
        }
    }
`;

export const GET_BIZTALK_ITEM = gql`
    query BiztalkItemList($item_no: String) {
        biztalkItemList(item_no: $item_no) {
            success
            message
            data
        }
    }
`;

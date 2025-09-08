import { gql } from "@apollo/client";

export const GET_CUSTOMER_CART = gql`
    query GetCustomerCart {
        customerCart {
            id
            itemsV2 {
                items {
                    uid
                    is_available
                    product {
                        uid
                        name
                        sku
                        thumbnail {
                            disabled
                            label
                            position
                            url
                        }
                        image {
                            disabled
                            label
                            position
                            url
                        }
                        url_key
                        canonical_url
                    }
                    prices {
                        price {
                            currency
                            value
                        }
                    }
                    product_type
                    quantity
                }
                page_info {
                    current_page
                    page_size
                    total_pages
                }
                total_count
            }
            prices {
                grand_total {
                    currency
                    value
                }
            }
        }
    }
`;

export const CHECK_PRODUCT_AVAILABILITY = gql`
    query CheckProductAvailability($items: [AvailabilityCheckInput!]!) {
        checkAvailability(items: $items) {
            items {
                sku
                name
                price
                requested_qty
                is_available
                stock_qty
                short_description
            }
        }
    }
`;

export const ADD_PRODUCTS_TO_CART = gql`
    mutation AddProductsToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
        addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
            user_errors {
                code
                message
            }
            cart {
                id
            }
        }
    }
`;

export const REMOVE_ITEM_FROM_CART = gql`
    mutation RemoveItemFromCart($input: RemoveItemFromCartInput) {
        removeItemFromCart(input: $input) {
            cart {
                id
            }
        }
    }
`;

export const ADD_TO_CART = gql`
    mutation AddSimpleProductsToCart($cartId: String!, $cartItems: [SimpleProductCartItemInput!]!) {
        addSimpleProductsToCart(input: { cart_id: $cartId, cart_items: $cartItems }) {
            cart {
                id
                itemsV2 {
                    items {
                        uid
                        quantity
                        product {
                            name
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
                }
                prices {
                    grand_total {
                        value
                        currency
                    }
                    subtotal_excluding_tax {
                        value
                        currency
                    }
                }
                total_quantity
            }
        }
    }
`;

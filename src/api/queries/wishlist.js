import { gql } from "@apollo/client";

export const GET_WISHLISTS = gql`
    query GetCustomerWishlists {
        customerWishlists {
            total_count
            items {
                wishlist_id
                name
                customer_id
                type
                created_at
                updated_at
                items_count
            }
        }
    }
`;

export const CREATE_WISHLIST = gql`
    mutation CreateWishlist($input: CreateWishlistInput!) {
        createWishlist(input: $input) {
            message
            success
            wishlist {
                wishlist_id
                name
                customer_id
                type
                created_at
                updated_at
                items_count
            }
        }
    }
`;

export const DELETE_WISHLIST = gql`
    mutation DeleteWishlist($input: DeleteWishlistInput!) {
        deleteWishlist(input: $input) {
            message
            success
            wishlist_id
        }
    }
`;

export const GET_WISHLIST_ITEMS = gql`
    query GetWishlistItems($wishlistId: Int!) {
        wishlistItems(wishlistId: $wishlistId) {
            wishlist_info {
                wishlist_id
                name
                customer_id
                type
                created_at
                updated_at
                items_count
            }
            total_count
            items {
                wishlist_item_id
                wishlist_id
                product_id
                store_id
                added_at
                description
                qty
                product {
                    id
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
                    small_image {
                        url
                        label
                    }
                }
            }
        }
    }
`;

export const ADD_PRODUCT_TO_WISHLIST = gql`
    mutation AddProductToWishlist($input: AddProductToWishlistInput!) {
        addProductToWishlist(input: $input) {
            success
            message
            wishlist_item {
                wishlist_item_id
                wishlist_id
                product_id
                store_id
                added_at
                description
                qty
                product {
                    id
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
                    small_image {
                        url
                        label
                    }
                }
            }
        }
    }
`;

export const UPDATE_PRODUCTS_IN_WISHLIST = gql`
    mutation updateProductsInWishlist($wishlistItems: [WishlistItemUpdateInput!]!, $wishlistId: ID!) {
        updateProductsInWishlist(wishlistItems: $wishlistItems, wishlistId: $wishlistId) {
            user_errors {
                code
                message
            }
            wishlist {
                items_v2 {
                    items {
                        id
                        quantity
                    }
                }
            }
        }
    }
`;

export const REMOVE_PRODUCTS_FROM_WISHLIST = gql`
    mutation RemoveProductsFromWishlist($wishlistId: ID!, $wishlistItemsIds: [ID!]!) {
        removeProductsFromWishlist(wishlistId: $wishlistId, wishlistItemsIds: $wishlistItemsIds) {
            success
            message
            items_deleted
            remaining_items_count
        }
    }
`;

export const ADD_WISHLIST_PRODUCTS_TO_CART = gql`
    mutation AddWishlistItemsToCart($wishlistItemIds: [ID!], $wishlistId: ID!) {
        addWishlistItemsToCart(wishlistItemIds: $wishlistItemIds, wishlistId: $wishlistId) {
            status
            add_wishlist_items_to_cart_user_errors {
                code
                message
                wishlistId
                wishlistItemId
            }
            wishlist {
                items_v2 {
                    items {
                        id
                    }
                }
            }
        }
    }
`;

export const GET_LATEST_WISHLIST_PRODUCTS = gql`
    query GetLastAddedWishlistItems($customerId: Int, $limit: Int) {
        lastAddedWishlistItems(customerId: $customerId, limit: $limit) {
            total_count
            items {
                wishlist_item_id
                wishlist_id
                wishlist_name
                product_id
                store_id
                added_at
                description
                qty
                product {
                    id
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
                    small_image {
                        url
                        label
                    }
                }
            }
        }
    }
`;

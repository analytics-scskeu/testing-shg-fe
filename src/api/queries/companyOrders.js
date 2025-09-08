import { gql } from "@apollo/client";

export const GET_COMPANY_ORDERS = gql`
    query GetCompanyOrders(
        $currentPage: Int
        $pageSize: Int
        $filter: CustomerOrdersFilterInput
        $sort: CustomerOrderSortInput
        $scope: ScopeTypeEnum
    ) {
        companyOrders(currentPage: $currentPage, pageSize: $pageSize, filter: $filter, sort: $sort, scope: $scope) {
            items {
                id
                number
                additional_number
                purchase_number
                order_by
                order_date
                status
                total {
                    grand_total {
                        currency
                        value
                    }
                }
            }
            page_info {
                current_page
                page_size
                total_pages
            }
            total_count
        }
    }
`;

export const REORDER_ITEMS = gql`
    mutation ReorderItems($orderNumber: String!) {
        reorderItems(orderNumber: $orderNumber) {
            cart {
                id
            }
        }
    }
`;

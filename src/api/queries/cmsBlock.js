// GET_CMS_BLOCK.js
import { gql } from "@apollo/client";

export const GET_CMS_BLOCK = gql`
    query CmsBlockByIdentifier($identifier: String!) {
        cmsBlocks(identifiers: [$identifier]) {
            items {
                identifier
                title
                content
            }
        }
    }
`;

export const GET_CMS_PAGE = gql`
    query CmsBlockPage($identifier: String!) {
        cmsPage(identifier: $identifier) {
            identifier
            url_key
            title
            content
            content_heading
            page_layout
            meta_title
            meta_description
            meta_keywords
        }
    }
`;

export const GET_PAGE_BUILDER_CMS_CONTENT = gql`
    query StaticPage($slug: String!) {
        PageBuilderCMSContent(slug: $slug) {
            contentJson
            metadata {
                itemsCount
                processedAt
                processingTime
                renderersUsed
            }
            isEmpty
            title
        }
    }
`;

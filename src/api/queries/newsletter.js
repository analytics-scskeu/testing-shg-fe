import { gql } from "@apollo/client";

export const GET_NEWSLETTER_FIELDS = gql`
    query GetNewsletterFields {
        hubspotNewsletterForm {
            fields {
                label
                name
                required
                type
            }
        }
    }
`;
export const SUBMIT_NEWSLETTER_FORM = gql`
    mutation SubmitHubspotNewsletterForm($input: HubspotFormInput!) {
        submitHubspotNewsletterForm(input: $input) {
            message
            success
        }
    }
`;

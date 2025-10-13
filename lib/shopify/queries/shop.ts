// Shopify has built-in policy pages that are separate from regular pages
// These are managed in Settings > Policies in Shopify admin

export const getShopPoliciesQuery = /* GraphQL */ `
  query getShopPolicies {
    shop {
      privacyPolicy {
        id
        title
        body
        handle
        url
      }
      termsOfService {
        id
        title
        body
        handle
        url
      }
      refundPolicy {
        id
        title
        body
        handle
        url
      }
      shippingPolicy {
        id
        title
        body
        handle
        url
      }
    }
  }
`;


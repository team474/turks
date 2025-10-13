import imageFragment from "./image";
import seoFragment from "./seo";

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
      metafields(identifiers: [
      { namespace: "custom", key: "terpenes" },
      { namespace: "custom", key: "effects" },
      { namespace: "custom", key: "case_color" },
      { namespace: "custom", key: "category" },
      { namespace: "custom", key: "concentration" },
      { namespace: "custom", key: "indica" },
      { namespace: "custom", key: "sativa" },
    ]) {
      key
      value
      type
    }
    seo {
      ...seo
    }
    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;

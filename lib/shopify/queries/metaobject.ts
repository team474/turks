export const getMetaObjectQuery = `
  query getMetaObject($handle: String!, $type: String!) {
    metaobject(handle: { handle: $handle, type: $type }) {
      id
      handle
      type
      fields {
        key
        value
        type
        reference {
          ... on MediaImage {
            id
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

export const getMetaObjectQueryByType = `
  query metaobjectDefinitionByType($type: String!, $first: Int = 250) {
    metaobjects(first: $first, type: $type) {
      edges {
        node {
          id
          handle
          type
          fields {
            key
            value
            type
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

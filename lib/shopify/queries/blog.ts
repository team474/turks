
const blogArticleFragment = /* GraphQL */ `
  fragment blogArticle on Article {
    id
    title
    handle
    excerpt
    contentHtml
    publishedAt
    image {
      url
      altText
      width
      height
    }
    blog {
      handle
      title
    }
  }
`;

export const getBlogArticlesQuery = /* GraphQL */ `
  query getBlogArticles($first: Int!) {
    articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
      edges {
        node {
          ...blogArticle
        }
      }
    }
  }
  ${blogArticleFragment}
`;

export const getBlogArticleQuery = /* GraphQL */ `
  query getBlogArticle($blogHandle: String!) {
    blogByHandle(handle: $blogHandle) {
      articles(first: 250) {
        edges {
          node {
            id
            title
            handle
            excerpt
            contentHtml
            publishedAt
            image {
              url
              altText
              width
              height
            }
            blog {
              handle
              title
            }
          }
        }
      }
    }
  }
`;

export const getBlogArticleByBlogQuery = /* GraphQL */ `
  query getBlogArticleByBlog($blogHandle: String!, $articleHandle: String!) {
    blogByHandle(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        id
        title
        handle
        excerpt
        contentHtml
        publishedAt
        image {
          url
          altText
          width
          height
        }
        blog {
          handle
          title
        }
      }
    }
  }
`;

export const getBlogArticlesByBlogQuery = /* GraphQL */ `
  query getBlogArticlesByBlog($blogHandle: String!, $first: Int!) {
    blogByHandle(handle: $blogHandle) {
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            ...blogArticle
          }
        }
      }
    }
  }
  ${blogArticleFragment}
`;

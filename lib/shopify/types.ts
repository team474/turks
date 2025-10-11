export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Cart = Omit<ShopifyCart, "lines"> & {
  lines: CartItem[];
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
  metafields?: Metafield[];
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

export type Collection = ShopifyCollection & {
  path: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Metafield = {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
  description?: string | null;
  reference?: any; 
};

export type Product = Omit<ShopifyProduct, "variants" | "images"> & {
  // variants: ProductVariant[];
  // images: Image[];
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
  featuredImage: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
  metafields: Metafield[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type SEO = {
  title: string;
  description: string;
};

export type BlogArticle = {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  image: Image;
  blog: {
    handle: string;
    title: string;
  };
};

export type ShopifyCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
  metafields: Metafield[];
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyCollectionOperation = {
  data: {
    collection: ShopifyCollection;
  };
  variables: {
    handle: string;
  };
};

export type ShopifyCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<ShopifyCollection>;
  };
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type MetaObjectField = {
  key: string;
  value: string;
  type: string;
  reference?: {
    id: string;
    image?: {
      url: string;
      altText: string;
      width: number;
      height: number;
    };
  };
};

export type MetaObject = {
  id: string;
  handle: string;
  type: string;
  fields: MetaObjectField[];
};

export type ShopifyMetaObjectOperation = {
  data: {
    metaobject: MetaObject;
  };
  variables: {
    handle: string;
    type: string;
  };
};

export type ShopifyMetaObjectOperationByType = {
  data: {
    metaobjects: {
      edges: Array<{
        node: MetaObject;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
  variables: {
    type: string;
    first?: number;
  };
};

export type ShopifyBlogArticlesOperation = {
  data: {
    articles: Connection<BlogArticle>;
  };
  variables: {
    first: number;
  };
};

export type ShopifyBlogArticleOperation = {
  data: {
    blogByHandle: {
      articles: Connection<BlogArticle>;
    };
  };
  variables: {
    blogHandle: string;
  };
};

export type ShopifyBlogArticleByBlogOperation = {
  data: {
    blogByHandle: {
      articleByHandle: BlogArticle;
    };
  };
  variables: {
    blogHandle: string;
    articleHandle: string;
  };
};

export type ShopifyBlogArticlesByBlogOperation = {
  data: {
    blogByHandle: {
      articles: Connection<BlogArticle>;
    };
  };
  variables: {
    blogHandle: string;
    first: number;
  };
};
export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Trending",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  }, // asc
  {
    title: "Latest arrivals",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "Price: Low to high",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  }, // asc
  {
    title: "Price: High to low",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";

// Use a current, supported Storefront API version to avoid schema errors during build
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2025-10/graphql.json";

export const currencyCodeMap = {
  'USD' : "$",
}

// Strain-specific font mapping (cycles through 6 fonts for 6 strains, with 2 fallbacks)
const STRAIN_FONT_VARS = [
  'var(--font-shrikhand)',
  'var(--font-bungee-shade)',
  'var(--font-monoton)',
  'var(--font-nosifer)',
  'var(--font-sixtyfour)',
  'var(--font-fascinate)',
  'var(--font-atomic-age)',
  'var(--font-cinzel-decorative)',
] as const;

export function getStrainFontFamily(index: number): string {
  return STRAIN_FONT_VARS[index % STRAIN_FONT_VARS.length] || 'var(--font-shrikhand)';
}
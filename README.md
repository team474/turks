## Turk's Bud Storefront

A modern, high-performance e‑commerce storefront for Turk's Bud built with the Next.js App Router and the Shopify Storefront API.

### Features
- Product browsing with rich images and SEO-friendly pages
- Animated hero gallery with thumbnail carousel and smooth transitions
- Dynamic gradient backgrounds driven by strain color metaobjects
- Shopping cart with optimistic UI and server actions
- Checkout redirect to Shopify
- Responsive design with Tailwind CSS

### Tech Stack
- Next.js (App Router) and React
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Shopify Storefront API

### Environment Variables
Create a `.env.local` file in the project root with the following variables:

- SHOPIFY_STORE_DOMAIN
- SHOPIFY_STOREFRONT_ACCESS_TOKEN
- SHOPIFY_REVALIDATION_SECRET
- SITE_NAME
- COMPANY_NAME (optional)

### Running Locally
```bash
pnpm install
pnpm dev
```

The app will be available at http://localhost:3000.

### Scripts
- pnpm dev: Start the development server
- pnpm build: Create a production build
- pnpm start: Start the production server

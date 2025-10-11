import { GridTileImage } from "components/grid/tile";
import Price from "components/price";
import { getCollectionProducts } from "lib/shopify";
import type { Product } from "lib/shopify/types";
import Link from "next/link";

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: Product;
  size: "full" | "half";
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:col-start-1 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        <GridTileImage
          containerClassName={size === "full" ? "p-16" : ""}
          src={item.featuredImage.url}
          fill
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode,
          }}
        />
      </Link>
    </div>
  );
}

export async function ThreeItemGrid() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const homepageItems = await getCollectionProducts({
    collection: "hidden-homepage-featured-items",
  });

  if (!homepageItems[0]) return null;

  const [firstProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-(--breakpoint-xl) gap-4 px-4 lg:px-0 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <div className="md:col-span-2 md:row-span-1 relative block aspect-square h-full w-full">
        <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white/80 dark:bg-black/80 backdrop-blur-sm p-6">
          <div className="text-start flex flex-col gap-8">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
              $100/Oz
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis,
              animi architecto nihil nostrum earum deleniti soluta dolore optio
              dignissimos et libero est mollitia voluptatem laboriosam vitae
              unde, minima aut natus?
            </p>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 md:row-span-1 relative block aspect-square h-full w-full">
        <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white/80 dark:bg-black/80 backdrop-blur-sm p-6">
          <div className="text-center space-y-6 w-full max-w-xs">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Shop?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                click the button below and experience premium quality.
              </p>
            </div>
            <Link href={`/product/${firstProduct.handle}`} className="w-full">
              <div className=" flex w-full px-4 pb-4 justify-center items-center cursor-pointer">
                <div className="flex items-center rounded-full border bg-white/70 p-1 text-sm font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white p-2 text-base">
                  <h3 className="mr-4 grow pl-2 leading-none tracking-tight text-nowrap">
                    {firstProduct.title}
                  </h3>
                  <Price
                    className="flex-none rounded-full bg-green-600 p-2 text-white p-3"
                    amount="100"
                    currencyCode="USD"
                    currencyCodeClassName="hidden"
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

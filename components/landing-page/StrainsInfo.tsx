'use client'

import { Metafield, Product } from "@/lib/shopify/types";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";

interface infoProps {
  product: Product[];
}

export function StrainsInfo({ product }: infoProps) {

  function transformProductsToStrains(products: Product[]): Array<{
    name: string;
    type: string;
    flavor: string[];
    description: string;
    image: string;
    color: string;
  }> {
    return products?.map((product: Product) => {
      // Find metafields with proper type safety
      const caseColorMetafield = product.metafields?.find((mf: Metafield) => mf.key === 'case_color');
      const terpenesMetafield = product.metafields?.find((mf: Metafield) => mf.key === 'terpenes');
      const category = product.metafields?.find((mf: Metafield) => mf.key === 'category');

      // Parse terpenes from metafield
      let terpenes: string[] = [];
      if (terpenesMetafield?.value) {
        try {
          terpenes = JSON.parse(terpenesMetafield.value) as string[];
        } catch (e) {
          console.warn(`Failed to parse terpenes for ${product.title}:`, e);
        }
      }

      // Get the category value as string, not the entire metafield object
      const productType = category?.value || product.options?.[0]?.values?.[0] || "Default Title";

      // Get featured image or first image as fallback
      const productImage = product.featuredImage?.url || product.images?.[0]?.url || "";

      return {
        name: product.title,
        type: productType, // Now this is a string, not a Metafield object
        flavor: terpenes,
        description: product.description,
        image: productImage,
        color: caseColorMetafield?.value || "#FFFFFF"
      };
    });
  }

  const strainsList = transformProductsToStrains(product);

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {strainsList && strainsList.map((item, index) => (
          <CarouselItem
            key={index}
            className="sm:basis-1/2 lg:basis-1/3 flex justify-center items-center w-fit max-w-fit pl-4 md:pl-7.5"
          >
            <div
              style={{ background: item.color }}
              key={index}
              className="flex max-w-[295px] md:max-w-[370px] w-full h-full p-3 md:p-4 md:pb-5 gap-4 flex-col items-center shrink-0 rounded-2xl md:rounded-3xl"
            >
              <div className="h-[190px] md:h-[240px] w-full rounded-xl md:rounded-2xl bg-[#E3EAD5]">
              {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={370}
                    height={240}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-[#E3EAD5] flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div className="flex p-2 flex-col items-start gap-4 md:gap-6">
                <div className="flex flex-col items-start gap-3 md:gap-4">
                  <p className="text-xl md:text-[28px] font-semibold leading-[120%] text-[#101010]">
                    {item.name}
                  </p>
                  <p className="text-sm md:text-lg font-normal leading-[150%] text-[#101010]">
                    {item.type}
                  </p>
                </div>

                <p className="text-base md:text-lg font-normal leading-[150%] text-[#101010]">
                  {item.description}
                </p>

                {/* <div className="flex flex-col items-start gap-2">
                  <p className="text-sm md:text-base font-normal leading-[150%] text-[#101010]">
                    Flavor
                  </p>
                  <div className="flex items-center gap-2">
                    {item.flavor.map((item, index) => (
                      <div key={index}>
                        <p className="text-sm md:text-base font-normal leading-[150%] text-[#101010]">
                          {item}
                        </p>
                        {index !== 2 && (
                          <span className="size-1 md:size-1.5 bg-[#101010] rounded-full"></span>
                        )}
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
    // <div className="flex justify-center items-center gap-7.5 overflow-hidden">

    //   {strainsList.map((item, index) => (
    // <div style={{background: item.color}} key={index} className="flex max-w-[370px] w-full h-full min-h-[650px] p-4 pb-5 gap-4 flex-col items-center shrink-0 rounded-3xl">
    //   <div className="h-[240px] w-full rounded-2xl bg-[#E3EAD5]"></div>
    //   <div className="flex p-2 flex-col items-start gap-6">
    //     <div className="flex flex-col items-start gap-4">
    //       <p className="text-[28px] font-semibold leading-[120%] text-[#101010]">
    //         {item.name}
    //       </p>
    //       <p className="text-lg font-normal leading-[150%] text-[#101010]">
    //         {item.type}
    //       </p>
    //     </div>

    //     <p className="text-lg font-normal leading-[150%] text-[#101010]">
    //       {item.description}
    //     </p>

    //     <div className="flex flex-col items-start gap-2">
    //       <p className="text-base font-normal leading-[150%] text-[#101010]">
    //         Flavor
    //       </p>
    //       <div className="flex items-center gap-2">
    //         {item.flavor.map((item, index) => (
    //           <div key={index}>
    //             <p className="text-base font-normal leading-[150%] text-[#101010]">
    //               {item}
    //             </p>
    //             {index !== 2 && (
    //               <span className="size-1.5 bg-[#101010] rounded-full"></span>
    //             )}
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    //   ))}
    // </div>
  );
}

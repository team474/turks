import flower from "@/assets/CTA-flower.png";
import { getMetaObject } from "@/lib/shopify";
import Image from "next/image";
import { Icon } from "../Icons";
import { Button } from "./Button";

export async function CTA() {
  let ctaHeader: string | undefined;
  let ctaDescription: string | undefined;

  try {
    const CTA = await getMetaObject(
      "strains-deals-more-straight-to-your-inbox",
      "cta"
    );
    ctaHeader = CTA?.fields.find((field) => field.key === "header")?.value;
    ctaDescription = CTA?.fields.find((field) => field.key === "description")?.value;
  } catch {
    ctaHeader = undefined;
    ctaDescription = undefined;
  }

  return (
    <div className="relative max-w-[1170px] flex flex-col items-center sm:flex-row rounded-4xl bg-[#DBEEC8] border border-[#1D431D] gap-6 sm:gap-0 pb-0 p-6 sm:pb-6 lg:px-17.5 lg:py-10 overflow-hidden">
      <div className="relative flex flex-1 flex-col items-start gap-6 md:gap-12">
        <div className="flex flex-col items-start gap-5">
          <h2 className="text-[26px] md:text-4xl lg:text-5xl leading-[120%] text-[#1D431D] uppercase font-vast-shadow">
            {ctaHeader}
          </h2>
          <p className="text-base md:text-xl font-normal leading-[150%] text-[#1D431D] max-w-[620px]">
            {ctaDescription}
          </p>
        </div>

        <Button title="REACH OUT" link="/contact-us" />

        <Icon.leafIcon className="absolute -bottom-10 sm:-bottom-5 right-50 sm:right-20 md:right-68 size-14 sm:size-18 -rotate-[60deg]" />
        <Icon.leafIcon className="absolute bottom-10 right-10 size-14 sm:size-18" />
      </div>

      <Image
        src={flower}
        alt="flower"
        width={411}
        height={211}
        className="max-w-[260px] lg:max-w-[320px] aspect-square"
      />
      <Icon.cureveDesign className="absolute -top-13 -right-20 sm:-top-5 md:top-0 sm:right-30 lg:right-60 rotate-180 w-[260px] md:w-[408px]" />
      <Icon.cureveDesign className="absolute -bottom-12 sm:-bottom-5 md:bottom-0 sm:left-30 lg:left-80 w-[178px] sm:w-[260px] md:w-[408px]" />
    </div>
  );
}

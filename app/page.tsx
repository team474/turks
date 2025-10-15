import { Icon } from "@/components/Icons";
import { About } from "@/components/landing-page/About";
// import { Blog } from "@/components/landing-page/Blog";
import { CTA } from "@/components/landing-page/CTA";
import { Hero } from "@/components/landing-page/Hero";
import { Strains } from "@/components/landing-page/Strains";
import { StrainsInfo } from "@/components/landing-page/StrainsInfo";
import { Testimonials } from "@/components/landing-page/Testimonials";
import { getProducts } from "@/lib/shopify";
import { Metadata } from "next";
import { Reveal } from "@/components/animation/Reveal";
import {
  fadeOnly,
  slowUp,
  slowLeft,
  slowRight,
  slowDown,
} from "@/lib/animation";
import { mixWithWhite, mixWithBlack, saturateHex } from "@/lib/color";
import React from "react";
import Image from "next/image";
import wordmarkSvg from "@/assets/turks-wordmark.svg";
import CurvedLoop from "@/components/CurvedLoop";
import { getMetaObject } from "@/lib/shopify";

import { SquiggleSeparator } from "@/components/landing-page/SquiggleSeparator";

export const metadata: Metadata = {
  description: "TURK'S",
  openGraph: {
    type: "website",
  },
};

type Product = {
  title: string;
  [key: string]: any;
};

export default async function HomePage() {
  const fetchLoopData = async () => {
    try {
      const metaObj = await getMetaObject(
        "side-to-side-loop-zmzy7jzn",
        "side_to_side_loop"
      );

      const fields: Record<string, string> = {};
      metaObj?.fields?.forEach((field: any) => {
        fields[field.key] = field.value;
      });

      const loopOneArr: string[] = JSON.parse(fields["loop_one"] || "[]");
      const loopTwoArr: string[] = JSON.parse(fields["loop_two"] || "[]");

      const loopOneText = loopOneArr.map((item) => item.trim()).filter(Boolean).join(" • ") + " • ";
      const loopTwoText = loopTwoArr.map((item) => item.trim()).filter(Boolean).join(" • ") + " • ";

      return { loopOne: loopOneText, loopTwo: loopTwoText };
    } catch (error) {
      console.error("Error fetching loop data:", error);
      return { loopOne: "", loopTwo: "" };
    }
  };

  const { loopOne, loopTwo } = await fetchLoopData();

  const products = await getProducts({
    sortKey: 'UPDATED_AT',
    reverse: true  // Most recently updated first
  });

  function splitProductTitles(products: Product[]) {
    const titles = products.map((p) => p.title.trim());
    const mid = Math.ceil(titles.length / 2);
    const firstHalf = titles.slice(0, mid).join(" • ") + " • ";
    const secondHalf = titles.slice(mid).join(" • ") + " • ";
    return { firstHalf, secondHalf };
  }

  const { firstHalf, secondHalf } = splitProductTitles(products);

  const loopOneText = loopOne || firstHalf;
  const loopTwoText = loopTwo || secondHalf;

  // derive initial CTA colors from first product to avoid FOUC
  const base =
    products?.[0]?.metafields?.find((m) => m.key === "case_color")?.value ||
    "#1D431D";
  const ctaBg = mixWithWhite(base, 20);
  const ctaBorder = saturateHex(mixWithBlack(base, 68), 38);
  const checkoutBg = saturateHex(mixWithBlack(base, 30), 30);
  const styleVars = {
    ["--cta-bg"]: ctaBg,
    ["--cta-border"]: ctaBorder,
    ["--checkout-bg"]: checkoutBg,
  } as React.CSSProperties;

  return (
    <div id="cta-color-scope" style={styleVars}>
      <section
        id="strain"
        className="w-full max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18"
      >
        {products && (
          <Reveal variants={fadeOnly} amount={0.3}>
            <Hero product={products} />
          </Reveal>
        )}
      </section>
      <CurvedLoop
        marqueeText={loopOneText}
        speed={1.2}
        curveAmount={225}
        direction="left"
        interactive={false}
        className="text-[#1D431D] fill-[#1D431D]"
        bgColor="#c4d499"
        bgStrokeWidth={80}
        paddingTopOverride={{ mobile: 30, tablet: 20, desktop: 20 }}
        paddingBottomOverride={{ mobile: 50, tablet: 60, desktop: 0 }}
      />
      <section className="relative w-full max-w-[1200px] mx-auto py-6 px-8 lg:py-18 overflow-hidden">
        <Icon.leafIcon className="absolute top-3.5 lg:top-[24px] left-5 size-12 md:size-18" />
        <Icon.smokeIcon className="absolute -top-2 lg:-top-[0px] right-5 w-14 h-18 md:w-30 md:h-37" />
        <Reveal variants={slowLeft} amount={0.3}>
          {products && <Strains product={products} />}
        </Reveal>
      </section>

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-8">
        <SquiggleSeparator className="w-full h-10" color="#1D431D" />
      </div>

      <section className="relative w-full max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18">
        <Reveal variants={slowRight} amount={0.3}>
          <About />
        </Reveal>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-14 w-[250px] md:w-[660px] opacity-20 pointer-events-none select-none">
          <Image
            src={wordmarkSvg}
            alt="TURK'S"
            width={660}
            height={200}
            className="w-full h-auto"
            style={{
              filter:
                "invert(88%) sepia(12%) saturate(682%) hue-rotate(25deg) brightness(96%) contrast(88%) drop-shadow(0 2px 4px rgba(29,67,29,0.1))",
            }}
          />
        </div>
      </section>

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-14 md:my-18">
        <SquiggleSeparator className="w-full h-10" color="#1D431D" />
      </div>

      <section className="relative w-full max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18">
        <Icon.leafIcon className="absolute top-15 md:top-7.5 right-5 size-12 md:size-18" />
        <Icon.pipeIcon className="absolute top-15 md:-top-10 left-5 size-14 md:size-30" />
        <Reveal variants={slowDown} amount={0.3}>
          <Testimonials />
        </Reveal>
      </section>

      <CurvedLoop
        marqueeText={loopTwoText}
        speed={1.2}
        curveAmount={-225}
        direction="right"
        interactive={false}
        className="text-[#c4d499] fill-[#c4d499]"
        bgColor="#1D431D"
        bgStrokeWidth={80}
        paddingTopOverride={{ mobile: 40, tablet: 50, desktop: 0 }}
        paddingBottomOverride={{ mobile: 0, tablet: 0, desktop: 0 }}
      />

      <section className="w-full max-w-[1170px] mx-auto pb-6 lg:p-4 xl:px-0 lg:py-10 overflow-hidden">
        <Reveal variants={slowUp} amount={0.3}>
          {products && <StrainsInfo product={products} />}
        </Reveal>
      </section>

      {/* <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-8">
        <SquiggleSeparator className="w-full h-10" color="#1D431D" />
      </div>

      <section className="relative w-full max-w-[1170px] mx-auto pt-14 pb-6 px-8 lg:pt-18 overflow-hidden">
        <Icon.leafIcon className="absolute left-5 z-0 pointer-events-none
          top-30
          md:top-6
          lg:top-0
        " />
        <Icon.pipeIcon className="absolute top-35 md:top-40 right-5 scale-x-[-1] z-0 pointer-events-none" />
        <Reveal variants={slowLeft} amount={0.3}>
          <Blog />
        </Reveal>
      </section> */}

      <section className="w-full max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18">
        <Reveal variants={slowRight} amount={0.3}>
          <CTA />
        </Reveal>
      </section>
    </div>
  );
}

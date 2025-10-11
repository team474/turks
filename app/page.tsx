import { Icon } from "@/components/Icons";
import { About } from "@/components/landing-page/About";
import { Blog } from "@/components/landing-page/Blog";
import { CTA } from "@/components/landing-page/CTA";
import { Hero } from "@/components/landing-page/Hero";
import { Strains } from "@/components/landing-page/Strains";
import { StrainsInfo } from "@/components/landing-page/StrainsInfo";
import { Testimonials } from "@/components/landing-page/Testimonials";
import { getProducts } from "@/lib/shopify";
import { Metadata } from "next";


export const metadata: Metadata = {
  description:
    "TURK'S",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {

  const products = await getProducts({});

  console.log("prod", products);
  
  
  return (
    <>
      <section id="strain" className="w-full max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18">
        {products && <Hero product={products} />} 
      </section>
      <section className="relative w-full max-w-[1200px] mx-auto py-6 px-8 lg:py-18 overflow-hidden">
        <Icon.leafIcon className="absolute top-3.5 lg:top-[24px] left-5 size-12 md:size-18" />
        <Icon.smokeIcon className="absolute -top-2 lg:-top-[0px] right-5 w-14 h-18 md:w-30 md:h-37" />
        {products && <Strains product={products}/>}
      </section>
      <section className="relative w-full max-w-[1440px] mx-auto p-6 2xl:px-34 2xl:pl-10 md:py-18">
        <About />
        <p className="oi-regular absolute left-1/2 -translate-x-1/2 -bottom-4 md:-bottom-12.5 md:text-[220px] text-[100px] font-normal leading-[120%] text-[#101010] uppercase text-center opacity-2">
          TURK&apos;S
        </p>
      </section>
      <section className="relative w-full max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18">
        <Icon.leafIcon className="absolute -top-15 md:-top-7.5 right-5 size-12 md:size-18" />
        <Icon.pipeIcon className="absolute top-1 md:-top-11 left-5 size-14 md:size-30" />
        <Testimonials />
      </section>

      <section className="w-full max-w-[1170px] mx-auto py-6 lg:p-4 xl:px-0 lg:py-18 overflow-hidden">
      {products && <StrainsInfo product={products} />} 
      </section>

      <section className="relative w-full max-w-[1170px] mx-auto py-6 px-8 lg:py-18 overflow-hidden">
        <Icon.leafIcon className="hidden md:flex absolute top-9.5 left-5" />
        <Icon.pipeIcon className="hidden md:flex absolute top-12 right-5 scale-x-[-1]" />
        <Blog />
      </section>

      <section className="w-full max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:py-18">
        <CTA />
      </section>
    </>
  );
}

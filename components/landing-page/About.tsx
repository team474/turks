import about from "@/assets/about-image.png";
import { RichTextRenderer } from "@/lib/rich-text-renderer";
import { getMetaObject } from "@/lib/shopify";
import Image from "next/image";
import { Button } from "./Button";
import { mixWithBlack, mixWithWhite, saturateHex } from "@/lib/color";
import type { CSSProperties } from "react";

export async function About() {
  let aboutText: string | undefined;

  try {
    const aboutInfo = await getMetaObject("about-us-3mvanv09", "about_us");
    aboutText = aboutInfo?.fields.find(
      (field) => field.key === "content"
    )?.value;
  } catch {
    aboutText = undefined;
  }

  // Muted, brand-forward accent similar to Blog container
  const baseBrand = "#1D431D";
  const aboutAccentBg = mixWithWhite(baseBrand, 92);
  const aboutAccentBorder = saturateHex(mixWithBlack(baseBrand, 72), 24);
  const aboutAccentText = saturateHex(mixWithBlack(baseBrand, 60), 32);
  const accentVars = {
    "--about-accent-bg": aboutAccentBg,
    "--about-accent-border": aboutAccentBorder,
    "--about-accent-text": aboutAccentText,
  } as CSSProperties;

  return (
    <div className="group flex flex-col md:flex-row items-center justify-between gap-12 md:gap-12 2xl:gap-20 transition-all duration-300" style={accentVars}>
      <div className="max-w-[570px] w-full">
        <div className="rounded-3xl overflow-hidden transition-transform duration-300 ease-out group-hover:scale-[1.01]">
          <Image src={about} alt="about" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex max-w-[570px] w-full flex-col items-start gap-12">
        <div
          className="w-full rounded-3xl overflow-hidden shadow-[0_6px_24px_rgba(0,0,0,0.08)] border-[0.5px] border-[var(--about-accent-border)] bg-[var(--about-accent-bg)] relative transition-all duration-300 ease-out group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] group-hover:-translate-y-0.5 group-hover:border-[var(--about-accent-text)]"
        >
          <div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none select-none z-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 96 97" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M43.4413 56.859L43.6163 56.96L32.1713 79.5165L29.4536 77.9474L43.2655 56.7575L43.4413 56.859Z" fill="currentColor" />
              <path fillRule="evenodd" clipRule="evenodd" d="M65.8121 18.1104C58.359 31.0196 50.8937 43.9499 43.4406 56.8591C43.8103 52.0174 44.2587 47.1919 45.7902 42.4642C46.1663 42.6227 46.5552 42.7593 46.9521 42.931C46.9213 39.8452 47.413 36.768 48.3903 33.7086C48.7436 34.059 49.1093 34.3863 49.4626 34.7368C50.2302 32.3452 51.2632 30.0484 52.7329 27.8581C53.0017 28.1012 53.2705 28.3443 53.5397 28.5866C55.0336 25.7961 56.874 23.4694 58.971 21.4069C59.0313 21.9095 59.0917 22.4121 59.1647 22.8927C61.1814 21.0183 63.3767 19.3925 65.8121 18.1104Z" fill="currentColor" />
              <path fillRule="evenodd" clipRule="evenodd" d="M65.8125 18.1105C58.3594 31.0197 50.894 43.95 43.4409 56.8592C47.449 54.1181 51.4039 51.317 54.7325 47.6269C54.4071 47.3804 54.0724 47.0993 53.7473 46.854C56.4342 45.3373 58.8541 43.3734 61.015 40.9973C60.5348 40.8666 60.0686 40.7135 59.5884 40.5828C61.2546 38.7101 62.7484 36.6792 63.9103 34.3113C63.5654 34.2001 63.2205 34.0889 62.876 33.9768C64.5457 31.2878 65.6406 28.5306 66.3782 25.6834C65.9128 25.8824 65.4473 26.0814 64.9946 26.2585C65.6088 23.5743 65.919 20.8602 65.8125 18.1105Z" fill="currentColor" />
            </svg>
          </div>
          <div className="p-6 md:p-8 lg:p-10 relative z-10">
            <div className="flex flex-col justify-center gap-4">
              <h2 className="text-5xl leading-[120%] text-[#101010] uppercase text-start font-vast-shadow">
                Turk&apos;s
              </h2>
              <span className="h-[2px] w-12 rounded-full bg-[var(--about-accent-text)] mt-1 transition-all duration-300 group-hover:w-16" />
              <RichTextRenderer
                content={aboutText || "No disclaimer text available"}
                className="flex flex-col items-start gap-3 text-base md:text-xl font-normal leading-[150%] text-[#101010]"
              />
              <div className="pt-2">
                <Button title="Shop Now" link="#strain" className="self-start" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

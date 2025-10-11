import about from "@/assets/about-image.png";
import { RichTextRenderer } from "@/lib/rich-text-renderer";
import { getMetaObject } from "@/lib/shopify";
import Image from "next/image";
import { Button } from "./Button";

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

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-15 md:gap-20 2xl:gap-34.5">
      <div className="max-w-[570px] w-full">
        <Image src={about} alt="about" className="w-full h-full object-cover" />
      </div>
      <div className="flex max-w-[570px] w-full flex-col items-start gap-12">
        <div className="flex flex-col justify-center gap-5">
          <h2 className="text-5xl font-black leading-[120%] text-[#101010] uppercase text-start font-playfair-display-sc">
            Turk’s
          </h2>
          <RichTextRenderer
            content={aboutText || "No disclaimer text available"}
            className="flex flex-col items-start gap-3 text-base md:text-xl font-normal leading-[150%] text-[#101010]"
          />
        </div>

        <Button title="Shop Now" link="/#strain" />
      </div>
    </div>
  );
}

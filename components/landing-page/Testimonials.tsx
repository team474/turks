import GMP from "@/assets/GMP-logo.png";
import { getMetaObject, getMetaObjectsByType } from "@/lib/shopify";
import { MetaObject } from "@/lib/shopify/types";
import Image from "next/image";
import { Icon } from "../Icons";
import { Marquee } from "@/components/ui/marquee";
import { gradientAround, mixWithBlack, mixWithWhite, saturateHex } from "@/lib/color";

// Helper function to extract field value from MetaObject
const getFieldValue = (metaObject: MetaObject, key: string): string => {
  const field = metaObject.fields.find((field) => field.key === key);
  return field?.value || "";
};

// Helper function to render stars based on rating
const renderStars = (rating: number, className: string = "fill-[#1D431D]") => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<Icon.yellowStarIcon key={i} className={className} />);
  }
  return stars;
};

// Helper to generate initials for avatar fallback
const getInitials = (name: string): string => {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  return words.slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("");
};

// Helper to infer ISO date from a "X days ago"-style string
const inferDateFromDaysAgo = (relative: string | undefined): string | undefined => {
  if (!relative) return undefined;
  const match = relative.match(/(\d+)/);
  if (!match) return undefined;
  const daysString = match[1] ?? match[0];
  const days = parseInt(daysString, 10);
  if (Number.isNaN(days)) return undefined;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

// Color palette for testimonial cards - rotates through these with 10% more contrast
const testimonialColors = [
  "#E8F0DC", // Very light sage green
  "#C9DFBA", // Medium mint green
  "#BDD8AF", // Pale green with depth
  "#F0F3E0", // Warm light cream
  "#D0E3B8", // Fresh medium green
  "#DBE9C8", // Light olive
  "#C0DCA8", // Spring green with saturation
  "#E9F1D8", // Soft beige-green
  "#CCDFB5", // Garden green medium
  "#D5E8BC", // Lime tint with contrast
];

const features = [
  {
    title: (
      <>
        Chemical and additive <br /> Free
      </>
    ),
    icon: <Icon.chamicalFreeIcon className="size-13 md:size-18" />,
  },
  {
    title: (
      <>
        100% Organic & <br /> Pesticide-Free
      </>
    ),
    icon: <Icon.organicIcon className="size-13 md:size-18" />,
  },
  {
    title: (
      <>
        Premium Indoor <br /> Grown
      </>
    ),
    icon: (
      <Image
        src={GMP}
        alt="premium indoor grown"
        width={72}
        height={72}
        className="size-13 md:size-18"
      />
    ),
  },
  {
    title: (
      <>
        Quality & Freshness <br /> Guaranteed
      </>
    ),
    icon: <Icon.premiumQualityIcon className="size-13 md:size-18" />,
  },
];

export async function Testimonials() {
  let header: MetaObject | undefined;
  try {
    header = await getMetaObject(
      "testimonials",
      "landing_page_section_headers"
    );
  } catch {
    header = undefined;
  }

  let testimonialsList: MetaObject[] | undefined;
  try {
    testimonialsList = await getMetaObjectsByType("user_testimonials");
  } catch {
    testimonialsList = undefined;
  }

  const mainHeader = header?.fields.find(
    (field) => field.key === "main_header"
  )?.value;
  const subHeader = header?.fields.find(
    (field) => field.key === "sub_header"
  )?.value;

  // Use dynamic testimonials data or fallback to empty array
  const testimonials = testimonialsList || [];
  
  // Split testimonials into two halves for the two marquees
  const midPoint = Math.ceil(testimonials.length / 2);
  const firstHalf = testimonials.slice(0, midPoint);
  const secondHalf = testimonials.slice(midPoint);

  // Helper function to render a single testimonial card
  const renderTestimonialCard = (testimonial: MetaObject, index: number) => {
    const comment = getFieldValue(testimonial, "comment");
    const userName = getFieldValue(testimonial, "user_name");
    const commentDaysAgo = getFieldValue(testimonial, "comment_days_ago");
    const stars = parseInt(getFieldValue(testimonial, "stars")) || 5;
    const initials = getInitials(userName || "");
    const publishedISO = inferDateFromDaysAgo(commentDaysAgo);
    
    // Get color from palette based on index
    const baseColor = testimonialColors[index % testimonialColors.length] || "#E3EAD5";
    const backgroundGradient = gradientAround(baseColor, 8);
    const borderColor = saturateHex(mixWithBlack(baseColor, 15), 20);
    const textColor = saturateHex(mixWithBlack(baseColor, 75), 35);
    const avatarBg = mixWithWhite(baseColor, 10);
    
    const reviewLd = {
      "@context": "https://schema.org",
      "@type": "Review",
      author: { "@type": "Person", name: userName || "Anonymous" },
      reviewBody: comment || "",
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(stars),
        bestRating: "5",
        worstRating: "1",
      },
      ...(publishedISO ? { datePublished: publishedISO } : {}),
    };

    return (
      <div
        key={testimonial.id}
        className="flex w-[280px] md:w-[320px] flex-col items-center gap-3 md:gap-4 mx-2"
      >
        <article
          className="flex p-5 md:p-6 flex-col justify-center items-center gap-4 md:gap-6 border rounded-2xl md:rounded-3xl shadow-sm motion-safe:transition-transform duration-200 hover:-translate-y-0.5 md:hover:-translate-y-1 hover:shadow-md md:hover:shadow-lg md:active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:min-h-[220px] w-full"
          style={{
            background: backgroundGradient,
            borderColor: borderColor,
            color: textColor,
          }}
          aria-label={`Testimonial by ${userName}`}
        >
          {/* Mobile: three-row layout */}
          <div className="flex flex-col gap-3 w-full md:hidden">
            {/* First row: stars */}
            <div
              className="flex items-center gap-1 justify-center"
              aria-label={`${stars} out of 5 stars`}
              style={{ color: textColor }}
            >
              <span className="sr-only">{stars} out of 5 stars</span>
              {renderStars(stars, "fill-current").map((el, idx) => (
                <span aria-hidden="true" key={idx}>
                  {el}
                </span>
              ))}
            </div>

            {/* Second row: icon + name and time (left-aligned, text can expand) */}
            <div className="flex items-center gap-2.5 w-full">
              <div 
                className="size-[48px] shrink-0 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] overflow-hidden"
                style={{ backgroundColor: avatarBg }}
              >
                <div 
                  className="w-full h-full flex items-center justify-center font-semibold text-base"
                  style={{ backgroundColor: avatarBg, color: textColor }}
                >
                  {initials}
                </div>
              </div>
              <div className="flex flex-col items-start flex-1 min-w-0">
                <cite className="text-base font-medium leading-[120%] uppercase not-italic w-full" style={{ color: textColor }}>
                  {userName}
                </cite>
                {commentDaysAgo && (
                  <>
                    {publishedISO ? (
                      <time
                        dateTime={publishedISO}
                        className="text-sm font-normal leading-[150%] w-full"
                        style={{ color: textColor }}
                      >
                        {commentDaysAgo}
                      </time>
                    ) : (
                      <span className="text-sm font-normal leading-[150%] w-full" style={{ color: textColor }}>
                        {commentDaysAgo}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Third row: quote + description (row layout with quote on left) */}
            <div className="flex items-start gap-2 w-full" style={{ color: textColor }}>
              <Icon.doubleQuote className="size-6 shrink-0 mt-0.5 fill-current" />
              <blockquote className="text-sm leading-[150%] flex-1">
                {comment}
              </blockquote>
            </div>
          </div>

          {/* Desktop: stacked content with quote on left */}
          <div className="hidden md:flex md:flex-col justify-center items-center gap-4 md:gap-5 w-full">
            <div
              className="flex items-center gap-1.5 scale-125"
              aria-label={`${stars} out of 5 stars`}
              style={{ color: textColor }}
            >
              <span className="sr-only">{stars} out of 5 stars</span>
              {renderStars(stars, "fill-current").map((el, idx) => (
                <span aria-hidden="true" key={idx}>
                  {el}
                </span>
              ))}
            </div>
            <div className="flex items-start gap-3 w-full" style={{ color: textColor }}>
              <Icon.doubleQuote className="scale-75 shrink-0 mt-1 fill-current" />
              <blockquote className="text-sm md:text-base leading-[150%] flex-1">
                {comment}
              </blockquote>
            </div>
          </div>

          {/* SEO: JSON-LD for review */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }}
          />
        </article>

        <div className="hidden md:flex flex-col justify-center items-center gap-4">
          <div 
            className="size-[64px] md:size-[72px] shrink-0 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] overflow-hidden"
            style={{ backgroundColor: avatarBg }}
          >
            <div 
              className="w-full h-full flex items-center justify-center font-semibold text-2xl"
              style={{ backgroundColor: avatarBg, color: textColor }}
            >
              {initials}
            </div>
          </div>
          <div className="flex justify-center items-center gap-1 flex-col">
            <cite className="text-base md:text-lg font-medium leading-[120%] uppercase not-italic" style={{ color: textColor }}>
              {userName}
            </cite>
            {commentDaysAgo && (
              <>
                {publishedISO ? (
                  <time
                    dateTime={publishedISO}
                    className="text-sm md:text-base font-normal leading-[150%] text-center"
                    style={{ color: textColor }}
                  >
                    {commentDaysAgo}
                  </time>
                ) : (
                  <span className="text-sm md:text-base font-normal leading-[150%] text-center" style={{ color: textColor }}>
                    {commentDaysAgo}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 md:gap-12 items-center">
      <div className="flex max-w-[1170px] mx-auto flex-col justify-center items-center gap-3 md:gap-5">
        <h2 className="text-[26px] md:text-5xl leading-[120%] text-[#101010] uppercase text-center font-vast-shadow">
          {mainHeader}
        </h2>
        <p className="text-center text-base md:text-xl font-normal leading-[150%] text-[#101010]">
          {subHeader}
        </p>
      </div>

      {testimonials.length > 0 ? (
        <div className="flex flex-col gap-4 md:gap-6 w-full relative">
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#F7F8F2] via-[#F7F8F2]/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#F7F8F2] via-[#F7F8F2]/90 to-transparent z-10 pointer-events-none" />
          
          {/* First Marquee - going left */}
          <Marquee className="[--duration:30s]" repeat={2}>
            {firstHalf.map((testimonial, index) => renderTestimonialCard(testimonial, index))}
          </Marquee>

          {/* Second Marquee - going right */}
          <Marquee reverse className="[--duration:30s]" repeat={2}>
            {secondHalf.map((testimonial, index) => renderTestimonialCard(testimonial, midPoint + index))}
          </Marquee>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No testimonials available at the moment.
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 w-full max-w-[1170px] p-6 md:p-7.5 justify-between items-center rounded-2xl md:rounded-4xl bg-[#DBEEC8] border border-[#1D431D]">
        {features.map((item, index) => (
          <div key={index} className="gap-2 flex items-center">
            <div className="flex w-full flex-col items-center gap-2 md:gap-7.5 shrink-0">
              {item.icon}
              <p className="text-xs sm:text-base font-bold leading-[120%] uppercase text-[#101010] text-center">
                {item.title}
              </p>
            </div>
            {index !== 3 && (
              <span className="hidden md:flex h-[100px] w-px min-w-px bg-[#1010101A]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

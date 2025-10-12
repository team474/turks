import GMP from "@/assets/GMP-logo.png";
import { getMetaObject, getMetaObjectsByType } from "@/lib/shopify";
import { MetaObject } from "@/lib/shopify/types";
import Image from "next/image";
import { Icon } from "../Icons";

// Helper function to extract field value from MetaObject
const getFieldValue = (metaObject: MetaObject, key: string): string => {
  const field = metaObject.fields.find((field) => field.key === key);
  return field?.value || "";
};

// Helper function to get user image URL from MetaObject
const getUserImageUrl = (metaObject: MetaObject): string => {
  const field = metaObject.fields.find((field) => field.key === "user_image");
  return field?.reference?.image?.url || "";
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

const features = [
  {
    title: (
      <>
        London Pound <br /> Cake
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
  return (
    <div className="flex flex-col gap-6 md:gap-12 items-center">
      <div className="flex max-w-[1170px] mx-auto flex-col justify-center items-center gap-3 md:gap-5">
        <h2 className="text-[26px] md:text-5xl font-black leading-[120%] text-[#101010] uppercase text-center font-playfair-display-sc">
          {mainHeader}
        </h2>
        <p className="text-center text-base md:text-xl font-normal leading-[150%] text-[#101010]">
          {subHeader}
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-7.5">
        {testimonials.length > 0 ? (
          testimonials.map((testimonial, index) => {
            const comment = getFieldValue(testimonial, "comment");
            const userName = getFieldValue(testimonial, "user_name");
            const commentDaysAgo = getFieldValue(
              testimonial,
              "comment_days_ago"
            );
            const stars = parseInt(getFieldValue(testimonial, "stars")) || 5;
            const userImageUrl = getUserImageUrl(testimonial);
            const initials = getInitials(userName || "");
            const publishedISO = inferDateFromDaysAgo(commentDaysAgo);
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
                className={`flex md:max-w-[370px] w-full flex-col items-center gap-4 ${index === 1 && "md:flex-col-reverse"}`}
              >
                <article
                  className="flex p-7.5 pb-6 flex-col justify-center items-center gap-8 bg-[linear-gradient(to_bottom,_#E8F5DC,_#DBEEC8,_#CEE8B6)] border border-[#1D431D] rounded-3xl shadow-sm motion-safe:transition-transform duration-200 hover:-translate-y-0.5 md:hover:-translate-y-1 hover:shadow-md md:hover:shadow-lg md:active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D431D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#DBEEC8] md:min-h-[260px]"
                  aria-label={`Testimonial by ${userName}`}
                >
                  {/* Mobile: two-column layout with avatar on left and content on right */}
                  <div className="grid grid-cols-[72px_1fr] items-start gap-3 w-full md:hidden">
                    <div className="size-[72px] shrink-0 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] overflow-hidden bg-[#E3EAD5]">
                      {userImageUrl ? (
                        <Image
                          src={userImageUrl}
                          alt={userName || "User avatar"}
                          width={72}
                          height={72}
                          sizes="72px"
                          className="block w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#E3EAD5] flex items-center justify-center text-[#1D431D] font-semibold">
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-2 justify-center w-full">
                      <div className="flex w-full items-start justify-between gap-2">
                        <div className="flex flex-col items-start">
                          <cite className="text-lg font-medium leading-[120%] text-[#1D431D] uppercase not-italic">{userName}</cite>
                          {publishedISO ? (
                            <time dateTime={publishedISO} className="text-base font-normal leading-[150%] text-[#1D431D]">
                              {commentDaysAgo}
                            </time>
                          ) : (
                            <span className="text-base font-normal leading-[150%] text-[#1D431D]">{commentDaysAgo}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 scale-110 shrink-0" aria-label={`${stars} out of 5 stars`}>
                          <span className="sr-only">{stars} out of 5 stars</span>
                          {renderStars(stars, "fill-[#1D431D]").map((el, idx) => (
                            <span aria-hidden="true" key={idx}>{el}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 w-full">
                        <Icon.doubleQuote className="size-8 fill-[#1D431D] text-[#1D431D] shrink-0 mt-0.5" />
                        <blockquote className="text-base leading-[150%] text-[#1D431D] flex-1">
                          {comment}
                        </blockquote>
                      </div>
                    </div>
                  </div>

                  {/* Desktop: original stacked content */}
                  <div className="hidden md:flex md:flex-col justify-center items-center gap-8">
                    <Icon.doubleQuote className="fill-[#1D431D] text-[#1D431D]" />
                    <div className="flex items-center gap-2 scale-150" aria-label={`${stars} out of 5 stars`}>
                      <span className="sr-only">{stars} out of 5 stars</span>
                      {renderStars(stars, "fill-[#1D431D]").map((el, idx) => (
                        <span aria-hidden="true" key={idx}>{el}</span>
                      ))}
                    </div>
                    <blockquote className="text-base md:text-xl leading-[150%] text-[#101010] md:text-[#1D431D] text-center">
                      {comment}
                    </blockquote>
                  </div>

                  {/* SEO: JSON-LD for review */}
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }}
                  />
                </article>

                <div className="hidden md:flex flex-col justify-center items-center gap-6.5">
                  <div className="size-[72px] md:size-[100px] shrink-0 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] overflow-hidden bg-[#E3EAD5]">
                    {userImageUrl ? (
                      <Image
                        src={userImageUrl}
                        alt={userName || "User avatar"}
                        width={100}
                        height={100}
                        sizes="(min-width: 768px) 100px, 72px"
                        className="block w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E3EAD5] flex items-center justify-center text-[#1D431D] font-semibold">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center items-center gap-1 flex-col">
                    <cite className="text-lg md:text-2xl font-medium leading-[120%] text-[#101010] uppercase not-italic">
                      {userName}
                    </cite>
                    {publishedISO ? (
                      <time dateTime={publishedISO} className="text-base md:text-lg font-normal leading-[150%] text-[#101010] text-center">
                        {commentDaysAgo}
                      </time>
                    ) : (
                      <span className="text-base md:text-lg font-normal leading-[150%] text-[#101010] text-center">{commentDaysAgo}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-8">
            No testimonials available at the moment.
          </div>
        )}
      </div>

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

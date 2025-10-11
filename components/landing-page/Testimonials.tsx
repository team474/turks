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
const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<Icon.yellowStarIcon key={i} />);
  }
  return stars;
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

            return (
              <div
                key={testimonial.id}
                className={`flex md:max-w-[370px] w-full flex-col items-center gap-4 ${index === 1 && "md:flex-col-reverse"}`}
              >
                <div
                  style={{
                    filter: "drop-shadow(0 4px 14px rgba(0, 0, 0, 0.05))",
                  }}
                  className="flex p-7.5 pb-2 flex-col justify-center items-center gap-8 bg-white rounded-3xl"
                >
                  <Icon.doubleQuote className="fill-[#1D431D]" />
                  <div className="flex items-center gap-2">
                    {renderStars(stars)}
                  </div>
                  <p className="text-base md:text-xl leading-[150%] text-[#101010] text-center">
                    {comment}
                  </p>
                </div>

                <div className="flex flex-col justify-center items-center gap-6.5">
                  <div className="size-13 md:size-18 shrink-0 rounded-full border-2 border-white shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] overflow-hidden">
                    {userImageUrl ? (
                      <Image
                        src={userImageUrl}
                        alt={userName}
                        width={72}
                        height={72}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E3EAD5]"></div>
                    )}
                  </div>
                  <div className="flex justify-center items-center gap-1 flex-col">
                    <p className="text-base md:text-xl font-medium leading-[120%] text-[#101010] uppercase">
                      {userName}
                    </p>
                    <p className="text-sm md:text-base font-normal leading-[150%] text-[#101010] text-center">
                      {commentDaysAgo}
                    </p>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-0 w-full max-w-[1170px] p-4 md:p-7.5 justify-between items-center rounded-2xl md:rounded-4xl bg-[#E3EAD5]">
        {features.map((item, index) => (
          <div key={index} className="gap-2 flex items-center">
            <div className="flex w-full flex-col items-center gap-7.5 shrink-0">
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

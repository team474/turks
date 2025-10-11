import { Icon } from "@/components/Icons";
import { CompanyPage } from "@/components/landing-page/CompanyPage";
import { CTA } from "@/components/landing-page/CTA";
import { cn } from "@/lib/utils";
import Link from "next/link";

const contactInfo = [
  {
    title: "Call",
    icon: <Icon.callIcon />,
    value: "856-300-3416",
    href: "tel:856-300-3416",
  },
  {
    title: "Email",
    icon: <Icon.emailIcon />,
    value: "turksbudco@gmail.com",
    href: "mailto:turksbudco@gmail.com",
  },
  {
    title: "Address",
    icon: <Icon.mapPinIcon />,
    value: "Cherry Hill Township, NJ 08003",
    href: "https://www.google.com/maps/place/Cherry+Hill+Township,+NJ+08003/@39.8729013,-75.0091485,13z/data=!3m1!4b1!4m6!3m5!1s0x89c6c666764406e1:0x830564154214506f!8m2!3d39.8729013!4d-75.0091485!16s%2Fg%2F11f5xk3319?entry=ttu&g_ep=EgoyMDI1MTAyMi4wIKXMDSoASAFQAw%3D%3D",
  },
];
export default function page() {
  return (
    <CompanyPage title="Contact Us" path="contact us">
      <>
        <div className="flex flex-col justify-center items-center gap-7.5 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-7.5 w-full">
            <div className="flex p-4 md:p-8 justify-center items-center gap-8 rounded-[20px] bg-[#DBEEC8]">
              <div className="flex flex-col items-start gap-8 w-full">
                <h2 className="text-xl w-full text-center md:text-[28px] font-black leading-[120%] text-[#101010] uppercase font-playfair-display-sc">
                  Ready to Start Your Journey?
                </h2>
                <form action="" className="flex flex-col gap-4 md:gap-6 w-full">
                  <div className="flex py-4 pl-6 pr-9 gap-4 bg-white rounded-full">
                    <Icon.userIcon />
                    <input
                      type="text"
                      placeholder="Enter Your Name"
                      className="w-full text-base font-normal leading-[150%] text-[#101010] bg-transparent outline-none ring-0"
                    />
                  </div>
                  <div className="flex py-4 pl-6 pr-9 gap-4 bg-white rounded-full">
                    <Icon.emailIcon />
                    <input
                      type="email"
                      placeholder="Enter Your Email Address"
                      className="w-full text-base font-normal leading-[150%] text-[#101010] bg-transparent outline-none ring-0"
                    />
                  </div>
                  <div className="flex py-4 pl-6 pr-9 gap-4 bg-white rounded-full">
                    <Icon.callIcon />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter Your Phone Number"
                      className="w-full text-base font-normal leading-[150%] text-[#101010] bg-transparent outline-none ring-0"
                    />
                  </div>
                  <div className="flex py-4 pl-6 pr-9 gap-4 bg-white rounded-3xl">
                    <Icon.messageIcon />
                    <textarea
                      placeholder="Message"
                      className="w-full text-base font-normal leading-[150%] text-[#101010] bg-transparent outline-none ring-0"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-fit mx-auto md:mt-2 flex px-4 py-3 sm:px-8 sm:py-4 justify-center items-center gap-4 rounded-full border border-white bg-[#1D431D] shadow-[0_1px_0_1px_#1D431D] text-white text-sm sm:text-base font-bold leading-[150%] uppercase"
                  >
                    GET IN TOUCH
                    <Icon.arrowRightIcon />
                  </button>
                </form>
              </div>
            </div>

            <div className="size-full rounded-[20px] bg-[#DBEEC8]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7.5 w-full">
            {contactInfo.map((item, index) => (
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className={cn(
                  "flex p-5 items-center gap-5 rounded-[20px] bg-[#DBEEC8]",
                  index === 2 && "md:col-span-2 lg:col-span-1"
                )}
              >
                <div className="size-10.5 md:size-13 flex justify-center items-center rounded-full bg-white shrink-0">
                  {item.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base md:text-xl font-black leading-[120%] text-[#101010] uppercase font-playfair-display-sc">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base font-normal leading-[150%] text-[#101010]">
                    {item.value}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <CTA />
      </>
    </CompanyPage>
  );
}

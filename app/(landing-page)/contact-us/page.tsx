import { Icon } from "@/components/Icons";
import { CompanyPage } from "@/components/landing-page/CompanyPage";
import { CTA } from "@/components/landing-page/CTA";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { slowLeft, slowRight } from "@/lib/animation";
import { ContactForm } from "@/components/landing-page/ContactForm";

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
  const styleVars: React.CSSProperties = {
    ["--cta-bg" as unknown as keyof React.CSSProperties]: "#DBEEC8",
    ["--cta-border" as unknown as keyof React.CSSProperties]: "#1D431D",
  };

  return (
    <CompanyPage title="Contact Us">
      <div style={styleVars} className="w-full max-w-[1170px] mx-auto">
        <div className="flex flex-col justify-center items-center gap-10 md:gap-14 z-10">
          <Reveal variants={slowLeft}>
            <div className="w-full rounded-[20px] p-6 md:p-8 bg-[linear-gradient(to_bottom,_hsl(77,33%,94%),_hsl(77,33%,90%),_hsl(77,33%,86%))] md:bg-[linear-gradient(to_bottom,_hsl(77,33%,96%),_hsl(77,33%,92%),_hsl(77,33%,88%))] border border-[#1D431D]/20 border-b-[hsl(77,33%,70%)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:border-[#1D431D] hover:brightness-[1.02]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div className="flex flex-col items-start gap-6 md:gap-8">
                  <h2 className="text-xl w-full text-center md:text-left md:text-[28px] leading-[120%] text-[#101010] uppercase font-vast-shadow">
                    Ready to Start Your Journey?
                  </h2>
                  <ContactForm />
                </div>
                <div className="flex flex-col gap-5 md:gap-6 md:pl-12 md:border-l md:border-l-[#1D431D]/15">
                  <h3 className="text-lg md:text-2xl leading-[120%] text-[#101010] uppercase font-vast-shadow">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {contactInfo.map((item, index) => (
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={index}
                        className={cn(
                          "group w-full min-h-[68px] grid grid-cols-[auto_1fr] items-center gap-4 md:gap-5 rounded-[16px] p-4 md:p-5 bg-[linear-gradient(to_bottom,_#EFF7E6,_#DBEEC8)] border border-[#1D431D]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#1D431D] hover:translate-y-[-1px] hover:shadow-[0_8px_24px_rgba(29,67,29,0.10)]",
                          index === 2 && ""
                        )}
                      >
                        <div className="size-11 md:size-13 flex justify-center items-center rounded-full bg-[#DBEEC8] border border-[#1D431D]/40 shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] group-hover:border-[#1D431D]">
                          {item.icon}
                        </div>
                        <div className="flex flex-col gap-1">
                          <h4 className="text-base md:text-xl leading-[120%] text-[#101010] uppercase font-vast-shadow">
                            {item.title}
                          </h4>
                          <p className="text-sm md:text-base font-normal leading-[150%] text-[#101010]">
                            {item.value}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-10">
          <Reveal variants={slowRight} amount={0.3}>
            <CTA />
          </Reveal>
        </div>
      </div>
    </CompanyPage>
  );
}

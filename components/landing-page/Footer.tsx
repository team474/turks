import { getMenu, getMetaObject } from "@/lib/shopify";
import type { Menu as MenuType, MetaObject } from "@/lib/shopify/types";
import Link from "next/link";
import { Icon } from "../Icons";

const strains = [
  {
    name: "Banana Zkittles",
    link: "/",
  },
  {
    name: "Gary Payton",
    link: "/",
  },
  {
    name: "London Pound Cake",
    link: "/",
  },
  {
    name: "Garlic Truffles",
    link: "/",
  },
  {
    name: "Hood Candy",
    link: "/",
  },
];

const aboutUs = [
  {
    title: "Contact",
    path: "/contact-us",
  },
  {
    title: "Blog",
    path: "/blog",
  },
];

// Helper function to get social accounts based on available data
const getSocialAccounts = (socialLinks: MetaObject | undefined) => {
  if (!socialLinks?.fields) return [];
  
  const socialAccounts = [];
  
  // Check for Facebook
  const facebookUrl = socialLinks.fields.find(field => field.key === 'facebook_url')?.value;
  if (facebookUrl) {
    socialAccounts.push({
      name: "Facebook",
      Icon: <Icon.facebookIcon />,
      link: facebookUrl,
    });
  }
  
  // Check for Instagram
  const instagramUrl = socialLinks.fields.find(field => field.key === 'instagram_url')?.value;
  if (instagramUrl) {
    socialAccounts.push({
      name: "Instagram",
      Icon: <Icon.instagramIcon />,
      link: instagramUrl,
    });
  }
  
  // Check for X (Twitter)
  const xUrl = socialLinks.fields.find(field => field.key === 'x_url')?.value;
  if (xUrl) {
    socialAccounts.push({
      name: "X",
      Icon: <Icon.xIcon />,
      link: xUrl,
    });
  }
  
  return socialAccounts;
};

export async function Footer() {
  let menu: MenuType[] = [];
  let footerDisclaimer: MetaObject | undefined;
  let socialLinks: MetaObject | undefined;

  try {
    menu = await getMenu("next-js-frontend-footer-menu");
  } catch {
    // Fallback to local links if Shopify request fails at build/runtime
    menu = aboutUs.map(({ title, path }) => ({ title, path }));
  }

  try {
    footerDisclaimer = await getMetaObject(
      "footer-cta-and-disclaimer",
      "footer_content"
    );
  } catch {
    footerDisclaimer = undefined;
  }

  try {
    socialLinks = await getMetaObject("social-urls", "social_links");
  } catch {
    socialLinks = undefined;
  }


  const ctaText = footerDisclaimer?.fields.find(
    (field) => field.key === "cta"
  )?.value;
  // Get the disclaimer text from MetaObject, fallback to hardcoded text if not found
  const disclaimerText = footerDisclaimer?.fields.find(
    (field) => field.key === "fda_disclaimer"
  )?.value;

  // Get dynamic social accounts based on available data
  const availableSocialAccounts = getSocialAccounts(socialLinks);

  return (
    <footer className="w-full max-w-[1170px] mx-auto p-6 lg:p-4 xl:px-0 lg:pt-12 flex flex-col justify-center items-center pb-0 lg:pb-0">
      <div className="flex flex-col lg:flex-row py-7.5 items-start gap-12 border-t border-b border-[rgba(16,16,16,0.10)] lg:h-[530px]">
        <div className="flex flex-col justify-between items-start flex-1 gap-12.5">
          <div className="flex flex-col gap-8 sm:min-w-[405px]">
            <p className="text-base font-normal leading-[150%] text-[#101010]">
              {ctaText}
            </p>

            <div className="flex flex-col gap-1">
              <p className="text-base font-medium leading-[150%] text-[#101010]">
                FDA disclaimer :
              </p>
              <div className="text-sm font-normal leading-[150%] text-[#101010]">
                {disclaimerText}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="px-8 py-4 flex-1 rounded-full border border-[#1D431D] bg-[#DBEEC8]">
              <input
                type="text"
                placeholder="Enter your email"
                className="text-base font-normal leading-[150%] text-[#101010] bg-transparent outline-none w-full"
              />
            </div>
            <button className="flex px-8 py-4 justify-center items-center rounded-[48px] bg-[#1D431D]">
              <Icon.arrowRightIcon className="text-white" />
            </button>
          </div>
        </div>

        <span className="hidden lg:block w-px h-full bg-[rgba(16,16,16,0.10)]" />

        <span className="lg:hidden w-full h-px bg-[rgba(16,16,16,0.10)]" />

        <div className="flex w-full flex-col items-end justify-between h-full gap-18">
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-10 text-[#101010]">
            <div className="flex flex-col items-start gap-8 flex-1">
              <p className="text-xl font-medium leading-[120%] uppercase">
                Strains
              </p>
              <div className="flex flex-col items-start gap-6">
                {strains.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="text-sm font-medium leading-[150%] transition-colors duration-200 hover:text-[#1D431D]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start gap-8 flex-1">
              <p className="text-xl font-medium leading-[120%] uppercase">
                Company
              </p>
              <div className="flex flex-col items-start gap-6">
                {menu.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className="text-sm font-medium leading-[150%] transition-colors duration-200 hover:text-[#1D431D]"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex col-span-2 md:col-span-1 flex-col items-start gap-8 flex-1">
              <p className="text-xl font-medium leading-[120%] uppercase">
                Socials
              </p>
              <div className="flex items-start gap-6 flex-wrap">
                {availableSocialAccounts.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="size-12 flex justify-center items-center p-2.5 bg-[#1D431D] rounded-full transition-colors duration-200 hover:bg-[#163416]"
                  >
                    {item.Icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start w-full">
            <div className="flex items-start gap-4 md:gap-7.5">
              {aboutUs.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="text-xs sm:text-sm font-medium leading-[150%] transition-colors duration-200 hover:text-[#1D431D]"
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <p className="text-xs sm:text-sm font-normal leading-[150%] uppercase">
              © turk’s bud 2025
            </p>
          </div>
        </div>
      </div>

      <p className="oi-regular text-[62px] md:text-[172px] font-normal text-[#1D431D] uppercase tracking-[3.44px] text-center leading-[normal]">
        TURK’S
      </p>
    </footer>
  );
}

"use client";

import { Menu } from "lib/shopify/types";
import StaggeredMenu from "components/StaggeredMenu";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const items = (menu || []).map((m) => ({
    label: m.title,
    ariaLabel: `Go to ${m.title}`,
    link: m.path,
  }));

  // Subtle left-to-right site gradient (reduced intensity)
  const colors = [
    // Darker, saturated layer below (matches menu text color)
    "#1D431D",
    // Lighter layers above
    "hsl(77,33%,78%)",
    "hsl(77,33%,75%)",
    "hsl(77,33%,72%)",
  ];

  return (
    <StaggeredMenu
      position="right"
      items={items}
      socialItems={[]}
      displaySocials={false}
      displayItemNumbering={false}
      menuButtonColor="#1D431D"
      openMenuButtonColor="#1D431D"
      changeMenuColorOnOpen={false}
      colors={colors}
      isFixed={false}
      accentColor="#1D431D"
      renderInlineToggle={true}
    />
  );
}

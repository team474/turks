import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselTab({ children }: { children: React.ReactNode }) {
  return (
    <Carousel
      opts={{
        // align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>{children}</CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

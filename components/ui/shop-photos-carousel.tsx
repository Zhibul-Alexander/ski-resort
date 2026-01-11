"use client";

import * as React from "react";
import { Carousel } from "./carousel";
import { ImageLightbox } from "./image-lightbox";

interface ShopPhotosCarouselProps {
  images: Array<{ src: string; title?: string }>;
}

export function ShopPhotosCarousel({ images }: ShopPhotosCarouselProps) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Carousel slidesPerView={{ mobile: 1, desktop: 1.5 }} autoPlay={!lightboxOpen}>
        {images.map((p, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-border bg-card h-[500px] cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleImageClick(idx)}
          >
            <img src={p.src} alt={p.title} className="w-full h-full object-cover" />
          </div>
        ))}
      </Carousel>
      <ImageLightbox
        images={images}
        initialIndex={selectedIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  );
}


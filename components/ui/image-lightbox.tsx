"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface ImageLightboxProps {
  images: Array<{ src: string; title?: string }>;
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageLightbox({ images, initialIndex = 0, open, onOpenChange }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, open]);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, images.length, onOpenChange]);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center outline-none"
          onPointerDownOutside={(e) => {
            onOpenChange(false);
          }}
        >
          <Dialog.Title className="sr-only">
            {currentImage.title || `Изображение ${currentIndex + 1} из ${images.length}`}
          </Dialog.Title>
          <div 
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => {
              // Закрываем при клике вне изображения и кнопок
              const target = e.target as HTMLElement;
              const isImage = target.tagName === 'IMG';
              const isImageContainer = target.closest('.image-container');
              const isButton = target.closest('button');
              
              if (!isImage && !isImageContainer && !isButton) {
                onOpenChange(false);
              }
            }}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 text-white border border-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChange(false);
              }}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Закрыть</span>
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-10 h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 text-white border border-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Предыдущее</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-10 h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 text-white border border-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Следующее</span>
                </Button>
              </>
            )}

            <div 
              className="image-container max-w-7xl max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage.src}
                alt={currentImage.title || `Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-background/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 text-white text-sm pointer-events-none">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}


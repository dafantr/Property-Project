"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface ImageContainerProps {
  images: string[];
}

const ImageContainer: React.FC<ImageContainerProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [smallImageIndex, setSmallImageIndex] = useState<number>(0); // Track the start index of small images
  const startX = useRef<number | null>(null);
  const isSwiping = useRef<boolean>(false); // To track if the user is swiping

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mobile: <768px
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!images || images.length === 0) {
    return <p>No images available</p>;
  }

  // Close modal function
  const closeModal = () => setSelectedIndex(null);

  // Navigate left (previous image)
  const prevImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : 0));
    }
  };
  
  const nextImage = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : 0));
    }
  };  

  // Navigate left (for smaller images) with infinite loop
  const prevSmallImage = () => {
    if (smallImageIndex > 0) {
      setSmallImageIndex(smallImageIndex - 1);
    } else {
      setSmallImageIndex(images.length - 7); // Loop to the last set of images
    }
  };

  // Navigate right (for smaller images) with infinite loop
  const nextSmallImage = () => {
    if (smallImageIndex < images.length - 7) {
      setSmallImageIndex(smallImageIndex + 1);
    } else {
      setSmallImageIndex(0); // Loop back to the first set of images
    }
  };

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    isSwiping.current = true;
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null || !isSwiping.current) return;
    const endX = e.touches[0].clientX;
    const diff = startX.current - endX;

    if (diff > 50) {
      nextImage(); // Swipe left → Next image
      isSwiping.current = false; // Disable further swipe actions until reset
    } else if (diff < -50) {
      prevImage(); // Swipe right → Previous image
      isSwiping.current = false; // Disable further swipe actions until reset
    }
  };

  const handleTouchEnd = () => {
    isSwiping.current = false;
    startX.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isSwiping.current = true;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startX.current === null || !isSwiping.current) return;
    const endX = e.clientX;
    const diff = startX.current - endX;

    if (diff > 50) {
      nextImage(); // Swipe left → Next image
      isSwiping.current = false; // Disable further swipe actions until reset
    } else if (diff < -50) {
      prevImage(); // Swipe right → Previous image
      isSwiping.current = false; // Disable further swipe actions until reset
    }
  };

  const handleMouseUp = () => {
    isSwiping.current = false;
    startX.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex !== null) {
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "Escape") closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* BIG IMAGE */}
      <div
        className="relative overflow-hidden rounded-lg cursor-pointer mx-auto"
        onClick={() => setSelectedIndex(0)}
      >
        <Image
          src={images[0]}
          alt="Featured Image"
          width={500} // Adjust width
          height={200} // Adjust height
          className="object-cover rounded-lg hover:scale-105 transition-transform duration-300 mx-auto"
        />
      </div>

      {/* SMALL IMAGES BELOW */}
      <div className="relative">
        {images.length > 7 && (
          <button
            onClick={prevSmallImage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[rgba(194,171,125,1)] text-white p-3 rounded-full hover:bg-[rgba(194,171,125,0.9)] transition z-50"
          >
            ◀
          </button>
        )}
        <div className="flex gap-4 mt-4 overflow-x-auto">
          {images.slice(1).slice(smallImageIndex, smallImageIndex + 7).map((img, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedIndex(smallImageIndex + index + 1)}
            >
              <Image
                src={img}
                alt={`Property image ${index + 1}`}
                width={150} // Smaller size for the small images
                height={100}
                className="h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        {images.length > 7 && (
          <button
            onClick={nextSmallImage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[rgba(194,171,125,1)] text-white p-3 rounded-full hover:bg-[rgba(194,171,125,0.9)] transition z-50"
          >
            ▶
          </button>
        )}
      </div>

      {/* FULLSCREEN IMAGE VIEWER */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="fixed top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full border border-[rgba(194,171,125,1)] text-[rgba(194,171,125,1)] hover:bg-[rgba(194,171,125,0.1)] transition-all"
          >
            ✕
          </button>

          {/* Navigation Buttons (Hidden on Mobile) */}
          {!isMobile && selectedIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 bg-[rgba(194,171,125,1)] text-white p-3 rounded-full hover:bg-[rgba(194,171,125,0.9)] transition z-50"
            >
              ◀
            </button>
          )}
          {!isMobile && selectedIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 bg-[rgba(194,171,125,1)] text-white p-3 rounded-full hover:bg-[rgba(194,171,125,0.9)] transition z-50"
            >
              ▶
            </button>
          )}

          {/* Selected Image Display */}
          <div className="relative flex justify-center">
            <img
              src={images[selectedIndex]}
              alt="Selected"
              className="rounded-lg"
              style={{
                maxWidth: "90%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageContainer;

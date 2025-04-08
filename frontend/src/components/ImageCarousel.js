// src/components/ImageCarousel.js
import React, { useState, useEffect } from 'react';

const ImageCarousel = ({ images, alt, className, autoSlide = true, slideInterval = 3000, showArrows = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efecto para auto-deslizar las imágenes
  useEffect(() => {
    if (autoSlide && images && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, slideInterval);
      return () => clearInterval(interval);
    }
  }, [autoSlide, images, slideInterval]);

  if (!images || images.length === 0) {
    return (
      <img
        src="/images/sample.jpg"
        alt={alt}
        className={className}
      />
    );
  }

  const handlePrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={images[currentIndex]}
        alt={`${alt} ${currentIndex + 1}`}
        className="w-full h-full object-cover rounded"
      />
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full"
          >
            &#9664;
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full"
          >
            &#9654;
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;

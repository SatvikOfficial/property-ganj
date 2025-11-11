'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const carouselImages = [
  '/3bhk-apartment.jpg',
  '/luxury-apartment.jpg',
  '/modern-apartment.jpg',
  '/apartment-complex.jpg',
  '/residential-property.jpg',
  '/modern-2bhk-apartment.jpg',
  '/4bhk-apartment.jpg',
  '/premium-apartment.jpg',
];

export default function PropertyCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xs mx-auto md:ml-auto md:mr-0">
      <div className="relative w-48 h-64 md:w-52 md:h-80 rounded-lg overflow-hidden shadow-lg">
        {carouselImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={src}
              alt={`Property ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  school: string;
  image: string;
  content: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

function useDeviceDetect() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkDevice();

    // Add event listener for window resize
    window.addEventListener("resize", checkDevice);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return { isMobile, isDesktop: !isMobile };
}

export default function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
  const { isDesktop } = useDeviceDetect();
  const perPage = isDesktop ? 2 : 1;
  const minHeight = isDesktop ? "400px" : "500px";

  const [activeIndex, setActiveIndex] = useState(0);
  const totalPages = Math.ceil(testimonials.length / perPage);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalPages);
    }, 5000); // Change testimonials every 5 seconds

    return () => clearInterval(interval);
  }, [totalPages]);

  const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex items-center mb-4">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          width={64}
          height={64}
          className="rounded-full mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold text-[#79b6f2]">
            {testimonial.name}
          </h3>
          <p className="text-gray-600">{testimonial.school}</p>
        </div>
      </div>
      <p className="text-gray-700 flex-grow">{testimonial.content}</p>
    </div>
  );

  return (
    <>
      <div className="relative overflow-hidden" style={{ minHeight }}>
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <div
            key={pageIndex}
            className="absolute top-0 left-0 w-full transition-all duration-500 ease-in-out"
            style={{
              transform: `translateX(${(pageIndex - activeIndex) * 100}%)`,
              opacity: pageIndex === activeIndex ? 1 : 0,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials
                .slice(pageIndex * perPage, pageIndex * perPage + perPage)
                .map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full mx-1 ${
              index === activeIndex ? "bg-[#79b6f2]" : "bg-gray-300"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to testimonial page ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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

export default function TestimonialCarousel({
  testimonials,
}: TestimonialCarouselProps) {
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
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      breakpoints={{
        768: {
          slidesPerView: 2,
        },
      }}
      className="min-h-[400px] md:min-h-[500px]"
    >
      {testimonials.map((testimonial) => (
        <SwiperSlide key={testimonial.id}>
          <TestimonialCard testimonial={testimonial} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

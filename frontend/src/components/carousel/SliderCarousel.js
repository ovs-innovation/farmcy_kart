import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import "swiper/css";
import "swiper/css/navigation";

const SliderCarousel = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingImage } = useUtilsFunction();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Get all slider images from CMS
  const sliderImages = [
    "/slider/dss11.webp"|| storeCustomizationSetting?.slider?.first_img ,
     "/slider/dss22.webp"|| storeCustomizationSetting?.slider?.second_img,
    storeCustomizationSetting?.slider?.third_img || "/slider/dss11.webp",
    storeCustomizationSetting?.slider?.four_img || "/slider/dss11.webp",
    storeCustomizationSetting?.slider?.five_img || "/slider/dss11.webp",
  ].filter(Boolean).map(img => showingImage(img));

  // Don't render if no images
  if (!sliderImages || sliderImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white  ">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="relative">
          <Swiper
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            modules={[Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={sliderImages.length > 2}
            className="slider-carousel-swiper"
          >
            {sliderImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Image
                    src={image}
                    alt={`Slider ${index + 1}`}
                    fill
                    className="object-contain"
                    priority={index < 2}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Navigation Buttons */}
          <button 
            ref={prevRef}
            className="prev-slider absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-store-50 transition-colors transform -translate-x-4"
          >
            <IoChevronBack className="text-xl text-gray-600" />
          </button>
          <button 
            ref={nextRef}
            className="next-slider absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-store-50 transition-colors transform translate-x-4"
          >
            <IoChevronForward className="text-xl text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SliderCarousel;


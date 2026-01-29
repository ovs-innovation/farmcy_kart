import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import useGetSetting from "@hooks/useGetSetting";
import { getPalette } from "@utils/themeColors";
import SectionHeader from "@components/common/SectionHeader";

const CategoryCards = () => {
  const router = useRouter();
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";
  const palette = getPalette(storeColor);

  const categories = [
    {
      id: 1,
      title: "DIABETES CARE",
      description: "Medicines, glucose monitors, test strips, and daily care essentials for diabetes management.",
      image: "/flags/diabetic-health.webp",
      searchQuery: "diabetes",
    },
    {
      id: 2,
      title: "HEART CARE",
      description: "Prescription and OTC medicines for blood pressure, cholesterol, and heart health support.",
      image: "/flags/heart-care.webp",
      searchQuery: "heart",
    },
    {
      id: 3,
      title: "PAIN RELIEF",
      description: "Painkillers, muscle relaxants, and inflammation relief medicines.",
      image: "/flags/pain-relief.png",
      searchQuery: "pain",
    },
    {
      id: 4,
      title: "COLD & COUGH",
      description: "Syrups, tablets, lozenges, and immunity boosters.",
      image: "/flags/cold-caugh.png",
      searchQuery: "cold",
    },
    {
      id: 5,
      title: "BABY CARE",
      description: "Baby medicines, nutrition, skincare, and hygiene products.",
      image: "/flags/babycare.png",
      searchQuery: "baby",
    },
    {
      id: 6,
      title: "WOMEN'S HEALTH",
      description: "Personal care, supplements, and wellness products for women.",
      image: "/flags/women-health.jpg",
      searchQuery: "women",
    },
  ];

  return (
    <div className="bg-white py-12  ">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10">
        {/* Header Section */}
        <SectionHeader
          title="Departments"
          subtitle=" "
          align="left"
        />

        {/* Category Cards Carousel */}
        <div className="relative">
          <style dangerouslySetInnerHTML={{
            __html: `
              /* Simplified navigation styles */
              .category-cards-swiper .swiper-button-next { right: 10px !important; color: #333 !important; }
              .category-cards-swiper .swiper-button-prev { left: 10px !important; color: #333 !important; }
              .category-cards-swiper .swiper-button-next::after,
              .category-cards-swiper .swiper-button-prev::after {
                font-size: 16px !important;
              }
            `
          }} />
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            navigation={true}
            className="category-cards-swiper"
          >
            {categories.map((category) => {
              return (
                <SwiperSlide key={category.id}>
                  <div
                    className="group relative overflow-hidden  transition-all duration-500   h-full   flex flex-col"
                    style={{
                      minHeight: "300px",
                    }}
                    onClick={() => router.push(`/search`)}
                  >
                    {/* Image Area - Simple */}
                    <div className="relative w-full h-48 overflow-hidden  ">
                      <Image
                        src={category.image}
                        alt={category.title}
                        layout="fill"
                        objectFit="contain"
                        className="transition-transform duration-300 p-4"
                      />
                    </div>

                    <div className="relative z-10 p-8 flex flex-col flex-1 -mt-6">
                      
                      {/* Content */}
                      <h3 className="text-xl md:text-2xl text-center font-black text-gray-800 mb-3 uppercase tracking-tight group-hover:text-gray-900 line-clamp-2">
                        {category.title}
                      </h3>
                      
                      {/* <p className="text-gray-500 leading-relaxed mb-6 flex-1 text-sm md:text-base line-clamp-3">
                        {category.description}
                      </p> */}

                      
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default CategoryCards;


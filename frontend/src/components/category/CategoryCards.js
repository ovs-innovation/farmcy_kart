import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { IoChevronBack, IoChevronForward, IoArrowForwardOutline } from "react-icons/io5";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Internal imports
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
      title: "Diabetes Care",
      description: "Medicines, glucose monitors, and daily care essentials.",
      image: "/flags/diabetic-health.webp",
      searchQuery: "diabetes",
      accent: "bg-blue-500",
      lightAccent: "bg-blue-50",
    },
    {
      id: 2,
      title: "Heart Care",
      description: "Support for blood pressure, cholesterol, and heart health.",
      image: "/flags/heart-care.webp",
      searchQuery: "heart",
      accent: "bg-red-500",
      lightAccent: "bg-red-50",
    },
    {
      id: 3,
      title: "Pain Relief",
      description: "Painkillers, muscle relaxants, and inflammation relief.",
      image: "/flags/pain-relief.png",
      searchQuery: "pain",
      accent: "bg-orange-500",
      lightAccent: "bg-orange-50",
    },
    {
      id: 4,
      title: "Cold & Cough",
      description: "Syrups, tablets, lozenges, and immunity boosters.",
      image: "/flags/cold-caugh.png",
      searchQuery: "cold",
      accent: "bg-teal-500",
      lightAccent: "bg-teal-50",
    },
    {
      id: 5,
      title: "Baby Care",
      description: "Baby medicines, nutrition, skincare, and hygiene.",
      image: "/flags/babycare.png",
      searchQuery: "baby",
      accent: "bg-pink-500",
      lightAccent: "bg-pink-50",
    },
    {
      id: 6,
      title: "Women's Health",
      description: "Personal care, supplements, and wellness for women.",
      image: "/flags/women-health.jpg",
      searchQuery: "women",
      accent: "bg-purple-500",
      lightAccent: "bg-purple-50",
    },
  ];

  return (
    <div className="relative py-12 sm:py-20 overflow-hidden bg-[#d5deee70] my-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] bg-blue-50 rounded-full blur-[80px]" />
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Medical Specialty</span>
            </div>
            <SectionHeader title="Shop by Departments" subtitle="Find exactly what you need with our specialized healthcare sections." align="left" />
          </div>

          {/* Custom Navigation buttons for Desktop */}
          <div className="hidden md:flex gap-3">
            <button className="category-prev p-3 rounded-2xl bg-white border border-gray-100 text-gray-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95">
              <IoChevronBack size={20} />
            </button>
            <button className="category-next p-3 rounded-2xl bg-white border border-gray-100 text-gray-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95">
              <IoChevronForward size={20} />
            </button>
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1.2}
            centeredSlides={false}
            breakpoints={{
              480: { slidesPerView: 1.5, spaceBetween: 20 },
              640: { slidesPerView: 2.2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
              1280: { slidesPerView: 4, spaceBetween: 30 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation={{ prevEl: ".category-prev", nextEl: ".category-next" }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="category-cards-swiper !pb-14"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id} className="h-auto">
                <div
                  className="group relative flex flex-col h-full bg-white rounded-[2rem] p-6 border border-transparent hover:border-emerald-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] transition-all duration-500 cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/search?q=${category.searchQuery}`)}
                >
                  {/* Card Background Accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${category.lightAccent} rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-[3] opacity-50`} />

                  {/* Image Container */}
                  <div className="relative w-full h-44 mb-6 flex items-center justify-center z-10">
                    <div className="relative w-40 h-40 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                      <Image
                        src={category.image}
                        alt={category.title}
                        layout="fill"
                        objectFit="contain"
                        className="drop-shadow-2xl"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-2 transition-opacity duration-300">
                      {category.description}
                    </p>

                    {/* Interactive Button */}
                    <div className="mt-auto inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-gray-50 text-gray-700 font-bold text-xs group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      View Department
                      <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .category-cards-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #E2E8F0;
          opacity: 1;
        }
        .category-cards-swiper .swiper-pagination-bullet-active {
          background: #10B981 !important;
          width: 25px;
          border-radius: 4px;
        }
        .category-cards-swiper {
          padding-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default CategoryCards;
import Image from "next/image";
import Link from "next/link";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import useUtilsFunction from "@hooks/useUtilsFunction";
import useGetSetting from "@hooks/useGetSetting";

const BrandSection = ({ brands = [] }) => {
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!brands.length) return null;

  return (
    <div className="bg-white lg:py-16 py-10">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="mb-10 flex justify-center">
          <div className="text-center w-full lg:w-2/5">
            <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
              Shop by Brand
            </h2>
            <p className="text-base font-sans text-gray-600 leading-6">
              Discover trusted partners and explore products from your favorite
              makers.
            </p>
          </div>
        </div>

        <div className="relative w-full">
          {/* Custom arrows (both sides) */}
          <button
            ref={prevRef}
            type="button"
            aria-label="Scroll brands left"
            className={`flex absolute left-1 sm:-left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 shadow-md border border-gray-100 text-store-600 hover:bg-store-50`}
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            ref={nextRef}
            type="button"
            aria-label="Scroll brands right"
            className={`flex absolute right-1 sm:-right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 shadow-md border border-gray-100 text-store-600 hover:bg-store-50`}
          >
            <FiChevronRight className="w-5 h-5" />
          </button>

          <Swiper
            loop={brands.length > 5}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            spaceBetween={20}
            slidesPerView={5}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 3, spaceBetween: 12 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
            }}
            modules={[Navigation, Autoplay]}
            // Use custom navigation buttons (so we control visibility + style)
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              // Swiper needs these refs during init
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            className="px-10 sm:px-2 lg:px-0"
          >
            {brands.map((brand) => (
              <SwiperSlide key={brand._id}>
                <Link
                  href={`/search?brand=${brand._id}`}
                  aria-label={showingTranslateValue(brand.name)}
                >
                  <div className="border rounded-xl p-4 sm:p-6 h-full flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-3 sm:mb-4">
                      <Image
                        src={
                          brand.logo ||
                          "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                        }
                        alt={showingTranslateValue(brand.name)}
                        fill
                        sizes="(max-width: 640px) 100px, (max-width: 1024px) 150px, 200px"
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-800 line-clamp-1">
                      {showingTranslateValue(brand.name)}
                    </h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default BrandSection;



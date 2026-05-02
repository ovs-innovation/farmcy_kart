import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useRef } from "react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Controller, Navigation, Pagination } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";

//internal import
import { SidebarContext } from "@context/SidebarContext";
import CategoryServices from "@services/CategoryServices";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Loading from "@components/preloader/Loading";
import useGetSetting from "@hooks/useGetSetting";

const CategoryCarousel = () => {
  const router = useRouter();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { showingTranslateValue } = useUtilsFunction();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  // console.log("data", data, "error", error, "isFetched", isFetched);

  const handleCategoryClick = (id, category) => {
    const category_name = showingTranslateValue(category)
      ?.toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");

    router.push(`/search?category=${category_name}&_id=${id}`);
    setIsLoading(!isLoading);
  };

  return (
    <>
      <div className="relative category-carousel-wrapper my-10 px-8 md:px-12">
        <Swiper
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          spaceBetween={24}
          navigation={true}
          allowTouchMove={true}
          loop={data?.[0]?.children?.length > 10}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            480: {
              slidesPerView: 2.5,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 3.5,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 4.5,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 32,
            },
          }}
          modules={[Autoplay, Navigation, Pagination, Controller]}
          className="mySwiper category-slider"
        >
          {loading ? (
            <Loading loading={loading} />
          ) : error ? (
            <p className="flex justify-center align-middle items-center m-auto text-xl text-red-500">
              {error?.response?.data?.message || error?.message}
            </p>
          ) : (
            data[0]?.children?.map((category, i) => (
              <SwiperSlide key={i + 1} className="group">
                <div
                  onClick={() =>
                    handleCategoryClick(category?._id, category.name)
                  }
                  className="text-center cursor-pointer p-4 md:p-5 bg-white rounded-2xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-store-300"
                >
                  {/* Circular Image Container */}
                  <div className="relative mx-auto mb-4">
                    {/* Outer Glow Effect */}
                    <div className="absolute inset-0 bg-store-100 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform scale-125"></div>
                    
                    {/* Main Circle */}
                    <div className="relative flex items-center justify-center transition-all duration-500 transform group-hover:scale-110">
                      <div className="relative w-16 h-16 md:w-20 md:h-20">
                        <Image
                          src={
                            category?.icon ||
                            "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                          }
                          alt={showingTranslateValue(category?.name) || "category"}
                          width={80}
                          height={80}
                          style={{ width: 'auto', height: 'auto' }}
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      
                       
                    </div>
                  </div>

                  {/* Category Name */}
                  <h3
                    className={`text-sm md:text-base font-semibold text-gray-700 mt-2 font-serif group-hover:text-store-600 transition-colors duration-300 uppercase tracking-wide line-clamp-2 min-h-[2.5rem] flex items-center justify-center`}
                  >
                    {showingTranslateValue(category?.name)}
                  </h3>
                  
                  {/* Hover Indicator */}
                  <div className="mt-3 h-1 w-0 mx-auto bg-gradient-to-r from-store-400 to-store-600 rounded-full group-hover:w-12 transition-all duration-500"></div>
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
        
        {/* Navigation Buttons */}
        <button
          ref={prevRef}
          className="prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl rounded-full p-3 text-gray-700 hover:text-white hover:bg-store-500 transition-all duration-300 transform hover:scale-110 border border-gray-200 hover:border-store-500"
          aria-label="Previous categories"
        >
          <IoChevronBackOutline size={24} />
        </button>
        <button
          ref={nextRef}
          className="next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl rounded-full p-3 text-gray-700 hover:text-white hover:bg-store-500 transition-all duration-300 transform hover:scale-110 border border-gray-200 hover:border-store-500"
          aria-label="Next categories"
        >
          <IoChevronForward size={24} />
        </button>
      </div>
    </>
  );
};

export default React.memo(CategoryCarousel);

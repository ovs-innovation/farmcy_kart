import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useGetSetting from "@hooks/useGetSetting";
import SectionHeader from "@components/common/SectionHeader";
import { useContext } from "react";
import { UserContext } from "@context/UserContext";
import Cookies from "js-cookie";

const DealsYouLove = ({ products, sectionColor }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { showingTranslateValue, getNumber } = useUtilsFunction();
  const { globalSetting } = useGetSetting();
  const currency = globalSetting?.default_currency || "₹";

  // Determine wholesaler status (context first, then cookie fallback)
  const { state } = useContext(UserContext) || {};
  let role = state?.userInfo?.role;
  if (!role && typeof window !== "undefined") {
    try {
      const cookieUser = Cookies.get("userInfo");
      if (cookieUser) {
        role = JSON.parse(cookieUser)?.role;
      }
    } catch (e) {
      // ignore
    }
  }
  const isWholesaler = role && role.toString().toLowerCase() === "wholesaler";

  // Calculate discount and filter products; compute wholesale price & min qty
  const dealProducts = products?.map(p => {
      const retailPrice = getNumber(p?.prices?.price);
      const originalPrice = getNumber(p?.prices?.originalPrice);
      const wholesalePrice = p?.wholePrice && Number(p.wholePrice) > 0 ? Number(p.wholePrice) : null;
      const price = (isWholesaler && wholesalePrice) ? wholesalePrice : retailPrice;
      const minQty = p?.minQuantity || p?.minWholesaleQty || null;
      let discountPercent = 0;
      if(originalPrice > retailPrice) {
          discountPercent = Math.round(((originalPrice - retailPrice) / originalPrice) * 100);
      }
      return { ...p, discountPercent, price, originalPrice, retailPrice, wholesalePrice, minQty };
  }).filter(p => p.discountPercent >= 20)
    .filter(p => {
      if (!isWholesaler) return true;
      return (p.wholesalePrice && Number(p.wholesalePrice) > 0) || p.isWholesaler;
    });

  if (!dealProducts || dealProducts.length === 0) return null;
  const sectionBg = sectionColor ? `bg-${sectionColor}-50` : 'bg-white';
 
  return (
    <div className={` lg:py-16 py-6 mx-auto max-w-screen-2xl px-3 sm:px-10`}>
      <div className="mb-10 flex justify-between items-center">
        <div className="w-full">
          <SectionHeader
            title="Deals You'll Love"
            subtitle="Buy now to get the best deals"
            align="left"
             
          />
        </div>
      </div>

      <div className={` flex w-full relative group`}>
        <div className="w-full">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={2}
            navigation={{
              prevEl: ".prev-deals",
              nextEl: ".next-deals",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 15 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
              1280: { slidesPerView: 7, spaceBetween: 20 },
            }}
            className="mySwiper px-2 py-4"
          >
            {dealProducts.map((item) => (
              <SwiperSlide key={item._id}>
                <Link href={`/product/${item.slug}`} className="flex flex-col items-center cursor-pointer group/item">
                  <div className="relative w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[190px] mb-3 overflow-hidden transition-transform duration-300 transform group-hover/item:scale-105">
                    <Image 
                        src={item.image[0] || "https://placehold.co/150x150"} 
                        alt={showingTranslateValue(item.title)} 
                        layout="fill"
                        objectFit="contain"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 text-center mb-1 line-clamp-2 min-h-[40px]">
                      {showingTranslateValue(item.title)}
                  </h3>
                  
                  {/* For wholesalers show wholesale price & min qty and hide discount/MRP; for others show discount prominence */}
                  {isWholesaler ? (
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-black">
                        {currency}{item.price}
                      </span>
                      {item.minQty && (
                        <div className="text-xs text-gray-500 mt-1">Min {item.minQty}</div>
                      )}
                    </div>
                  ) : item.discountPercent >= 20 ? (
                    <div className="flex flex-col items-center">
                        <span className="bg-store-600 text-white text-xs font-bold px-2 py-1 rounded-sm mb-1">
                            {item.discountPercent}% off
                        </span>
                        
                        <div className="text-xs text-gray-500 line-through">
                            {currency}{item.originalPrice}
                        </div>
                        <span className="font-bold text-black">
                           {currency}{item.price}
                        </span>
                    </div>
                  ) : (
                      <p className="text-sm font-bold text-black">
                        From {currency}{item.price}
                      </p>
                  )}
                  
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <button className="prev-deals absolute top-1/2 -left-2 md:-left-4 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-gray-100 transition-colors transform -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed">
            <IoChevronBack className="text-xl text-gray-600" />
          </button>
          <button className="next-deals absolute top-1/2 -right-2 md:-right-4 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-gray-100 transition-colors transform -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed">
            <IoChevronForward className="text-xl text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealsYouLove;

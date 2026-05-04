import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5"; // requires a loader
import { Autoplay, Controller, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

const ImageCarousel = ({ images, handleChangeImage }) => {
  // Filter out any null/undefined/invalid images
  const validImages = Array.isArray(images) 
    ? images.filter(img => img && typeof img === 'string' && img.trim() !== '')
    : [];
  
  if (!validImages || validImages.length === 0) {
    return null;
  }
  
  // Only enable loop if we have more images than visible slides
  const shouldLoop = validImages.length > 4;
  const slidesPerView = Math.min(4, validImages.length);
  
  return (
    <div className="w-full">
      <Swiper
        spaceBetween={8}
        navigation={false}
        allowTouchMove={true}
        loop={validImages.length >= 8}
        autoplay={false}
        slidesPerView={slidesPerView}
        breakpoints={{
          320: { 
            slidesPerView: Math.min(2, validImages.length), 
            spaceBetween: 8 
          },
          640: { 
            slidesPerView: Math.min(3, validImages.length), 
            spaceBetween: 8 
          },
          1024: { 
            slidesPerView: Math.min(4, validImages.length), 
            spaceBetween: 8 
          },
        }}
        modules={[Navigation, Pagination]}
        className="mySwiper image-carousel"
      >
        {validImages.map((img, i) => {
          // Create a safe key from image URL
          const safeKey = img.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '_');
          
          return (
            <SwiperSlide key={`img-${i}-${safeKey}`} className="group">
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (handleChangeImage) {
                    handleChangeImage(img);
                  }
                }}
                className="w-full h-full flex items-center justify-center p-1 hover:opacity-80 transition-opacity"
              >
                <Image
                  className="border rounded object-cover"
                  src={img}
                  alt={`product image ${i + 1}`}
                  width={100}
                  height={100}
                  unoptimized
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ImageCarousel), { ssr: false });

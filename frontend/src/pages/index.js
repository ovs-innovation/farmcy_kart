import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

//internal import
import { SidebarContext } from "@context/SidebarContext";
import Layout from "@layout/Layout";
import Banner from "@components/banner/Banner";
import useGetSetting from "@hooks/useGetSetting";
import OfferCard from "@components/offer/OfferCard";
import Loading from "@components/preloader/Loading";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import HeroBanner from "@components/banner/HeroBanner";
import OrderOptions from "@components/cta-card/OrderOptions";
import FeatureCategory from "@components/category/FeatureCategory";
import HealthCheckupBanner from "@components/banner/HealthCheckupBanner";
import CategoryCards from "@components/category/CategoryCards";
import AttributeServices from "@services/AttributeServices";
import CMSkeleton from "@components/preloader/CMSkeleton";
import BrandSection from "@components/brand/BrandSection";
import TrustedBrandsSection from "@components/brand/TrustedBrandsSection";
import BrandServices from "@services/BrandServices";
import SectionHeader from "@components/common/SectionHeader";
import SliderCarousel from "@components/carousel/SliderCarousel";
import TestimonialsSection from "@components/testimonial/TestimonialsSection";

const Home = ({ popularProducts, discountProducts, bestSellingProducts, attributes, brands }) => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { loading, error, storeCustomizationSetting } = useGetSetting();

  // console.log("storeCustomizationSetting", storeCustomizationSetting);

  useEffect(() => {
    if (router.asPath === "/") {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout>
          <div className="min-h-screen">
            <div className="bg-white">
              <div className="mx-auto py-5 max-w-screen-2xl">
                <div className="flex w-full flex-col">
                  <div className="w-full">
                    <HeroBanner />
                  </div>
                  <div className="w-full">
                    <OrderOptions />
                  </div>
                  
                </div>
                {storeCustomizationSetting?.home?.promotion_banner_status && (
                  <div
                    className={`bg-store-100 px-10 py-6 rounded-lg mt-6`}
                  >
                    <Banner />
                  </div>
                )}
              </div>
            </div>

            {/* feature category's */}
            {storeCustomizationSetting?.home?.featured_status && (
              <div className="bg-white lg:py-16 py-10">
                <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                  <SectionHeader
                    title={storeCustomizationSetting?.home?.feature_title || "Featured Categories"}
                    subtitle={storeCustomizationSetting?.home?.feature_description || "Explore our handpicked selection of featured categories"}
                    loading={loading}
                    error={error}
                    align="left"
                  />

                  <FeatureCategory attributes={attributes} />
                </div>
              </div>
            )}

            {/* Trusted Brands Section */}
            <TrustedBrandsSection brands={brands} />

            {/* popular products */}
            {storeCustomizationSetting?.home?.popular_products_status && (
              <div className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10">
                <SectionHeader
                  title={storeCustomizationSetting?.home?.popular_title || "Popular Products"}
                  subtitle={storeCustomizationSetting?.home?.popular_description || "Discover our most loved and trending products"}
                  loading={loading}
                  error={error}
                  align="left"
                />
                <div className="flex w-full relative group">
                  <div className="w-full">
                    {loading ? (
                      <CMSkeleton
                        count={20}
                        height={20}
                        error={error}
                        loading={loading}
                      />
                    ) : (
                      <>
                        <Swiper
                          modules={[Navigation, Autoplay]}
                          spaceBetween={10}
                          slidesPerView={2}
                          navigation={{
                            prevEl: ".prev-popular",
                            nextEl: ".next-popular",
                          }}
                          autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                          }}
                          breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 10 },
                            768: { slidesPerView: 3, spaceBetween: 20 },
                            1024: { slidesPerView: 4, spaceBetween: 20 },
                            1280: { slidesPerView: 5, spaceBetween: 20 },
                          }}
                          className="mySwiper px-2 py-2"
                        >
                          {popularProducts
                            ?.slice(
                              0,
                              storeCustomizationSetting?.home
                                ?.popular_product_limit
                            )
                            .map((product) => (
                              <SwiperSlide key={product._id}>
                                <ProductCard
                                  product={product}
                                  attributes={attributes}
                                />
                              </SwiperSlide>
                            ))}
                        </Swiper>
                        <button className="prev-popular absolute top-1/2 -left-2 md:-left-4 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-store-50 transition-colors transform -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed">
                          <IoChevronBack className="text-xl text-gray-600" />
                        </button>
                        <button className="next-popular absolute top-1/2 -right-2 md:-right-4 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-store-50 transition-colors transform -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed">
                          <IoChevronForward className="text-xl text-gray-600" />
                        </button>
                        
                        <div className="flex justify-end mt-4 px-2">
                          <Link href="/search?sort=newest" className="inline-flex items-center gap-1 text-sm font-semibold text-store-500 border border-store-500 rounded-full px-4 py-1 hover:bg-store-500 hover:text-white transition-colors">
                            View All <IoChevronForward />
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

           

                  <div className="w-full px-3 sm:px-10">
                    <HealthCheckupBanner />
                  </div>
            {/* best selling products */}
            {bestSellingProducts?.length > 0 && (
              <div className="bg-white lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10">
                <SectionHeader
                  title="Best Selling Products"
                  subtitle="We have compiled the best selling products for you"
                  align="left"
                />
                <div className="flex w-full relative group">
                  <div className="w-full">
                    {loading ? (
                      <CMSkeleton
                        count={20}
                        height={20}
                        error={error}
                        loading={loading}
                      />
                    ) : (
                      <>
                        <Swiper
                          modules={[Navigation, Autoplay]}
                          spaceBetween={10}
                          slidesPerView={2}
                          navigation={{
                            prevEl: ".prev-best-selling",
                            nextEl: ".next-best-selling",
                          }}
                          autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                          }}
                          breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 10 },
                            768: { slidesPerView: 3, spaceBetween: 20 },
                            1024: { slidesPerView: 4, spaceBetween: 20 },
                            1280: { slidesPerView: 5, spaceBetween: 20 },
                          }}
                          className="mySwiper px-2 py-2"
                        >
                          {bestSellingProducts
                            ?.slice(0, 10)
                            .map((product) => (
                              <SwiperSlide key={product._id}>
                                <ProductCard
                                  product={product}
                                  attributes={attributes}
                                />
                              </SwiperSlide>
                            ))}
                        </Swiper>
                        <button className="prev-best-selling absolute top-1/2 -left-2 md:-left-4 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-store-50 transition-colors transform -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed">
                          <IoChevronBack className="text-xl text-gray-600" />
                        </button>
                        <button className="next-best-selling absolute top-1/2 -right-2 md:-right-4 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-store-50 transition-colors transform -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed">
                          <IoChevronForward className="text-xl text-gray-600" />
                        </button>

                        <div className="flex justify-end mt-4 px-2">
                          <Link href="/search?sort=best-selling" className="inline-flex items-center gap-1 text-sm font-semibold text-store-500 border border-store-500 rounded-full px-4 py-1 hover:bg-store-500 hover:text-white transition-colors">
                            View All <IoChevronForward />
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Slider Carousel */}
            <SliderCarousel />
            {/* //  promotional banner card */}
            {storeCustomizationSetting?.home?.delivery_status && 
             (storeCustomizationSetting?.home?.promotional_banner_image1 || 
              storeCustomizationSetting?.home?.promotional_banner_image2 || 
              storeCustomizationSetting?.home?.promotional_banner_image3) && (
              <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
                <div className="shadow-sm border rounded-lg p-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {storeCustomizationSetting?.home?.promotional_banner_image1 && (
                      <div className="md:col-span-2">
                        <Link href={storeCustomizationSetting?.home?.promotional_banner_link1 || "#"}>
                          <Image
                            width={500}
                            height={48}
                            alt="Offer Banner 1"
                            className="w-full h-[240px] sm:h-[320px] md:h-[550px] rounded object-cover"
                            src={storeCustomizationSetting?.home?.promotional_banner_image1}
                            priority={false}
                          />
                        </Link>
                      </div>
                    )}

                    <div className="md:col-span-1 flex flex-col gap-2">
                      {storeCustomizationSetting?.home?.promotional_banner_image2 && (
                        <Link href={storeCustomizationSetting?.home?.promotional_banner_link2 || "#"}>
                          <Image
                            width={500}
                            height={100}
                            alt="Offer Banner 2"
                            className="w-full h-[160px] sm:h-[200px] md:h-[271px] rounded object-cover"
                            src={storeCustomizationSetting?.home?.promotional_banner_image2}
                            priority={false}
                          />
                        </Link>
                      )}
                      {storeCustomizationSetting?.home?.promotional_banner_image3 && (
                        <Link href={storeCustomizationSetting?.home?.promotional_banner_link3 || "#"}>
                          <Image
                            width={600}
                            height={600}
                            alt="Offer Banner 3"
                            className="w-full h-[160px] sm:h-[200px] md:h-[271px] rounded object-cover"
                            src={storeCustomizationSetting?.home?.promotional_banner_image3}
                            priority={false}
                          />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

             

            {/* discounted products */}
            {storeCustomizationSetting?.home?.discount_product_status &&
              discountProducts?.length > 0 && (
                <div
                  id="discount"
                  className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10"
                >
                  <SectionHeader
                    title={storeCustomizationSetting?.home?.latest_discount_title || "Discounted Products"}
                    subtitle={storeCustomizationSetting?.home?.latest_discount_description || "Grab amazing deals on our discounted products"}
                    loading={loading}
                    error={error}
                    align="left"
                  />
                  <div className="flex w-full relative group">
                    <div className="w-full">
                      {loading ? (
                        <CMSkeleton
                          count={20}
                          height={20}
                          error={error}
                          loading={loading}
                        />
                      ) : (
                        <>
                          <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={10}
                            slidesPerView={2}
                            navigation={{
                              prevEl: ".prev-discount",
                              nextEl: ".next-discount",
                            }}
                            autoplay={{
                              delay: 2500,
                              disableOnInteraction: false,
                              pauseOnMouseEnter: true
                            }}
                            breakpoints={{
                              640: { slidesPerView: 2, spaceBetween: 10 },
                              768: { slidesPerView: 3, spaceBetween: 20 },
                              1024: { slidesPerView: 4, spaceBetween: 20 },
                              1280: { slidesPerView: 5, spaceBetween: 20 },
                            }}
                            className="mySwiper px-2 py-2"
                          >
                            {discountProducts
                              ?.slice(
                                0,
                                storeCustomizationSetting?.home
                                  ?.latest_discount_product_limit
                              )
                              .map((product) => (
                                <SwiperSlide key={product._id}>
                                  <ProductCard
                                    product={product}
                                    attributes={attributes}
                                  />
                                </SwiperSlide>
                              ))}
                          </Swiper>
                          <button className="prev-discount absolute top-1/2 -left-2 md:-left-4 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-store-50 transition-colors transform -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <IoChevronBack className="text-xl text-gray-600" />
                          </button>
                          <button className="next-discount absolute top-1/2 -right-2 md:-right-4 z-10 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-store-50 transition-colors transform -translate-y-1/2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <IoChevronForward className="text-xl text-gray-600" />
                          </button>

                          <div className="flex justify-end mt-4 px-2">
                            <Link href="/search?sort=most-discounted" className="inline-flex items-center gap-1 text-sm font-semibold text-store-500 border border-store-500 rounded-full px-4 py-1 hover:bg-store-500 hover:text-white transition-colors">
                              View All <IoChevronForward />
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Category Cards Section */}
            <CategoryCards />

            {/* Testimonials Section */}
            <TestimonialsSection />
          </div>
        </Layout>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { cookies } = context.req;
  const { query, _id } = context.query;

  const [data, attributes, brands] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: _id ? _id : "",
      title: query ? query : "",
    }),

    AttributeServices.getShowingAttributes(),
    BrandServices.getShowingBrands(),
  ]);

  return {
    props: {
      attributes,
      cookies: cookies,
      popularProducts: data.popularProducts,
      discountProducts: data.discountedProducts,
      bestSellingProducts: data.bestSellingProducts,
      brands,
    },
  };
};

export default Home;


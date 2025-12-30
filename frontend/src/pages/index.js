import { SidebarContext } from "@context/SidebarContext";
import { useContext, useEffect } from "react";
 
import { useRouter } from "next/router";

//internal import
import Layout from "@layout/Layout";
import Banner from "@components/banner/Banner";
import useGetSetting from "@hooks/useGetSetting";
import Image from "next/image";
import Link from "next/link";
import OfferCard from "@components/offer/OfferCard";
import StickyCart from "@components/cart/StickyCart";
import Loading from "@components/preloader/Loading";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import HeroBanner from "@components/banner/HeroBanner";
import OrderOptions from "@components/cta-card/OrderOptions";
import FeatureCategory from "@components/category/FeatureCategory";
import AttributeServices from "@services/AttributeServices";
import CMSkeleton from "@components/preloader/CMSkeleton";
import BrandSection from "@components/brand/BrandSection";
import BrandServices from "@services/BrandServices";

const Home = ({ popularProducts, discountProducts, attributes, brands }) => {
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
            <StickyCart />
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
              <div className="bg-gray-100 lg:py-16 py-10">
                <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                  {/* <div className="mb-10 flex justify-center">
                    <div className="text-center w-full lg:w-2/5">
                      <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                        <CMSkeleton
                          count={1}
                          height={30}
                          loading={loading}
                          data={storeCustomizationSetting?.home?.feature_title}
                        />
                      </h2>
                      <p className="text-base font-sans text-gray-600 leading-6">
                        <CMSkeleton
                          count={4}
                          height={10}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home?.feature_description
                          }
                        />
                      </p>
                    </div>
                  </div> */}

                  <FeatureCategory />
                </div>
              </div>
            )}

            {brands?.length > 0 && <BrandSection brands={brands} />}

            {/* popular products */}
            {storeCustomizationSetting?.home?.popular_products_status && (
              <div className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10">
                <div className="mb-10 flex justify-center">
                  <div className="text-center w-full lg:w-2/5">
                    <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                      <CMSkeleton
                        count={1}
                        height={30}
                        loading={loading}
                        data={storeCustomizationSetting?.home?.popular_title}
                      />
                    </h2>
                    <p className="text-base font-sans text-gray-600 leading-6">
                      <CMSkeleton
                        count={5}
                        height={10}
                        error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.home?.popular_description
                        }
                      />
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-full">
                    {loading ? (
                      <CMSkeleton
                        count={20}
                        height={20}
                        error={error}
                        loading={loading}
                      />
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2 md:gap-3 lg:gap-3">
                        {popularProducts
                          ?.slice(
                            0,
                            storeCustomizationSetting?.home
                              ?.popular_product_limit
                          )
                          .map((product) => (
                            <ProductCard
                              key={product._id}
                              product={product}
                              attributes={attributes}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                  <div className="mb-10 flex justify-center">
                    <div className="text-center w-full lg:w-2/5">
                      <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                        <CMSkeleton
                          count={1}
                          height={30}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_title
                          }
                        />
                      </h2>
                      <p className="text-base font-sans text-gray-600 leading-6">
                        <CMSkeleton
                          count={5}
                          height={20}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_description
                          }
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-full">
                      {loading ? (
                        <CMSkeleton
                          count={20}
                          height={20}
                          error={error}
                          loading={loading}
                        />
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2 md:gap-3 lg:gap-3">
                          {discountProducts
                            ?.slice(
                              0,
                              storeCustomizationSetting?.home
                                ?.latest_discount_product_limit
                            )
                            .map((product) => (
                              <ProductCard
                                key={product._id}
                                product={product}
                                attributes={attributes}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
      brands,
    },
  };
};

export default Home;


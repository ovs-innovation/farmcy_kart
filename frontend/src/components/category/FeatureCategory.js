import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

//internal import
import CategoryServices from "@services/CategoryServices";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import CMSkeleton from "@components/preloader/CMSkeleton";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useGetSetting from "@hooks/useGetSetting";

const FeatureCategory = ({ attributes }) => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [categoryProductsMap, setCategoryProductsMap] = useState({});

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  const categories = useMemo(() => data?.[0]?.children || [], [data]);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (selectedCategory?._id) {
      setLoadingProducts(true);
      ProductServices.getShowingStoreProducts({ category: selectedCategory._id })
        .then((res) => {
          setProducts(res?.products || []);
          setLoadingProducts(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingProducts(false);
        });
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Fetch products for right grid categories
  useEffect(() => {
    if (categories.length === 0) return;
    
    const rightGridCategories = categories.slice(8, 14);
    rightGridCategories.forEach((category) => {
      if (category._id && !categoryProductsMap[category._id]) {
        ProductServices.getShowingStoreProducts({ category: category._id })
          .then((res) => {
            setCategoryProductsMap(prev => ({
              ...prev,
              [category._id]: (res?.products || []).slice(0, 3)
            }));
          })
          .catch((err) => {
            console.error(`Error fetching products for category ${category._id}:`, err);
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  // Split categories into two groups: left sidebar (first 6-8) and right grid (rest)
  const leftSidebarCategories = categories.slice(0, 8);
  const rightGridCategories = categories.slice(8, 14); // Show 6 categories in grid

  return (
    <>
      {loading ? (
        <CMSkeleton count={10} height={20} error={error} loading={loading} />
      ) : (
        <div className="w-full">
          {/* Unified background for both category list and product area */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 relative">
            <div className="hidden lg:block absolute top-0 left-0 w-full h-full  " style={{ background: '#e6f9f0', zIndex: 0 }}></div>
            {/* Small Screen: Connected Category & Product Section Background */}
            <div className="lg:hidden w-full relative">
              {/* Unified background block for both sections - light green */}
              <div className="absolute top-0 left-0 w-full h-[420px]  " style={{ background: '#e6f9f0', zIndex: 0 }}></div>
              <div className="relative z-10">
                <div className="  p-3" style={{ background: '#e6f9f0' }}>
                  <div className="flex  overflow-x-auto scrollbar-hide pb-2">
                    {leftSidebarCategories.map((category, i) => (
                      <div
                        key={i + 1}
                        onClick={() => handleCategoryClick(category)}
                        className={`cursor-pointer flex flex-col items-center gap-2 min-w-[80px] transition-all duration-200 rounded-2xl ${
                          selectedCategory?._id === category._id
                            ? "opacity-100"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        style={selectedCategory?._id === category._id ? {
                           
                          color: 'var(--store-color-700)',
                          boxShadow: '0 2px 8px 0 rgba(16,185,129,0.10)'
                        } : { background: '#fff' }}
                      >
                        {category.icon && (
                          <div 
                            className={`relative w-16 h-16 flex items-center justify-center transition-all ${
                              selectedCategory?._id === category._id
                                ? "scale-110"
                                : "bg-gray-50"
                            }`}
                          >
                            <Image
                              src={category.icon}
                              alt={showingTranslateValue(category?.name)}
                              width={48}
                              height={48}
                              className="object-contain w-12 h-12"
                            />
                             
                          </div>
                        )}
                        <span className={`text-xs text-center font-medium ${
                          selectedCategory?._id === category._id
                            ? "text-emerald-700"
                            : "text-gray-700"
                        }`}>
                          {showingTranslateValue(category?.name)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Large Screen: Left Sidebar - Vertical Category List */}
            <div className="hidden lg:block w-full lg:w-1/4 flex-shrink-0 relative">
              <div className="rounded-lg border border-gray-200 p-3 lg:p-4  " style={{ background: '#e6f9f0' }}>
                  {leftSidebarCategories.map((category, i) => (
                    <div
                      key={i + 1}
                      onClick={() => handleCategoryClick(category)}
                      className={`cursor-pointer p-3 transition-all duration-200 relative ${
                        selectedCategory?._id === category._id
                          ? "shadow-sm"
                          : "bg-white hover:bg-gray-50"
                      } ${i !== leftSidebarCategories.length - 1 ? 'border-b border-gray-200' : ''}`}
                      style={{ marginBottom: 0, borderRadius: 0 }}
                    >
                    {selectedCategory?._id === category._id && (
                      <div 
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0  z-10"
                        style={{ borderLeftColor: 'var(--store-color-500)' }}
                      ></div>
                    )}
                    <div className="flex items-center gap-3">
                      {category.icon && (
                        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg p-1 ${
                          selectedCategory?._id === category._id
                            ? "bg-store-100"
                            : "bg-gray-50"
                        }`}>
                          <Image
                            src={category.icon}
                            alt={showingTranslateValue(category?.name)}
                            width={56}
                            height={56}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      )}
                      <span className={`text-sm font-medium flex-1 ${
                        selectedCategory?._id === category._id
                          ? "text-store-600 font-semibold"
                          : "text-gray-700"
                      }`}>
                      {showingTranslateValue(category?.name)}
                    </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Products Grid (Large Screens) / Category Cards (Small Screens) */}
            <div className="flex-1">
              {/* Category Cards - Only on small/medium screens with discount offers */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex flex-wrap -mx-1">
                  {rightGridCategories.map((category, i) => {
                    const categoryProducts = categoryProductsMap[category._id] || [];
                    return (
                      <Link
                        key={i + 1}
                        href={`/search?category=${category.slug || category.name?.toLowerCase().replace(/[^A-Z0-9]+/gi, "-")}&_id=${category._id}`}
                        className="bg-white rounded-xl shadow p-2 flex flex-col items-center     transition-all duration-200   group w-1/3 px-1 mb-3"
                        style={{ maxWidth: '33.3333%' }}
                      >
                        <div className="w-full h-20 flex items-center justify-center mb-2">
                          {categoryProducts[0]?.images?.[0] ? (
                            <Image
                              src={categoryProducts[0].images[0]}
                              alt={categoryProducts[0].title}
                              width={60}
                              height={60}
                              className="object-contain h-full w-full"
                            />
                          ) : category.icon ? (
                            <Image
                              src={category.icon}
                              alt={showingTranslateValue(category?.name)}
                              width={48}
                              height={48}
                              className="object-contain h-full w-full opacity-60"
                            />
                          ) : null}
                        </div>
                        <div className="w-full text-center">
                          <span className="block font-medium text-gray-800 text-sm line-clamp-2">
                            {showingTranslateValue(category?.name)}
                          </span>
                          <span className="block text-xs text-store-500 font-bold mt-1">
                            Up to 50% off
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                 
              </div>

              {/* Products Grid - Show on all screens */}
              {selectedCategory && (
                <div 
                  className="rounded-lg  p-3 sm:p-4 lg:p-6 mt-4 lg:mt-0 transition-all duration-300 relative"
                  style={{
                    
                   
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                   
            {loadingProducts ? (
              <CMSkeleton count={10} height={20} error={error} loading={loadingProducts} />
            ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {products.length > 0 ? (
                  products.map((product) => (
                          <div key={product._id} className="w-full">
                    <ProductCard
                      product={product}
                      attributes={attributes}
                      hidePriceAndAdd={true}
                              hideDiscount={true}
                              hideWishlistCompare={true}
                    />
                          </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-400">
                    <p>No products found</p>
                  </div>
                )}
              </div>
            )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeatureCategory;

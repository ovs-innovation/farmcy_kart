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
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Small Screen: Horizontal Scrollable Category Icons */}
            <div className="lg:hidden w-full">
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {leftSidebarCategories.map((category, i) => (
                    <div
                  key={i + 1}
                      onClick={() => handleCategoryClick(category)}
                      className={`cursor-pointer flex flex-col items-center gap-2 min-w-[80px] transition-all duration-200 ${
                    selectedCategory?._id === category._id
                          ? "opacity-100"
                          : "opacity-70 hover:opacity-100"
                  }`}
                >
                    {category.icon && (
                        <div 
                          className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
                            selectedCategory?._id === category._id
                              ? "border-store-500 bg-store-50 scale-110"
                              : "border-gray-200 bg-gray-50"
                          }`}
                          style={selectedCategory?._id === category._id ? {
                            boxShadow: '0 0 0 3px var(--store-color-100)'
                          } : {}}
                        >
                      <Image
                        src={category.icon}
                            alt={showingTranslateValue(category?.name)}
                            width={48}
                            height={48}
                            className="object-contain w-12 h-12"
                      />
                          {selectedCategory?._id === category._id && (
                            <div 
                              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                              style={{ backgroundColor: 'var(--store-color-500)' }}
                            >
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      )}
                      <span className={`text-xs text-center font-medium ${
                        selectedCategory?._id === category._id
                          ? "text-store-600"
                          : "text-gray-700"
                      }`}>
                        {showingTranslateValue(category?.name)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Large Screen: Left Sidebar - Vertical Category List */}
            <div className="hidden lg:block w-full lg:w-1/4 flex-shrink-0 relative">
              <div className="bg-white rounded-lg border border-gray-200 p-3 lg:p-4 space-y-2">
                {leftSidebarCategories.map((category, i) => (
                  <div
                    key={i + 1}
                    onClick={() => handleCategoryClick(category)}
                    className={`cursor-pointer p-3 rounded-lg transition-all duration-200 border relative ${
                      selectedCategory?._id === category._id
                        ? "bg-store-50 border-store-500 shadow-sm"
                        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-store-300"
                    }`}
                  >
                    {selectedCategory?._id === category._id && (
                      <div 
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent z-10"
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
                {rightGridCategories.map((category, i) => {
                  const categoryProducts = categoryProductsMap[category._id] || [];
                  return (
                    <Link
                      key={i + 1}
                      href={`/search?category=${category.slug || category.name?.toLowerCase().replace(/[^A-Z0-9]+/gi, "-")}&_id=${category._id}`}
                      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200 hover:border-store-500 group"
                    >
                      <div className="flex flex-col">
                        {/* Category Title */}
                        <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-store-600 transition-colors">
                          {showingTranslateValue(category?.name)}
                        </h3>
                        
                        {/* Discount Offer */}
                        <div className="mb-3">
                          <span className="text-sm font-semibold text-store-500">
                            Up to 50% off
                          </span>
          </div>

                        {/* Product Images Grid */}
                        <div className="grid grid-cols-3 gap-1.5">
                          {categoryProducts.length > 0 ? (
                            categoryProducts.map((product, idx) => (
                              <div key={product._id || idx} className="relative aspect-square bg-gray-50 rounded overflow-hidden">
                                {product.images && product.images[0] ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.title}
                                    fill
                                    className="object-contain p-0.5"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-[8px]">
                                    {category.icon && (
                                      <Image
                                        src={category.icon}
                                        alt={showingTranslateValue(category?.name)}
                                        width={24}
                                        height={24}
                                        className="object-contain opacity-50"
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            Array.from({ length: 3 }).map((_, idx) => (
                              <div key={idx} className="relative aspect-square bg-gray-50 rounded overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  {category.icon && (
                                    <Image
                                      src={category.icon}
                                      alt={showingTranslateValue(category?.name)}
                                      width={24}
                                      height={24}
                                      className="object-contain opacity-50"
                                    />
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Products Grid - Show on all screens */}
              {selectedCategory && (
                <div 
                  className="rounded-lg border-2 p-3 sm:p-4 lg:p-6 mt-4 lg:mt-0 transition-all duration-300 relative"
                  style={{
                    backgroundColor: 'var(--store-color-50)',
                    borderColor: 'var(--store-color-300)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Connection Indicator - Small Screen */}
                  <div className="lg:hidden absolute -top-4 left-4 flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                      style={{ 
                        backgroundColor: 'var(--store-color-500)',
                        borderColor: 'var(--store-color-500)'
                      }}
                    >
                      {selectedCategory.icon && (
                        <Image
                          src={selectedCategory.icon}
                          alt={showingTranslateValue(selectedCategory?.name)}
                          width={20}
                          height={20}
                          className="object-contain filter brightness-0 invert"
                        />
                      )}
                    </div>
                    <div 
                      className="h-0.5 w-8"
                      style={{ backgroundColor: 'var(--store-color-300)' }}
                    ></div>
                  </div>

                  {/* Header with Category Icon and Name */}
                  <div className="mb-3 sm:mb-4 flex items-center gap-3">
                    {/* Category Icon */}
                    {selectedCategory.icon && (
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 flex-shrink-0"
                        style={{ 
                          backgroundColor: 'white',
                          borderColor: 'var(--store-color-300)'
                        }}
                      >
                        <Image
                          src={selectedCategory.icon}
                          alt={showingTranslateValue(selectedCategory?.name)}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-1 h-6 rounded-full"
                          style={{ backgroundColor: 'var(--store-color-500)' }}
                        ></div>
                        <h3 
                          className="text-lg sm:text-xl font-bold"
                          style={{ color: 'var(--store-color-800)' }}
                        >
                          {showingTranslateValue(selectedCategory?.name)}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        {products.length} {products.length === 1 ? 'product' : 'products'} available
                      </p>
                    </div>
                  </div>
            {loadingProducts ? (
              <CMSkeleton count={10} height={20} error={error} loading={loadingProducts} />
            ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
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

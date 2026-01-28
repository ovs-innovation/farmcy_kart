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

const FeatureCategory = ({ attributes, initialSelectedCategory }) => {
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

  // Show all first-level children of the root (e.g. Medicines, Personal Care, Healthcare Devices) on the left
  const parentCategories = useMemo(() => {
    if (!data || !Array.isArray(data) || !data[0]?.children) return [];
    return data[0].children;
  }, [data]);

  // Track the selected left category
  const [selectedLeft, setSelectedLeft] = useState(null);

  // Children of the selected left category (right grid)
  const rightCategories = useMemo(() => {
    if (!selectedLeft) return [];
    return selectedLeft.children || [];
  }, [selectedLeft]);

  useEffect(() => {
    if (initialSelectedCategory) {
      setSelectedLeft(initialSelectedCategory);
    } else if (parentCategories.length > 0 && (!selectedLeft || !parentCategories.some(cat => cat._id === selectedLeft._id))) {
      setSelectedLeft(parentCategories[0]);
    }
  }, [parentCategories, selectedLeft]);

  // No product fetching needed

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubcategoryClick = (subcategory) => {
    const catName = showingTranslateValue(subcategory?.name) || "";
    // Navigate to search page and pass category name and id so server fetches filtered products
    router.push(
      {
        pathname: "/search",
        query: { category: catName, _id: subcategory._id },
      },
      `/search?category=${encodeURIComponent(catName)}&_id=${subcategory._id}`,
      { shallow: false }
    );
  };

  // No right grid product fetching needed

  // All parent categories in left sidebar

  const singleMode = Boolean(initialSelectedCategory);

  return (
    <>
      {loading ? (
        <CMSkeleton count={10} height={20} error={error} loading={loading} />
      ) : (
        <div className="w-full">
          {singleMode ? (
            <div className="rounded-lg p-4   sm:p-2 transition-all duration-300 relative">
               

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(initialSelectedCategory?.children || []).length > 0 ? (
                  (initialSelectedCategory.children || []).map((child) => (
                    <button
                      key={child._id}
                      onClick={() => handleSubcategoryClick(child)}
                      className="flex md:flex-row flex-col items-center justify-between p-2 md:p-6 rounded-xl bg-white border border-gray-100 shadow-sm transition hover:shadow-md text-left cursor-pointer"
                    >
                      <div className="flex-1">
                        <h4 className=" text-sm md:text-lg font-semibold text-emerald-900 mb-1">
                          {showingTranslateValue(child?.name)}
                        </h4>
                        <p className="text-sm text-emerald-600">Up to 30% off</p>
                      </div>
                      {child.icon ? (
                        <div className="w-20 md:w-44 h-24 md:h-36 flex-shrink-0 ml-4 flex items-center justify-center">
                          <Image
                            src={child.icon}
                            alt={showingTranslateValue(child?.name)}
                            width={120}
                            height={80}
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-28 h-20 ml-4 bg-gray-50 flex items-center justify-center rounded">
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-400">
                    <p>No child categories found</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row  relative">
              <div className="hidden lg:block absolute top-0 left-0 w-full h-full" style={{ background: '#e6f9f0', zIndex: 0 }}></div>
              {/* Left Sidebar: Parent Categories */}
              <div className="w-full lg:w-1/4 flex-shrink-0 relative">
                <div className="rounded-lg bg-[#feffff] flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible lg:overflow-x-visible z-10" 
                >
                  {parentCategories.map((category, i) => (
                    <button
                      key={category._id || i}
                      onClick={() => setSelectedLeft(category)}
                      className={`w-full text-left px-4 py-3  transition-all duration-200 focus:outline-none flex md:flex-row flex-col items-center gap-3  ${
                        selectedLeft?._id === category._id
                          ? " bg-[#e6f9f0] border-b-transparent  text-emerald-700 font-semibold shadow"
                          : " bg-white border-b-transparent  border-b-gray-200 text-gray-700 hover:bg-emerald-50"
                      }`}
                    >
                      {category.icon && (
                        <span className="inline-block w-12 md:w-20 h-12 md:h-20 mr-2">
                          <Image
                            src={category.icon}
                            alt={showingTranslateValue(category?.name)}
                            width={40}
                            height={40}
                            className="object-contain w-full h-full"
                          />
                        </span>
                      )}
                      <span className="text-xs md:text-base">
                        {showingTranslateValue(category?.name)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Right Side: Child Categories of Selected Parent */}
              <div className="flex-1">
                <div className="rounded-lg p-3 bg-[#e6f9f0]  sm:p-2 lg:p-6 mt-0 lg:mt-0 transition-all duration-300 relative " style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {rightCategories.length > 0 ? (
                      rightCategories.map((child) => (
                        <button
                          key={child._id}
                          onClick={() => handleSubcategoryClick(child)}
                          className="flex flex-col items-center p-4 border rounded-xl bg-white transition shadow-sm text-left cursor-pointer"
                        >
                          {child.icon && (
                            <div className="w-20 h-24 md:w-48 md:h-48 mb-2 flex items-center justify-center">
                              <Image
                                src={child.icon}
                                alt={showingTranslateValue(child?.name)}
                                width={64}
                                height={64}
                                className="object-contain w-full h-full"
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium text-center text-emerald-900">
                            {showingTranslateValue(child?.name)}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-400">
                        <p>No child categories found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FeatureCategory;

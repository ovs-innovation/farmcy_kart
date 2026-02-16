import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// Internal imports
import CategoryServices from "@services/CategoryServices";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";

const FeatureCategory = ({ initialSelectedCategory }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();
  const [selectedLeft, setSelectedLeft] = useState(null);

  const { data, error, isLoading: loading } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  const parentCategories = useMemo(() => {
    if (!data || !Array.isArray(data) || !data[0]?.children) return [];
    return data[0].children;
  }, [data]);

  const rightCategories = useMemo(() => {
    return selectedLeft?.children || [];
  }, [selectedLeft]);

  useEffect(() => {
    if (initialSelectedCategory) {
      setSelectedLeft(initialSelectedCategory);
    } else if (parentCategories.length > 0 && !selectedLeft) {
      setSelectedLeft(parentCategories[0]);
    }
  }, [parentCategories, initialSelectedCategory, selectedLeft]);

  const handleSubcategoryClick = (subcategory) => {
    const catName = showingTranslateValue(subcategory?.name) || "";
    router.push(
      {
        pathname: "/search",
        query: { category: catName, _id: subcategory._id },
      },
      undefined,
      { shallow: false }
    );
  };

  if (loading) return <CMSkeleton count={10} height={20} error={error} loading={loading} />;

  return (
    <div className="w-full max-w-screen-2xl mx-auto">
      <div className="flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">

        {/* Navigation Sidebar (Desktop) / Horizontal Tabs (Mobile) */}
        <div className="w-full lg:w-1/4 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="flex lg:flex-col overflow-x-auto no-scrollbar lg:overflow-y-auto p-2 lg:p-4 gap-2">
            {parentCategories.map((category) => {
              const isActive = selectedLeft?._id === category._id;
              return (
                <button
                  key={category._id}
                  onClick={() => setSelectedLeft(category)}
                  className={`flex flex-row lg:flex-row items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 min-w-max lg:min-w-full text-left group ${isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-200/50"
                      : "hover:bg-emerald-50 text-gray-600 bg-white lg:bg-transparent"
                    }`}
                >
                  <div className={`relative w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {category.icon ? (
                      <Image
                        src={category.icon}
                        alt={showingTranslateValue(category?.name)}
                        fill
                        className={`object-contain ${isActive ? 'brightness-0 invert' : ''}`}
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold">
                        {showingTranslateValue(category?.name)?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-sm lg:text-base font-bold whitespace-nowrap lg:whitespace-normal">
                    {showingTranslateValue(category?.name)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8 bg-white">
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-extrabold text-gray-800">
                {showingTranslateValue(selectedLeft?.name)}
              </h3>
              <div className="h-1 w-12 bg-emerald-500 rounded-full mt-1"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6">
            {rightCategories.length > 0 ? (
              rightCategories.map((child) => (
                <button
                  key={child._id}
                  onClick={() => handleSubcategoryClick(child)}
                  className="group flex flex-col items-center p-3 lg:p-5 rounded-2xl border border-gray-50 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50 transition-all duration-500"
                >
                  <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50/50 p-2 group-hover:bg-emerald-50/30 transition-colors">
                    <Image
                      src={child.icon || '/placeholder.png'}
                      alt={showingTranslateValue(child?.name)}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <span className="text-xs lg:text-sm font-bold text-gray-700 group-hover:text-emerald-700 text-center line-clamp-2 leading-tight">
                    {showingTranslateValue(child?.name)}
                  </span>
                  <div className="mt-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    Explore
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 italic">No sub-categories found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCategory;
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoClose, IoChevronDown, IoChevronForward } from "react-icons/io5";
import {
  FiHome,
  FiGrid,
  FiShoppingBag,
  FiTag,
  FiHeart,
  FiShuffle,
  FiUsers,
  FiPhoneCall,
  FiHelpCircle,
  FiFileText,
  FiShield,
  FiBriefcase,
  FiRefreshCw,
  FiTruck,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

//internal import
import useGetSetting from "@hooks/useGetSetting";
import Loading from "@components/preloader/Loading";
import { SidebarContext } from "@context/SidebarContext";
import CategoryServices from "@services/CategoryServices";
import CategoryCard from "@components/category/CategoryCard";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Category = () => {
  const router = useRouter();
  const { categoryDrawerOpen, closeCategoryDrawer } = 
    useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";

  const [activeTab, setActiveTab] = useState("category");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data, error, isLoading, isFetched } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });

  // console.log("data", data, "error", error, "isFetched", isFetched);

  const mainLinks = [
    { title: "Home", href: "/", icon: FiHome },
    // { title: "Category", href: "/search", icon: FiGrid },
    // { title: "Products", href: "/search", icon: FiShoppingBag },
    // { title: "Top Offers", href: "/offer", icon: FiTag },
    { title: "My Orders", href: "/user/my-orders", icon: FiGrid },
    { title: "Favorite", href: "/wishlist", icon: FiHeart },
    { title: "Compare", href: "/compare", icon: FiShuffle },
    { title: "About Us", href: "/about-us", icon: FiUsers },
    { title: "Careers", href: "/careers", icon: FiBriefcase },
    { title: "Contact Us", href: "/contact-us", icon: FiPhoneCall },
    // { title: "FAQs", href: "/faq", icon: FiHelpCircle },
    { title: "Refund and Returns Policy", href: "/refund-and-return-policy", icon: FiRefreshCw },
    { title: "Shipping & Delivery Policy", href: "/shipping-and-delivery-policy", icon: FiTruck },
    { title: "Terms & Conditions", href: "/terms-and-conditions", icon: FiFileText },
    { title: "Privacy Policy", href: "/privacy-policy", icon: FiShield },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-white cursor-pointer scrollbar-hide">
      {categoryDrawerOpen && (
        <div className="w-full flex justify-between items-center h-16 px-6 py-4 bg-white text-white border-b border-gray-100">
          <h2 className="font-semibold font-serif text-lg m-0 text-heading flex align-center">
            <Link href="/" className="mr-10">
              <Image
                width={100}
                height={38}
                src="/logo/logo.png"
                alt="logo"
              />
            </Link>
          </h2>
          <button
            onClick={closeCategoryDrawer}
            className="flex text-xl items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-red-500 p-2 focus:outline-none transition-opacity hover:text-red-600"
            aria-label="close"
          >
            <IoClose />
          </button>
        </div>
      )}
      <div className="w-full max-h-full overflow-y-auto">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("category")}
            className={`flex-1 py-4 text-center font-serif font-semibold text-sm transition-colors duration-300 ${
              activeTab === "category"
                ? `text-store-600 border-b-2 border-store-600`
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Category
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`flex-1 py-4 text-center font-serif font-semibold text-sm transition-colors duration-300 ${
              activeTab === "pages"
                ? `text-store-600 border-b-2 border-store-600`
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pages
          </button>
        </div>

        {activeTab === "pages" ? (
          <nav className="px-6 py-3">
            <ul className="space-y-1">
              {mainLinks.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    onClick={closeCategoryDrawer}
                    className={`flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-store-600`}
                  >
                    <item.icon className="flex-shrink-0 h-4 w-4 mr-3" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <>
            {isLoading ? (
              <Loading loading={isLoading} />
            ) : error ? (
              <p className="flex justify-center align-middle items-center m-auto text-xl text-red-500">
                {error?.response?.data?.message || error?.message}
              </p>
            ) : (
              <div className="relative grid grid-cols-1 gap-2 p-4 pt-3">
                {data?.map((mainCategory) => (
                  <div key={mainCategory._id}>
                    {/* Main Categories - Direct display without parent */}
                    {mainCategory?.children?.length > 0 && (
                      <div className="border-b border-gray-100 last:border-b-0">
                        {mainCategory.children.map((subcategory1) => (
                          <div key={subcategory1._id}>
                            <div 
                              className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-store-500 transition-colors cursor-pointer"
                              onClick={() => toggleCategoryExpansion(subcategory1._id)}
                            >
                              {subcategory1?.icon ? (
                                <Image
                                  src={subcategory1.icon}
                                  alt={showingTranslateValue(subcategory1?.name)}
                                  width={20}
                                  height={20}
                                  className="object-contain flex-shrink-0"
                                />
                              ) : (
                                <div className="w-5 h-5 flex-shrink-0"></div>
                              )}
                              <span className="uppercase">
                                {showingTranslateValue(subcategory1?.name)}
                              </span>
                              {subcategory1?.children?.length > 0 && (
                                <div className="ml-auto">
                                  {expandedCategories[subcategory1._id] ? (
                                    <IoChevronDown className="text-gray-400 transition-transform duration-200" />
                                  ) : (
                                    <IoChevronForward className="text-gray-400 transition-transform duration-200" />
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Subcategories Level 2 - Collapsible */}
                            {subcategory1?.children?.length > 0 && expandedCategories[subcategory1._id] && (
                              <div className="bg-gray-50">
                                {subcategory1.children.map((subcategory2) => (
                                  <div
                                    key={subcategory2._id}
                                    onClick={() => {
                                      const name = (subcategory2?.name?.en || subcategory2?.name)
                                        .toLowerCase()
                                        .replace(/[^A-Z0-9]+/gi, "-");
                                      router.push(`/search?category=${name}&_id=${subcategory2._id}`);
                                      closeCategoryDrawer();
                                    }}
                                    className="flex items-center gap-3 px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-store-500 transition-colors cursor-pointer"
                                  >
                                    {subcategory2?.icon ? (
                                      <Image
                                        src={subcategory2.icon}
                                        alt={showingTranslateValue(subcategory2?.name)}
                                        width={16}
                                        height={16}
                                        className="object-contain flex-shrink-0"
                                      />
                                    ) : (
                                      <div className="w-4 h-4 flex-shrink-0"></div>
                                    )}
                                    <span>
                                      {showingTranslateValue(subcategory2?.name)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Category;

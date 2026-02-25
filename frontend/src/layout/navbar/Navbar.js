import { useContext, useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCart } from "react-use-cart";
import { IoChevronDownOutline, IoBagHandleOutline, IoLockClosedOutline, IoSearchOutline, IoChevronForward, IoChevronDown } from "react-icons/io5";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import { useQuery } from "@tanstack/react-query";

//internal import
import { getUserSession } from "@lib/auth";
import useWishlist from "@hooks/useWishlist";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CartDrawer from "@components/drawer/CartDrawer";
import { SidebarContext } from "@context/SidebarContext";
import CategoryServices from "@services/CategoryServices";
// import LocationButton from "@components/location/LocationButton";
import LocationPickerDropdown from "@components/location/LocationPickerDropdown";
import SearchSuggestions from "@components/search/SearchSuggestions";


const Navbar = () => {
  const { t, lang } = useTranslation("common");
  const { showingTranslateValue } = useUtilsFunction();
  const router = useRouter();
  const { data: categoriesData } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
    onSuccess: (data) => {
      console.log('Categories API Success:', data);
      console.log('Categories length:', data?.length);
      data?.forEach((cat, index) => {
        console.log(`Category ${index + 1}:`, cat.name, 'Children:', cat.children?.length || 0);
      });
    },
    onError: (error) => {
      console.error('Categories API Error:', error);
    }
  });
  const { toggleCartDrawer } = useContext(SidebarContext);
  const { totalItems, totalUniqueItems } = useCart();
  const { count: wishlistCount } = useWishlist();

  const userInfo = getUserSession();

  const { storeCustomizationSetting, globalSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";

  // Search state
  const [showSearchInNavbar, setShowSearchInNavbar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  // Sign In dropdown & wholesaler modal

  // Scroll listener to show/hide search bar in navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      // Show search bar when scrolled down more than 100px
      if (scrollY > 50) {
        setShowSearchInNavbar(true);
      } else {
        setShowSearchInNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Sync searchText with URL query on search page
  useEffect(() => {
    if (router.pathname === "/search" && router.query.query) {
      setSearchText(router.query.query);
    }
  }, [router.pathname, router.query.query]);

  const handleSearchChange = (value) => {
    setSearchText(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const trimmedSearchText = searchText.trim();
    setShowSuggestions(false);
    searchInputRef.current?.blur();

    if (trimmedSearchText) {
      router.push(
        {
          pathname: "/search",
          query: { query: trimmedSearchText },
        },
        `/search?query=${encodeURIComponent(trimmedSearchText)}`,
        { shallow: false }
      ).then(() => {
        setSearchText("");
      }).catch((err) => {
        console.error("Navigation error:", err);
        window.location.href = `/search?query=${encodeURIComponent(trimmedSearchText)}`;
      });
    }
  };



  return (
    <>
      <CartDrawer />
      <div className="hidden lg:block sticky top-0 z-50 bg-white w-full shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-8">
          <div className="top-bar h-8 lg:h-auto flex items-center justify-between gap-3 mx-auto">

            {/* Left Side: Logo + Nav Links */}
            <div className="flex items-center gap-8">
              <Link href="/" className="mr-3 lg:mr-0 block">
                <div className="relative w-28 h-12 sm:w-32 sm:h-12 lg:w-40 lg:h-20">
                  <Image
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="h-full w-auto object-contain"
                    priority
                    src={storeCustomizationSetting?.navbar?.logo}
                    alt="logo"
                  />
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-6 font-medium text-gray-700">
                <Link href="/" className="hover:text-store-500 transition-colors">
                  Home
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-1 hover:text-store-500 transition-colors py-2">
                    Categories <IoChevronDownOutline />
                  </button>
                  <div className="absolute top-full left-0 w-80 bg-white shadow-lg rounded-md py-2 hidden group-hover:block z-50 border border-gray-100 max-h-96 overflow-y-auto">
                    {categoriesData?.map((mainCategory) => (
                      <div key={mainCategory._id}>
                        {/* Subcategories Level 1 - Direct display without parent */}
                        {mainCategory?.children?.length > 0 && (
                          <div className="border-b border-gray-100 last:border-b-0">
                            {mainCategory.children.map((subcategory1) => (
                              <div key={subcategory1._id}>
                                <div className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-store-500 transition-colors cursor-default">
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
                                </div>

                                {/* Subcategories Level 2 */}
                                {subcategory1?.children?.length > 0 && (
                                  <div className="bg-gray-50">
                                    {subcategory1.children.map((subcategory2) => (
                                      <Link
                                        key={subcategory2._id}
                                        href={`/search?category=${subcategory2.slug ||
                                          (subcategory2?.name?.en || subcategory2?.name)
                                            .toLowerCase()
                                            .replace(/[^A-Z0-9]+/gi, "-")
                                          }&_id=${subcategory2._id}`}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-store-500 transition-colors"
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
                                      </Link>
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
                </div>
              </div>
            </div>

            {/* Center: Search Bar - Show when scrolled or on search page */}
            {(showSearchInNavbar || router.pathname === "/search") ? (
              <div className="flex-1 max-w-2xl mx-4">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white border-2 border-gray-200 rounded-full shadow-sm overflow-visible z-20 focus-within:ring-0 focus-within:shadow-none focus-within:border-gray-200 focus-within:outline-none">
                  {/* Location Button */}
                  <LocationPickerDropdown className="h-full z-30" />

                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for medicine or store..."
                      className="w-full py-2.5 pl-4 pr-12 rounded-full bg-white focus:outline-none outline-none focus:ring-0 focus:border-transparent focus:shadow-none focus-visible:outline-none focus-visible:shadow-none focus-visible:border-transparent text-gray-700 text-sm"
                      value={searchText}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => searchText.length > 0 && setShowSuggestions(true)}
                      onBlur={(e) => {
                        const relatedTarget = e.relatedTarget;
                        const suggestionsContainer = document.querySelector('.search-suggestions-container');

                        if (!relatedTarget || (suggestionsContainer && !suggestionsContainer.contains(relatedTarget))) {
                          setTimeout(() => {
                            const activeElement = document.activeElement;
                            if (!suggestionsContainer || !suggestionsContainer.contains(activeElement)) {
                              setShowSuggestions(false);
                            }
                          }, 200);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-store-600 transition-colors"
                    >
                      <IoSearchOutline className="text-lg" />
                    </button>
                    <SearchSuggestions
                      searchText={searchText}
                      showSuggestions={showSuggestions}
                      onSelect={() => {
                        setSearchText("");
                        setShowSuggestions(false);
                      }}
                      onClose={() => setShowSuggestions(false)}
                    />
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex-1"></div>
            )}

            {/* Right Side: Icons + Sign In */}
            <div className="flex items-center gap-4">
              {/* Box Icon / Orders */}
              {/* <Link
                href="/user/my-orders"
                className="text-2xl text-gray-600 hover:text-store-500 transition-colors"
                aria-label="Orders"
              >
                <IoBagHandleOutline />
              </Link> */}

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="relative text-2xl text-gray-600 hover:text-store-500 transition-colors"
                aria-label="Wishlist"
              >
                <span className="absolute z-10 top-0 right-0 -mt-1 -mr-1 inline-flex items-center justify-center p-1 h-4 w-4 text-xs font-medium leading-none text-white transform bg-store-500 rounded-full">
                  {wishlistCount}
                </span>
                <FiHeart />
              </Link>

              {/* Cart Icon */}
              <button
                aria-label="Total"
                onClick={toggleCartDrawer}
                className="relative text-2xl text-gray-600 hover:text-store-500 transition-colors"
              >
                <span className="absolute z-10 top-0 right-0 -mt-1 -mr-1 inline-flex items-center justify-center p-1 h-4 w-4 text-xs font-medium leading-none text-white transform bg-store-500 rounded-full">
                  {totalUniqueItems}
                </span>
                <FiShoppingCart />
              </button>

              {/* Sign In / Profile */}
              <div className="pl-2">
                {userInfo?.image ? (
                  <Link href="/user/dashboard" className="relative top-1 w-8 h-8 block">
                    <Image
                      width={32}
                      height={32}
                      src={userInfo?.image}
                      alt="user"
                      className="bg-white rounded-full object-cover w-8 h-8 border-2 border-gray-200"
                    />
                  </Link>
                ) : userInfo?.name ? (
                  <Link
                    href="/user/dashboard"
                    className="leading-none font-bold font-serif block border-2 px-3 py-2 border-store-500 text-store-500 rounded-full"
                  >
                    {userInfo?.name[0]}
                  </Link>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => router.push('/auth/signup')}
                      className="bg-store-500 text-white px-5 py-2 rounded-full flex items-center gap-2 font-bold hover:bg-store-600 transition-colors"
                    >
                      <IoLockClosedOutline className="text-lg" /> Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* second header - hiding it as per design request to simplify */}
      {/* <div className="hidden lg:block bg-white">
        <NavbarPromo />
      </div> */}

    </>
  );
};
export default dynamic(() => Promise.resolve(Navbar), { ssr: false });

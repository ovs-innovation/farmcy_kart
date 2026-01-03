import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCart } from "react-use-cart";
import { IoSearchOutline, IoChevronDownOutline, IoBagHandleOutline, IoLockClosedOutline } from "react-icons/io5";
import { FiShoppingCart, FiUser, FiBell, FiHeart, FiShuffle } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import { useQuery } from "@tanstack/react-query";

//internal import
import { getUserSession } from "@lib/auth";
import useWishlist from "@hooks/useWishlist";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { handleLogEvent } from "src/lib/analytics";
import NavbarPromo from "@layout/navbar/NavbarPromo";
import CartDrawer from "@components/drawer/CartDrawer";
import { SidebarContext } from "@context/SidebarContext";
import BrandServices from "@services/BrandServices";
import CategoryServices from "@services/CategoryServices";

const Navbar = () => {
  const { t, lang } = useTranslation("common");
  const { showingTranslateValue } = useUtilsFunction();
  const { data: categoriesData } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await CategoryServices.getShowingCategory(),
  });
  const [searchText, setSearchText] = useState("");
  const [brands, setBrands] = useState([]);
  const [matchedBrand, setMatchedBrand] = useState(null);
  const { toggleCartDrawer } = useContext(SidebarContext);
  const { totalItems, totalUniqueItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const router = useRouter();

  const userInfo = getUserSession();

  const { storeCustomizationSetting } = useGetSetting();
  console.log("storeCustomizationSetting", storeCustomizationSetting);
  const storeColor = storeCustomizationSetting?.theme?.color || "pink";

  useEffect(() => {
    let isMounted = true;
    const fetchBrands = async () => {
      try {
        const response = await BrandServices.getShowingBrands();
        if (isMounted && Array.isArray(response)) {
          setBrands(response);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch brands for search", error);
      }
    };
    fetchBrands();
    return () => {
      isMounted = false;
    };
  }, []);

  const getBrandLabel = (brand = {}) => {
    if (!brand.name) return "";
    if (typeof brand.name === "string") return brand.name;
    return (
      brand.name[lang] ||
      brand.name.en ||
      Object.values(brand.name)[0] ||
      ""
    );
  };

  const handleSearchChange = (value) => {
    setSearchText(value);
    if (!value) {
      setMatchedBrand(null);
      return;
    }
    const normalized = value.trim().toLowerCase();
    const found = brands.find((brand) => {
      const label = getBrandLabel(brand).toLowerCase();
      return (
        label === normalized || brand.slug?.toLowerCase() === normalized
      );
    });
    setMatchedBrand(found || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (matchedBrand) {
      router.push(`/search?brand=${matchedBrand._id}`, null, { scroll: false });
      setSearchText("");
      setMatchedBrand(null);
      handleLogEvent("search", `searched brand ${matchedBrand.slug || matchedBrand._id}`);
      return;
    }

    if (searchText.trim()) {
      router.push(`/search?query=${searchText}`, null, { scroll: false });
      setSearchText("");
      setMatchedBrand(null);
      handleLogEvent("search", `searched ${searchText}`);
    } else {
      router.push(`/ `, null, { scroll: false });
      setSearchText("");
      setMatchedBrand(null);
    }
  };

  return (
    <>
      <CartDrawer />
      <div className="hidden lg:block sticky top-0 z-50 bg-white w-full shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-8">
          <div className="top-bar h-8 lg:h-auto flex items-center justify-between gap-3  mx-auto">
            
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
                  <div className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-md py-1 hidden group-hover:block z-50 border border-gray-100">
                    {categoriesData?.[0]?.children?.map((category) => (
                      <Link
                        key={category._id}
                        href={`/search?category=${
                          category.slug ||
                          (category?.name?.en || category?.name)
                            .toLowerCase()
                            .replace(/[^A-Z0-9]+/gi, "-")
                        }&_id=${category._id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-store-500 transition-colors"
                      >
                        {showingTranslateValue(category?.name)}
                      </Link>
                    ))}
                  </div>
                </div>
                <button className="flex items-center gap-1 hover:text-store-500 transition-colors">
                  Stores <IoChevronDownOutline />
                </button>
              </div>
            </div>

            {/* Right Side: Icons + Sign In */}
            <div className="flex items-center gap-4">
              {/* Box Icon / Orders */}
              <Link
                href="/user/my-orders"
                className="text-2xl text-gray-600 hover:text-store-500 transition-colors"
                aria-label="Orders"
              >
                <IoBagHandleOutline />
              </Link>

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
                      className="bg-white rounded-full"
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
                  <Link
                    href="/auth/login"
                    className="bg-store-500 text-white px-5 py-2 rounded-full flex items-center gap-2 font-bold hover:bg-store-600 transition-colors"
                  >
                    <IoLockClosedOutline className="text-lg" /> Sign In
                  </Link>
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

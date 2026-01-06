import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { IoArrowBack, IoSearchOutline, IoClose } from "react-icons/io5";
import { FiHeart, FiShoppingCart, FiUser, FiFilter, FiList } from "react-icons/fi";
import { useCart } from "react-use-cart";

//internal import
import Layout from "@layout/Layout";
import useFilter from "@hooks/useFilter";
import Card from "@components/cta-card/Card";
import Loading from "@components/preloader/Loading";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import { SidebarContext } from "@context/SidebarContext";
import AttributeServices from "@services/AttributeServices";
import CategoryCarousel from "@components/carousel/CategoryCarousel";
import FilterSidebar from "@components/category/FilterSidebar";
import FilterDrawer from "@components/drawer/FilterDrawer";
import useWishlist from "@hooks/useWishlist";

const Search = ({ products, attributes }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { query } = router.query;
  const { isLoading, setIsLoading, toggleFilterDrawer } = useContext(SidebarContext);
  const [visibleProduct, setVisibleProduct] = useState(18);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  const {
    setSortedField,
    productData,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    selectedCategories,
    setSelectedCategories,
    selectedRating,
    setSelectedRating,
    selectedDiscount,
    setSelectedDiscount,
    sortedField,
  } = useFilter(products);

  useEffect(() => {
    if (router.query.sort) {
      setSortedField(router.query.sort);
    }
  }, [router.query.sort, setSortedField]);

  const handleClearAll = () => {
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 100000 });
    setSelectedCategories([]);
    setSelectedRating(0);
    setSelectedDiscount(0);
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search?query=${searchText}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <Layout title="Search" description="This is search page" hideMobileHeader={true}>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3">
        {isSearchOpen ? (
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
            <button type="button" onClick={() => setIsSearchOpen(false)} className="text-gray-700">
              <IoArrowBack size={24} />
            </button>
            <input
              autoFocus
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products..."
              className="flex-1 border-none focus:ring-0 text-sm"
            />
            <button type="submit" className="text-gray-700">
              <IoSearchOutline size={22} />
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="text-gray-700">
                <IoArrowBack size={24} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 relative">
                  <Image
                    src="/logo/logo-color.png"
                    alt="logo"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <h1 className="text-lg font-semibold text-gray-800 capitalize truncate max-w-[120px]">
                  {query || "Search"}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-700">
              <button onClick={() => setIsSearchOpen(true)}>
                <IoSearchOutline size={22} />
              </button>
              <button onClick={() => router.push("/wishlist")} className="relative">
                <FiHeart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-store-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button onClick={() => router.push("/cart")} className="relative">
                <FiShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-store-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button onClick={() => router.push("/user/dashboard")}>
                <FiUser size={22} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sort/Filter Bar */}
      <div className="lg:hidden sticky top-[57px] z-20 bg-white border-b border-gray-100 flex divide-x divide-gray-100">
        <button
          onClick={() => setIsSortModalOpen(true)}
          className="flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
        >
          <FiList size={18} />
          Sort
        </button>
        <button
          onClick={toggleFilterDrawer}
          className="flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
        >
          <FiFilter size={18} />
          Filter
        </button>
      </div>

      <div className="mx-auto max-w-screen-2xl px-3 md:px-0">
        <div className="flex gap-6">
          {/* Sidebar for Desktop */}
          <div className="hidden lg:block w-1/5 shrink-0">
            <FilterSidebar
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              selectedDiscount={selectedDiscount}
              setSelectedDiscount={setSelectedDiscount}
              onClearAll={handleClearAll}
            />
          </div>

          <div className="w-full lg:w-3/4">
            <div className="w-full">
              <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:gap-6">
                {/* <Card /> */}
              </div>
              <div className="relative block">
                <CategoryCarousel />
              </div>
              {productData?.length === 0 ? (
                <div className="mx-auto p-5 my-5">
                  <Image
                    className="my-4 mx-auto"
                    src="/no-result.svg"
                    alt="no-result"
                    width={400}
                    height={380}
                  />
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl text-center mt-2 font-medium font-serif text-gray-600">
                    {t("sorryText")} 😞
                  </h2>
                </div>
              ) : (
                <div className="hidden lg:flex justify-between my-3 bg-orange-100 border border-gray-100 rounded p-3">
                  <h6 className="text-sm font-serif">
                    {t("totalI")}{" "}
                    <span className="font-bold">{productData?.length}</span>{" "}
                    {t("itemsFound")}
                  </h6>
                  <span className="text-sm font-serif">
                    <select
                      onChange={(e) => setSortedField(e.target.value)}
                      value={sortedField}
                      className="py-0 text-sm font-serif font-medium block w-full rounded border-0 bg-white pr-10 cursor-pointer focus:ring-0"
                    >
                      <option className="px-3" value="All" defaultValue hidden>
                        {t("sortByPrice")}
                      </option>
                      <option className="px-3" value="Low">
                        {t("lowToHigh")}
                      </option>
                      <option className="px-3" value="High">
                        {t("highToLow")}
                      </option>
                      <option className="px-3" value="newest">
                        Latest
                      </option>
                      <option className="px-3" value="best-selling">
                        Best Selling
                      </option>
                      <option className="px-3" value="most-discounted">
                        Most Discounted
                      </option>
                    </select>
                  </span>
                </div>
              )}

              {isLoading ? (
                <Loading loading={isLoading} />
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-2 md:gap-3 lg:gap-3">
                    {productData?.slice(0, visibleProduct).map((product, i) => (
                      <ProductCard
                        key={i + 1}
                        product={product}
                        attributes={attributes}
                      />
                    ))}
                  </div>

                  {productData?.length > visibleProduct && (
                    <button
                      onClick={() => setVisibleProduct((pre) => pre + 10)}
                      className={`w-auto mx-auto md:text-sm leading-5 flex items-center transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none bg-indigo-100 text-gray-700 px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-store-600 h-12 mt-6 text-sm lg:text-sm`}
                    >
                      {t("loadMoreBtn")}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Drawer for Mobile */}
      <FilterDrawer
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        selectedDiscount={selectedDiscount}
        setSelectedDiscount={setSelectedDiscount}
        onClearAll={handleClearAll}
      />

      {/* Sort Modal for Mobile */}
      {isSortModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 lg:hidden">
          <div className="bg-white w-full rounded-t-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sort By</h3>
              <button className="p-2 border border-store-400 rounded-lg" onClick={() => setIsSortModalOpen(false)}>
                <IoClose size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setSortedField("Low");
                  setIsSortModalOpen(false);
                }}
                className={`w-full text-left py-2 px-4 rounded-lg ${
                  sortedField === "Low" ? "bg-store-100 text-store-600 font-semibold" : "text-gray-700"
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => {
                  setSortedField("High");
                  setIsSortModalOpen(false);
                }}
                className={`w-full text-left py-2 px-4 rounded-lg ${
                  sortedField === "High" ? "bg-store-100 text-store-600 font-semibold" : "text-gray-700"
                }`}
              >
                Price: High to Low
              </button>
              <button
                onClick={() => {
                  setSortedField("newest");
                  setIsSortModalOpen(false);
                }}
                className={`w-full text-left py-2 px-4 rounded-lg ${
                  sortedField === "newest" ? "bg-store-100 text-store-600 font-semibold" : "text-gray-700"
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => {
                  setSortedField("best-selling");
                  setIsSortModalOpen(false);
                }}
                className={`w-full text-left py-2 px-4 rounded-lg ${
                  sortedField === "best-selling" ? "bg-store-100 text-store-600 font-semibold" : "text-gray-700"
                }`}
              >
                Best Selling
              </button>
              <button
                onClick={() => {
                  setSortedField("most-discounted");
                  setIsSortModalOpen(false);
                }}
                className={`w-full text-left py-2 px-4 rounded-lg ${
                  sortedField === "most-discounted" ? "bg-store-100 text-store-600 font-semibold" : "text-gray-700"
                }`}
              >
                Most Discounted
              </button>
              <button
                onClick={() => {
                  setSortedField("All");
                  setIsSortModalOpen(false);
                }}
                className={`w-full text-left py-2 px-4 rounded-lg ${
                  sortedField === "All" ? "bg-store-100 text-store-600 font-semibold" : "text-gray-700"
                }`}
              >
                Default
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Search;

export const getServerSideProps = async (context) => {
  const { query, _id, brand } = context.query;

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: _id ? _id : "",
      title: query ? encodeURIComponent(query) : "",
      brand: brand ? brand : "",
    }),
    AttributeServices.getShowingAttributes({}),
  ]);

  return {
    props: {
      attributes,
      products: data?.products,
    },
  };
};

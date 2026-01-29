import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { SidebarContext } from "@context/SidebarContext";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { FiChevronRight } from "react-icons/fi";
import SectionHeader from "@components/common/SectionHeader";

const SuggestedProducts = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const [products, setProducts] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Responsive product count
  const getVisibleCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 6; // lg and up
      return 4; // sm and below
    }
    return 6;
  };
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    // Update visibleCount on resize
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        setFetchLoading(true);
        let userInfo = null;
        try {
            const cookie = Cookies.get("userInfo");
            if (cookie) userInfo = JSON.parse(cookie);
        } catch (e) {}

        let params = {};
        let guestIds = [];
        // 2. If guest, get history from LocalStorage
        if (!userInfo) {
          const guestHistory = localStorage.getItem("recentlyViewed");
          if (guestHistory) {
            try {
              const parsed = JSON.parse(guestHistory);
              if (Array.isArray(parsed)) {
                // Remove duplicates and deleted products
                const unique = Array.from(new Set(parsed.map(item => item._id)));
                guestIds = unique;
                params.productIds = guestIds.join(",");
              }
            } catch (e) {
              console.error("Error parsing guest history", e);
            }
          }
        }
        // 3. Fetch from Backend
        const res = await ProductServices.getSuggestedProducts(params);
        // Filter out deleted/null products and duplicates
        const filtered = Array.isArray(res)
          ? res.filter((p, i, arr) => p && arr.findIndex(x => x._id === p._id) === i)
          : [];
        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching suggested products:", err);
        setProducts([]);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSuggestedProducts();
  }, []);

  if (fetchLoading) {
     return null; // Or a skeleton loader
  }

  if (products.length === 0) {
    // Edge case: new user, cleared cache, or all products deleted
    return null;
  }

  return (
    <div className="bg-emerald-50/40 rounded-xl py-6 px-2">
      <SectionHeader
        title="Suggested For You"
        subtitle="Personalized recommendations based on your activity"
        align="left"
      />
      <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
        {(showAll ? products : products.slice(0, visibleCount)).map((product, i) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {products.length > visibleCount && !showAll && (
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-2 rounded-full border border-emerald-700 text-emerald-700 font-bold flex items-center gap-2 bg-white hover:bg-emerald-50 transition shadow-none outline-none focus:outline-none"
            onClick={() => setShowAll(true)}
          >
            View All <FiChevronRight className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SuggestedProducts;

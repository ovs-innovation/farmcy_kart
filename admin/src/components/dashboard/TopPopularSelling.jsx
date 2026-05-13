import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdHealthAndSafety,
  MdScience,
  MdOutlineLocalShipping,
  MdOutlineAssignment,
  MdOutlineAddBox,
  MdOutlineMedicalInformation,
} from "react-icons/md";
import { FiHeart } from "react-icons/fi";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const TopPopularSelling = ({ bestSeller = [], topBrands = [], goldCustomers = [] }) => {
  const { t } = useTranslation();
  const { showingTranslateValue } = useUtilsFunction();

  // Brand icons
  const pharmacyIcons = [
    { icon: MdHealthAndSafety, color: "text-[#2e7d32]", bgColor: "bg-[#e8f5e9]" },
    { icon: MdScience, color: "text-[#0288d1]", bgColor: "bg-[#e1f5fe]" },
    { icon: MdOutlineLocalShipping, color: "text-[#00796b]", bgColor: "bg-[#e0f2f1]" },
    { icon: MdOutlineAssignment, color: "text-[#00838f]", bgColor: "bg-[#e0f7fa]" },
    { icon: MdOutlineAddBox, color: "text-[#1565c0]", bgColor: "bg-[#e3f2fd]" },
    { icon: MdOutlineMedicalInformation, color: "text-[#c62828]", bgColor: "bg-[#ffebee]" },
  ];

  // Top brands
  const displayBrands =
    topBrands.length > 0
      ? topBrands.slice(0, 6)
      : [
          { name: "Health Shield", count: 45 },
          { name: "Eco-Meds", count: 38 },
          { name: "RxCare", count: 32 },
          { name: "Quick Rx", count: 28 },
          { name: "CityMed", count: 24 },
          { name: "Wellness", count: 18 },
        ];

  // Top selling meds
  const displayMeds =
    bestSeller.length > 0
      ? bestSeller.slice(0, 6).map((m) => ({
          name: showingTranslateValue(m.title) || m.title,
          sold: m.count,
          img: m.image?.[0] || "https://cdn-icons-png.flaticon.com/512/3028/3028574.png",
        }))
      : [
          { name: "Paracetamol 500mg", sold: 12, img: "https://cdn-icons-png.flaticon.com/512/3028/3028574.png" },
          { name: "Multivitamin 30s", sold: 10, img: "https://cdn-icons-png.flaticon.com/512/1047/1047687.png" },
          { name: "Salbutamol Inhaler", sold: 8, img: "https://cdn-icons-png.flaticon.com/512/1047/1047721.png" },
          { name: "Antiseptic Cream", sold: 7, img: "https://cdn-icons-png.flaticon.com/512/1047/1047711.png" },
          { name: "Digital Thermometer", sold: 6, img: "https://cdn-icons-png.flaticon.com/512/1047/1047716.png" },
          { name: "Cold & Flu Relief", sold: 5, img: "https://cdn-icons-png.flaticon.com/512/3028/3028566.png" },
        ];

  // Most loved products
  const mostLovedProducts = [
    {
      name: "Farmcy Organic Herbal Tea",
      hearts: 212,
      img: "https://images.unsplash.com/photo-1594631252845-29fc458639a6?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Pure Lavender Honey",
      hearts: 185,
      img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Organic Aloe Vera Gel",
      hearts: 156,
      img: "https://images.unsplash.com/photo-1596755094514-b87a0423926c?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Sun-Dried Chamomile",
      hearts: 142,
      img: "https://images.unsplash.com/photo-1544145945-f904253d0c7e?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Farmcy Chia Seeds",
      hearts: 128,
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Pure Turmeric Powder",
      hearts: 115,
      img: "https://images.unsplash.com/photo-1615485245832-378393c04205?auto=format&fit=crop&q=80&w=400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
      {/* Top Brands */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t("TopBrands")}</h3>
          <Link
            to="/brands"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {t("ViewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {displayBrands.map((brand, idx) => {
            const style = pharmacyIcons[idx % pharmacyIcons.length];
            const IconComponent = style.icon;

            return (
              <div
                key={idx}
                className="aspect-square bg-white dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 flex flex-col items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all group overflow-hidden p-2"
                title={showingTranslateValue(brand.name) || brand.name}
              >
                <div
                  className={`p-3 rounded-xl ${style.bgColor} dark:bg-gray-800/50 group-hover:scale-110 transition-transform duration-300 mb-1`}
                >
                  <IconComponent className={`w-6 h-6 ${style.color}`} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 truncate w-full text-center">
                  {showingTranslateValue(brand.name) || brand.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Selling Meds */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t("TopSellingMeds")}</h3>
          <Link
            to="/products"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {t("ViewAll")}
          </Link>
        </div>

        <div className="space-y-4">
          {displayMeds.map((med, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center p-1 group-hover:scale-110 transition-transform overflow-hidden">
                  <img src={med.img} alt={med.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200 tracking-tight max-w-[140px] truncate">
                  {med.name}
                </span>
              </div>

              <div className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl">
                <span className="text-xs font-black text-blue-600 whitespace-nowrap">
                  {t("Sold")} : {med.sold}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Loved Products */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t("MostLovedProducts")}</h3>
          <Link
            to="/products"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {t("ViewAll")}
          </Link>
        </div>

        <div className="space-y-4">
          {mostLovedProducts.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center p-1 group-hover:scale-110 transition-transform overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200 tracking-tight max-w-[140px] truncate">
                  {product.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-900/10 rounded-full">
                <span className="text-xs font-black text-rose-600">{product.hearts}</span>
                <FiHeart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPopularSelling;
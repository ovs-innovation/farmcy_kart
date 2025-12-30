import React, { useState } from "react";
import { useRouter } from "next/router";
import { IoSearchOutline } from "react-icons/io5";
import useTranslation from "next-translate/useTranslation";

const HeroBanner = () => {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const { t } = useTranslation("common");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText) {
      router.push(`/search?query=${searchText}`, null, { scroll: false });
    }
  };

  return (
    <div className="w-full bg-store-100 relative overflow-hidden rounded-lg">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none" 
             style={{ 
                 backgroundImage: 'url(/home/par.webp)', // Using a placeholder, user can change this
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
             }}>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-store-900 mb-8 font-serif drop-shadow-lg">
                Quality Medicines & Health Care At Your Doorstep.
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
                <input
                    type="text"
                    placeholder="Search for medicine or store..."
                    className="w-full py-4 pl-6 pr-12 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-store-500 text-gray-700"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-store-600"
                >
                    <IoSearchOutline className="text-2xl" />
                </button>
            </form>
        </div>
    </div>
  );
};

export default HeroBanner;

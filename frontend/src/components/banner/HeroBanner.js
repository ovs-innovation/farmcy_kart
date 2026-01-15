import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { IoSearchOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import LocationButton from "@components/location/LocationButton";
import SearchSuggestions from "@components/search/SearchSuggestions";
import PrescriptionUploadModal from "@components/prescription/PrescriptionUploadModal";
import {
  FaHeartbeat,
  FaCapsules,
  FaShoppingCart,
  FaFileUpload,
} from "react-icons/fa";

const HeroBanner = () => {
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");
  const searchInputRef = useRef(null);

  const handleSearchChange = (value) => {
    setSearchText(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSubmit = (e) => {
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

  const handleCTAClick = (type) => {
    if (type === "shop") {
      router.push("/category");
    } else if (type === "prescription") {
      setPrescriptionModalOpen(true);
    }
  };

  // Animation variants for left side (top to bottom)
  const leftAnimationVariants = {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Animation variants for right side (bottom to top)
  const rightAnimationVariants = {
    initial: { y: 100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
    float: {
      y: [0, 20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Content animation
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full relative overflow-hidden bg-green-800" style={{ minHeight: '600px', height: 'auto' }}>
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated Visual Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left Side Medicine Images - Top to Bottom */}
        <div className="absolute left-0 top-0 w-full md:w-1/3 h-full flex flex-col items-center justify-start pt-8 md:pt-16 px-4">
          {/* Medicine Strip */}
          <motion.div
            variants={leftAnimationVariants}
            initial="initial"
            animate={["animate", "float"]}
            className="relative mb-6 opacity-40"
          >
            <div className="bg-white rounded-lg shadow-xl p-3 md:p-4 transform rotate-[-5deg]">
              <div className="w-24 md:w-32 h-16 md:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                <div className="grid grid-cols-4 gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-sm"></div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Prescription Bottle */}
          <motion.div
            variants={leftAnimationVariants}
            initial="initial"
            animate={["animate", "float"]}
            transition={{ delay: 0.2 }}
            className="relative mb-6 opacity-40"
          >
            <div className="bg-white rounded-lg shadow-xl p-2 md:p-3 transform rotate-[3deg]">
              <div className="w-16 md:w-20 h-24 md:h-28 bg-gradient-to-b from-green-100 to-green-200 rounded-t-lg rounded-b-sm relative">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 md:w-10 h-2 bg-green-400 rounded"></div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-green-600 font-bold text-xs md:text-sm">100ml</div>
              </div>
            </div>
          </motion.div>

          {/* Pills Container */}
          <motion.div
            variants={leftAnimationVariants}
            initial="initial"
            animate={["animate", "float"]}
            transition={{ delay: 0.4 }}
            className="relative opacity-40"
          >
            <div className="bg-white rounded-lg shadow-xl p-3 md:p-4 transform rotate-[-3deg]">
              <div className="flex gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-red-500 rounded-full"></div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full"></div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side Medicine Images - Bottom to Top */}
        <div className="absolute right-0 bottom-0 w-full md:w-1/3 h-full flex flex-col items-center justify-end pb-8 md:pb-16 px-4">
          {/* Syrup Bottle */}
          <motion.div
            variants={rightAnimationVariants}
            initial="initial"
            animate={["animate", "float"]}
            className="relative mb-6 opacity-40"
          >
            <div className="bg-white rounded-lg shadow-xl p-2 md:p-3 transform rotate-[-3deg]">
              <div className="w-14 md:w-18 h-28 md:h-32 bg-gradient-to-b from-purple-100 to-purple-200 rounded-lg relative">
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 md:w-8 h-1 bg-purple-400 rounded"></div>
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-purple-600 font-bold text-xs">200ml</div>
              </div>
            </div>
          </motion.div>

          {/* Medicine Capsules */}
          <motion.div
            variants={rightAnimationVariants}
            initial="initial"
            animate={["animate", "float"]}
            transition={{ delay: 0.2 }}
            className="relative mb-6 opacity-40"
          >
            <div className="bg-white rounded-lg shadow-xl p-3 md:p-4 transform rotate-[5deg]">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="w-12 h-6 md:w-14 md:h-7 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                  <div className="w-12 h-6 md:w-14 md:h-7 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-12 h-6 md:w-14 md:h-7 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                  <div className="w-12 h-6 md:w-14 md:h-7 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medicine Box */}
          <motion.div
            variants={rightAnimationVariants}
            initial="initial"
            animate={["animate", "float"]}
            transition={{ delay: 0.4 }}
            className="relative opacity-40"
          >
            <div className="bg-white rounded-lg shadow-xl p-2 md:p-3 transform rotate-[-2deg]">
              <div className="w-20 md:w-24 h-16 md:h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded flex items-center justify-center">
                <div className="text-indigo-600 font-bold text-xs md:text-sm text-center">MED</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Medicine Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 md:left-1/3"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <FaCapsules className="text-white text-xl md:text-2xl opacity-80" />
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 md:right-1/3"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <FaHeartbeat className="text-white text-xl md:text-2xl opacity-80" />
          </div>
        </motion.div>
      </div>
          
      {/* Content Section */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 py-8 md:py-12 min-h-[600px]">
        {/* Hero Text Section */}
        <motion.div
          variants={contentVariants}
          initial="initial"
          animate="animate"
          className="text-center w-full max-w-4xl mx-auto mb-6 md:mb-8 px-2"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight text-white drop-shadow-lg">
            Affordable Medicines, Delivered to Your Doorstep
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/90 drop-shadow-md mb-6 md:mb-8">
            Trusted pharmacy • Genuine medicines • Fast delivery
          </p>
          {/* Search Box Section */}
        <motion.div
          variants={contentVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
          className="relative z-10 w-full flex flex-col items-center px-3 sm:px-4"
        >
          <form onSubmit={handleSubmit} className="w-full max-w-4xl relative flex items-center bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl z-10 overflow-visible">
            {/* Location Button */}
            <LocationButton className="h-full" />
            
            {/* Search Input */}
            <div className="flex-1 relative" style={{ zIndex: 10 }}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for medicine or store..."
                className="w-full py-3 sm:py-4 pl-3 sm:pl-4 pr-10 sm:pr-12 focus:outline-none focus:ring-0 text-gray-700 text-sm sm:text-base md:text-lg bg-transparent"
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchText.trim().length > 0) {
                    setShowSuggestions(true);
                  }
                }}
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
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors z-10"
              >
                <IoSearchOutline className="text-xl sm:text-2xl" />
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
        </motion.div>
          {/* Feature Cards */}
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-stretch mb-6 md:mb-8 mt-6 md:mt-8 w-full max-w-5xl mx-auto px-4">
            {/* Shop Medicines Feature Card */}
            <motion.div
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCTAClick("shop")}
              className="group relative flex-1 max-w-sm cursor-pointer bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, green 1px, transparent 0)`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              {/* Content */}
              <div className="relative p-6 md:p-8">
                {/* Icon Container */}
                <div className="mb-4 flex items-center justify-center">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 md:p-5 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <FaShoppingCart className="text-white text-3xl md:text-4xl" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center group-hover:text-green-600 transition-colors">
                  Shop Medicines
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 mb-4 text-center leading-relaxed">
                  Browse through our wide range of genuine medicines and healthcare products
                </p>

                {/* Badge */}
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs md:text-sm font-semibold">
                    Get Max. Discount
                  </span>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-green-600 text-white p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
            </motion.div>

            {/* Upload Prescription Feature Card */}
            <motion.div
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCTAClick("prescription")}
              className="group relative flex-1 max-w-sm cursor-pointer bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-500"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              {/* Content */}
              <div className="relative p-6 md:p-8">
                {/* Icon Container */}
                <div className="mb-4 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-4 md:p-5 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 border border-white/30">
                    <FaFileUpload className="text-white text-3xl md:text-4xl" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 text-center group-hover:text-blue-50 transition-colors">
                  Upload Prescription
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-blue-100 mb-4 text-center leading-relaxed">
                  Upload your prescription and get medicines delivered to your doorstep quickly
                </p>

                {/* Badge */}
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs md:text-sm font-semibold border border-white/30">
                    FAST & SAFE
                  </span>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white text-blue-600 p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-500"></div>
            </motion.div>
          </div>
        </motion.div>

        
      </div>
      
      {/* Prescription Upload Modal */}
      <PrescriptionUploadModal
        modalOpen={prescriptionModalOpen}
        setModalOpen={setPrescriptionModalOpen}
      />
    </div>
  );
};

export default HeroBanner;

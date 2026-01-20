import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { IoSearchOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import LocationPickerDropdown from "@components/location/LocationPickerDropdown";
import SearchSuggestions from "@components/search/SearchSuggestions";
import PrescriptionUploadModal from "@components/prescription/PrescriptionUploadModal";
import {
  FaHeartbeat,
  FaCapsules,
  FaShoppingCart,
  FaFileUpload,
  FaLeaf,
  FaPrescriptionBottleAlt,
  FaFileMedical,
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
      const element = document.getElementById("feature-category");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/category");
      }
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
    <div className="w-full relative overflow-hidden bg-white" style={{ minHeight: '600px', height: 'auto' }}>
      {/* Bubble/Water Animation Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/80 via-emerald-50/50 to-white"
        />
        {[...Array(15)].map((_, i) => {
          const size = (i % 5) * 8 + 15; // Increased size range 15px - 47px
          const left = (i * 15) % 95; 
          const duration = (i % 3) * 2 + 5; // Faster duration 5-9s
          const delay = i * 0.5; // Reduced delay
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-400/20 border border-blue-400/30 shadow-sm backdrop-blur-[2px]"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                top: -60,
              }}
              animate={{
                y: ["0vh", "100vh"],
                x: [0, (i % 2 === 0 ? 50 : -50)],
                rotate: [0, 360],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear",
              }}
            />
          );
        })}
      </div>
      
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #064e3b 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated Visual Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left Side Natural/Cream Images - Top to Bottom */}
        <div className="absolute hidden left-0 top-0 w-full md:w-1/5 h-full md:flex flex-col items-center justify-center pt-8 px-4 gap-8">
          {/* Cream Jar */}
          <motion.div
            variants={leftAnimationVariants}
            initial="initial"
            animate={["animate", "float"]}
            className="relative opacity-40"
          >
            <div className="bg-white rounded-full shadow-xl p-3 transform -rotate-12">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-50 to-emerald-100 border-4 border-white shadow-inner flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/40 rounded-full transform scale-50 translate-x-4 -translate-y-4 blur-md"></div>
                 <div className="text-emerald-800/40 text-xs font-bold tracking-widest uppercase">Natural</div>
              </div>
            </div>
          </motion.div>

          {/* Herbal Tube */}
          <motion.div
            variants={leftAnimationVariants}
            initial="initial"
            animate={["animate", "float"]}
            transition={{ delay: 0.2 }}
            className="relative opacity-40"
          >
            <div className="bg-white rounded-xl shadow-xl p-2 transform rotate-6">
              <div className="w-16 h-32 bg-gradient-to-b from-teal-50 to-teal-100 rounded-b-2xl rounded-t-lg border border-teal-100 relative shadow-sm flex flex-col items-center">
                <div className="w-full h-8 bg-teal-600/20 rounded-t-lg mb-4"></div>
                <FaLeaf className="text-teal-600/30 text-3xl" />
                <div className="mt-auto mb-4 w-8 h-1 bg-teal-600/20 rounded"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side Natural/Cream Images - Bottom to Top */}
        <div className="absolute right-0 bottom-0 w-full md:w-1/5 h-full hidden md:flex flex-col items-center justify-center pb-8 px-4 gap-8">
          {/* Himalaya Style Face Wash */}
          <motion.div
            variants={rightAnimationVariants}
            initial="initial"
            animate={["animate", "float"]}
            className="relative opacity-40"
          >
            <div className="bg-white rounded-2xl shadow-xl p-2 transform rotate-3">
              <div className="w-14 h-36 bg-gradient-to-t from-lime-50 to-green-100 rounded-b-lg relative border-b-4 border-green-600/30 flex flex-col items-center justify-center">
                 <div className="w-10 h-10 rounded-full border-2 border-green-600/20 flex items-center justify-center mb-2 bg-white/30 backdrop-blur-sm">
                    <FaLeaf className="text-green-600/40 text-sm" />
                 </div>
                 <div className="w-8 h-1 bg-green-600/20 rounded-full"></div>
              </div>
            </div>
          </motion.div>

          {/* Natural Soap/Core Product */}
          <motion.div
            variants={rightAnimationVariants}
            initial="initial"
            animate={["animate", "float"]}
            transition={{ delay: 0.2 }}
            className="relative opacity-40"
          >
             <div className="bg-white rounded-lg shadow-xl p-3 transform -rotate-6">
              <div className="w-24 h-16 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg shadow-sm flex items-center justify-center border border-amber-100">
                 <div className="text-amber-800/30 font-serif italic text-lg">Pure</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Natural Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 md:left-1/3"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="bg-green-100/50 backdrop-blur-sm rounded-full p-3 shadow-lg">
            <FaLeaf className="text-green-600 text-xl opacity-60" />
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 md:right-1/3"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="bg-teal-100/50 backdrop-blur-sm rounded-full p-3 shadow-lg">
            <FaLeaf className="text-teal-600 text-xl opacity-60 transform rotate-90" />
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
          className="relative z-10 text-center w-full max-w-4xl mx-auto mb-6 md:mb-8 px-2"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight text-emerald-950 drop-shadow-sm">
            Affordable Medicines, Delivered to Your Doorstep
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-emerald-800 drop-shadow-sm mb-6 md:mb-8">
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
          <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="w-full relative flex items-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-10 p-2">
              {/* Location Button */}
              <div className="  border-r border-gray-200 ">
                <LocationPickerDropdown />
              </div>
              
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                   <IoSearchOutline className="text-xl" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for medicines, wellness..."
                  className="w-full py-3.5 pl-12 pr-4 focus:outline-none text-gray-700 font-medium placeholder-gray-400 bg-transparent rounded-full"
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

               {/* Search Button */}
              <button 
                type="submit" 
                className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-200 transform hover:-translate-y-0.5"
              >
                Search
              </button>
               {/* Mobile Search Button */}
              <button 
                type="submit" 
                className="md:hidden flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white w-10 h-10 rounded-full transition-colors duration-300 ml-2"
              >
                <IoSearchOutline className="text-xl" />
              </button>
            </form>
          </div>
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
                <div className="mb-6 flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse opacity-50 scale-150"></div>
                   <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full shadow-lg flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-500 border-4 border-white z-10">
                      <FaPrescriptionBottleAlt className="text-white text-2xl md:text-3xl drop-shadow-md transform -rotate-12" />
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-sm z-20">
                        <FaShoppingCart className="text-yellow-900 text-xs" />
                      </div>
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
              className="group relative flex-1 max-w-sm cursor-pointer bg-gradient-to-br from-green-500 to-emerald-600 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-green-400"
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
                <div className="mb-6 flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-blue-100/20 rounded-full animate-pulse opacity-50 scale-150"></div>
                   <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full shadow-lg flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-500 border-4 border-white/20 backdrop-blur-md z-10">
                      <FaFileMedical className="text-white text-2xl md:text-3xl drop-shadow-md" />
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-blue-600 rounded-full border-2 border-blue-100 flex items-center justify-center shadow-sm text-xs font-bold font-serif z-20">
                        Rx
                      </div>
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
                  <div className="bg-white text-gray-800 p-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-100 to-gray-50"></div>
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

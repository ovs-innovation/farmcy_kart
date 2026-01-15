import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { IoSearchOutline } from "react-icons/io5";
import useTranslation from "next-translate/useTranslation";
import LocationButton from "@components/location/LocationButton";
import SearchSuggestions from "@components/search/SearchSuggestions";

const HeroBanner = () => {
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");
  const searchInputRef = useRef(null);

  const handleSearchChange = (value) => {
    setSearchText(value);
    // Show suggestions when user types (even with 1 character)
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const trimmedSearchText = searchText.trim();
    
    // Close suggestions
    setShowSuggestions(false);
    searchInputRef.current?.blur();
    
    if (trimmedSearchText) {
      // Navigate to search page with query parameter
      // Use router.push with pathname and query object for proper navigation
      router.push(
        {
          pathname: "/search",
          query: { query: trimmedSearchText },
        },
        `/search?query=${encodeURIComponent(trimmedSearchText)}`,
        { shallow: false }
      ).then(() => {
        // Clear search text after successful navigation
        setSearchText("");
      }).catch((err) => {
        console.error("Navigation error:", err);
        // Fallback: use window.location if router.push fails
        window.location.href = `/search?query=${encodeURIComponent(trimmedSearchText)}`;
      });
    }
  };

  return (
    <div className="w-full relative overflow-hidden" style={{ height: '100vh', minHeight: '600px' }}>
        {/* Background Image - Full Screen */}
        <div className="absolute inset-0 pointer-events-none" 
             style={{ 
                 backgroundImage: 'url(/home/par.png)',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat'
             }}>
        </div>

        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Hero Text Section */}
        <div className="relative z-10 w-full flex flex-col items-center px-4 pt-8">
          <div className="text-center w-full  md:max-w-5xl mx-auto mb-8 px-2">
            <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
              Order medicines & healthcare essentials.Trusted pharmacy.Farmecy Kart it!
            </h1>
           
          </div>
        </div>

        {/* Search Box Section - Responsive */}
        <div className="relative z-10 w-full flex flex-col items-center px-3 sm:px-4 md:pt-4">
            <form onSubmit={handleSubmit} className="w-full max-w-4xl relative flex items-center bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg z-10 overflow-visible">
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
                          // Show suggestions on focus if there's any text
                          if (searchText.trim().length > 0) {
                            setShowSuggestions(true);
                          }
                        }}
                        onBlur={(e) => {
                          // Don't close if clicking on suggestions
                          const relatedTarget = e.relatedTarget;
                          const suggestionsContainer = document.querySelector('.search-suggestions-container');
                          
                          // Check if the blur is happening because of clicking on suggestions
                          if (!relatedTarget || (suggestionsContainer && !suggestionsContainer.contains(relatedTarget))) {
                            // Delay to allow suggestion click to register
                            setTimeout(() => {
                              // Double-check that suggestions container is not being interacted with
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
                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-store-600 transition-colors z-10"
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
        </div>
    </div>
  );
};

export default HeroBanner;

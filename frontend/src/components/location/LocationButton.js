import React, { useState, useEffect } from "react";
import { FiMapPin, FiLoader } from "react-icons/fi";
import Cookies from "js-cookie";
import { notifyError, notifySuccess } from "@utils/toast";
import { useGeolocated } from "react-geolocated";
import LocationServices from "@services/LocationServices";

const LocationButton = ({ className = "" }) => {
  const [location, setLocation] = useState(null);
  const [shouldGetLocation, setShouldGetLocation] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use react-geolocated hook for availability checks
  const {
    isGeolocationAvailable,
    isGeolocationEnabled,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
    userDecisionTimeout: 5000,
    watchPosition: false,
    isOptimisticGeolocationEnabled: false,
    suppressLocationOnMount: true,
    watchLocationPermissionChange: false,
  });

  // Set mounted flag to prevent SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load location from cookies on mount
  useEffect(() => {
    const savedLocation = Cookies.get("userLocation");
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
      } catch (error) {
        console.error("Error parsing saved location:", error);
      }
    }
  }, []);

  const handleGeocoding = async (lat, lng) => {
    try {
      const geocodeData = await LocationServices.getReverseGeocode({ lat, lng });
      
      if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {

        const result = geocodeData.results[0];
        const address = result.formatted_address || '';
        
        // Extract postal code from address components
        let pinCode = '';
        const postalCodeComponent = result.address_components?.find(
          component => component.types.includes('postal_code')
        );
        if (postalCodeComponent) {
          pinCode = postalCodeComponent.long_name || postalCodeComponent.short_name || '';
        }

        // Save location to cookies with address info
        const locationData = {
          lat,
          lng,
          address: address,
          pinCode: pinCode,
          timestamp: Date.now(),
        };

        setLocation(locationData);
        Cookies.set("userLocation", JSON.stringify(locationData), { expires: 30 });
        
        // Trigger custom event to update NavBarTop
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent('locationUpdated', { detail: locationData }));
        }
        
        notifySuccess(`Location set successfully! ${pinCode ? `PIN: ${pinCode}` : ''}`);
      } else {
        // API returned error or no results
        console.error("Google Maps Geocoding API error:", geocodeData.status, geocodeData.error_message);
        // Still save coordinates even if geocoding fails
        const locationData = {
          lat,
          lng,
          timestamp: Date.now(),
        };
        setLocation(locationData);
        Cookies.set("userLocation", JSON.stringify(locationData), { expires: 30 });
        
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent('locationUpdated', { detail: locationData }));
        }
        
        notifySuccess("Location set successfully!");
      }
    } catch (error) {
      console.error("Error getting location details:", error);
      // Still save coordinates even if geocoding fails
      const locationData = {
        lat,
        lng,
        timestamp: Date.now(),
      };
      setLocation(locationData);
      Cookies.set("userLocation", JSON.stringify(locationData), { expires: 30 });
      
      // Trigger custom event to update NavBarTop
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent('locationUpdated', { detail: locationData }));
      }
      
      notifySuccess("Location set successfully!");
    }
  };

  const getCurrentLocation = (e) => {
    // Prevent form submission if button is in a form
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Check if component is mounted and geolocation is available
    if (!mounted || typeof window === "undefined") return;
    
    if (isGeolocationAvailable === false) {
      notifyError("Geolocation is not supported by your browser");
      return;
    }

    // Trigger geolocation request
    setShouldGetLocation(true);
    
    // Use native geolocation API for manual trigger
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setShouldGetLocation(false);
          await handleGeocoding(lat, lng);
        },
        (error) => {
          setShouldGetLocation(false);
          let errorMessage = "Location access denied. Please allow location permission.";
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Location permission denied. Please allow location access in browser settings.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Location information unavailable.";
          } else if (error.code === error.TIMEOUT) {
            errorMessage = "Location request timeout. Please try again.";
          }
          notifyError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setShouldGetLocation(false);
      notifyError("Geolocation is not supported by your browser");
    }
  };

  const isLoading = shouldGetLocation;

  const getDisplayText = () => {
    if (isLoading) return "Getting location...";
    if (location) return "Location set";
    return "Set location";
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        getCurrentLocation(e);
      }}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-white border-r border-gray-200 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${className}`}
    >
      {isLoading ? (
        <FiLoader className="animate-spin text-green-600" size={18} />
      ) : (
        <FiMapPin className="text-green-600" size={18} />
      )}
      <span className="hidden md:inline">{getDisplayText()}</span>
    </button>
  );
};

// Export with dynamic import to prevent SSR issues
export default LocationButton;

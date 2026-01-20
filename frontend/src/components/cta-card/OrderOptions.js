import React, { useState } from "react";
import { FaPhoneVolume, FaFilePrescription } from "react-icons/fa";
import PrescriptionUploadModal from "@components/prescription/PrescriptionUploadModal";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getPalette } from "@utils/themeColors";

const OrderOptions = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { storeCustomizationSetting, globalSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  // Get theme colors
  const storeColor = storeCustomizationSetting?.theme?.color || "green";
  const palette = getPalette(storeColor);

  // Get contact number from settings with fallbacks
  const contactNumber = 
    storeCustomizationSetting?.navbar?.phone || 
    showingTranslateValue(storeCustomizationSetting?.contact_us?.call_box_phone) ||
    globalSetting?.contact ||
    "09240250346"; // Fallback to default

  return (
    <>
      <div className="w-full max-w-3xl mx-auto mt-6">
        <div className="flex items-center justify-center mb-6">
          <div className="h-px bg-gray-300 w-16 md:w-24"></div>
          <span className="px-4 text-gray-500 text-xs md:text-sm font-semibold tracking-wider uppercase">
            PLACE YOUR ORDER VIA
          </span>
          <div className="h-px bg-gray-300 w-16 md:w-24"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <a
            href={`tel:${contactNumber.replace(/\s+/g, '')}`}
            className="flex items-center p-3 md:p-4 rounded-xl transition-all cursor-pointer group border overflow-hidden relative shadow-sm hover:shadow-md bg-white border-green-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative mr-4">
              <div className="absolute inset-0 bg-green-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-3.5 rounded-full shadow-lg group-hover:shadow-green-300/50 transition-all duration-300 group-hover:-translate-y-1">
                <FaPhoneVolume className="text-white text-xl" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-green-700 font-semibold tracking-wide uppercase mb-0.5">Order via Call</span>
              <span className="text-gray-900 font-bold text-lg leading-tight group-hover:text-green-700 transition-colors">
                 {contactNumber}
              </span>
            </div>
          </a>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center p-3 md:p-4 rounded-xl transition-all cursor-pointer group w-full text-left border overflow-hidden relative shadow-sm hover:shadow-md bg-white border-blue-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative mr-4">
               <div className="absolute inset-0 bg-blue-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 p-3.5 rounded-full shadow-lg group-hover:shadow-blue-300/50 transition-all duration-300 group-hover:-translate-y-1">
                  <FaFilePrescription className="text-white text-xl" />
               </div>
            </div>
            <div className="relative flex flex-col">
               <span className="text-xs text-blue-700 font-semibold tracking-wide uppercase mb-0.5">Quick Upload</span>
               <span className="text-gray-900 font-bold text-lg leading-tight group-hover:text-blue-700 transition-colors">
                 Upload Prescription
               </span>
            </div>
          </button>
        </div>
      </div>

      <PrescriptionUploadModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

export default OrderOptions;

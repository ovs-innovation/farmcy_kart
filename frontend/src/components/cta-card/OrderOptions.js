import React from "react";
import { IoCallOutline, IoDocumentTextOutline } from "react-icons/io5";

const OrderOptions = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
        <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-gray-300 w-16 md:w-24"></div>
            <span className="px-4 text-gray-500 text-xs md:text-sm font-semibold tracking-wider uppercase">PLACE YOUR ORDER VIA</span>
            <div className="h-px bg-gray-300 w-16 md:w-24"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <a href="tel:09240250346" className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer group">
                <div className="bg-white p-3 rounded-lg shadow-sm text-blue-600 group-hover:text-blue-700">
                    <IoCallOutline className="text-2xl" />
                </div>
                <span className="ml-4 text-gray-700 font-medium">Call <span className="font-bold text-gray-900">09240250346</span> to place order</span>
            </a>

            <button className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer group w-full text-left">
                <div className="bg-white p-3 rounded-lg shadow-sm text-blue-600 group-hover:text-blue-700">
                    <IoDocumentTextOutline className="text-2xl" />
                </div>
                <span className="ml-4 text-gray-700 font-medium">Upload a <span className="font-bold text-gray-900">prescription</span></span>
            </button>
        </div>
    </div>
  );
};

export default OrderOptions;

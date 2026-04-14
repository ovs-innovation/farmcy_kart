import React, { useState } from "react";
import { Button, Select, Input } from "@windmill/react-ui";
import { FiShare } from "react-icons/fi";
import { notifySuccess, notifyError } from "@/utils/toast";
import ProductServices from "@/services/ProductServices";

const ProductBulkExport = () => {
  const [selectedType, setSelectedType] = useState("All data");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");

  const handleClear = () => {
    setSelectedType("All data");
    setStartDate("");
    setEndDate("");
    setStartId("");
    setEndId("");
    notifySuccess("Form cleared successfully");
  };

  const handleExport = async () => {
    try {
      if (!selectedType) {
        notifyError("Please select a data type");
        return;
      }

      if (selectedType === "By Date" && (!startDate || !endDate)) {
        notifyError("Please select both from and to date");
        return;
      }

      if (selectedType === "By ID" && (!startId || !endId)) {
        notifyError("Please select both start and end ID");
        return;
      }

      const res = await ProductServices.exportProductsCSV({
        type: selectedType,
        startDate,
        endDate,
        startId,
        endId,
      });

      if (res && res.length > 0) {
        const headers = Object.keys(res[0]);
        const csvContent = [
          headers.join(","),
          ...res.map((row) =>
            headers
              .map((header) => {
                const cell = row[header] === null || row[header] === undefined ? "" : row[header];
                return `"${String(cell).replace(/"/g, '""')}"`;
              })
              .join(",")
          ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `products_export_${new Date().getTime()}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        notifySuccess(`Exported ${res.length} items successfully`);
      } else {
        notifyError("No data found to export");
      }
    } catch (err) {
      notifyError(err.response?.data?.message || err.message || "Export failed");
    }
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-10 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <svg className="w-5 h-5 mr-3 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
             <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
             <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <h1 className="text-xl font-bold text-gray-800">Items Bulk Export</h1>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 mb-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 xl:w-2/3">
            {/* Step 1 */}
            <div className="border border-gray-100 rounded-lg p-5 relative bg-[#ffffff] shadow-sm flex flex-col justify-between">
              <div>
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <h3 className="text-[16px] font-bold text-gray-800">Step 1</h3>
                     <p className="text-[13px] text-gray-500 mt-1">Select Data Type</p>
                   </div>
                   {/* Dummy Icon representing List + Hand */}
                   <div className="w-12 h-12 bg-[#e0f2fe] text-[#0284c7] rounded-md flex items-center justify-center opacity-80">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                   </div>
                 </div>
                 <h4 className="text-[13px] font-bold text-gray-800 mb-2 mt-2">Instruction</h4>
                 <ul className="text-[13px] text-gray-500 space-y-1 pl-4 list-disc marker:text-gray-400">
                   <li className="leading-relaxed">Select data type in which order you want your data sorted while downloading.</li>
                 </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="border border-gray-100 rounded-lg p-5 relative bg-[#ffffff] shadow-sm flex flex-col justify-between">
              <div>
                 <div className="flex justify-between items-start mb-4">
                   <div className="max-w-[80%]">
                     <h3 className="text-[16px] font-bold text-gray-800">Step 2</h3>
                     <p className="text-[13px] text-gray-500 mt-1">Select Data Range by Date or ID and Export</p>
                   </div>
                   {/* Dummy Icon representing Calendar */}
                   <div className="w-12 h-12 bg-[#fffbeb] text-[#d97706] rounded-md flex items-center justify-center opacity-80">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                   </div>
                 </div>
                 <h4 className="text-[13px] font-bold text-gray-800 mb-2 mt-2">Instruction</h4>
                 <ul className="text-[13px] text-gray-500 space-y-1.5 pl-4 list-disc marker:text-gray-400">
                   <li className="leading-relaxed">The file will be downloaded in .xls format</li>
                   <li className="leading-relaxed">Click reset if you want to clear you changes and want to download in default sort wise data</li>
                 </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 items-end">
            <div className="w-full">
               <label className="block text-[13px] font-bold text-gray-700 mb-2">Type</label>
               <Select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border-gray-200 text-gray-600 h-10 shadow-sm focus:border-[#008f89] focus:ring focus:ring-[#008f89] focus:ring-opacity-20 text-[13px]"
               >
                  <option value="All data">All data</option>
                  <option value="By Date">Date wise</option>
                  <option value="By ID">Id wise</option>
               </Select>
            </div>

            {selectedType === "By Date" && (
              <>
                <div className="w-full">
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">From date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border-gray-200 text-gray-600 h-10 shadow-sm focus:border-[#008f89] focus:ring focus:ring-[#008f89] focus:ring-opacity-20 text-[13px]"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">To Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border-gray-200 text-gray-600 h-10 shadow-sm focus:border-[#008f89] focus:ring focus:ring-[#008f89] focus:ring-opacity-20 text-[13px]"
                  />
                </div>
              </>
            )}

            {selectedType === "By ID" && (
              <>
                <div className="w-full">
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">Start id</label>
                  <Input
                    type="text"
                    placeholder="Enter start ID"
                    value={startId}
                    onChange={(e) => setStartId(e.target.value)}
                    className="w-full border-gray-200 text-gray-600 h-10 shadow-sm focus:border-[#008f89] focus:ring focus:ring-[#008f89] focus:ring-opacity-20 text-[13px]"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">End id</label>
                  <Input
                    type="text"
                    placeholder="Enter end ID"
                    value={endId}
                    onChange={(e) => setEndId(e.target.value)}
                    className="w-full border-gray-200 text-gray-600 h-10 shadow-sm focus:border-[#008f89] focus:ring focus:ring-[#008f89] focus:ring-opacity-20 text-[13px]"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end mt-12 gap-3">
            <Button onClick={handleClear} className="bg-[#e2e8f0] text-[#334155] hover:bg-[#cbd5e1] px-8 text-sm font-semibold h-11 transition-colors border-none shadow-none">
               Clear
            </Button>
            <Button onClick={handleExport} className="bg-[#008f89] text-white hover:bg-[#00706b] px-8 text-sm font-semibold h-11 shadow-sm transition-colors border-[#008f89]">
               Export
            </Button>
          </div>

        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed top-[40%] right-0 transform -translate-y-1/2 z-50">
         <button className="bg-[#1a365d] text-white p-2.5 rounded-l-md shadow-lg flex items-center justify-center hover:bg-[#2a4365] transition-colors">
            <FiShare className="w-5 h-5 transform -scale-x-100" />
         </button>
      </div>

    </div>
  );
};

export default ProductBulkExport;

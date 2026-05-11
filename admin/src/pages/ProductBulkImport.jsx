import React, { useState, useRef } from "react";
import { Button, Select, Textarea, Card, CardBody } from "@windmill/react-ui";
import { FiDownload, FiInfo, FiX, FiCheckCircle, FiUploadCloud } from "react-icons/fi";
import { HiOutlineDocumentDownload, HiOutlineClipboardList, HiOutlineCloudUpload } from "react-icons/hi";
import { notifySuccess, notifyError } from "@/utils/toast"; 
import AnimatedContent from "@/components/common/AnimatedContent"; 

const ProductBulkImport = () => {
  const [uploadType, setUploadType] = useState("new"); 
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [generatedVariant, setGeneratedVariant] = useState("");
  const [generatedChoice, setGeneratedChoice] = useState("");
  const [generatedField, setGeneratedField] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        file.type === "application/vnd.ms-excel" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setSelectedFile(file);
        notifySuccess("File selected successfully!");
      } else {
        notifyError("Please upload a valid Excel file (.xls, .xlsx)");
        setSelectedFile(null);
      }
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current.click();
  };

  const handleResetUpload = () => {
    setSelectedFile(null);
    setUploadType("new");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    notifySuccess("Form reset successfully");
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      notifyError("Please select a file to import!");
      return;
    }
    notifySuccess(`Uploading ${selectedFile.name} as ${uploadType === 'new' ? 'New Data' : 'Update Data'}...`);
  };

  const handleDownloadTemplate = (type) => {
    notifySuccess(`Downloading Template (${type})...`);
  };

  const handleGenerateVariation = () => {
    if (!selectedAttribute) {
       notifyError("Select an attribute first!");
       return;
    }
    setGeneratedVariant('["Black","White"]');
    setGeneratedChoice('["Color"]');
    setGeneratedField('[{"color":"Black"},{"color":"White"}]');
    notifySuccess("Variations generated successfully");
  };

  const handleResetVariation = () => {
     setSelectedAttribute("");
     setGeneratedVariant("");
     setGeneratedChoice("");
     setGeneratedField("");
     notifySuccess("Variations reset successfully");
  };

  return (
    <AnimatedContent>
      <div className="bg-[#f8fafc] dark:bg-gray-900 min-h-screen pb-12 pt-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#008f89] p-2.5 rounded-xl shadow-lg shadow-teal-500/20">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                 <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-[#1e293b] dark:text-gray-200 tracking-tight">Items Bulk Import</h1>
          </div>

          {/* Steps Section Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Step 1 */}
            <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 overflow-hidden">
              <CardBody className="p-7">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#008f89] uppercase tracking-widest bg-teal-50 px-2 py-1 rounded">Step 01</span>
                    <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-gray-200 mt-2">Download Template</h3>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-2xl text-[#008f89]">
                    <HiOutlineDocumentDownload className="w-7 h-7" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Instruction
                  </h4>
                  <ul className="text-[12.5px] text-[#475569] dark:text-gray-400 space-y-2 leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-teal-400 font-bold">•</span>
                      Download the Excel format file and fill it with proper product data.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal-400 font-bold">•</span>
                      Use the example file to understand the required data formats.
                    </li>
                  </ul>
                </div>
              </CardBody>
            </Card>

            {/* Step 2 */}
            <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 overflow-hidden">
              <CardBody className="p-7">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#008f89] uppercase tracking-widest bg-teal-50 px-2 py-1 rounded">Step 02</span>
                    <h3 className="text-[15px] font-bold text-[#1e293b] mt-2">Data Matching</h3>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-2xl text-[#008f89]">
                    <HiOutlineClipboardList className="w-7 h-7" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Instruction
                  </h4>
                  <ul className="text-[12.5px] text-[#475569] dark:text-gray-400 space-y-2 leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-teal-400 font-bold">•</span>
                      Fill up category IDs, brand IDs, and unit IDs correctly from lists.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal-400 font-bold">•</span>
                      For variations, use the generator below and paste values into spreadsheet.
                    </li>
                  </ul>
                </div>
              </CardBody>
            </Card>

            {/* Step 3 */}
            <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 overflow-hidden">
              <CardBody className="p-7">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#008f89] uppercase tracking-widest bg-teal-50 px-2 py-1 rounded">Step 03</span>
                    <h3 className="text-[15px] font-bold text-[#1e293b] mt-2">Upload & Import</h3>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-2xl text-[#008f89]">
                    <HiOutlineCloudUpload className="w-7 h-7" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[11px] font-extrabold text-[#64748b] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Instruction
                  </h4>
                  <ul className="text-[12.5px] text-[#475569] dark:text-gray-400 space-y-2 leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-teal-400 font-bold">•</span>
                      Choose upload type (New vs Update) and select your .xls/.xlsx file.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal-400 font-bold">•</span>
                      Verify data matches template columns to avoid import errors.
                    </li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Download Template Section */}
          <Card className="rounded-2xl border-none shadow-sm bg-white dark:bg-gray-800 mb-8 overflow-hidden">
            <CardBody className="p-10 flex flex-col items-center">
               <h2 className="text-[12px] font-extrabold text-[#64748b] mb-8 uppercase tracking-[0.2em]">Download spreadsheet template</h2>
               <div className="flex flex-wrap gap-5 justify-center">
                 <Button 
                   onClick={() => handleDownloadTemplate("With Data")} 
                   layout="outline" 
                   className="h-12 px-10 border-teal-100 bg-teal-50/10 text-[#008f89] font-bold rounded-xl hover:bg-teal-50 hover:border-teal-200 transition-all text-xs tracking-wider border-2"
                 >
                   Template With Current Data
                 </Button>
                 <Button 
                   onClick={() => handleDownloadTemplate("Empty")} 
                   className="h-12 px-10 bg-[#008f89] hover:bg-[#00706b] text-white font-bold rounded-xl transition-all border-none text-xs tracking-wider shadow-lg shadow-teal-700/20 active:scale-95"
                 >
                   Template Without Any Data
                 </Button>
               </div>
            </CardBody>
          </Card>

          {/* Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
            
            {/* Upload Type Selection */}
            <div className="lg:col-span-12 xl:col-span-5 h-full">
              <Card className="rounded-2xl border-none shadow-sm bg-white dark:bg-gray-800 h-full overflow-hidden">
                <CardBody className="p-8">
                  <h3 className="text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-widest mb-8">Select Data Upload Type</h3>
                  <div className="space-y-4">
                    <label 
                      className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border-2 ${uploadType === 'new' ? 'border-teal-100 dark:border-teal-900/50 bg-teal-50/20 dark:bg-teal-900/10' : 'border-slate-50 dark:border-gray-700 hover:border-slate-100 dark:hover:border-gray-600 hover:bg-slate-50/30 dark:hover:bg-gray-700/50'}`}
                      onClick={() => setUploadType('new')}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${uploadType === 'new' ? 'bg-teal-100 text-[#008f89]' : 'bg-slate-100 text-slate-400'}`}>
                           <FiUploadCloud className="w-5 h-5" />
                        </div>
                         <span className={`text-[14px] font-bold ${uploadType === 'new' ? 'text-[#1e293b] dark:text-gray-200' : 'text-[#64748b] dark:text-gray-400'}`}>Upload New Data</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${uploadType === 'new' ? 'border-[#008f89] bg-[#008f89]' : 'border-slate-200'}`}>
                        {uploadType === 'new' && <div className="w-2.5 h-2.5 rounded-full bg-white animate-scale-in"></div>}
                      </div>
                    </label>
                    
                    <label 
                      className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border-2 ${uploadType === 'update' ? 'border-teal-100 dark:border-teal-900/50 bg-teal-50/20 dark:bg-teal-900/10' : 'border-slate-50 dark:border-gray-700 hover:border-slate-100 dark:hover:border-gray-600 hover:bg-slate-50/30 dark:hover:bg-gray-700/50'}`}
                      onClick={() => setUploadType('update')}
                    >
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${uploadType === 'update' ? 'bg-teal-100 text-[#008f89]' : 'bg-slate-100 text-slate-400'}`}>
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                         </div>
                         <span className={`text-[14px] font-bold ${uploadType === 'update' ? 'text-[#1e293b] dark:text-gray-200' : 'text-[#64748b] dark:text-gray-400'}`}>Update Existing Data</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${uploadType === 'update' ? 'border-[#008f89] bg-[#008f89]' : 'border-slate-200'}`}>
                        {uploadType === 'update' && <div className="w-2.5 h-2.5 rounded-full bg-white animate-scale-in"></div>}
                      </div>
                    </label>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Dropzone */}
            <div className="lg:col-span-12 xl:col-span-7 h-full">
              <Card className="rounded-2xl border-none shadow-sm bg-white dark:bg-gray-800 h-full overflow-hidden">
                <CardBody className="p-8 flex flex-col">
                  <h3 className="text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-widest mb-8">Import Items File</h3>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileChange}
                  />

                    <div 
                    onClick={handleDropzoneClick}
                    className={`flex-1 min-h-[160px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer relative group
                      ${selectedFile ? 'border-teal-200 dark:border-teal-800 bg-teal-50/20 dark:bg-teal-900/10' : 'border-slate-100 dark:border-gray-700 bg-slate-50/20 dark:bg-gray-700/20 hover:bg-teal-50/10 dark:hover:bg-teal-900/5 hover:border-teal-200'}`}
                  >
                    {!selectedFile ? (
                       <>
                         <div className="p-5 bg-white dark:bg-gray-700 rounded-2xl shadow-sm mb-5 text-[#008f89] group-hover:scale-110 transition-transform duration-300">
                            <FiUploadCloud className="w-10 h-10" />
                         </div>
                          <p className="text-[14px] font-bold text-[#475569] dark:text-gray-300 mb-1">Click or drag file to upload</p>
                         <p className="text-[11px] text-[#94a3b8] font-bold uppercase tracking-wider">Excel Template (.xls, .xlsx)</p>
                       </>
                    ) : (
                       <div className="flex flex-col items-center animate-scale-in">
                         <div className="bg-teal-100 p-4 rounded-full mb-4 text-[#008f89]">
                            <FiCheckCircle className="w-10 h-10 animate-pulse" />
                         </div>
                          <p className="text-[15px] font-extrabold text-[#1e293b] dark:text-gray-200 truncate max-w-[300px] mb-1">{selectedFile.name}</p>
                         <p className="text-[10px] text-[#008f89] font-extrabold uppercase tracking-[0.2em] bg-teal-50 px-3 py-1 rounded-full">Ready for Import</p>
                         <p className="text-[9px] text-[#94a3b8] mt-4 font-bold uppercase tracking-widest group-hover:text-[#008f89] transition-colors">Click to change file</p>
                       </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-5 mb-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-50 dark:border-gray-700">
            <Button 
              onClick={handleResetUpload} 
              className="h-12 px-12 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-500 dark:text-gray-300 rounded-xl font-extrabold text-[11px] uppercase tracking-widest transition-all border-none"
            >
              Reset
            </Button>
            <Button 
              onClick={handleUploadSubmit} 
              className="h-12 px-16 bg-[#008f89] hover:bg-[#00706b] text-white rounded-xl font-extrabold text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-teal-700/20 border-none active:scale-95"
            >
              Start Upload
            </Button>
          </div>

          {/* Generate Variation Section */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-slate-100 dark:border-gray-700 p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-8 relative">
                <div className="w-1.5 h-8 bg-[#008f89] rounded-full"></div>
                <h3 className="text-xl font-extrabold text-[#1e293b] dark:text-gray-200 tracking-tight">Generate Variation Values</h3>
            </div>
            
            {isAlertVisible && (
               <div className="bg-[#f0f9ff] dark:bg-sky-900/20 border border-[#bae6fd] dark:border-sky-800 text-[#0ea5e9] p-6 rounded-2xl flex items-start text-[13px] mb-8 relative transition-all group overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 bg-[#0ea5e9] h-full"></div>
                 <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm mr-4 text-[#0ea5e9]">
                    <FiInfo className="w-5 h-5" />
                 </div>
                 <div className="flex-grow">
                    <p className="font-extrabold text-[#0369a1] dark:text-sky-400 mb-1 uppercase tracking-wider text-[11px]">Pro Tip!</p>
                    <p className="leading-relaxed text-[#0c4a6e] dark:text-sky-300 font-medium text-justify pr-10">
                      Generate variation data here before adding it to your Excel sheet. Copy the generated values from the specific fields and paste them exactly into the corresponding columns. For empty variations, ensure you use <strong>[ ]</strong> to avoid import errors.
                    </p>
                 </div>
                 <button onClick={() => setIsAlertVisible(false)} className="absolute top-4 right-4 text-[#0ea5e9] hover:bg-white hover:shadow-sm p-1 rounded-lg transition-all">
                    {/* <FiX className="w-5 h-5" /> */}
                 </button>
               </div>
            )}

            <div className="flex flex-col lg:flex-row items-end gap-6 mb-10">
              <div className="flex-grow w-full">
                <label className="block text-[11px] font-extrabold text-[#64748b] mb-3 uppercase tracking-widest ml-1">1. Select Attribute</label>
                <Select 
                   value={selectedAttribute} 
                   onChange={(e) => setSelectedAttribute(e.target.value)} 
                   className="w-full border-slate-200 dark:border-gray-600 bg-slate-50/30 dark:bg-gray-700 text-[#1e293b] dark:text-gray-200 h-12 rounded-xl px-4 shadow-sm focus:border-[#008f89] focus:ring focus:ring-teal-100 transition-all font-bold text-[13px]"
                >
                  <option value="" className="dark:bg-gray-800">Choose an attribute...</option>
                  <option value="color" className="dark:bg-gray-800">Color</option>
                  <option value="size" className="dark:bg-gray-800">Size</option>
                  <option value="weight" className="dark:bg-gray-800">Weight</option>
                </Select>
              </div>
              <Button 
                onClick={handleGenerateVariation} 
                className="w-full lg:w-auto h-12 px-12 bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold rounded-xl transition-all border-none text-[11px] uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95"
              >
                Generate Values
              </Button>
            </div>

            <label className="block text-[11px] font-extrabold text-[#64748b] mb-4 uppercase tracking-widest ml-1">2. Copy Generated Output</label>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
               <div className="space-y-3">
                 <label className="text-[12px] font-bold text-[#475569] dark:text-gray-300 flex items-center justify-between px-1">
                   <span>Variant Label</span>
                   <span className="text-rose-500 font-extrabold dark:text-rose-400">*</span>
                 </label>
                 <Textarea 
                   value={generatedVariant}
                   readOnly 
                   placeholder='Example: ["Black", "White"]'
                   className="w-full border-slate-200 dark:border-gray-600 bg-slate-50/50 dark:bg-gray-900 min-h-[110px] p-4 rounded-2xl text-[#1e293b] dark:text-gray-200 font-mono text-[12px] focus:ring-0 cursor-text shadow-inner transition-all hover:bg-slate-50 dark:hover:bg-gray-700" 
                 />
                 <p className="text-[10px] text-slate-400 font-medium px-1 italic">Paste this into "variant" column</p>
               </div>
               <div className="space-y-3">
                 <label className="text-[12px] font-bold text-[#475569] dark:text-gray-300 flex items-center justify-between px-1">
                    <span>Choice Options</span>
                    <span className="text-rose-500 font-extrabold">*</span>
                 </label>
                 <Textarea 
                   value={generatedChoice}
                   readOnly 
                   placeholder='Example: ["Color"]'
                   className="w-full border-slate-200 dark:border-gray-600 bg-slate-50/50 dark:bg-gray-900 min-h-[110px] p-4 rounded-2xl text-[#1e293b] dark:text-gray-200 font-mono text-[12px] focus:ring-0 cursor-text shadow-inner transition-all hover:bg-slate-50 dark:hover:bg-gray-700" 
                 />
                 <p className="text-[10px] text-slate-400 font-medium px-1 italic">Paste this into "choice" column</p>
               </div>
               <div className="space-y-3">
                 <label className="text-[12px] font-bold text-[#475569] dark:text-gray-300 flex items-center justify-between px-1">
                    <span>Attributes Field</span>
                    <span className="text-rose-500 font-extrabold">*</span>
                 </label>
                 <Textarea 
                   value={generatedField}
                   readOnly 
                   placeholder='Example: [{"color":"Black"},{"color":"White"}]'
                   className="w-full border-slate-200 dark:border-gray-600 bg-slate-50/50 dark:bg-gray-900 min-h-[110px] p-4 rounded-2xl text-[#1e293b] dark:text-gray-200 font-mono text-[12px] focus:ring-0 cursor-text shadow-inner transition-all hover:bg-slate-50 dark:hover:bg-gray-700" 
                 />
                 <p className="text-[10px] text-slate-400 font-medium px-1 italic">Paste this into "attribute" column</p>
               </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-50 dark:border-gray-700">
               <Button 
                onClick={handleResetVariation} 
                className="h-10 px-10 bg-slate-100 dark:bg-gray-700 hover:bg-rose-50 hover:text-rose-600 text-slate-500 dark:text-gray-300 rounded-xl font-extrabold text-[10px] uppercase tracking-widest transition-all border-none"
               >
                 Clear Output
               </Button>
            </div>

          </div>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default ProductBulkImport;

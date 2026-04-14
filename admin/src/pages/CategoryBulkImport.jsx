import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Select,
} from "@windmill/react-ui";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiGrid, FiUploadCloud, FiDownload, FiCheckCircle, FiInfo } from "react-icons/fi";

// internal import
import PageTitle from "@/components/Typography/PageTitle";
import AnimatedContent from "@/components/common/AnimatedContent";
import { notifySuccess, notifyError } from "@/utils/toast";

const CategoryBulkImport = () => {
  const { t } = useTranslation();
  const [activeUploadType, setActiveUploadType] = useState("new");
  const [file, setFile] = useState(null);

  const handleReset = () => {
    setFile(null);
    setActiveUploadType("new");
  };

  const handleUpload = () => {
    if (!file) return notifyError("Please select an Excel file to upload!");
    notifySuccess("File uploaded successfully! Processing...");
  };

  return (
    <>
      <AnimatedContent>
        <div className="flex items-center gap-2 mb-6 mt-2">
            <FiGrid className="text-orange-400 text-xl" />
            <h1 className="text-lg font-bold text-gray-800">Category Bulk Import</h1>
        </div>

        {/* Step Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Step 1 */}
          <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
            <CardBody className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Step 1</h3>
                  <p className="text-xs text-gray-400 font-semibold mb-6">Download Excel File</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15,18L12,21L9,18H11V14H13V18H15M13,9V3.5L18.5,9H13Z" /></svg>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-extrabold uppercase text-gray-600 tracking-wider flex items-center gap-2">
                    Instruction
                </h4>
                <ul className="text-[13px] text-gray-500 space-y-2 font-medium">
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-1">•</span>
                    Download the format file and fill it with proper data.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-1">•</span>
                    You can download the example file to understand how the data must be filled.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-1">•</span>
                    Have to upload excel file.
                  </li>
                </ul>
              </div>
            </CardBody>
          </Card>

          {/* Step 2 */}
          <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
            <CardBody className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-800">Step 2</h3>
                  <p className="text-xs text-gray-400 font-semibold mb-6">Match Spread sheet data according to instruction</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                   <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12,18H6V14H12M21,14H12V12H21M12,10H6V6H12M21,6H12V4H21M15,8V10H18V12L22,9L18,6V8H15Z" /></svg>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-extrabold uppercase text-gray-600 tracking-wider flex items-center gap-2">
                    Instruction
                </h4>
                <ul className="text-[13px] text-gray-500 space-y-2 font-medium">
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-1">•</span>
                    Fill up the data according to the format
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-1">•</span>
                    For parent category position will 0 and for sub category it will be 1
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-1">•</span>
                    By default status will be 1, please input the right ids
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-1">•</span>
                    For a category parent id will be empty, for sub category it will be the category id
                  </li>
                </ul>
              </div>
            </CardBody>
          </Card>

          {/* Step 3 */}
          <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
            <CardBody className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-base font-bold text-gray-800">Step 3</h3>
                   <p className="text-xs text-gray-400 font-semibold mb-6">Validate data and complete import</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                   <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15,18L12,21L9,18H11V14H13V18H15M13,9V3.5L18.5,9H13Z" /></svg>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-extrabold uppercase text-gray-600 tracking-wider flex items-center gap-2">
                    Instruction
                </h4>
                <ul className="text-[13px] text-gray-500 space-y-2 font-medium">
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-1">•</span>
                    In the Excel file upload section first select the upload option.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-1">•</span>
                    Upload your file in .xls .xlsx format.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-300 mt-1">•</span>
                    Finally click the upload button.
                  </li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Template Section */}
        <Card className="rounded-2xl border-none shadow-sm bg-white mb-8 overflow-hidden">
          <CardBody className="p-10 flex flex-col items-center">
             <h2 className="text-sm font-bold text-gray-700 mb-8 uppercase tracking-widest">Download spreadsheet template</h2>
             <div className="flex flex-wrap gap-4 justify-center">
                <Button layout="outline" className="h-12 px-8 border-teal-100 bg-teal-50/10 text-teal-800 font-extrabold rounded-xl hover:bg-teal-50 hover:border-teal-200 transition-all text-xs tracking-wider">
                    Template With Existing Data
                </Button>
                <Button className="h-12 px-8 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl transition-all border-none text-xs tracking-wider shadow-lg shadow-teal-700/20">
                    Template Without Data
                </Button>
             </div>
          </CardBody>
        </Card>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12">
            {/* Left Box: Upload Type */}
            <div className="lg:col-span-5 h-full">
                <Card className="rounded-2xl border-none shadow-sm bg-white h-full overflow-hidden">
                    <CardBody className="p-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Select Data Upload Type</h3>
                        <div className="space-y-4">
                            <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border-2 ${activeUploadType === "new" ? "border-teal-100 bg-teal-50/30" : "border-gray-50 hover:border-gray-100"}`} onClick={() => setActiveUploadType("new")}>
                                <span className={`text-sm font-bold ${activeUploadType === "new" ? "text-teal-800" : "text-gray-500"}`}>Upload New Data</span>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${activeUploadType === "new" ? "border-teal-600 bg-teal-600" : "border-gray-200"}`}>
                                    {activeUploadType === "new" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                </div>
                            </label>

                            <label className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border-2 ${activeUploadType === "update" ? "border-teal-100 bg-teal-50/30" : "border-gray-50 hover:border-gray-100"}`} onClick={() => setActiveUploadType("update")}>
                                <span className={`text-sm font-bold ${activeUploadType === "update" ? "text-teal-800" : "text-gray-500"}`}>Update Existing Data</span>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${activeUploadType === "update" ? "border-teal-600 bg-teal-600" : "border-gray-200"}`}>
                                    {activeUploadType === "update" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                </div>
                            </label>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Right Box: Dropzone */}
            <div className="lg:col-span-7 h-full">
                <Card className="rounded-2xl border-none shadow-sm bg-white h-full overflow-hidden">
                    <CardBody className="p-8 flex flex-col">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Import Category File</h3>
                        <div className="flex-1 min-h-[140px] border-2 border-dashed border-teal-100 rounded-2xl flex flex-col items-center justify-center bg-gray-50/30 hover:bg-teal-50/20 hover:border-teal-300 transition-all cursor-pointer relative group">
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={(e) => setFile(e.target.files[0])}
                                accept=".xls,.xlsx"
                            />
                            {file ? (
                                <div className="flex flex-col items-center">
                                    <FiCheckCircle className="text-teal-600 text-4xl mb-3 animate-bounce" />
                                    <span className="text-sm font-bold text-teal-800">{file.name}</span>
                                    <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Click to change file</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-center px-4">
                                    <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 text-teal-600 group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13,5V9H17L13,5M13,3.5L18.5,9H13V3.5ZM9,14V17H11V14H13V17H15V14H17V19H7V14H9Z" /></svg>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Must be Excel files using our Excel template above</p>
                                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">( .xls , .xlsx )</p>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>

        {/* Final Actions */}
        <div className="flex justify-end gap-5 mt-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-50">
            <Button 
                onClick={handleReset} 
                className="h-12 px-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all border-none"
            >
                Reset
            </Button>
            <Button 
                onClick={handleUpload}
                className="h-12 px-14 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all shadow-xl shadow-teal-700/20 border-none active:scale-95"
            >
                Upload
            </Button>
        </div>
      </AnimatedContent>
    </>
  );
};

export default CategoryBulkImport;

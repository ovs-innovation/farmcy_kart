import {
  Button,
  Card,
  CardBody,
  Select,
} from "@windmill/react-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiGrid, FiList, FiCalendar } from "react-icons/fi";

// internal import
import AnimatedContent from "@/components/common/AnimatedContent";
import { notifySuccess } from "@/utils/toast";

const CategoryBulkExport = () => {
  const { t } = useTranslation();
  const [exportType, setExportType] = useState("All data");

  const handleReset = () => {
    setExportType("All data");
  };

  const handleExport = () => {
    notifySuccess("Exporting categories... File will download shortly.");
  };

  return (
    <>
      <AnimatedContent>
        <div className="flex items-center gap-2 mb-6 mt-2">
            <FiGrid className="text-orange-400 text-xl" />
            <h1 className="text-lg font-bold text-gray-800">Export Categories</h1>
        </div>

        <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden p-10">
          <CardBody className="p-0">
            {/* Step Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Step 1 */}
              <Card className="rounded-2xl border border-gray-50 shadow-none bg-white overflow-hidden h-full">
                <CardBody className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-base font-bold text-gray-800">Step 1</h3>
                      <p className="text-xs text-gray-400 font-semibold mt-1">Select Data Type</p>
                    </div>
                    <div className="p-3 bg-blue-50/50 rounded-xl">
                      <FiList className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-extrabold uppercase text-gray-600 tracking-wider">
                        Instruction
                    </h4>
                    <ul className="text-[13px] text-gray-500 space-y-2 font-medium">
                      <li className="flex gap-2">
                        <span className="text-gray-300 mt-1">•</span>
                        Select data type in which order you want your data sorted while downloading.
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>

              {/* Step 2 */}
              <Card className="rounded-2xl border border-gray-50 shadow-none bg-white overflow-hidden h-full">
                <CardBody className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-base font-bold text-gray-800">Step 2</h3>
                      <p className="text-xs text-gray-400 font-semibold mt-1 text-wrap">Select Data Range by Date or ID and Export</p>
                    </div>
                    <div className="p-3 bg-orange-50/50 rounded-xl">
                       <FiCalendar className="w-8 h-8 text-orange-400" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-extrabold uppercase text-gray-600 tracking-wider">
                        Instruction
                    </h4>
                    <ul className="text-[13px] text-gray-500 space-y-2 font-medium">
                      <li className="flex gap-2">
                        <span className="text-gray-300 mt-1">•</span>
                        The file will be downloaded in .xls format
                      </li>
                      <li className="flex gap-2">
                        <span className="text-gray-300 mt-1">•</span>
                        Click reset if you want to clear you changes and want to download in default sort wise data
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Type Dropdown Section */}
            <div className="mb-12 max-w-sm">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Type</label>
                <Select 
                    className="h-12 border-gray-100 bg-gray-50/30 rounded-xl focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm px-4 cursor-pointer"
                    value={exportType}
                    onChange={(e) => setExportType(e.target.value)}
                >
                    <option value="All data">All data</option>
                    <option value="By Date Range">By Date Range</option>
                    <option value="By ID Range">By ID Range</option>
                </Select>
            </div>

            {/* Final Actions */}
            <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-50">
                <Button 
                    onClick={handleReset} 
                    className="h-12 px-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all border-none"
                >
                    Clear
                </Button>
                <Button 
                    onClick={handleExport}
                    className="h-12 px-14 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all shadow-xl shadow-teal-700/20 border-none active:scale-95"
                >
                    Export
                </Button>
            </div>
          </CardBody>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default CategoryBulkExport;

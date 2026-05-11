import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React, { useContext, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiSearch, FiTrash2, FiBox, FiCheck } from "react-icons/fi";
import { createPortal } from "react-dom";

//internal import
import AttributeTable from "@/components/attribute/AttributeTable";
import DeleteModal from "@/components/modal/DeleteModal";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import { SidebarContext } from "@/context/SidebarContext";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import AttributeServices from "@/services/AttributeServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";
import AttributeDrawer from "@/components/drawer/AttributeDrawer";

const Attributes = () => {
  const { lang, setIsUpdate } = useContext(SidebarContext);
  const { data, loading, error } = useAsync(() =>
    AttributeServices.getAllAttributes({
      type: "attribute",
      option: "Dropdown",
      option1: "Radio",
    })
  );

  const { allId, serviceId } = useToggleDrawer();

  const { t } = useTranslation();

  const {
    dataTable,
    serviceData,
    totalResults,
    attributeRef,
    resultsPerPage,
    handleChangePage,
    setAttributeTitle,
    handleSubmitAttribute,
  } = useFilter(data);

  // React hooks for the form top
  const [activeTab, setActiveTab] = useState("Default");
  const [name, setName] = useState({ default: "", en: "" });
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (msg, type = "success") => {
    setAlert({ show: true, message: msg, type: type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3500);
  };

  const handleResetField = () => {
    setName({ default: "", en: "" });
  };

  const handleAddAttribute = async (e) => {
    e.preventDefault();
    if (!name.default && !name.en) return showAlert("Attribute name is required!", "error");

    try {
      const attributeData = {
        title: {
          default: name.default || name.en,
          en: name.en || name.default,
        },
        name: {
          default: name.default || name.en,
          en: name.en || name.default,
        },
        variants: [], // Required by backend API
        option: "Dropdown", // Default value since it's removed from UI
        type: "attribute",
        lang: "en",
      };

      const res = await AttributeServices.addAttribute(attributeData);
      setIsUpdate(true);
      showAlert(res.message, "success");
      handleResetField();
    } catch (err) {
      showAlert(err ? err?.response?.data?.message : err?.message, "error");
    }
  };

  // State for Checkboxes
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  return (
    <>
      <AnimatedContent>
        {/* Form header */}
        <div className="flex items-center gap-2 mb-4">
          <FiBox className="text-gray-800 dark:text-gray-200 text-[22px]" />
          <h1 className="text-[20px] font-bold text-gray-800 dark:text-gray-200 tracking-tight">Add New Attribute</h1>
        </div>

        <DeleteModal id={serviceId} title="Attribute" />

        <MainDrawer>
          <AttributeDrawer id={serviceId} />
        </MainDrawer>

        {/* Input Form Card */}
        <Card className="min-w-0 shadow-sm overflow-visible bg-white dark:bg-gray-800 mb-8 rounded-2xl border border-gray-100 dark:border-gray-700">
          <CardBody className="p-0">
            <form onSubmit={handleAddAttribute} className="p-6 md:p-8 flex flex-col gap-6">
              {/* Tabs */}
              <div className="flex gap-4 text-[13px] font-semibold mb-2">
                {["Default", "English(EN)"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 px-1 transition-all duration-300 border-b-2 ${
                      activeTab === tab
                        ? "border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Input Field */}
              <div className="flex flex-col gap-2 relative max-w-full">
                <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                  Name ({activeTab}) <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={
                    activeTab === "Default" ? name.default : name.en
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(prev => ({
                      ...prev,
                      [activeTab === "Default" ? "default" : "en"]: val
                    }));
                  }}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all dark:bg-gray-700 dark:border-gray-600 text-sm"
                  placeholder="Ex : new attribute"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleResetField}
                  className="px-8 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-[0_4px_14px_rgba(13,148,136,0.3)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.4)] hover:-translate-y-0.5"
                >
                  Submit
                </button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* List Card */}
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 mb-5 rounded-2xl border border-gray-100 dark:border-gray-700">
          <CardBody className="p-0">
            <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <h2 className="text-[17px] font-bold text-gray-700 dark:text-gray-200">Attribute List</h2>
                <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1 rounded-lg">
                  {totalResults}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <form
                  onSubmit={handleSubmitAttribute}
                  className="flex items-center relative w-full md:w-[280px]"
                >
                  <Input
                    ref={attributeRef}
                    type="search"
                    placeholder="Ex : attribute name"
                    className="w-full h-11 pl-4 pr-12 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all dark:bg-gray-700 dark:border-gray-600 text-sm"
                  />
                  <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-slate-400 text-white rounded-r-xl outline-none hover:bg-slate-500 transition-colors flex items-center justify-center">
                    <FiSearch />
                  </button>
                </form>

                <button className="flex items-center gap-2 px-4 h-11 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm transition-all whitespace-nowrap bg-white dark:bg-gray-800">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-500 dark:text-gray-400"><path d="M4 17V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V17M7 11L12 16M12 16L17 11M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Export <span className="opacity-50 ml-1">▼</span>
                </button>
              </div>
            </div>

            {loading ? (
              <TableLoading row={12} col={4} width={180} height={20} />
            ) : error ? (
              <span className="text-center mx-auto text-red-500 py-6 block">{error}</span>
            ) : serviceData?.length !== 0 ? (
              <TableContainer className="mb-0 border-none">
                <Table className="w-full whitespace-nowrap text-sm text-left">
                  <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                    <tr>
                      <TableCell className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 w-24">Sl <span className="text-gray-300 dark:text-gray-500 ml-1">↕</span></TableCell>
                      <TableCell className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 w-32">ID <span className="text-gray-300 dark:text-gray-500 ml-1">↕</span></TableCell>
                      <TableCell className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Name <span className="text-gray-300 dark:text-gray-500 ml-1">↕</span></TableCell>
                      <TableCell className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-center w-32">Action <span className="text-gray-300 dark:text-gray-500 ml-1">↕</span></TableCell>
                    </tr>
                  </TableHeader>
                  <AttributeTable
                    attributes={dataTable}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                  />
                </Table>
                <TableFooter className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4">
                  <Pagination
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    onChange={handleChangePage}
                    label="Table navigation"
                  />
                </TableFooter>
              </TableContainer>
            ) : (
              <NotFound title="Sorry, There are no attributes right now." />
            )}
          </CardBody>
        </Card>

        {/* Custom Professional Notification Banner */}
        {alert.show && createPortal(
          <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[9999] max-w-sm w-full px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-4 border backdrop-blur-md animate-in slide-in-from-top-10 duration-500 ${alert.type === 'success' ? 'bg-teal-600/95 border-teal-500 text-white' : alert.type === 'disable' ? 'bg-amber-600/95 border-amber-500 text-white' : 'bg-red-600/95 border-red-500 text-white'}`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
               {alert.type === 'success' ? <FiCheck size={20} /> : <FiSearch size={20} />}
            </div>
            <div className="flex-1 text-left">
               <p className="font-extrabold text-[15px]">{alert.type === 'success' ? 'Success ✓' : alert.type === 'disable' ? 'Disabled \u26A0' : 'Action Required'}</p>
               <p className="text-[13px] opacity-90 font-medium">{alert.message}</p>
            </div>
          </div>,
          document.body
        )}
      </AnimatedContent>
    </>
  );
};

export default Attributes;

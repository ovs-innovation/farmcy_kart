import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Input, Select, Table, TableHeader, TableCell, TableContainer, TableBody, TableRow, Pagination, TableFooter } from "@windmill/react-ui";
import { FiSearch, FiDownload, FiChevronDown, FiPackage, FiCheck, FiAlertCircle, FiPlus, FiClipboard, FiArrowLeft } from "react-icons/fi";
import { HiSelector } from "react-icons/hi";
import { Button } from "@windmill/react-ui";
import { SidebarContext } from "@/context/SidebarContext";
import useAsync from "@/hooks/useAsync";
import ProductServices from "@/services/ProductServices";
import BrandServices from "@/services/BrandServices";
import SelectCategory from "@/components/form/selectOption/SelectCategory";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import AnimatedContent from "@/components/common/AnimatedContent";
import noResult from "@/assets/img/no-result.svg";

const NewItemRequest = () => {
  const { lang, currentPage, handleChangePage, resultsPerPage, showAlert } = useContext(SidebarContext);
  const history = useHistory();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");

  // Form state for new request submission
  const [form, setForm] = useState({ productName: "", category: "", description: "", suggestedPrice: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { data, loading, error } = useAsync(() =>
    ProductServices.getAllProducts({
      page: currentPage,
      limit: resultsPerPage,
      category,
      title: search,
      price: "",
      brand,
      status,
    })
  );

  const { data: brandList } = useAsync(BrandServices.getAllBrands);

  const products = data?.products || [];
  const totalDoc = data?.totalDoc || 0;

  const formatText = (val) => {
    if (!val) return "N/A";
    if (typeof val === "string") return val;
    if (typeof val === "object") return val.en || val.default || Object.values(val)[0] || "N/A";
    return String(val);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleReset = () => {
    setSearch("");
    setSearchInput("");
    setCategory("");
    setBrand("");
    setStatus("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName.trim()) return showAlert("Product name is required!", "error");
    setFormLoading(true);
    try {
      // Send as a new product with minimal data / tagged as a request
      await ProductServices.addProduct({
        title: { en: form.productName, default: form.productName },
        description: { en: form.description, default: form.description },
        prices: { originalPrice: Number(form.suggestedPrice) || 0, price: Number(form.suggestedPrice) || 0, discount: 0 },
        slug: form.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-request-" + Date.now(),
        categories: [],
        category: null,
        image: [],
        stock: 0,
        tag: JSON.stringify(["new-item-request"]),
        isCombination: false,
        variants: [],
        status: "hide",
      });
      showAlert("Request submitted successfully!", "success");
      setForm({ productName: "", category: "", description: "", suggestedPrice: "" });
      setShowForm(false);
    } catch (err) {
      showAlert(err?.response?.data?.message || "Failed to submit request", "error");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <AnimatedContent>
      <div className="bg-[#f0f2f5] dark:bg-gray-900 min-h-screen pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Back Button */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              layout="link"
              onClick={() => history.goBack()}
              className="p-0 text-store-500 hover:text-store-600 h-auto"
            >
              <FiArrowLeft className="w-5 h-5 mr-1" />
              <span className="text-sm font-bold uppercase tracking-wider">Back</span>
            </Button>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-md">
                <FiClipboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-tight">New Item Requests</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">View and manage item requests</p>
              </div>
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold px-3 py-1 rounded-lg">
                {totalDoc}
              </span>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all shadow-md"
            >
              <FiPlus size={16} />
              Submit Request
            </button>
          </div>

          {/* Request Submission Form (expandable) */}
          {showForm && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-violet-100 dark:border-violet-900/30 p-6 mb-6">
              <h2 className="text-[15px] font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <FiPlus className="text-violet-600 dark:text-violet-400" /> New Item Request Form
              </h2>
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                    Product Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={form.productName}
                    onChange={(e) => setForm(p => ({ ...p, productName: e.target.value }))}
                    placeholder="Ex: Vitamin D3 Tablets 60s"
                    className="focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                    Suggested Price (₹)
                  </label>
                  <Input
                    type="number"
                    value={form.suggestedPrice}
                    onChange={(e) => setForm(p => ({ ...p, suggestedPrice: e.target.value }))}
                    placeholder="0.00"
                    className="focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[12px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                    Description / Notes
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Additional details about the product request..."
                    rows={3}
                    className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all resize-none"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-sm disabled:opacity-60"
                  >
                    {formLoading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Search & Filter</h2>
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-2 flex">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="search"
                  placeholder="Search item name..."
                  className="rounded-r-none border-r-0 focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 h-10"
                />
                <button type="submit" className="bg-slate-400 text-white px-4 rounded-r-xl hover:bg-slate-500 transition-colors">
                  <FiSearch size={15} />
                </button>
              </div>

              <SelectCategory setCategory={setCategory} lang={lang} />

              <Select value={brand} onChange={(e) => setBrand(e.target.value)} className="focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                <option value="" className="dark:bg-gray-800">All Stores</option>
                {brandList?.map((b) => (
                  <option key={b._id} value={b._id} className="dark:bg-gray-800">{formatText(b.name)}</option>
                ))}
              </Select>

              <Select value={status} onChange={(e) => setStatus(e.target.value)} className="focus:border-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                <option value="" className="dark:bg-gray-800">All Types</option>
                <option value="published" className="dark:bg-gray-800">Published</option>
                <option value="unPublished" className="dark:bg-gray-800">Hidden (Requests)</option>
              </Select>

              <div className="flex gap-2 lg:col-span-5 justify-end">
                <button type="submit" className="px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all">
                  Filter
                </button>
                <button type="button" onClick={handleReset} className="px-5 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Table Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-[16px] font-bold text-gray-700 dark:text-gray-200">Request List</h2>
              <button className="flex items-center gap-2 px-4 h-9 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm bg-white dark:bg-gray-800 shadow-sm">
                <FiDownload size={14} className="text-gray-500" />
                Export
                <FiChevronDown size={14} className="text-gray-400" />
              </button>
            </div>

            {loading ? (
              <TableLoading row={8} col={6} width={150} height={20} />
            ) : error ? (
              <div className="text-center text-red-500 py-16">{error}</div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <img src={noResult} alt="No Data" className="w-28 h-28 opacity-80 mb-4" />
                <h3 className="text-[17px] font-bold text-gray-700 dark:text-gray-300">No Data Found</h3>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or submit a new request</p>
              </div>
            ) : (
              <TableContainer className="rounded-none border-none overflow-x-auto">
                <Table className="w-full text-sm">
                  <TableHeader>
                    <tr className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                      {["Sl", "Name", "Category", "Store", "Price", "Status", "Action"].map((h, idx) => (
                        <TableCell key={idx} className="py-4 font-extrabold text-gray-600 dark:text-gray-400 text-[12px] uppercase tracking-wide">
                          <div className={`flex items-center gap-1 ${idx === 0 || idx >= 5 ? "justify-center" : "justify-start"}`}>
                            {h}
                            {h !== "Action" && <HiSelector className="text-gray-300 w-3.5 h-3.5" />}
                          </div>
                        </TableCell>
                      ))}
                    </tr>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {products.map((product, i) => (
                      <TableRow key={product._id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors">
                        <TableCell className="text-center text-gray-400 text-[13px] font-medium w-12">
                          {(currentPage - 1) * resultsPerPage + i + 1}
                        </TableCell>
                        <TableCell className="min-w-[180px]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 overflow-hidden shrink-0">
                              {product.image?.[0] ? (
                                <img src={product.image[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FiPackage className="text-gray-200 w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <p className="text-[13px] font-bold text-gray-800 dark:text-gray-200 line-clamp-2 max-w-[150px]">
                              {formatText(product.title)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-[12px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                            {formatText(product.category?.name) !== "N/A" ? formatText(product.category?.name) : "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-[13px] text-gray-600">
                            {formatText(product.brand?.name) !== "N/A" ? formatText(product.brand?.name) : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-[13px] font-bold text-teal-600">
                            ₹{(product.prices?.originalPrice || 0).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${product.status === "show" ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
                            {product.status === "show" ? "Published" : "Pending"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <label className="flex items-center cursor-pointer">
                              <div className="relative">
                                <input type="checkbox" className="sr-only" defaultChecked={product.status === "show"} />
                                <div className={`block w-10 h-[22px] rounded-full transition-colors ${product.status === "show" ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"}`}></div>
                                <div className={`dot absolute top-[2px] bg-white w-[18px] h-[18px] rounded-full transition-transform ${product.status === "show" ? "translate-x-[20px]" : "translate-x-[2px]"}`}></div>
                              </div>
                            </label>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TableFooter className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4">
                  <Pagination
                    totalResults={totalDoc}
                    resultsPerPage={resultsPerPage}
                    onChange={handleChangePage}
                    label="Item request pagination"
                  />
                </TableFooter>
              </TableContainer>
            )}
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default NewItemRequest;

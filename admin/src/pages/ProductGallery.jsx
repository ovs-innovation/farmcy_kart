import React, { useContext, useState, useEffect } from "react";
import { Input, Select, Pagination } from "@windmill/react-ui";
import { FiSearch, FiGrid, FiList, FiEye, FiStar, FiPackage, FiFilter, FiImage, FiEdit, FiTrash2 } from "react-icons/fi";
import { useHistory } from "react-router-dom";

// Internal imports
import ProductServices from "@/services/ProductServices";
import BrandServices from "@/services/BrandServices";
import { SidebarContext } from "@/context/SidebarContext";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import AnimatedContent from "@/components/common/AnimatedContent";
import SelectCategory from "@/components/form/selectOption/SelectCategory";
import MainDrawer from "@/components/drawer/MainDrawer";
import ProductDrawer from "@/components/drawer/ProductDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";

const RESULTS_PER_PAGE = 16;

const ProductGallery = () => {
  const history = useHistory();
  const { lang, isUpdate } = useContext(SidebarContext);
  const { serviceId, handleUpdate, handleModalOpen, title } = useToggleDrawer();

  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sortedField, setSortedField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Data state
  const [data, setData] = useState({ products: [], totalDoc: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [brands, setBrands] = useState([]);

  // Fetch Brands once
  useEffect(() => {
    BrandServices.getAllBrands().then(setBrands).catch(() => {});
  }, []);

  // Fetch Products reactively
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await ProductServices.getAllProducts({
          page: currentPage,
          limit: RESULTS_PER_PAGE,
          category,
          title: search,
          price: sortedField,
          brand,
          status: "",
        });
        setData(res);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, category, search, sortedField, brand, isUpdate]);

  const formatText = (val) => {
    if (!val) return "N/A";
    if (typeof val === "string") return val;
    if (typeof val === "object") return val.en || val.default || Object.values(val)[0] || "N/A";
    return String(val);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setSearchInput("");
    setCategory("");
    setBrand("");
    setSortedField("");
    setCurrentPage(1);
  };

  const products = data?.products || [];
  const totalDoc = data?.totalDoc || 0;

  return (
    <AnimatedContent>
      {/* Modals & Drawers */}
      <MainDrawer>
        <ProductDrawer id={serviceId} />
      </MainDrawer>
      <DeleteModal id={serviceId} title={title} />

      <div className="bg-[#f0f2f5] min-h-screen pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <FiImage className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 leading-tight">Product Gallery</h1>
                <p className="text-xs text-gray-500 mt-0.5">Manage products in dynamic gallery view</p>
              </div>
              <span className="ml-2 bg-gray-100 border border-gray-200 text-gray-700 text-sm font-bold px-3 py-1 rounded-lg">
                {totalDoc}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-xl border transition-all ${viewMode === "grid" ? "bg-teal-600 text-white border-teal-600 shadow-md" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-xl border transition-all ${viewMode === "list" ? "bg-teal-600 text-white border-teal-600 shadow-md" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}
              >
                <FiList size={16} />
              </button>
            </div>
          </div>

          {/* Filter Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FiFilter className="text-teal-600" size={16} />
              <h2 className="text-sm font-bold text-gray-700">Filters</h2>
            </div>
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
            >
              {/* Search */}
              <div className="lg:col-span-2 flex">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="search"
                  placeholder="Search products..."
                  className="rounded-r-none border-r-0 focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 bg-slate-400 text-white rounded-r-xl hover:bg-slate-500 transition-colors flex items-center"
                >
                  <FiSearch size={16} />
                </button>
              </div>

              {/* Category */}
              <SelectCategory setCategory={setCategory} lang={lang} />

              {/* Brand */}
              <Select value={brand} onChange={(e) => setBrand(e.target.value)} className="focus:border-teal-500">
                <option value="">All Brands</option>
                {brands?.map((b) => (
                  <option key={b._id} value={b._id}>
                    {formatText(b.name)}
                  </option>
                ))}
              </Select>

              {/* Sort */}
              <Select value={sortedField} onChange={(e) => { setSortedField(e.target.value); setCurrentPage(1); }} className="focus:border-teal-500">
                <option value="">Sort By</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="date-added-desc">Newest First</option>
                <option value="date-added-asc">Oldest First</option>
              </Select>

              <div className="flex gap-2 sm:col-span-2 lg:col-span-5 justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-sm transition-all"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Gallery */}
          {loading ? (
            <TableLoading row={4} col={4} width={180} height={20} />
          ) : error ? (
            <div className="text-center text-red-500 py-16 bg-white rounded-2xl">{error}</div>
          ) : products.length === 0 ? (
            <NotFound title="No products found in gallery." />
          ) : viewMode === "grid" ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => {
                const img = Array.isArray(product.image) ? product.image[0] : product.image;
                const title = formatText(product.title);
                const price = product.prices?.price ?? product.prices?.originalPrice ?? 0;
                const originalPrice = product.prices?.originalPrice ?? 0;
                const hasDiscount = originalPrice > price;

                return (
                  <div
                    key={product._id}
                    onMouseEnter={() => setHoveredProduct(product._id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiPackage className="w-16 h-16 text-gray-200" />
                        </div>
                      )}
                      {/* Status badge */}
                      <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-bold ${product.status === "show" ? "bg-teal-500 text-white" : "bg-amber-500 text-white"}`}>
                        {product.status === "show" ? "Active" : "Hidden"}
                      </div>
                      {hasDiscount && (
                        <div className="absolute top-3 right-3 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                          -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${hoveredProduct === product._id ? "opacity-100" : "opacity-0"}`}>
                        <button
                          onClick={() => history.push(`/product/${product._id}`)}
                          title="View Details"
                          className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-teal-600 hover:text-white transition-colors shadow-md"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          onClick={() => handleUpdate(product._id)}
                          title="Edit Product"
                          className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-colors shadow-md"
                        >
                          <FiEdit size={15} />
                        </button>
                        <button
                          onClick={() => handleModalOpen(product._id, title)}
                          title="Delete Product"
                          className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-600 hover:text-white transition-colors shadow-md"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-[13px] text-gray-400 font-medium mb-1 truncate">
                        {formatText(product.category?.name) !== "N/A" ? formatText(product.category?.name) : "No Category"}
                      </p>
                      <h3 className="text-[14px] font-bold text-gray-800 leading-snug mb-2 line-clamp-2">
                        {title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-teal-600 font-bold text-[15px]">₹{price.toLocaleString()}</span>
                        {hasDiscount && (
                          <span className="text-gray-400 line-through text-[13px]">₹{originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${(product.stock ?? 0) > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                          {(product.stock ?? 0) > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                        {product.averageRating > 0 && (
                          <div className="flex items-center gap-1 text-amber-500">
                            <FiStar size={12} fill="currentColor" />
                            <span className="text-[12px] font-bold text-gray-600">{product.averageRating?.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {products.map((product) => {
                  const img = Array.isArray(product.image) ? product.image[0] : product.image;
                  const titleStr = formatText(product.title);
                  const price = product.prices?.price ?? product.prices?.originalPrice ?? 0;
                  const originalPrice = product.prices?.originalPrice ?? 0;

                  return (
                    <div
                      key={product._id}
                      className="flex items-center gap-5 p-4 hover:bg-gray-50/80 transition-colors group"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        {img ? (
                          <img src={img} alt={titleStr} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiPackage className="text-gray-300 w-7 h-7" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[14px] font-bold text-gray-800 truncate">{titleStr}</h3>
                        <p className="text-[12px] text-gray-400 mt-0.5">{formatText(product.category?.name)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-teal-600 font-bold text-[14px]">₹{price.toLocaleString()}</p>
                        {originalPrice > price && (
                          <p className="text-gray-400 line-through text-[12px]">₹{originalPrice.toLocaleString()}</p>
                        )}
                      </div>
                      <div className="shrink-0 w-24 text-center">
                        <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${(product.stock ?? 0) > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                          {(product.stock ?? 0) > 0 ? `${product.stock} in stock` : "Out"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => history.push(`/product/${product._id}`)}
                          className="p-2 text-gray-500 hover:text-teal-600 rounded-lg hover:bg-teal-50"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdate(product._id)}
                          className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleModalOpen(product._id, titleStr)}
                          className="p-2 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalDoc > RESULTS_PER_PAGE && (
            <div className="mt-6 flex justify-center">
              <Pagination
                totalResults={totalDoc}
                resultsPerPage={RESULTS_PER_PAGE}
                onChange={(p) => setCurrentPage(p)}
                label="Gallery navigation"
              />
            </div>
          )}
        </div>
      </div>
    </AnimatedContent>
  );
};

export default ProductGallery;

import React, { useContext, useMemo, useRef, useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
} from "@windmill/react-ui";
import { FiEdit, FiPlus, FiTrash2, FiSearch, FiMessageCircle, FiVideo, FiMoreHorizontal, FiX, FiCheckCircle } from "react-icons/fi";

import AnimatedContent from "@/components/common/AnimatedContent";
import MainDrawer from "@/components/drawer/MainDrawer";
import TestimonialDrawer from "@/components/drawer/TestimonialDrawer";
import PageTitle from "@/components/Typography/PageTitle";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import { SidebarContext } from "@/context/SidebarContext";
import TestimonialServices from "@/services/TestimonialServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import { notifyError, notifySuccess } from "@/utils/toast";
import DeleteModal from "@/components/modal/DeleteModal";

const Testimonials = () => {
  const { toggleDrawer, setIsUpdate, isUpdate } = useContext(SidebarContext);
  const { serviceId, setServiceId, handleModalOpen, handleUpdate, title, setTitle } = useToggleDrawer();

  // Local data state for dynamic fetching
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const searchFormRef = useRef(null);

  // Fetch Testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const res = await TestimonialServices.getAllTestimonials();
        setData(res || []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [isUpdate]);

  // Filtering on frontend for responsive searching
  const filteredTestimonials = useMemo(() => {
    if (!searchText) return data;
    const lowerSearch = searchText.toLowerCase().trim();
    return data.filter((item) =>
      item?.title?.toLowerCase()?.includes(lowerSearch)
    );
  }, [data, searchText]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchText(searchInput);
  };

  const handleReset = () => {
    setSearchText("");
    setSearchInput("");
  };

  const getEmbedUrl = (url = "") => {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtube.com")) {
        const videoId = parsed.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url.replace("watch?v=", "embed/");
      }
      if (parsed.hostname.includes("youtu.be")) return `https://www.youtube.com/embed${parsed.pathname}`;
      if (parsed.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video${parsed.pathname}`;
    } catch (err) { return null; }
    return null;
  };

  return (
    <AnimatedContent>
      {/* Modals & Drawers */}
      <MainDrawer>
        <TestimonialDrawer id={serviceId} />
      </MainDrawer>
      <DeleteModal id={serviceId} title={title} />

      <div className="bg-[#f0f2f5] min-h-screen pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 mt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-200 text-white">
                <FiMessageCircle size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-tight">Customer Testimonials</h1>
                <p className="text-xs text-gray-500 mt-1">Showcase video reviews from happy customers</p>
              </div>
              <span className="ml-2 bg-white border border-gray-200 text-gray-600 text-sm font-bold px-3 py-1 rounded-lg shadow-sm">
                {data.length} Total
              </span>
            </div>
            <button
              onClick={() => { setServiceId(null); toggleDrawer(); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all shadow-md"
            >
              <FiPlus size={16} /> Add Testimonial
            </button>
          </div>

          {/* Search/Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
            <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
              <div className="relative flex items-center min-w-[200px] flex-1 max-w-sm">
                <FiSearch className="absolute left-3.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by title..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all shadow-sm"
                />
              </div>
              <button type="submit" className="h-11 px-6 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 shadow-sm transition-all text-sm">
                Filter
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="h-11 px-6 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm"
              >
                Reset
              </button>
            </form>
          </div>

          {loading ? (
            <div className="p-8">
              <TableLoading row={4} col={3} width={250} height={20} />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-20 bg-white rounded-2xl border border-dashed border-red-200">
               <p className="font-bold">Backend Connection Failed</p>
               <p className="text-sm mt-2">{error}</p>
            </div>
          ) : filteredTestimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTestimonials.map((item) => {
                const embedUrl = getEmbedUrl(item.video);
                return (
                  <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-lg transition-all duration-300">
                     <div className="relative w-full aspect-video bg-black">
                       {embedUrl ? (
                         <iframe
                           src={embedUrl}
                           title={item.title}
                           className="absolute inset-0 w-full h-full border-none"
                           allowFullScreen
                         />
                       ) : (
                         <div className="absolute inset-0 flex items-center justify-center p-4">
                           <a href={item.video} target="_blank" rel="noreferrer" className="text-violet-400 underline text-sm break-all text-center">{item.video}</a>
                         </div>
                       )}
                       <div className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.status === "published" ? "bg-green-500 text-white shadow-sm" : "bg-amber-500 text-white shadow-sm"}`}>
                          {item.status === "published" ? "Live" : "Hidden"}
                       </div>
                     </div>
                     <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-[15px] font-bold text-gray-800 mb-4 line-clamp-1 group-hover:text-violet-700 transition-colors">{item.title}</h3>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                           <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Display Order</span>
                              <span className="text-sm font-bold text-gray-700">{item.sortOrder || 0}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                             <button
                                onClick={() => handleUpdate(item._id)}
                                className="p-2.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                                title="Edit Testimonial"
                             >
                                <FiEdit size={16} />
                             </button>
                             <button
                                onClick={() => { setServiceId(item._id); setTitle(item.title); handleModalOpen(); }}
                                className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                title="Delete Testimonial"
                             >
                                <FiTrash2 size={16} />
                             </button>
                           </div>
                        </div>
                     </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl py-24 flex flex-col items-center border border-gray-50 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                   <FiMessageCircle className="text-gray-200" size={40} />
                </div>
                <p className="text-gray-400 text-base font-bold">No testimonials found</p>
                <button onClick={() => { setServiceId(null); toggleDrawer(); }} className="mt-4 text-sm text-violet-600 font-bold hover:underline hover:text-violet-700">+ Add your first testimonial</button>
            </div>
          )}
        </div>
      </div>
    </AnimatedContent>
  );
};

export default Testimonials;

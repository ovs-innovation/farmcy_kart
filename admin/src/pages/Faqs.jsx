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
import { FiEdit, FiPlus, FiTrash2, FiSearch, FiHelpCircle, FiVideo, FiMoreHorizontal, FiX, FiCheckCircle } from "react-icons/fi";
import { createPortal } from "react-dom";

import AnimatedContent from "@/components/common/AnimatedContent";
import MainDrawer from "@/components/drawer/MainDrawer";
import FaqDrawer from "@/components/drawer/FaqDrawer";
import PageTitle from "@/components/Typography/PageTitle";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import { SidebarContext } from "@/context/SidebarContext";
import FaqServices from "@/services/FaqServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import { notifyError, notifySuccess } from "@/utils/toast";
import DeleteModal from "@/components/modal/DeleteModal";

const Faqs = () => {
  const { toggleDrawer, setIsUpdate, isUpdate } = useContext(SidebarContext);
  const { serviceId, setServiceId, handleModalOpen, handleUpdate, title, setTitle } = useToggleDrawer();

  // Local data state for dynamic fetching
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [drawerType, setDrawerType] = useState("qa");

  const searchFormRef = useRef(null);

  // Fetch FAQs from backend
  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const res = await FaqServices.getAllFaqs();
        setData(res || []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, [isUpdate]);

  // Filtering on frontend for responsive searching
  const filteredFaqs = useMemo(() => {
    if (!searchText) return data;
    const lowerSearch = searchText.toLowerCase().trim();
    return data.filter((faq) =>
      faq?.question?.toLowerCase()?.includes(lowerSearch) ||
      faq?.answer?.toLowerCase()?.includes(lowerSearch)
    );
  }, [data, searchText]);

  const qaFaqs = useMemo(() => filteredFaqs.filter((f) => f.type !== "video"), [filteredFaqs]);
  const videoFaqs = useMemo(() => filteredFaqs.filter((f) => f.type === "video"), [filteredFaqs]);

  const openDrawer = (type = "qa", faqId = null) => {
    setDrawerType(type);
    if (faqId) {
      handleUpdate(faqId);
    } else {
      setServiceId(null);
      toggleDrawer();
    }
  };

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
        <FaqDrawer id={serviceId} type={drawerType} />
      </MainDrawer>
      <DeleteModal id={serviceId} title={title} />

      <div className="bg-[#f0f2f5] dark:bg-gray-900 min-h-screen pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 mt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-store-600 rounded-xl flex items-center justify-center shadow-md shadow-store-200 text-white">
                <FiHelpCircle size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 tracking-tight leading-tight">Customer Support FAQs</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage common questions and video guides</p>
              </div>
              <span className="ml-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold px-3 py-1 rounded-lg shadow-sm">
                {data.length} Total
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openDrawer("qa")}
                className="flex items-center gap-2 px-4 py-2.5 bg-store-600 text-white rounded-xl text-sm font-semibold hover:bg-store-700 transition-all shadow-md"
              >
                <FiPlus size={16} /> Add FAQ
              </button>
              <button
                onClick={() => openDrawer("video")}
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-all shadow-md"
              >
                <FiVideo size={16} /> Add Video
              </button>
            </div>
          </div>

          {/* Search/Filter Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-8">
            <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
              <div className="relative flex items-center min-w-[200px] flex-1 max-w-sm">
                <FiSearch className="absolute left-3.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search questions or answers..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:border-store-500 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm dark:text-gray-200"
                />
              </div>
              <button type="submit" className="h-11 px-6 bg-store-600 text-white font-semibold rounded-xl hover:bg-store-700 shadow-sm transition-all text-sm">
                Filter
              </button>
                <button
                type="button"
                onClick={handleReset}
                className="h-11 px-6 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
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
            <div className="text-center text-red-500 py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-red-200 dark:border-red-900/50">
               <p className="font-bold">Backend Connection Failed</p>
               <p className="text-sm mt-2">{error}</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* VIDEO SECTION */}
              <section>
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FiVideo className="text-teal-600" /> Video Guides
                  </h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{videoFaqs.length} items</span>
                </div>
                {videoFaqs.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {videoFaqs.map((video) => {
                      const embedUrl = getEmbedUrl(video.videoUrl);
                      return (
                        <div key={video._id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col group hover:shadow-lg transition-all duration-300">
                           <div className="relative w-full aspect-video bg-black">
                             {embedUrl ? (
                               <iframe
                                 src={embedUrl}
                                 title={video.question}
                                 className="absolute inset-0 w-full h-full border-none"
                                 allowFullScreen
                               />
                             ) : (
                               <div className="absolute inset-0 flex items-center justify-center p-4">
                                 <a href={video.videoUrl} target="_blank" rel="noreferrer" className="text-teal-400 underline text-sm break-all text-center">{video.videoUrl}</a>
                               </div>
                             )}
                             <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${video.status === "published" ? "bg-green-500 text-white" : "bg-amber-500 text-white shadow-sm"}`}>
                                {video.status === "published" ? "Live" : "Draft"}
                             </div>
                           </div>
                           <div className="p-4 flex-1 flex flex-col">
                              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">{video.question}</h3>
                              <p className="text-[12px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">{video.answer || "No description provided."}</p>
                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-gray-700">
                                 <span className="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase">Order: {video.sortOrder || 0}</span>
                                 <div className="flex items-center gap-1">
                                   <button onClick={() => openDrawer("video", video._id)} className="p-2 text-gray-400 hover:text-store-600 hover:bg-store-50 rounded-lg transition-colors"><FiEdit size={14} /></button>
                                   <button onClick={() => { setServiceId(video._id); setTitle(video.question); handleModalOpen(); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={14} /></button>
                                 </div>
                              </div>
                           </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl py-12 flex flex-col items-center border border-gray-50 dark:border-gray-700 shadow-sm">
                    <FiVideo className="text-gray-100 dark:text-gray-700 mb-4" size={50} />
                    <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">No video FAQs found.</p>
                  </div>
                )}
              </section>

              {/* QA SECTION */}
              <section>
                <div className="flex items-center justify-between mb-4 px-1">
                   <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                     <FiHelpCircle className="text-store-600" /> General Questions
                   </h2>
                   <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{qaFaqs.length} entries</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {qaFaqs.length > 0 ? (
                    <TableContainer className="rounded-none border-none">
                      <Table>
                        <TableHeader>
                          <tr className="bg-gray-50/70 dark:bg-gray-900/70 text-gray-500 dark:text-gray-400 text-[10px] font-extrabold uppercase tracking-widest leading-relaxed border-b border-gray-100 dark:border-gray-700">
                            <TableCell className="py-4">Question</TableCell>
                            <TableCell className="py-4">Short Answer</TableCell>
                            <TableCell className="py-4 text-center">Status</TableCell>
                            <TableCell className="py-4 text-right">Actions</TableCell>
                          </tr>
                        </TableHeader>
                        <TableBody>
                           {qaFaqs.map((faq) => (
                             <TableRow key={faq._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700">
                               <TableCell className="py-4 font-bold text-gray-800 dark:text-gray-200 text-sm max-w-[300px]">
                                  {faq.question}
                               </TableCell>
                               <TableCell className="py-4 text-xs text-gray-500 dark:text-gray-400 max-w-[400px] leading-relaxed">
                                  {faq.answer?.substring(0, 120)}{faq.answer?.length > 120 ? "..." : ""}
                               </TableCell>
                               <TableCell className="text-center py-4">
                                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${faq.status === "published" ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800" : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800"}`}>
                                    {faq.status === "published" ? "Live" : "Draft"}
                                  </span>
                               </TableCell>
                               <TableCell className="py-4 text-right">
                                  <div className="flex justify-end items-center gap-1">
                                    <button onClick={() => openDrawer("qa", faq._id)} className="p-2 text-gray-400 hover:text-store-600 hover:bg-store-50 rounded-lg transition-colors"><FiEdit size={16} /></button>
                                    <button onClick={() => { setServiceId(faq._id); setTitle(faq.question); handleModalOpen(); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={16} /></button>
                                  </div>
                               </TableCell>
                             </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <div className="py-20 flex flex-col items-center">
                        <FiHelpCircle className="text-gray-100 dark:text-gray-700 mb-4" size={60} />
                        <p className="text-gray-400 dark:text-gray-500 font-bold">No FAQ questions yet.</p>
                        <button onClick={() => openDrawer("qa")} className="mt-4 text-sm text-store-600 dark:text-store-400 font-bold hover:underline">+ Create first FAQ</button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </AnimatedContent>
  );
};

export default Faqs;

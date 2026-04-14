import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Pagination,
  Table,
  TableContainer,
  TableHeader,
  TableCell,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiRefreshCw, FiUsers, FiClock, FiCheckCircle, FiXCircle, FiSearch, FiFilter, FiRotateCcw, FiPlus, FiChevronDown } from "react-icons/fi";

// Internal imports
import WholesalerTable from "@/components/wholesaler/WholesalerTable";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import CustomerServices from "@/services/CustomerServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import MainDrawer from "@/components/drawer/MainDrawer";
import WholesalerDrawer from "@/components/drawer/WholesalerDrawer";
import { SidebarContext } from "@/context/SidebarContext";

/* ── Status summary cards ── */
const StatsCard = ({ label, count, subtext, colorClass, icon: Icon }) => (
  <div className={`flex flex-col p-6 rounded-[24px] border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm w-full transition-all hover:shadow-md group`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass} transition-transform group-hover:scale-110`}>
        <Icon size={24} />
      </div>
      <span className="text-3xl font-black text-gray-800 dark:text-gray-100 tracking-tight">{count}</span>
    </div>
    <div>
      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</h4>
      <p className="text-xs text-gray-500 font-medium">{subtext}</p>
    </div>
  </div>
);

const Retailer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [wholesalerStatus, setWholesalerStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  const { toggleDrawer, isUpdate } = useContext(SidebarContext);
  const RESULTS_PER_PAGE = 10;

  const fetchWholesalers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CustomerServices.getAllWholesalers({
        searchText,
        wholesalerStatus,
      });
      setData(res || []);
      
      if (!searchText && !wholesalerStatus) {
        setStats({
          total: res.length,
          pending: res.filter(i => !i.wholesalerStatus || i.wholesalerStatus === "pending").length,
          approved: res.filter(i => i.wholesalerStatus === "approved").length,
          rejected: res.filter(i => i.wholesalerStatus === "rejected").length,
        });
      }
      
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch wholesalers");
    } finally {
      setLoading(false);
    }
  }, [searchText, wholesalerStatus, isUpdate]);

  useEffect(() => {
    fetchWholesalers();
  }, [fetchWholesalers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchText(searchInput);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearchText("");
    setWholesalerStatus("");
    setCurrentPage(1);
  };

  const totalResults = data.length;
  const dataTable = data.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  return (
    <div className="bg-[#f8fafc] dark:bg-gray-900 min-h-screen pb-10 px-4 sm:px-6">
      <AnimatedContent>
        <MainDrawer>
          <WholesalerDrawer />
        </MainDrawer>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pt-4">
          <div>
            <PageTitle>Wholesaler Management</PageTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">
              Review and approve retailer registrations and documentations
            </p>
          </div>
          
          <button
            onClick={() => toggleDrawer()}
            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 h-[52px]"
          >
            <FiPlus size={18} /> Add New Retailer
          </button>
        </div>

        {/* ── Status summary cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              label="Total Retailers"
              count={stats.total}
              subtext="Registered accounts"
              colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600"
              icon={FiUsers}
            />
            <StatsCard
              label="Pending"
              count={stats.pending}
              subtext="Awaiting review"
              colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600"
              icon={FiClock}
            />
            <StatsCard
              label="Approved"
              count={stats.approved}
              subtext="Active wholesalers"
              colorClass="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
              icon={FiCheckCircle}
            />
            <StatsCard
              label="Rejected"
              count={stats.rejected}
              subtext="Denied applications"
              colorClass="bg-red-50 dark:bg-red-900/20 text-red-600"
              icon={FiXCircle}
            />
        </div>

        {/* ── Search & filter bar ── */}
        <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 dark:border-gray-700/50 p-6 mb-8 transition-all">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center gap-5">
            <div className="relative flex items-center flex-1 w-full group">
              <FiSearch className="absolute left-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by business name, email, phone..."
                className="w-full h-[52px] pl-12 pr-6 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all dark:text-gray-200"
              />
            </div>

            <div className="w-full lg:w-64">
                <div className="relative">
                  <select
                    value={wholesalerStatus}
                    onChange={(e) => { setWholesalerStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full h-[52px] pl-6 pr-12 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-sm font-bold appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-gray-200"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <button
                type="submit"
                className="h-[52px] px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex-1 lg:flex-none"
              >
                Apply Filters
              </button>
              {(searchText || wholesalerStatus) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-[52px] px-5 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center group"
                  title="Reset all filters"
                >
                  <FiRotateCcw size={18} className="text-gray-500 group-hover:rotate-[-45deg] transition-transform" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 dark:border-gray-700/50 overflow-hidden">
          {loading ? (
            <div className="p-8">
              <TableLoading row={8} col={8} width={150} height={20} />
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
                <FiXCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Connection Error</h3>
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
              <button onClick={fetchWholesalers} className="mt-6 text-emerald-600 font-bold hover:underline flex items-center gap-2 mx-auto">
                <FiRefreshCw size={14} /> Try Again
              </button>
            </div>
          ) : dataTable.length > 0 ? (
            <>
              <TableContainer className="border-0 shadow-none">
                <Table>
                  <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    <tr>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 px-6">Business / ID</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5">Register Date</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5">Contact Details</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 text-center">Documents</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 text-center">Approve Status</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 text-right pr-6">Management</TableCell>
                    </tr>
                  </TableHeader>
                  <WholesalerTable
                    wholesalers={dataTable}
                    onStatusChange={fetchWholesalers}
                  />
                </Table>
              </TableContainer>
              
              <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-700">
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={RESULTS_PER_PAGE}
                  onChange={(p) => setCurrentPage(p)}
                  label="Wholesaler pagination"
                />
              </div>
            </>
          ) : (
            <div className="py-32">
              <NotFound title="No wholesalers found matching your filters." />
              <div className="flex justify-center mt-6">
                <button onClick={handleReset} className="text-emerald-600 font-bold hover:underline">Clear all filters</button>
              </div>
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
};

export default Retailer;
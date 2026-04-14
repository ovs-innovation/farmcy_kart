import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  Button,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { FiPlus, FiSearch, FiUsers, FiRefreshCcw, FiUserPlus, FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// Internal imports
import AdminServices from "@/services/AdminServices";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import StaffTable from "@/components/staff/StaffTable";
import NotFound from "@/components/table/NotFound";
import AnimatedContent from "@/components/common/AnimatedContent";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import PageTitle from "@/components/Typography/PageTitle";

const Staff = () => {
  const { t } = useTranslation();
  const { state } = useContext(AdminContext);
  const { toggleDrawer, lang, isUpdate } = useContext(SidebarContext);

  // Local state for management
  const [searchInput, setSearchInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [role, setRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const RESULTS_PER_PAGE = 10;

  // Fetch staff
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await AdminServices.getAllStaff({
          searchText,
          role,
        });
        setData(res || []);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load staff members");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [isUpdate, searchText, role]);

  // Use data directly as it's filtered on the backend
  const dataTable = data.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );
  const totalResults = data.length;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchText(searchInput);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearchText("");
    setRole("");
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-gray-900 min-h-screen pb-10">
      <AnimatedContent>
        {/* Drawer */}
        <MainDrawer>
          <StaffDrawer />
        </MainDrawer>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-1 pt-2">
          <div>
            <PageTitle>Team Management</PageTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">
              Manage your staff members, roles and platform access
            </p>
          </div>
          
          <button
            onClick={toggleDrawer}
            className="flex items-center gap-2 px-6 py-3.5 bg-teal-600 text-white rounded-2xl text-sm font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-95 h-[52px]"
          >
            <FiUserPlus size={18} /> Add Team Member
          </button>
        </div>

        {/* Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-[24px] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600">
                <FiUsers size={22} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Total Members</p>
                <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100">{data?.length}</h3>
              </div>
           </div>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-[24px] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <FiRefreshCcw size={22} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Active Roles</p>
                <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100">
                  {[...new Set(data.map(i => i.role))].length}
                </h3>
              </div>
           </div>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-[24px] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                <FiPlus size={22} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">New Members</p>
                <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100">
                  {data.filter(i => new Date(i.joiningData) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </h3>
              </div>
           </div>
        </div>

        {/* Search/Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 dark:border-gray-700/50 p-6 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center gap-5">
              <div className="relative flex items-center flex-1 w-full group">
                <FiSearch className="absolute left-5 text-gray-400 group-focus-within:text-teal-500 transition-colors pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name, email or mobile number..."
                  className="w-full h-[52px] pl-12 pr-6 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-sm font-medium focus:ring-2 focus:ring-teal-500/20 outline-none transition-all dark:text-gray-200"
                />
              </div>

              <div className="w-full lg:w-64">
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => { setRole(e.target.value); setCurrentPage(1); }}
                    className="w-full h-[52px] pl-6 pr-12 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700/50 text-sm font-bold appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-teal-500/20 transition-all dark:text-gray-200"
                  >
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="flex gap-3 w-full lg:w-auto">
                <Button type="submit" className="h-[52px] px-8 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/20 transition-all flex-1 lg:flex-none">
                  Filter Team
                </Button>
                {(searchText || role) && (
                  <Button
                    type="button"
                    layout="outline"
                    onClick={handleReset}
                    className="h-[52px] px-5 border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center"
                    title="Reset filters"
                  >
                    <FiRefreshCcw size={16} className="text-gray-500" />
                  </Button>
                )}
              </div>
            </form>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 dark:border-gray-700/50 overflow-hidden">
          {loading ? (
            <div className="p-8">
              <TableLoading row={6} col={7} width={150} height={20} />
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-500 font-bold">{error}</div>
          ) : dataTable.length > 0 ? (
            <>
              <TableContainer className="border-0 shadow-none">
                <Table>
                  <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    <tr>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 pl-6">Name & ID</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5">Email</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5">Contact</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 text-center">Join Date</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 text-center">Role</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 text-center">Status</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 text-center px-4">Published</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 text-right pr-6">Actions</TableCell>
                    </tr>
                  </TableHeader>
                  <StaffTable staffs={dataTable} lang={lang} />
                </Table>
              </TableContainer>
              
              <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-700">
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={RESULTS_PER_PAGE}
                  onChange={(p) => setCurrentPage(p)}
                  label="Staff pagination"
                />
              </div>
            </>
          ) : (
            <div className="py-24">
              <NotFound title="No team members found." />
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
};

export default Staff;

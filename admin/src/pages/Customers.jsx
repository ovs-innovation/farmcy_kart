import {
  Card,
  Button,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiUsers, FiSearch, FiChevronDown, FiPlus, FiArrowRight } from "react-icons/fi";

//internal import
import UploadMany from "@/components/common/UploadMany";
import CustomerTable from "@/components/customer/CustomerTable";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import CustomerServices from "@/services/CustomerServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import CustomerOverview from "@/components/customer/CustomerOverview";

const Customers = () => {
  const { data: customerStatistics, loading: loadingStatistics } = useAsync(
    CustomerServices.getCustomerStatistics
  );

  const [signUpPeriod, setSignUpPeriod] = useState("today");
  const [activeCriteria, setActiveCriteria] = useState("login");
  const [inactiveCriteria, setInactiveCriteria] = useState("noLogin");
  const [filterType, setFilterType] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    userRef,
    searchUser,
    dataTable,
    serviceData,
    filename,
    isDisabled,
    setSearchUser,
    totalResults,
    resultsPerPage,
    handleSubmitUser,
    handleSelectFile,
    handleChangePage,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(data);

  // Fetch customers based on filter AND search
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await CustomerServices.getAllCustomers({
          filterType: filterType === "all" ? "" : filterType,
          searchText: searchUser,
        });
        setData(response);
      } catch (err) {
        setError(err.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [filterType, searchUser]);

  const { t } = useTranslation();
  
  const handleResetField = () => {
    setSearchUser("");
    if (userRef.current) userRef.current.value = "";
    setFilterType("all");
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-gray-900 min-h-screen pb-10">
      <AnimatedContent>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-1 pt-2">
          <div>
            <PageTitle>{t("CustomersPage")}</PageTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">
              View and manage your platform's customer base
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <UploadMany
              title="Customers"
              filename={filename}
              exportData={data}
              isDisabled={isDisabled}
              handleSelectFile={handleSelectFile}
              handleRemoveSelectFile={handleRemoveSelectFile}
              handleUploadMultiple={handleUploadMultiple}
            />
          </div>
        </div>

        {/* Customer Statistics Cards */}
        <CustomerOverview
          statistics={customerStatistics}
          loading={loadingStatistics}
          signUpPeriod={signUpPeriod}
          setSignUpPeriod={setSignUpPeriod}
          activeCriteria={activeCriteria}
          setActiveCriteria={setActiveCriteria}
          inactiveCriteria={inactiveCriteria}
          setInactiveCriteria={setInactiveCriteria}
        />

        {/* Filter/Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 dark:border-gray-700/50 p-6 mb-8">
            <form
              onSubmit={handleSubmitUser}
              className="flex flex-col lg:flex-row gap-5 items-center"
            >
              <div className="w-full lg:flex-1 relative group">
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                <input
                  ref={userRef}
                  type="search"
                  name="search"
                  placeholder="Search customers by name, email or mobile..."
                  className="w-full pl-12 pr-6 py-4 text-sm font-medium border-0 bg-gray-50 dark:bg-gray-700/50 rounded-2xl focus:ring-2 focus:ring-teal-500/20 dark:text-gray-200 transition-all outline-none"
                />
              </div>

              <div className="w-full lg:w-72">
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full pl-6 pr-12 py-4 text-sm font-semibold bg-gray-50 dark:bg-gray-700/50 rounded-2xl border-0 focus:ring-2 focus:ring-teal-500/20 dark:text-gray-200 appearance-none cursor-pointer outline-none transition-all"
                  >
                    <option value="all">All Customer Types</option>
                    <option value="newSignUpsToday">New Sign-ups (Today)</option>
                    <option value="newSignUpsThisMonth">New Sign-ups (Month)</option>
                    <option value="activeByLogin">Active (Last Login)</option>
                    <option value="activeByOrder">Active (Recent Order)</option>
                    <option value="inactiveByNoLogin">Inactive (No Login)</option>
                    <option value="inactiveByNoOrder">Inactive (No Order)</option>
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <Button 
                  type="submit" 
                  className="h-[52px] px-8 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold shadow-lg shadow-teal-600/20 flex-1 lg:flex-none transition-all active:scale-95"
                >
                  Apply Filters
                </Button>

                <Button
                  layout="outline"
                  onClick={handleResetField}
                  type="reset"
                  className="h-[52px] px-8 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl font-bold transition-all active:scale-95"
                >
                  Reset
                </Button>
              </div>
            </form>
        </div>

        {/* Table Content */}
        <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 dark:border-gray-700/50 overflow-hidden">
          {loading ? (
            <div className="p-8">
              <TableLoading row={10} col={7} width={160} height={20} />
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <FiPlus className="rotate-45 text-2xl" />
              </div>
              <p className="text-red-500 font-bold">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 text-sm font-bold text-teal-600 hover:underline"
              >
                Try refreshing the page
              </button>
            </div>
          ) : dataTable?.length !== 0 ? (
            <>
              <TableContainer className="border-0 shadow-none">
                <Table>
                  <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    <tr>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 pl-6">{t("CustomersId")}</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5">{t("CustomersJoiningDate")}</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5">{t("CustomersName")}</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5">{t("CustomersEmail")}</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5">Role</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 text-center">{t("CustomersPhone")}</TableCell>
                      <TableCell className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-5 text-right pr-6">
                        {t("CustomersActions")}
                      </TableCell>
                    </tr>
                  </TableHeader>
                  <CustomerTable customers={dataTable} />
                </Table>
              </TableContainer>
              
              <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-700">
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={handleChangePage}
                  label="Table navigation"
                />
              </div>
            </>
          ) : (
            <div className="py-24">
              <NotFound title="No customers found matching your criteria." />
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
};

export default Customers;

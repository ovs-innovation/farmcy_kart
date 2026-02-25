import {
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableContainer,
  TableFooter,
  TableHeader,
  TableCell,
} from "@windmill/react-ui";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import WholesalerTable from "@/components/wholesaler/WholesalerTable";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import useFilter from "@/hooks/useFilter";
import CustomerServices from "@/services/CustomerServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import MainDrawer from "@/components/drawer/MainDrawer";
import WholesalerDrawer from "@/components/drawer/WholesalerDrawer";
import { useContext } from "react";
import { SidebarContext } from "@/context/SidebarContext";

/* ── Status summary pills ── */
const SummaryPill = ({ label, count, color }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${color}`}>
    <span className="font-bold text-base">{count}</span>
    <span>{label}</span>
  </div>
);

const Retailer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { toggleDrawer } = useContext(SidebarContext);

  const fetchWholesalers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CustomerServices.getAllWholesalers();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to fetch wholesalers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWholesalers();
  }, [fetchWholesalers]);

  const {
    userRef,
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

  const { t } = useTranslation();

  const handleResetField = () => {
    setSearchUser("");
    userRef.current.value = "";
  };

  /* Status counts for summary bar */
  const pendingCount = data.filter((w) => !w.wholesalerStatus || w.wholesalerStatus === "pending").length;
  const approvedCount = data.filter((w) => w.wholesalerStatus === "approved").length;
  const rejectedCount = data.filter((w) => w.wholesalerStatus === "rejected").length;

  return (
    <>
      <PageTitle>Retailers / Wholesalers</PageTitle>

      <AnimatedContent>
        {/* ── Status summary bar ── */}
        {!loading && data.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-5 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <SummaryPill
              label="Total"
              count={data.length}
              color="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
            />
            <SummaryPill
              label="Pending Verification"
              count={pendingCount}
              color="bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300"
            />
            <SummaryPill
              label="Approved"
              count={approvedCount}
              color="bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300"
            />
            <SummaryPill
              label="Rejected"
              count={rejectedCount}
              color="bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300"
            />
            <button
              onClick={fetchWholesalers}
              className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              Refresh
            </button>
          </div>
        )}

        {/* ── Search & filter bar ── */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={handleSubmitUser}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={userRef}
                  type="search"
                  name="search"
                  placeholder={t("CustomersPageSearchPlaceholder")}
                />
              </div>

              <div className="flex items-center gap-2 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <div className="w-full mx-1">
                  <button
                    className="h-12 w-full bg-store-700 text-white rounded px-4 py-2"
                    type="submit"
                  >
                    Filter
                  </button>
                </div>

                <div className="w-full mx-1">
                  <button
                    onClick={handleResetField}
                    type="button"
                    className="px-4 md:py-1 py-2 h-12 text-sm dark:bg-gray-700 rounded"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => toggleDrawer()}
            className="bg-store-700 text-white px-4 py-2 rounded"
          >
            Add Retailer
          </button>
        </div>

        <MainDrawer>
          <WholesalerDrawer />
        </MainDrawer>
      </AnimatedContent>

      {loading ? (
        <TableLoading row={12} col={9} width={220} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 overflow-x-scroll w-full custom-scrollbar">
          <Table className="w-full">
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>Joining Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Aadhar</TableCell>
                <TableCell>PAN</TableCell>
                <TableCell>GST</TableCell>
                <TableCell>Drug License</TableCell>
                {/* ── Approval Status column ── */}
                <TableCell>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-.5-13h1v6h-1zm0 8h1v2h-1z" />
                    </svg>
                    Approval Status
                  </span>
                </TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            <WholesalerTable
              wholesalers={dataTable}
              onStatusChange={() => fetchWholesalers()}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no wholesalers right now." />
      )}
    </>
  );
};
export default Retailer;
import {
  Card,
  Button,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  Select,
} from "@windmill/react-ui";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiUsers, FiUserPlus, FiActivity, FiUserX } from "react-icons/fi";

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
import CardItem from "@/components/dashboard/CardItem";

const Customers = () => {
  const { data: customerStatistics, loading: loadingStatistics } = useAsync(
    CustomerServices.getCustomerStatistics
  );

  const [signUpPeriod, setSignUpPeriod] = useState("today"); // "today" or "month"
  const [activeCriteria, setActiveCriteria] = useState("login"); // "login" or "order"
  const [inactiveCriteria, setInactiveCriteria] = useState("noLogin"); // "noLogin" or "noOrder"
  const [filterType, setFilterType] = useState("all"); // Filter type for customer table
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customers based on filter
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await CustomerServices.getAllCustomers({
          filterType: filterType === "all" ? "" : filterType,
        });
        setData(response);
      } catch (err) {
        setError(err.message || "Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [filterType]);

  // console.log('customer',data)

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

  const newSignUpsCount =
    signUpPeriod === "today"
      ? customerStatistics?.todaySignups || 0
      : customerStatistics?.thisMonthSignups || 0;

  const activeCustomersCount =
    activeCriteria === "login"
      ? customerStatistics?.activeCustomersByLogin || 0
      : customerStatistics?.activeCustomersByOrder || 0;

  const inactiveCustomersCount =
    inactiveCriteria === "noLogin"
      ? customerStatistics?.inactiveCustomersByNoLogin || 0
      : customerStatistics?.inactiveCustomersByNoOrder || 0;

  return (
    <>
      <PageTitle>{t("CustomersPage")}</PageTitle>

      <AnimatedContent>
        {/* Customer Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
          <CardItem
            title="Total Customers"
            Icon={FiUsers}
            loading={loadingStatistics}
            quantity={customerStatistics?.totalCustomers || 0}
            className="text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500"
          />
          <Card className="flex h-full relative">
            <CardBody className="flex items-center border border-gray-200 dark:border-gray-800 w-full rounded-lg py-10">
              <div className="flex items-center justify-center p-3 rounded-full h-12 w-12 text-center mr-4 text-lg text-indigo-600 dark:text-indigo-100 bg-indigo-100 dark:bg-indigo-500">
                <FiUserPlus />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    New Sign Ups
                  </h6>
                  <div className="flex gap-2 absolute right-1 top-[12px]">
                    <button
                      onClick={() => setSignUpPeriod("today")}
                      className={`px-2 py-1 text-xs rounded ${
                        signUpPeriod === "today"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setSignUpPeriod("month")}
                      className={`px-2 py-1 text-xs rounded ${
                        signUpPeriod === "month"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      This Month
                    </button>
                  </div>
                </div>
                {loadingStatistics ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold leading-none text-gray-600 dark:text-gray-200">
                    {newSignUpsCount}
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
          <Card className="flex h-full relative">
            <CardBody className="flex border border-gray-200 dark:border-gray-800 w-full rounded-lg py-10">
              <div className="flex items-center justify-center p-3 rounded-full h-12 w-12 text-center mr-4 text-lg text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500">
                <FiActivity />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Customers
                    <span className="text-xs text-gray-500 block mt-0.5">(Last 30 days)</span>
                  </h6>
                  <div className="flex gap-2 absolute right-1 top-[12px]">
                    <button
                      onClick={() => setActiveCriteria("login")}
                      className={`px-2 py-1 text-xs rounded ${
                        activeCriteria === "login"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setActiveCriteria("order")}
                      className={`px-2 py-1 text-xs rounded ${
                        activeCriteria === "order"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Order
                    </button>
                  </div>
                </div>
                {loadingStatistics ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold leading-none text-gray-600 dark:text-gray-200">
                    {activeCustomersCount}
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
          <Card className="flex h-full relative">
            <CardBody className="flex border border-gray-200 dark:border-gray-800 w-full rounded-lg py-10">
              <div className="flex items-center justify-center p-3 rounded-full h-12 w-12 text-center mr-4 text-lg text-red-600 dark:text-red-100 bg-red-100 dark:bg-red-500">
                <FiUserX />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Inactive Customers
                    <span className="text-xs text-gray-500 block mt-0.5">
                      (Last 30 days)
                    </span>
                  </h6>
                  <div className="flex gap-2 absolute right-1 top-[12px]">
                    <button
                      onClick={() => setInactiveCriteria("noLogin")}
                      className={`px-2 py-1 text-xs rounded ${
                        inactiveCriteria === "noLogin"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      No Login
                    </button>
                    <button
                      onClick={() => setInactiveCriteria("noOrder")}
                      className={`px-2 py-1 text-xs rounded ${
                        inactiveCriteria === "noOrder"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      No Order
                    </button>
                  </div>
                </div>
                {loadingStatistics ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold leading-none text-gray-600 dark:text-gray-200">
                    {inactiveCustomersCount}
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={handleSubmitUser}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="items-center">
                <UploadMany
                  title="Customers"
                  exportData={data}
                  filename={filename}
                  isDisabled={isDisabled}
                  handleSelectFile={handleSelectFile}
                  handleUploadMultiple={handleUploadMultiple}
                  handleRemoveSelectFile={handleRemoveSelectFile}
                />
              </div>
            </form>
          </CardBody>
        </Card>

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
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-5 mr-1"
                ></button>
              </div>
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-12"
                >
                  <option value="all">All Customers</option>
                  <option value="newSignUpsToday">New Sign Ups (Today)</option>
                  <option value="newSignUpsThisMonth">New Sign Ups (This Month)</option>
                  <option value="activeByLogin">Active Customers (Login - Last 30 days)</option>
                  <option value="activeByOrder">Active Customers (Order - Last 30 days)</option>
                  <option value="inactiveByNoLogin">Inactive Customers (No Login - Last 30 days)</option>
                  <option value="inactiveByNoOrder">Inactive Customers (No Order - Last 30 days)</option>
                </Select>
              </div>
              <div className="flex items-center gap-2 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <div className="w-full mx-1">
                  <Button type="submit" className="h-12 w-full bg-store-700">
                    Filter
                  </Button>
                </div>

                <div className="w-full mx-1">
                  <Button
                    layout="outline"
                    onClick={handleResetField}
                    type="reset"
                    className="px-4 md:py-1 py-2 h-12 text-sm dark:bg-gray-700"
                  >
                    <span className="text-black dark:text-gray-200">Reset</span>
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </AnimatedContent>

      {loading ? (
        // <Loading loading={loading} />
        <TableLoading row={12} col={6} width={190} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 overflow-x-scroll w-full custom-scrollbar">
          <Table className="w-full">
            <TableHeader>
              <tr>
                <TableCell>{t("CustomersId")}</TableCell>
                <TableCell>{t("CustomersJoiningDate")}</TableCell>
                <TableCell>{t("CustomersName")}</TableCell>
                <TableCell>{t("CustomersEmail")}</TableCell>
                <TableCell>{"Type"}</TableCell>
                <TableCell>{t("CustomersPhone")}</TableCell>
                <TableCell className="text-right">
                  {t("CustomersActions")}
                </TableCell>
              </tr>
            </TableHeader>
            <CustomerTable customers={dataTable} />
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
        <NotFound title="Sorry, There are no customers right now." />
      )}
    </>
  );
};

export default Customers;

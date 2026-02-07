import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useState, useRef, useEffect } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import exportFromJSON from "export-from-json";
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck, FiXCircle, FiList, FiChevronDown } from "react-icons/fi";

//internal import
import { notifyError } from "@/utils/toast";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import OrderServices from "@/services/OrderServices";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import OrderTable from "@/components/order/OrderTable";
import TableLoading from "@/components/preloader/TableLoading";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import AnimatedContent from "@/components/common/AnimatedContent";
import CardItem from "@/components/dashboard/CardItem";

const Orders = () => {
  const {
    time,
    setTime,
    status,
    endDate,
    setStatus,
    setEndDate,
    startDate,
    currentPage,
    searchText,
    searchRef,
    method,
    setMethod,
    userRole,
    setUserRole,
    setStartDate,
    setSearchText,
    handleChangePage,
    handleSubmitForAll,
    resultsPerPage,
  } = useContext(SidebarContext);

  const { t } = useTranslation();

  const [loadingExport, setLoadingExport] = useState(false);
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const columnToggleRef = useRef(null);

  const [visibleColumns, setVisibleColumns] = useState({
    invoice: true,
    time: true,
    customerName: true,
    customerId: false,
    productName: false,
    productId: false,
    contact: true,
    shippingCost: false,
    discount: false,
    method: true,
    amount: true,
    status: true,
    action: true,
    actions: true,
  });

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        columnToggleRef.current &&
        !columnToggleRef.current.contains(event.target)
      ) {
        setShowColumnToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, loading, error } = useAsync(() =>
    OrderServices.getAllOrders({
      day: time,
      method: method,
      status: status,
      page: currentPage,
      endDate: endDate,
      startDate: startDate,
      limit: resultsPerPage,
      customerName: searchText,
      userRole: userRole,
    })
  );

  const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
    OrderServices.getDashboardCount
  );

  const { currency, getNumber, getNumberTwo } = useUtilsFunction();

  const { dataTable, serviceData } = useFilter(data?.orders);

  const handleDownloadOrders = async () => {
    try {
      setLoadingExport(true);
      const res = await OrderServices.getAllOrders({
        page: 1,
        day: time,
        method: method,
        status: status,
        endDate: endDate,
        download: true,
        startDate: startDate,
        limit: data?.totalDoc,
        customerName: searchText,
        userRole: userRole,
      });

      // console.log("handleDownloadOrders", res);
      const exportData = res?.orders?.map((order) => {
        return {
          _id: order._id,
          invoice: order.invoice,
          subTotal: getNumberTwo(order.subTotal),
          shippingCost: getNumberTwo(order.shippingCost),
          discount: getNumberTwo(order?.discount),
          total: getNumberTwo(order.total),
          paymentMethod: order.paymentMethod,
          status: order.status,
          user_info: order?.user_info?.name,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      });
      // console.log("exportData", exportData);

      exportFromJSON({
        data: exportData,
        fileName: "orders",
        exportType: exportFromJSON.types.csv,
      });
      setLoadingExport(false);
    } catch (err) {
      setLoadingExport(false);
      // console.log("err on orders download", err);
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  // handle reset field
  const handleResetField = () => {
    setTime("");
    setMethod("");
    setStatus("");
    setUserRole("");
    setEndDate("");
    setStartDate("");
    setSearchText("");
    searchRef.current.value = "";
  };
  // console.log("data in orders page", data);

  return (
    <>
      <PageTitle>{t("Orders")}</PageTitle>

      <AnimatedContent className="overflow-x-hidden">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 mb-5">
          <CardItem
            title="Total Order"
            Icon={FiShoppingCart}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalOrder || 0}
            className="text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500"
          />
          <CardItem
            title={t("OrderPending")}
            Icon={FiRefreshCw}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalPendingOrder?.count || 0}
            amount={dashboardOrderCount?.totalPendingOrder?.total || 0}
            className="text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500"
          />
          <CardItem
            title={t("OrderProcessing")}
            Icon={FiTruck}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalProcessingOrder || 0}
            className="text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500"
          />
          <CardItem
            title={t("OrderDelivered")}
            Icon={FiCheck}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalDeliveredOrder || 0}
            className="text-green-600 dark:text-green-100 bg-green-100 dark:bg-green-500"
          />
          <CardItem
            title={t("OrderCancel")}
            Icon={FiXCircle}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalCancelOrder || 0}
            className="text-red-600 dark:text-red-100 bg-red-100 dark:bg-red-500"
          />
        </div>

        <Card className="min-w-0 shadow-xs bg-white dark:bg-gray-800 mb-5 relative z-[60] !overflow-visible">
          <CardBody className="!overflow-visible">
            <form onSubmit={handleSubmitForAll}>
              <div className="grid gap-4 lg:gap-4 xl:gap-6 md:gap-2 md:grid-cols-6 py-2">
                {/* User Role Toggle Buttons - Left Side */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUserRole("")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      userRole === ""
                        ? "bg-store-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRole("customer")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      userRole === "customer"
                        ? "bg-store-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRole("wholesaler")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      userRole === "wholesaler"
                        ? "bg-store-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Retailer
                  </button>
                </div>
                    <br />
                <div>
                  <Input
                    ref={searchRef}
                    type="search"
                    name="search"
                    placeholder="Search by Customer Name"
                  />
                </div>

                <div>
                  <Select onChange={(e) => setStatus(e.target.value)}>
                    <option value="Status" defaultValue hidden>
                      {t("Status")}
                    </option>
                    <option value="Delivered">{t("PageOrderDelivered")}</option>
                    <option value="Pending">{t("PageOrderPending")}</option>
                    <option value="Processing">
                      {t("PageOrderProcessing")}
                    </option>
                    <option value="Cancel">{t("OrderCancel")}</option>
                  </Select>
                </div>

                <div>
                  <Select onChange={(e) => setTime(e.target.value)}>
                    <option value="Order limits" defaultValue hidden>
                      {t("Orderlimits")}
                    </option>
                    <option value="5">{t("DaysOrders5")}</option>
                    <option value="7">{t("DaysOrders7")}</option>
                    <option value="15">{t("DaysOrders15")}</option>
                    <option value="30">{t("DaysOrders30")}</option>
                  </Select>
                </div>
                <div>
                  <Select onChange={(e) => setMethod(e.target.value)}>
                    <option value="Method" defaultValue hidden>
                      {t("Method")}
                    </option>

                    <option value="Cash">{t("Cash")}</option>
                    <option value="Card">{t("Card")}</option>
                    <option value="Credit">{t("Credit")}</option>
                  </Select>
                </div>
                <div>
                  {loadingExport ? (
                    <Button
                      disabled={true}
                      type="button"
                      className="h-12 w-full"
                    >
                      <img
                        src={spinnerLoadingImage}
                        alt="Loading"
                        width={20}
                        height={10}
                      />{" "}
                      <span className="font-serif ml-2 font-light">
                        Processing
                      </span>
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleDownloadOrders}
                        disabled={data?.orders?.length <= 0 || loadingExport}
                        type="button"
                        className={`${
                          (data?.orders?.length <= 0 || loadingExport) &&
                          "opacity-50 cursor-not-allowed bg-store-600"
                        } flex items-center justify-center text-sm leading-5 h-12 w-full text-center transition-colors duration-150 font-medium px-4 py-2 rounded-md text-white bg-store-500 border border-transparent active:bg-store-600 hover:bg-store-600 `}
                      >
                        <IoCloudDownloadOutline className="text-xl" />
                      </button>

                      <div className="relative w-full z-[60]" ref={columnToggleRef}>
                        <button
                          onClick={() => setShowColumnToggle(!showColumnToggle)}
                          type="button"
                          className="flex items-center justify-between text-sm leading-5 h-12 w-full text-center transition-colors duration-150 font-medium px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          <FiList className="text-lg" />
                          <FiChevronDown className="ml-2" />
                        </button>

                        {showColumnToggle && (
                          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-[100] max-h-96 overflow-y-auto">
                            <div className="py-1 px-2" role="menu">
                              {Object.keys(visibleColumns).map((col) => (
                                <label
                                  key={col}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-md"
                                >
                                  <input
                                    type="checkbox"
                                    checked={visibleColumns[col]}
                                    onChange={() => toggleColumn(col)}
                                    className="form-checkbox h-4 w-4 text-store-500 transition duration-150 ease-in-out mr-3"
                                  />
                                  {col === "invoice" && t("InvoiceNo")}
                                  {col === "time" && t("TimeTbl")}
                                  {col === "customerName" && t("CustomerName")}
                                  {col === "customerId" && "Customer ID"}
                                  {col === "productName" && "Product Name"}
                                  {col === "productId" && "Product ID"}
                                  {col === "contact" && "Contact"}
                                  {col === "shippingCost" && "Shipping Cost"}
                                  {col === "discount" && "Discount"}
                                  {col === "method" && t("MethodTbl")}
                                  {col === "amount" && t("AmountTbl")}
                                  {col === "status" && t("OderStatusTbl")}
                                  {col === "action" && "Action"}
                                  {col === "actions" && "Actions"}
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="mt-2 md:mt-0 flex items-center xl:gap-x-4 gap-x-1 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <div className="w-full mx-1">
                    <Label style={{ visibility: "hidden" }}>Filter</Label>
                    <Button type="submit" className="h-12 w-full bg-store-700">
                      Filter
                    </Button>
                  </div>

                  <div className="w-full">
                    <Label style={{ visibility: "hidden" }}>Reset</Label>
                    <Button
                      layout="outline"
                      onClick={handleResetField}
                      type="reset"
                      className="px-4 md:py-1 py-3 text-sm dark:bg-gray-700"
                    >
                      <span className="text-black dark:text-gray-200">
                        Reset
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        {data?.methodTotals?.length > 0 && (
          <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
            <CardBody>
              <div className="flex gap-1">
                {data?.methodTotals?.map((el, i) => (
                  <div key={i + 1} className="dark:text-gray-300">
                    {el?.method && (
                      <>
                        <span className="font-medium"> {el.method}</span> :{" "}
                        <span className="font-semibold mr-2">
                          {currency}
                          {getNumber(el.total)}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {loading ? (
          <TableLoading row={12} col={7} width={160} height={20} />
        ) : error ? (
          <span className="text-center mx-auto text-red-500">{error}</span>
        ) : serviceData?.length !== 0 ? (
          <div className="mb-8 overflow-x-auto w-full">
            <TableContainer className="dark:bg-gray-900 min-w-full">
              <Table className="w-full min-w-max">
              <TableHeader>
                <tr>
                  {visibleColumns.invoice && (
                    <TableCell className="whitespace-nowrap">
                      {t("InvoiceNo")}
                    </TableCell>
                  )}
                  {visibleColumns.time && (
                    <TableCell className="whitespace-nowrap">
                      {t("TimeTbl")}
                    </TableCell>
                  )}
                  {visibleColumns.customerName && (
                    <TableCell className="whitespace-nowrap">
                      {t("CustomerName")}
                    </TableCell>
                  )}
                  {visibleColumns.customerId && (
                    <TableCell className="whitespace-nowrap">
                      Customer ID
                    </TableCell>
                  )}
                  {visibleColumns.productName && (
                    <TableCell className="whitespace-nowrap">
                      Product Name
                    </TableCell>
                  )}
                  {visibleColumns.productId && (
                    <TableCell className="whitespace-nowrap">
                      Product ID
                    </TableCell>
                  )}
                  {visibleColumns.contact && (
                    <TableCell className="whitespace-nowrap">Contact</TableCell>
                  )}
                  {visibleColumns.shippingCost && (
                    <TableCell className="whitespace-nowrap">
                      Shipping
                    </TableCell>
                  )}
                  {visibleColumns.discount && (
                    <TableCell className="whitespace-nowrap">
                      Discount
                    </TableCell>
                  )}
                  {visibleColumns.method && (
                    <TableCell className="whitespace-nowrap">
                      {t("MethodTbl")}
                    </TableCell>
                  )}
                  {visibleColumns.amount && (
                    <TableCell className="whitespace-nowrap">
                      {t("AmountTbl")}
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell className="whitespace-nowrap">
                      {t("OderStatusTbl")}
                    </TableCell>
                  )}
                  {visibleColumns.action && (
                    <TableCell className="text-center whitespace-nowrap">
                      Action
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell className="text-right whitespace-nowrap">
                      Actions
                    </TableCell>
                  )}
                </tr>
              </TableHeader>

              <OrderTable orders={dataTable} visibleColumns={visibleColumns} />
            </Table>

            <TableFooter>
              <Pagination
                totalResults={data?.totalDoc}
                resultsPerPage={resultsPerPage}
                onChange={handleChangePage}
                label="Table navigation"
              />
            </TableFooter>
            </TableContainer>
          </div>
        ) : (
          <NotFound title="Sorry, There are no orders right now." />
        )}
      </AnimatedContent>
    </>
  );
};

export default Orders;

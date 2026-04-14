import {
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  WindmillContext,
} from "@windmill/react-ui";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck, FiXCircle, FiUserPlus, FiLayers, FiSearch } from "react-icons/fi";
import { ImCreditCard, ImStack } from "react-icons/im";

//internal import
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import LineChart from "@/components/chart/LineChart/LineChart";
import PieChart from "@/components/chart/Pie/PieChart";
// import CardItem from "@/components/dashboard/CardItem";
// import CardItemTwo from "@/components/dashboard/CardItemTwo";
import ModernStats from "@/components/dashboard/ModernStats";
import DetailedOrderStatus from "@/components/dashboard/DetailedOrderStatus";
import GrossSaleChart from "@/components/dashboard/GrossSaleChart";
import UserStatisticsChart from "@/components/dashboard/UserStatisticsChart";
import TopPopularSelling from "@/components/dashboard/TopPopularSelling";
// import BottomPopularSelling from "@/components/dashboard/BottomPopularSelling";
import ChartCard from "@/components/chart/ChartCard";

import OrderTable from "@/components/order/OrderTable";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import OrderServices from "@/services/OrderServices";
import AnimatedContent from "@/components/common/AnimatedContent";

const Dashboard = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);

  dayjs.extend(isBetween);
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);

  const { currentPage, handleChangePage } = useContext(SidebarContext);

  // react hook
  const [todayOrderAmount, setTodayOrderAmount] = useState(0);
  const [yesterdayOrderAmount, setYesterdayOrderAmount] = useState(0);
  const [salesReport, setSalesReport] = useState([]);
  const [todayCashPayment, setTodayCashPayment] = useState(0);
  const [todayCardPayment, setTodayCardPayment] = useState(0);
  const [todayCreditPayment, setTodayCreditPayment] = useState(0);
  const [yesterdayCashPayment, setYesterdayCashPayment] = useState(0);
  const [yesterdayCardPayment, setYesterdayCardPayment] = useState(0);
  const [yesterdayCreditPayment, setYesterdayCreditPayment] = useState(0);
  const [timeFilter, setTimeFilter] = useState("year"); // Added for period filtering

  const {
    data: bestSellerProductChart,
    loading: loadingBestSellerProduct,
    error,
  } = useAsync(OrderServices.getBestSellerProductChart);

  const { data: dashboardRecentOrder, loading: loadingRecentOrder } = useAsync(
    () => OrderServices.getDashboardRecentOrder({ page: currentPage, limit: 8 })
  );

  const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
    OrderServices.getDashboardCount
  );

  const { data: dashboardOrderAmount, loading: loadingOrderAmount } = useAsync(
    OrderServices.getDashboardAmount
  );

  // console.log("dashboardOrderCount", dashboardOrderCount);

  const [searchTerm, setSearchTerm] = useState("");
  const { dataTable, serviceData } = useFilter(dashboardRecentOrder?.orders);

  // Filter data based on search term (Search within invoice No, Customer Name)
  const filteredData = dataTable?.filter(order =>
    String(order.invoice || "")?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user_info?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // today orders show
    const todayOrder = dashboardOrderAmount?.ordersData?.filter((order) =>
      dayjs(order.updatedAt).isToday()
    );
    //  console.log('todayOrder',dashboardOrderAmount.ordersData)
    const todayReport = todayOrder?.reduce((pre, acc) => pre + acc.total, 0);
    setTodayOrderAmount(todayReport);

    // yesterday orders
    const yesterdayOrder = dashboardOrderAmount?.ordersData?.filter((order) =>
      dayjs(order.updatedAt).set(-1, "day").isYesterday()
    );

    const yesterdayReport = yesterdayOrder?.reduce(
      (pre, acc) => pre + acc.total,
      0
    );
    setYesterdayOrderAmount(yesterdayReport);

    // sales orders chart data
    const salesOrderChartData = dashboardOrderAmount?.ordersData?.filter(
      (order) =>
        dayjs(order.updatedAt).isBetween(
          new Date().setDate(new Date().getDate() - 7),
          new Date()
        )
    );

    salesOrderChartData?.reduce((res, value) => {
      let onlyDate = value.updatedAt.split("T")[0];

      if (!res[onlyDate]) {
        res[onlyDate] = { date: onlyDate, total: 0, order: 0 };
        salesReport.push(res[onlyDate]);
      }
      res[onlyDate].total += value.total;
      res[onlyDate].order += 1;
      return res;
    }, {});

    setSalesReport(salesReport);

    const todayPaymentMethodData = [];
    const yesterDayPaymentMethodData = [];

    // today order payment method
    dashboardOrderAmount?.ordersData?.filter((item, value) => {
      if (dayjs(item.updatedAt).isToday()) {
        if (item.paymentMethod === "Cash") {
          let cashMethod = {
            paymentMethod: "Cash",
            total: item.total,
          };
          todayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Credit") {
          const cashMethod = {
            paymentMethod: "Credit",
            total: item.total,
          };

          todayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Card") {
          const cashMethod = {
            paymentMethod: "Card",
            total: item.total,
          };

          todayPaymentMethodData.push(cashMethod);
        }
      }

      return item;
    });
    // yesterday order payment method
    dashboardOrderAmount?.ordersData?.filter((item, value) => {
      if (dayjs(item.updatedAt).set(-1, "day").isYesterday()) {
        if (item.paymentMethod === "Cash") {
          let cashMethod = {
            paymentMethod: "Cash",
            total: item.total,
          };
          yesterDayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Credit") {
          const cashMethod = {
            paymentMethod: "Credit",
            total: item?.total,
          };

          yesterDayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Card") {
          const cashMethod = {
            paymentMethod: "Card",
            total: item?.total,
          };

          yesterDayPaymentMethodData.push(cashMethod);
        }
      }

      return item;
    });

    const todayCsCdCit = Object.values(
      todayPaymentMethodData.reduce((r, { paymentMethod, total }) => {
        if (!r[paymentMethod]) {
          r[paymentMethod] = { paymentMethod, total: 0 };
        }
        r[paymentMethod].total += total;

        return r;
      }, {})
    );
    const today_cash_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Cash"
    );
    setTodayCashPayment(today_cash_payment?.total);
    const today_card_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Card"
    );
    setTodayCardPayment(today_card_payment?.total);
    const today_credit_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Credit"
    );
    setTodayCreditPayment(today_credit_payment?.total);

    const yesterDayCsCdCit = Object.values(
      yesterDayPaymentMethodData.reduce((r, { paymentMethod, total }) => {
        if (!r[paymentMethod]) {
          r[paymentMethod] = { paymentMethod, total: 0 };
        }
        r[paymentMethod].total += total;

        return r;
      }, {})
    );
    const yesterday_cash_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Cash"
    );
    setYesterdayCashPayment(yesterday_cash_payment?.total);
    const yesterday_card_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Card"
    );
    setYesterdayCardPayment(yesterday_card_payment?.total);
    const yesterday_credit_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Credit"
    );
    setYesterdayCreditPayment(yesterday_credit_payment?.total);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardOrderAmount]);

  return (
    <>
      <PageTitle>{t("DashboardOverview")}</PageTitle>

      <AnimatedContent>
        <div className="space-y-8">
          {/* Modern Main Stats UI - Based on exact image request */}
          <ModernStats 
            dashboardOrderCount={dashboardOrderCount} 
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            dashboardOrderAmount={dashboardOrderAmount}
          />

          {/* Detailed Status Cards beneath Main Stats */}
          <DetailedOrderStatus dashboardOrderCount={dashboardOrderCount} />

          {/* Charts area */}
          <section className="mt-8 space-y-8">
            {/* Row 1: Gross Sale & User Statistics - 2:1 Ratio */}
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <GrossSaleChart 
                  data={dashboardOrderAmount} 
                  loading={loadingOrderAmount} 
                />
              </div>
              <div className="lg:col-span-1">
                <UserStatisticsChart 
                   data={dashboardOrderCount}
                   loading={loadingOrderCount}
                />
              </div>
            </div>

            {/* Top Selling & Popular Section - New Image UI */}
            <TopPopularSelling 
               bestSeller={bestSellerProductChart?.bestSellingProduct} 
               topBrands={dashboardOrderCount?.topBrands}
            />
            {/* <BottomPopularSelling 
               goldCustomers={dashboardOrderCount?.goldCustomers}
            /> */}
          </section>
        </div>
      </AnimatedContent>


      {/* Recent Order Section */}
      <section className="mt-10 bg-white dark:bg-gray-800 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-gray-100/80 dark:border-gray-700 overflow-hidden transition-all duration-500">
        {/* Header inside same white container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t("RecentOrder")}
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search by invoice or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[260px] h-10 pl-5 pr-11 bg-[#f8fafb] dark:bg-gray-700/50 border border-[#e5e9eb] dark:border-gray-600 rounded-2xl text-xs font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-400 outline-none focus:border-gray-300 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-200"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[#9fc9d3] group-focus-within:text-cyan-500 transition-colors pointer-events-none">
                <FiSearch className="w-5 h-5" style={{ strokeWidth: '3px' }} />
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border-2 border-[#e5e9eb] dark:border-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Table / content */}
        {loadingRecentOrder ? (
          <div className="p-5 md:p-6 text-center">
            <TableLoading row={5} col={4} />
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <span className="text-rose-500 font-bold tracking-tight">{error}</span>
          </div>
        ) : serviceData?.length !== 0 ? (
          <TableContainer className="mb-0 custom-scrollbar border-none shadow-none">
            <Table className="w-full">
              <TableHeader className="bg-[#f8fafb] dark:bg-gray-800/80">
                <tr>
                  <TableCell className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                    {t("InvoiceNo")}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                    {t("TimeTbl")}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                    {t("CustomerName")}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                    {t("MethodTbl")}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                    {t("AmountTbl")}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                    {t("OderStatusTbl")}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                    {t("ActionTbl")}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
                    {t("InvoiceTbl")}
                  </TableCell>
                </tr>
              </TableHeader>

              <OrderTable
                orders={filteredData}
                visibleColumns={{
                  invoice: true,
                  time: true,
                  customerName: true,
                  method: true,
                  amount: true,
                  status: true,
                  action: true,
                  actions: true,
                }}
              />
            </Table>

            <TableFooter className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <Pagination
                totalResults={dashboardRecentOrder?.totalOrder}
                resultsPerPage={8}
                onChange={handleChangePage}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        ) : (
          <div className="p-5 md:p-6">
            <NotFound title="Sorry, There are no orders right now." />
          </div>
        )}
      </section>
    </>
  );
};

export default Dashboard;

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
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck, FiXCircle, FiUserPlus, FiLayers } from "react-icons/fi";
import { ImCreditCard, ImStack } from "react-icons/im";

//internal import
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import LineChart from "@/components/chart/LineChart/LineChart";
import PieChart from "@/components/chart/Pie/PieChart";
import CardItem from "@/components/dashboard/CardItem";
import CardItemTwo from "@/components/dashboard/CardItemTwo";
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

  const { dataTable, serviceData } = useFilter(dashboardRecentOrder?.orders);

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
          {/* Top summary with soft gradient background */}
          <section className="rounded-2xl bg-gradient-to-r from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 border border-gray-100/70 dark:border-gray-800 shadow-sm px-4 py-5 md:px-6 md:py-6">
           <div className="grid grid-cols-2 gap-3 mb-6 xl:grid-cols-5 md:grid-cols-3">
    <CardItemTwo
      mode={mode}
      title="Today Order"
      title2="TodayOrder"
      Icon={ImStack}
      cash={todayCashPayment || 0}
      card={todayCardPayment || 0}
      credit={todayCreditPayment || 0}
      price={todayOrderAmount || 0}
      className="from-teal-500 to-teal-700" 
      loading={loadingOrderAmount}
    />

    <CardItemTwo
      mode={mode}
      title="Yesterday Order"
      title2="YesterdayOrder"
      Icon={ImStack}
      cash={yesterdayCashPayment || 0}
      card={yesterdayCardPayment || 0}
      credit={yesterdayCreditPayment || 0}
      price={yesterdayOrderAmount || 0}
      className="from-orange-400 to-orange-600"
      loading={loadingOrderAmount}
    />

    <CardItemTwo
      mode={mode}
      title2="ThisMonth"
      Icon={FiShoppingCart}
      price={dashboardOrderAmount?.thisMonthlyOrderAmount || 0}
      className="from-blue-500 to-blue-700"
      loading={loadingOrderAmount}
    />

    <CardItemTwo
      mode={mode}
      title2="LastMonth"
      Icon={ImCreditCard}
      loading={loadingOrderAmount}
      price={dashboardOrderAmount?.lastMonthOrderAmount || 0}
      className="from-cyan-500 to-cyan-700"
    />

    <CardItemTwo
      mode={mode}
      title2="AllTimeSales"
      Icon={ImCreditCard}
      price={dashboardOrderAmount?.totalAmount || 0}
      className="from-pink-500 to-pink-700"
      loading={loadingOrderAmount}
    />
  </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
  <CardItem
    title="Total Order"
    Icon={FiShoppingCart}
    loading={loadingOrderCount}
    quantity={dashboardOrderCount?.totalOrder || 0}
    className="bg-orange-50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-800/50 text-orange-600"
  />
  <CardItem
    title="Products"
    Icon={FiLayers}
    loading={loadingOrderCount}
    quantity={dashboardOrderCount?.totalProduct || 0}
    className="bg-purple-50 border-purple-100 dark:bg-purple-900/10 dark:border-purple-800/50 text-purple-600"
  />
  <CardItem
    title="New Sign Up"
    Icon={FiUserPlus}
    loading={loadingOrderCount}
    quantity={dashboardOrderCount?.totalCustomer || 0}
    className="bg-indigo-50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-800/50 text-indigo-600"
  />
  <CardItem
    title={t("OrderPending")}
    Icon={FiRefreshCw}
    loading={loadingOrderCount}
    quantity={dashboardOrderCount?.totalPendingOrder?.count || 0}
    amount={dashboardOrderCount?.totalPendingOrder?.total || 0}
    className="bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/50 text-blue-600"
  />
  <CardItem
    title={t("OrderProcessing")}
    Icon={FiTruck}
    loading={loadingOrderCount}
    quantity={dashboardOrderCount?.totalProcessingOrder || 0}
    className="bg-teal-50 border-teal-100 dark:bg-teal-900/10 dark:border-teal-800/50 text-teal-600"
  />
  <CardItem
    title={t("OrderDelivered")}
    Icon={FiCheck}
    loading={loadingOrderCount}
    quantity={dashboardOrderCount?.totalDeliveredOrder || 0}
    className="bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800/50 text-green-600"
  />
  <CardItem
    title={t("OrderCancel")}
    Icon={FiXCircle}
    loading={loadingOrderCount}
    quantity={dashboardOrderCount?.totalCancelOrder || 0}
    className="bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800/50 text-red-600"
  />
</div>
          </section>

          {/* Charts area */}
          <section className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100/70 dark:border-gray-800 shadow-sm px-4 py-5 md:px-6 md:py-6">
            <div className="grid gap-4 md:grid-cols-2">
              <ChartCard
                mode={mode}
                loading={loadingOrderAmount}
                title={t("WeeklySales")}
              >
                <LineChart salesReport={salesReport} />
              </ChartCard>

              <ChartCard
                mode={mode}
                loading={loadingBestSellerProduct}
                title={t("BestSellingProducts")}
              >
                <PieChart data={bestSellerProductChart} />
              </ChartCard>
            </div>
          </section>
        </div>
      </AnimatedContent>

      <PageTitle>{t("RecentOrder")}</PageTitle>

      {/* <Loading loading={loading} /> */}

      {loadingRecentOrder ? (
        <TableLoading row={5} col={4} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 overflow-x-scroll w-full custom-scrollbar">
          <Table className="w-full">
            <TableHeader>
              <tr>
                <TableCell>{t("InvoiceNo")}</TableCell>
                <TableCell>{t("TimeTbl")}</TableCell>
                <TableCell>{t("CustomerName")} </TableCell>
                <TableCell> {t("MethodTbl")} </TableCell>
                <TableCell> {t("AmountTbl")} </TableCell>
                <TableCell>{t("OderStatusTbl")}</TableCell>
                <TableCell>{t("ActionTbl")}</TableCell>
                <TableCell className="text-right">{t("InvoiceTbl")}</TableCell>
              </tr>
            </TableHeader>

            <OrderTable
              orders={dataTable}
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
          <TableFooter>
            <Pagination
              totalResults={dashboardRecentOrder?.totalOrder}
              resultsPerPage={8}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no orders right now." />
      )}
    </>
  );
};

export default Dashboard;

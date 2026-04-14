import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiSmartphone, 
  FiBox, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiRefreshCcw, 
  FiAlertCircle 
} from 'react-icons/fi';

const DetailedOrderStatus = ({ dashboardOrderCount }) => {
  // Map counts from dashboard data where available, otherwise default to 0
  const pendingCount = dashboardOrderCount?.totalPendingOrder?.count || 0;
  const processingCount = dashboardOrderCount?.totalProcessingOrder || 0;
  const deliveredCount = dashboardOrderCount?.totalDeliveredOrder || 0;
  const canceledCount = dashboardOrderCount?.totalCancelOrder || 0;
  
  // These statuses might not exist in the basic schema, so defaulting to 0
  const acceptedCount = dashboardOrderCount?.totalAcceptedOrder || 0;
  const outForDeliveryCount = dashboardOrderCount?.totalOutForDeliveryOrder || 0;
  const refundedCount = dashboardOrderCount?.totalRefundedOrder || 0;
  const paymentFailedCount = dashboardOrderCount?.totalFailedOrder || 0;

  const cards = [
    {
      title: "Unassigned Orders",
      value: pendingCount,
      valueColor: "text-gray-500 dark:text-gray-400",
      iconBg: "bg-blue-50 dark:bg-blue-900/30",
      iconColor: "text-blue-500",
      Icon: FiCalendar,
      link: "/orders/pending"
    },
    {
      title: "Accepted By Delivery Man",
      value: acceptedCount,
      valueColor: "text-emerald-500",
      iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
      iconColor: "text-emerald-500",
      Icon: FiSmartphone,
      link: "/orders/accepted"
    },
    {
      title: "Packaging",
      value: processingCount,
      valueColor: "text-gray-600 dark:text-gray-300",
      iconBg: "bg-orange-50 dark:bg-orange-900/30",
      iconColor: "text-orange-500",
      Icon: FiBox,
      link: "/orders/processing"
    },
    {
      title: "Out For Delivery",
      value: outForDeliveryCount,
      valueColor: "text-emerald-500",
      iconBg: "bg-teal-50 dark:bg-teal-900/30",
      iconColor: "text-teal-500",
      Icon: FiTruck,
      link: "/orders/on-the-way"
    },
    {
      title: "Delivered",
      value: deliveredCount,
      valueColor: "text-emerald-500",
      iconBg: "bg-green-50 dark:bg-green-900/30",
      iconColor: "text-green-500",
      Icon: FiCheckCircle,
      link: "/orders/delivered"
    },
    {
      title: "Canceled",
      value: canceledCount,
      valueColor: "text-red-500",
      iconBg: "bg-red-50 dark:bg-red-900/30",
      iconColor: "text-red-500",
      Icon: FiXCircle,
      link: "/orders/canceled"
    },
    {
      title: "Refunded",
      value: refundedCount,
      valueColor: "text-red-500",
      iconBg: "bg-pink-50 dark:bg-pink-900/30",
      iconColor: "text-pink-500",
      Icon: FiRefreshCcw,
      link: "/orders/refunded"
    },
    {
      title: "Payment Failed",
      value: paymentFailedCount,
      valueColor: "text-red-500",
      iconBg: "bg-rose-50 dark:bg-rose-900/30",
      iconColor: "text-rose-500",
      Icon: FiAlertCircle,
      link: "/orders/payment-failed"
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Link 
            key={index} 
            to={card.link}
            className="flex items-center justify-between p-4 bg-[#f8fafb] dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600 hover:shadow-md hover:border-teal-200 dark:hover:border-teal-900 transition-all duration-300 group no-underline"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <card.Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[120px] leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {card.title}
              </span>
            </div>
            <span className={`text-xl font-bold ${card.valueColor} group-hover:scale-110 transition-transform duration-300`}>
              {card.value}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DetailedOrderStatus;

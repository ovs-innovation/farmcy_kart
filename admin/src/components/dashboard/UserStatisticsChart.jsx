import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  FiUsers,
  FiTrendingUp
} from "react-icons/fi";

const UserStatisticsChart = ({ data, loading }) => {
  // Compute user segments from available counts
  const { totalUsers, customer, store, delivery, segments } = useMemo(() => {
    const customer = data?.totalCustomer || 0;
    const store = data?.totalStore || 0;
    const delivery = data?.totalDeliveryBoy || 0;
    const total = customer + store + delivery;
 
    return {
      totalUsers: total || 0,
      customer,
      store,
      delivery,
      segments: [customer, store, delivery]
    };
  }, [data]);

  const chartData = {
    labels: ["Customer", "Store", "Delivery Man"],
    datasets: [
      {
        data: segments,
        backgroundColor: ["#0d5429ff", "#10b981", "#b8f3e6ff"], // Dark teal, Emerald, Mint - High-end palette
        borderWidth: 0,
        borderRadius: 8,
        spacing: 4,
        cutout: "78%",
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#1e293b",
        padding: 10,
        cornerRadius: 6,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const stats = [
    { label: "Customer:", value: customer, color: "bg-[#14532d]" },
    { label: "Store:", value: store, color: "bg-[#10b981]" },
    { label: "Delivery Man:", value: delivery, color: "bg-[#ccfbf1]" },
  ];

  if (loading) return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] h-[450px] flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
      <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Statistics...</div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700 h-[500px] flex flex-col transition-all duration-300">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          User Statistics
        </h3>
        <div className="relative">
          <select className="bg-slate-50 dark:bg-gray-900 border-none px-4 py-1.5 rounded-xl text-xs font-black text-gray-500 uppercase tracking-widest focus:ring-0 cursor-pointer appearance-none pr-8">
            <option>Overall</option>
            <option>This Month</option>
            <option>This Year</option>
            <option>This Week</option>
          </select>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-48 lg:h-48 xl:w-56 xl:h-56">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-4xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">
              {totalUsers}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 leading-none">
              Total Users
            </span>
          </div>
        </div>
      </div>

      {/* Legend list - Premium styling */}
      <div className="mt-1 space-y-2 ">
        {stats.map((stat, i) => (
          <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-900/50 p-2.5 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color} shadow-sm group-hover:scale-125 transition-transform`} />
              <span className="text-[13px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white tracking-tight">
                {stat.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-gray-900 dark:text-white">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStatisticsChart;

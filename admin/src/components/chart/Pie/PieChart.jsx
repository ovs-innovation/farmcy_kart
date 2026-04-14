import React, { useState } from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const PieChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const products = data?.bestSellingProduct || [];
  const totalCount = products.reduce((a, b) => a + b.count, 0) || 0;

  const colors = [
    "#6366f1", // Indigo
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#3b82f6", // Blue
    "#8b5cf6", // Violet
  ];
  
  const chartData = {
    labels: products.map((s) => s._id),
    datasets: [
      {
        data: products.map((s) => s.count),
        backgroundColor: products.map((_, i) =>
          activeIndex === null || activeIndex === i
            ? colors[i % colors.length]
            : `${colors[i % colors.length]}33`),
        borderWidth: 0,
        borderRadius: 20,
        spacing: 10,
        cutout: "82%",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none mb-2">Best Selling Products</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live sales distribution overview</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-800/30">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Live
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-between gap-12 flex-1">
        {/* Chart Container */}
        <div className="relative w-56 h-56 lg:w-48 lg:h-48 xl:w-60 xl:h-60 flex-shrink-0">
          <Doughnut data={chartData} options={chartOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-4xl font-black text-gray-900 dark:text-white leading-none">
                {activeIndex !== null ? products[activeIndex]?.count : totalCount}
             </span>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                {activeIndex !== null ? "Units Sold" : "Total Sold"}
             </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-4">
           {products.slice(0, 5).map((item, index) => (
             <div 
               key={index}
               className={`flex justify-between items-center group cursor-pointer p-3 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 ${activeIndex === index ? 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700' : ''}`}
               onMouseEnter={() => setActiveIndex(index)}
               onMouseLeave={() => setActiveIndex(null)}
             >
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
                   <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate tracking-tight group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {item._id}
                   </span>
                </div>
                <span className="text-sm font-black text-gray-900 dark:text-white ml-4">
                   {item.count}
                </span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
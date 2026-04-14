import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const GrossSaleChart = ({ data, loading }) => {
  // Logic to calculate monthly sales from dashboardOrderAmount.ordersData
  const { labels, grossSales, adminCommissions, deliveryCommissions, totalGross } = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sales = new Array(12).fill(0);
    const admin = new Array(12).fill(0);
    const delivery = new Array(12).fill(0);
    let total = 0;

    const orders = data?.ordersData || [];
    
    // Group orders by month
    orders.forEach(order => {
      const date = dayjs(order.updatedAt || order.createdAt);
      if (date.year() === dayjs().year()) { // Only current year
        const monthIndex = date.month();
        const amount = order.total || 0;
        sales[monthIndex] += amount;
        total += amount;
        
        // Mock commissions since they aren't explicitly in the schema
        // Using common logic: Admin (10%), Delivery (5%)
        admin[monthIndex] += amount * 0.1;
        delivery[monthIndex] += amount * 0.05;
      }
    });

    return { 
      labels: months, 
      grossSales: sales, 
      adminCommissions: admin, 
      deliveryCommissions: delivery,
      totalGross: total
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += '₹' + context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 11 } },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { 
          color: "#94a3b8", 
          font: { size: 11 },
          callback: (value) => '₹' + value.toLocaleString(),
        },
        border: { display: false },
      },
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0, hoverRadius: 6 },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Gross Sale",
        data: grossSales,
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20, 184, 166, 0.08)",
        borderWidth: 4,
      },
      {
        fill: true,
        label: "Admin Commission",
        data: adminCommissions,
        borderColor: "#fb7185",
        backgroundColor: "rgba(251, 113, 133, 0.05)",
        borderWidth: 2,
      },
      {
        fill: true,
        label: "Delivery Commission",
        data: deliveryCommissions,
        borderColor: "#0d9488",
        backgroundColor: "rgba(13, 148, 136, 0.05)",
        borderWidth: 2,
      },
    ],
  };

  if (loading) return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[30px] h-[400px] flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
       <div className="text-gray-400 font-bold uppercase tracking-widest">Loading Analytics...</div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-[30px] shadow-sm border border-gray-100 dark:border-gray-700 h-[500px] flex flex-col transition-all duration-300">
      <div className="flex flex-col xl:flex-row justify-between items-start mb-8 gap-6">
        <div>
          <div className="text-2xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">
            ₹{totalGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Gross Sale Insight</div>
        </div>

        <div className="flex flex-col items-end gap-5">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Gross Sale (Mint)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#fb7185]" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Admin (Coral)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0d9488]" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Delivery (Teal)</span>
            </div>
          </div>

          <div className="relative">
             <select className="bg-slate-50 dark:bg-gray-900 border-none px-4 py-1.5 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-widest focus:ring-2 focus:ring-teal-500/20 cursor-pointer appearance-none pr-8">
               <option>This Year</option>
               <option>This Month</option>
               <option>This Week</option>


             </select>
             <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default GrossSaleChart;

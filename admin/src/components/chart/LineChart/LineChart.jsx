import { useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

const LineChart = ({ salesReport }) => {
  const uniqueDates = new Set();
  const updatedSalesReport = salesReport?.filter((item) => {
    const isUnique = !uniqueDates.has(item.date);
    uniqueDates.add(item.date);
    return isUnique;
  });

  const [activeTab, setActiveTab] = useState("Sales");

  const chartData = {
    labels: updatedSalesReport
      ?.sort((a, b) => new Date(a.date) - new Date(b.date))
      ?.map((or) => or.date.split("-")[2] + " " + new Date(or.date).toLocaleString('default', { month: 'short' })),
    datasets: [
      {
        label: activeTab,
        data: updatedSalesReport
          ?.sort((a, b) => new Date(a.date) - new Date(b.date))
          ?.map((or) => activeTab === "Sales" ? or.total : or.order),
        fill: true,
        borderColor: activeTab === "Sales" ? "#10b981" : "#f97316",
        backgroundColor: activeTab === "Sales" ? "rgba(16, 185, 129, 0.05)" : "rgba(249, 115, 22, 0.05)",
        borderWidth: 4,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        yAxisID: "y",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { size: 10, weight: 'bold' } },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { color: "#94a3b8", font: { size: 10 } },
        border: { display: false },
      },
    },
  };

  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab("Sales")}
          className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
            activeTab === "Sales"
              ? "bg-[#10b981] text-white shadow-lg shadow-emerald-500/20"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          {t("Sales")}
        </button>
        <button
          onClick={() => setActiveTab("Orders")}
          className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
            activeTab === "Orders"
              ? "bg-[#f97316] text-white shadow-lg shadow-orange-500/20"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          {t("Orders")}
        </button>
      </div>

      <div className="flex-1 min-h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineChart;

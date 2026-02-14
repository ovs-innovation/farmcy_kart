import React, { useState } from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const PieChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const products = data?.bestSellingProduct || [];
  const totalCount = products.reduce((a, b) => a + b.count, 0) || 0;

  const colors = [
    "#4F46E5",
    "#10B981",
    "#F59E0B",
    "#3B82F6",
    "#EC4899",
    "#8B5CF6",
  ];

  const chartData = {
    labels: products.map((s) => s._id),
    datasets: [
      {
        data: products.map((s) => s.count),
        backgroundColor: products.map((_, i) =>
          activeIndex === null || activeIndex === i
            ? colors[i % colors.length]
            : `${colors[i % colors.length]}33`
        ),
        borderWidth: 0,
        borderRadius: 12,
        spacing: 6,
        hoverOffset: 14,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "76%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#020617",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => `${ctx.parsed} Units Sold`,
        },
      },
    },
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="header">
        <div>
          <h3>Best Selling Products</h3>
          <p>Live sales distribution overview</p>
        </div>
        <span className="live">LIVE</span>
      </div>

      {/* Content */}
      <div className="layout">
        {/* Chart */}
        <div className="chartWrap">
          <div className="chartBox">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="center">
              <span className="total">
                {activeIndex !== null
                  ? products[activeIndex]?.count
                  : totalCount}
              </span>
              <span className="label">
                {activeIndex !== null ? "Units Sold" : "Total Sold"}
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="legend">
          {products.map((item, index) => (
            <div
              key={index}
              className={`row ${activeIndex === index ? "active" : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="left">
                <span
                  className="dot"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="name">{item._id}</span>
              </div>
              <span className="value">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #f1f5f9;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        h3 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.025em;
        }

        p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 4px 0 0;
        }

        .live {
          display: inline-flex;
          align-items: center;
          background: #ecfdf5;
          color: #059669;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid #d1fae5;
        }
        
        .live::before {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          background-color: #059669;
          border-radius: 50%;
          margin-right: 6px;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }

        /* Layout */
        .layout {
          display: flex;
          flex-direction: column;
          gap: 32px;
          flex: 1;
        }
        
        @media (min-width: 768px) {
          .layout {
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
          }
        }

        /* Chart */
        .chartWrap {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          min-width: 200px;
        }

        .chartBox {
          position: relative;
          width: 260px;
          height: 260px;
          max-width: 100%;
        }

        @media (min-width: 1024px) {
          .chartBox {
            width: 220px;
            height: 220px;
          }
        }
        
        @media (min-width: 1280px) {
          .chartBox {
             width: 260px;
             height: 260px;
          }
        }

        .center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }

        .total {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }

        .label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-top: 4px;
        }

        /* Legend */
        .legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          width: 100%;
          max-height: 300px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        
        .legend::-webkit-scrollbar {
          width: 4px;
        }
        .legend::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 4px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }

        .row:hover,
        .row.active {
          background: #f8fafc;
          border-color: #e2e8f0;
          transform: translateX(4px);
        }

        .left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0; 
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          flex-shrink: 0;
          box-shadow: 0 0 0 2px #fff;
          outline: 1px solid #e2e8f0;
        }

        .name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
          margin-left: 12px;
        }
      `}</style>
    </div>
  );
};

export default PieChart;
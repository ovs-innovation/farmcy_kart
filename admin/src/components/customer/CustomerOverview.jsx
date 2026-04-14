import React from 'react';
import { FiUsers, FiUserPlus, FiActivity, FiUserX, FiTrendingUp } from 'react-icons/fi';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Sparkline = () => {
  const data = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [
      {
        data: [30, 45, 35, 50, 40, 60, 55],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return (
    <div className="h-10 w-full mt-2">
      <Line data={data} options={options} />
    </div>
  );
};

const ActivityPieChart = ({ active, inactive }) => {
  const data = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [active, inactive],
        backgroundColor: ['#3b82f6', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-12 h-12">
      <Doughnut data={data} options={options} />
    </div>
  );
};

const CustomerOverview = ({
  statistics,
  loading,
  signUpPeriod,
  setSignUpPeriod,
  activeCriteria,
  setActiveCriteria,
  inactiveCriteria,
  setInactiveCriteria
}) => {
  const newSignUpsCount = signUpPeriod === 'today' ? statistics?.todaySignups : statistics?.thisMonthSignups;
  const activeCount = activeCriteria === 'login' ? statistics?.activeCustomersByLogin : statistics?.activeCustomersByOrder;
  const inactiveCount = inactiveCriteria === 'noLogin' ? statistics?.inactiveCustomersByNoLogin : statistics?.inactiveCustomersByNoOrder;

  return (
    <div className="mb-10 bg-white rounded-[32px] dark:bg-gray-800 p-6 md:p-8 border border-gray-100/80 dark:border-gray-700/60 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">    
      <h2 className="text-[13px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] mb-6 px-1">
      Customer Overview
    </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Customers Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_rgba(15,23,42,0.12),0_8px_18px_rgba(15,23,42,0.06)] border border-gray-100/50 dark:border-gray-700/50 flex flex-col justify-between relative overflow-hidden group transition-all hover:scale-[1.02] duration-300">
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Total Customers</span>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100/50 dark:border-blue-800/30">
                <FiUsers size={22} strokeWidth={2.5} />
              </div>
              <span className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                {loading ? '...' : statistics?.totalCustomers || 0}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col">
            <Sparkline />
            <div className="flex items-center gap-1.5 mt-2 transition-all">
              <span className="text-[12px] font-bold text-green-500 flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                <FiTrendingUp className="mr-1" /> +2.1%
              </span>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">(30 days)</span>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <FiUsers size={160} />
          </div>
        </div>

        {/* New Sign Ups Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_rgba(15,23,42,0.12),0_8px_18px_rgba(15,23,42,0.06)] border border-gray-100/50 dark:border-gray-700/50 flex flex-col justify-between relative overflow-hidden group transition-all hover:scale-[1.02] duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100/50 dark:border-indigo-800/30">
              <FiUserPlus size={22} strokeWidth={2.5} />
            </div>
            <div className="bg-gray-100/80 dark:bg-gray-700/50 p-1 rounded-xl flex">
              <button
                onClick={() => setSignUpPeriod('today')}
                className={`text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all ${signUpPeriod === 'today' ? 'bg-[#4338ca] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >Today</button>
              <button
                onClick={() => setSignUpPeriod('month')}
                className={`text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all ${signUpPeriod === 'month' ? 'bg-[#4338ca] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >This Month</button>
            </div>
          </div>

          <div>
            <span className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              {loading ? '...' : newSignUpsCount || 0}
            </span>
            <p className="text-[13px] font-bold text-gray-400 dark:text-gray-500 mt-2">
              {signUpPeriod === 'today'
                ? (newSignUpsCount > 0 ? `${newSignUpsCount} sign-ups today` : 'No sign-ups recorded yet today')
                : `${newSignUpsCount} sign-ups this month`}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-700/50 text-[11px] font-black text-gray-400 uppercase tracking-wider">
            <span className="text-gray-700 dark:text-gray-300 mr-1">{loading ? '...' : statistics?.totalCustomers}</span> All-Time
          </div>
        </div>

        {/* Active Customers Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_rgba(15,23,42,0.12),0_8px_18px_rgba(15,23,42,0.06)] border border-gray-100/50 dark:border-gray-700/50 flex flex-col justify-between relative overflow-hidden group transition-all hover:scale-[1.02] duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100/50 dark:border-emerald-800/30">
              <FiActivity size={22} strokeWidth={2.5} />
            </div>
            <div className="bg-gray-100/80 dark:bg-gray-700/50 p-1 rounded-xl flex">
              <button
                onClick={() => setActiveCriteria('login')}
                className={`text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all ${activeCriteria === 'login' ? 'bg-[#059669] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >Login</button>
              <button
                onClick={() => setActiveCriteria('order')}
                className={`text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all ${activeCriteria === 'order' ? 'bg-[#059669] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >Order</button>
            </div>
          </div>

          <div>
            <h4 className="text-[14px] font-black text-gray-800 dark:text-gray-200">Active Customers</h4>
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">(Last 30 days)</span>
            <h3 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight mt-2">
              {loading ? '...' : activeCount || 0}
            </h3>
          </div>

          <div className="absolute right-6 bottom-6 flex items-end">
            <div className="pulse-icon h-8 flex items-end gap-1">
              <div className="w-1 bg-emerald-500 h-2 rounded-full animate-pulse"></div>
              <div className="w-1 bg-emerald-400 h-5 rounded-full animate-pulse delay-75"></div>
              <div className="w-1 bg-emerald-500 h-3 rounded-full animate-pulse delay-150"></div>
              <div className="w-1 bg-emerald-400 h-6 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>

        {/* Inactive Customers Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_rgba(15,23,42,0.12),0_8px_18px_rgba(15,23,42,0.06)] border border-gray-100/50 dark:border-gray-700/50 flex flex-col justify-between relative overflow-hidden group transition-all hover:scale-[1.02] duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100/50 dark:border-rose-800/30">
              <FiUserX size={22} strokeWidth={2.5} />
            </div>
            <div className="bg-gray-100/80 dark:bg-gray-700/50 p-1 rounded-xl flex text-nowrap">
              <button
                onClick={() => setInactiveCriteria('noLogin')}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${inactiveCriteria === 'noLogin' ? 'bg-[#e11d48] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >No Login</button>
              <button
                onClick={() => setInactiveCriteria('noOrder')}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${inactiveCriteria === 'noOrder' ? 'bg-[#e11d48] text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
              >No Order</button>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <h4 className="text-[14px] font-black text-gray-800 dark:text-gray-200">Inactive Customers</h4>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">(Last 30 days)</span>
              <h3 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight mt-2">
                {loading ? '...' : inactiveCount || 0}
              </h3>
            </div>

            <div className="flex flex-col items-center gap-2">
              <ActivityPieChart active={activeCount} inactive={inactiveCount} />
              <div className="flex flex-col text-[9px] font-black tracking-tight leading-none text-right">
                <span className="text-gray-400 uppercase">Last Login</span>
                <span className="text-gray-700 dark:text-gray-300">No Order</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;
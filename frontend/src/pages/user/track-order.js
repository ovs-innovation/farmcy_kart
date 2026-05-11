import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { FiTruck, FiSearch, FiPackage, FiArrowRight } from 'react-icons/fi';
import Cookies from 'js-cookie';

// internal imports
import Dashboard from '@pages/user/dashboard';
import OrderServices from '@services/OrderServices';
import OrderTracking from '@components/order/OrderTracking';
import Loading from '@components/preloader/Loading';
import { setToken } from '@services/httpServices';

const TrackOrder = () => {
  const router = useRouter();
  const { id } = router.query;
  const [orderIdInput, setOrderIdInput] = useState(id || '');

  useEffect(() => {
    const userInfo = Cookies.get('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      if (parsedUser?.token) {
        setToken(parsedUser.token);
      }
    }
  }, []);

  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => await OrderServices.getOrderById(id),
    enabled: !!id,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      router.push(`/user/track-order?id=${orderIdInput.trim()}`);
    }
  };

  return (
    <Dashboard title="Track Order" description="Track your order status and delivery updates">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-gray-800 flex items-center gap-2">
            <FiTruck className="text-store-500" /> Track Your Order
          </h1>
          <p className="text-sm text-gray-500 mt-1">Enter your Order ID to see real-time updates on your delivery.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="Enter Order ID (e.g. 69ff59d0...)"
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-store-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-store-500 text-white rounded-xl font-bold hover:bg-store-600 transition-all shadow-md flex items-center gap-2"
            >
              Track Now <FiArrowRight />
            </button>
          </form>
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="py-10">
            <Loading loading={isLoading} />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-red-800">Order Not Found</h3>
            <p className="text-sm text-red-600 mt-1">We couldn't find an order with that ID. Please check the ID and try again.</p>
          </div>
        ) : order ? (
          <div className="space-y-6">
             <div className="bg-store-50 p-4 rounded-xl border border-store-100 flex justify-between items-center">
                <div>
                   <p className="text-xs text-store-600 font-bold uppercase tracking-wider">Tracking for Order</p>
                   <p className="text-sm font-mono font-bold text-gray-800">#{order._id}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Date Placed</p>
                   <p className="text-sm font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
             </div>
             
             <OrderTracking order={order} />
             
             <div className="flex justify-center mt-8">
                <button 
                  onClick={() => router.push(`/order/${order._id}`)}
                  className="text-sm font-bold text-store-600 hover:underline flex items-center gap-1"
                >
                   View Full Invoice Details <FiArrowRight />
                </button>
             </div>
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-12 rounded-3xl text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FiPackage className="text-gray-300 text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Enter an Order ID to start tracking</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
              You can find your Order ID in your order history or confirmation email.
            </p>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default dynamic(() => Promise.resolve(TrackOrder), { ssr: false });

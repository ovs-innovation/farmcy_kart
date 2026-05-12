import React from 'react';
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiClock, FiExternalLink, FiMapPin, FiCalendar } from 'react-icons/fi';

const OrderTracking = ({ order }) => {
  if (!order) return null;

  const steps = [
    { status: 'Order Placed', icon: FiClock, color: 'text-blue-500', bg: 'bg-blue-100' },
    { status: 'Accepted', icon: FiCheckCircle, color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { status: 'Processing', icon: FiPackage, color: 'text-orange-500', bg: 'bg-orange-100' },
    { status: 'Shipped', icon: FiTruck, color: 'text-purple-500', bg: 'bg-purple-100' },
    { status: 'OutForDelivery', icon: FiTruck, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { status: 'Delivered', icon: FiHome, color: 'text-green-500', bg: 'bg-green-100' },
  ];

  const currentStatus = order.status;
  const history = order.trackingHistory || [];
  const shipmentStatus = order.shipmentStatus || order.shiprocket?.status;

  // Find the highest completed step
  const getStatusIndex = (status) => steps.findIndex(s => s.status.toLowerCase() === status?.toLowerCase());
  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Live Shipment Tracking</h3>
        <span className="px-3 py-1 bg-store-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
          {shipmentStatus || currentStatus}
        </span>
      </div>

      <div className="p-4 sm:p-6">
        {/* Quick Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {order.courierName && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Courier Partner</p>
                <p className="text-sm font-bold text-gray-800">{order.courierName}</p>
              </div>
            )}
            {order.trackingNumber && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">AWB Number</p>
                <p className="text-sm font-mono font-bold text-gray-800">{order.trackingNumber}</p>
              </div>
            )}
            {order.estimatedDeliveryDate && (
              <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                <p className="text-[10px] text-green-600 uppercase font-bold mb-1 flex items-center gap-1">
                   <FiCalendar className="text-xs" /> Est. Delivery
                </p>
                <p className="text-sm font-bold text-green-800">
                   {new Date(order.estimatedDeliveryDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>
            )}
            {order.currentLocation && (
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[10px] text-blue-600 uppercase font-bold mb-1 flex items-center gap-1">
                   <FiMapPin className="text-xs" /> Current Location
                </p>
                <p className="text-sm font-bold text-blue-800 truncate">{order.currentLocation}</p>
              </div>
            )}
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-2">
          {/* Vertical Line */}
          <div className="absolute left-[29px] top-4 bottom-4 w-0.5 bg-gray-100"></div>

          <div className="space-y-10">
            {steps.map((step, index) => {
              const historyItem = history.find(h => h.status.toLowerCase() === step.status.toLowerCase());
              const isCompleted = index <= currentIndex || historyItem;
              const isCurrent = index === currentIndex;

              return (
                <div key={index} className="relative flex items-start gap-6 group">
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted ? `${step.bg} ${step.color}` : 'bg-gray-50 text-gray-300'
                  } ${isCurrent ? 'ring-4 ring-offset-2 ring-store-500 scale-110' : ''}`}>
                    <step.icon className="text-lg" />
                    {isCurrent && <span className="absolute -top-1 -right-1 w-3 h-3 bg-store-500 rounded-full border-2 border-white animate-ping"></span>}
                  </div>

                  <div className="flex-1 pt-0.5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <h4 className={`text-sm font-bold transition-all ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.status === 'OutForDelivery' ? 'Out for Delivery' : step.status}
                        </h4>
                        <p className={`text-xs mt-0.5 ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                          {historyItem?.message || (isCompleted ? 'Update successfully received' : 'Awaiting status update')}
                        </p>
                        {historyItem?.location && (
                           <p className="text-[10px] text-store-600 font-bold mt-1 flex items-center gap-1">
                              <FiMapPin className="text-[10px]" /> {historyItem.location}
                           </p>
                        )}
                      </div>
                      {historyItem && (
                        <div className="sm:text-right mt-1 sm:mt-0">
                          <p className="text-[10px] font-bold text-gray-900">
                            {new Date(historyItem.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(historyItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* External Link */}
        {order.trackingUrl && (
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <a 
              href={order.trackingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-store-200 hover:text-store-600 transition-all shadow-sm"
            >
              Track on Courier Website <FiExternalLink />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;

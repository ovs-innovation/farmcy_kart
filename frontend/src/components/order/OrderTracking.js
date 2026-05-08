import React from 'react';
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiClock, FiExternalLink } from 'react-icons/fi';

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

  // Find the highest completed step
  const getStatusIndex = (status) => steps.findIndex(s => s.status.toLowerCase() === status?.toLowerCase());
  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Order Tracking</h3>
        <span className="px-3 py-1 bg-store-100 text-store-700 rounded-full text-xs font-bold uppercase tracking-wider">
          {currentStatus}
        </span>
      </div>

      <div className="p-6">
        {/* Courier Details if Shipped */}
        {(order.trackingNumber || order.courierName) && (
          <div className="mb-8 p-4 bg-store-50 rounded-lg border border-store-100 flex flex-wrap gap-6 items-center">
            {order.courierName && (
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Courier</p>
                <p className="font-bold text-gray-900">{order.courierName}</p>
              </div>
            )}
            {order.trackingNumber && (
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tracking ID</p>
                <p className="font-mono font-bold text-gray-900">{order.trackingNumber}</p>
              </div>
            )}
            {order.trackingUrl && (
              <a 
                href={order.trackingUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-white border border-store-200 text-store-600 rounded-lg text-sm font-bold hover:bg-store-50 transition-all"
              >
                Track Externally <FiExternalLink />
              </a>
            )}
          </div>
        )}

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

          <div className="space-y-8">
            {steps.map((step, index) => {
              const historyItem = history.find(h => h.status.toLowerCase() === step.status.toLowerCase());
              const isCompleted = index <= currentIndex || historyItem;
              const isCurrent = index === currentIndex;

              return (
                <div key={index} className="relative flex items-start gap-6">
                  <div className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                    isCompleted ? `${step.bg} ${step.color}` : 'bg-gray-50 text-gray-300'
                  } ${isCurrent ? 'ring-4 ring-offset-2 ring-store-500' : ''}`}>
                    <step.icon className="text-xl" />
                  </div>

                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-bold transition-all ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.status === 'OutForDelivery' ? 'Out for Delivery' : step.status}
                        </h4>
                        <p className={`text-sm ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                          {historyItem?.message || (isCompleted ? 'Completed' : 'Pending')}
                        </p>
                      </div>
                      {historyItem && (
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-900">
                            {new Date(historyItem.timestamp).toLocaleDateString()}
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
      </div>
    </div>
  );
};

export default OrderTracking;

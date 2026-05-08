import React from 'react';

const Card = ({ title, Icon, quantity, className }) => {
  // Map incoming classes to a clean color palette
  const colorMap = {
    'red': { bg: 'bg-red-50', text: 'text-red-600' },
    'orange': { bg: 'bg-orange-50', text: 'text-orange-600' },
    'indigo': { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    'store': { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  };

  const colorMatch = className?.match(/text-(\w+)-/);
  const colorKey = colorMatch ? colorMatch[1] : 'gray';
  const colors = colorMap[colorKey] || { bg: 'bg-gray-50', text: 'text-gray-600' };

  return (
    <div className="flex h-full group">
      <div className="flex items-center w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-200">
        <div className={`flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-2xl ${colors.bg} ${colors.text}`}>
          <Icon className="text-2xl" />
        </div>
        <div className="ml-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
            {quantity || 0}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Card;

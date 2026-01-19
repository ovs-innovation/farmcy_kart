import React from 'react';

const Card = ({ title, Icon, quantity, className }) => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col sm:flex-row justify-center gap-2 items-center border border-gray-200 w-full rounded-lg p-4">
        <div
          className={`flex items-center justify-center p-3 rounded-full h-12 w-12 text-xl text-center mr-4 ${className}`}
        >
          <Icon />
        </div>
        <div className="flex flex-col text-center sm:text-left">
          <h5 className="leading-none mb-2 text-base font-medium font-serif text-gray-700">
            {title}
          </h5>
          <p className="text-xl font-bold font-serif leading-none text-gray-800">
            {quantity}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;

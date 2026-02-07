import React from "react";

const SimpleHeader = ({ title }) => {
  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-10 pt-10 ">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
          {title}
        </h1>
      </div>
       
    </div>
  );
};

export default SimpleHeader;



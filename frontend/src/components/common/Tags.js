import React from 'react';

const Tags = ({ product }) => {
  return (
    <>
      {product.tag.length !== 0 && (
        <div className="flex flex-row items-center">
          <div>
             <span className="text-gray-800 font-semibold text-sm mr-2">Net Quantity : </span>
          </div>
          {JSON.parse(product?.tag).map((t, i) => (
            <span
              key={i + 1}
              className="bg-gray-50 mr-2 border text-gray-600 rounded-full inline-flex items-center justify-center px-3 py-1 text-xs font-semibold font-serif mt-2"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default Tags;

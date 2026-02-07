import React from "react";

// Order items table for invoice layout (copied from frontend, adapted for admin)
const InvoiceOrderTable = ({ data, currency, getNumberTwo }) => {
  // Debug: Log data structure to understand what's coming from backend
  console.log('InvoiceOrderTable - data.user_info:', data?.user_info);
  console.log('InvoiceOrderTable - data.user_info.role:', data?.user_info?.role);
  console.log('InvoiceOrderTable - first cart item:', data?.cart?.[0]);
  
  // Check if this is a wholesaler order - try multiple possible locations
  const userRole = data?.user_info?.role?.toString().toLowerCase().trim() || 
                   data?.user?.role?.toString().toLowerCase().trim() ||
                   data?.role?.toString().toLowerCase().trim() || '';
  
  // Also check item level for wholesaler indicator
  const firstItem = data?.cart?.[0];
  const isWholesalerOrder = userRole === "wholesaler" || 
                            userRole.includes("wholesale") ||
                            firstItem?.wholePrice > 0;
  
  console.log('InvoiceOrderTable - Detected role:', userRole);
  console.log('InvoiceOrderTable - isWholesalerOrder:', isWholesalerOrder);
  
  return (
    <tbody className="bg-white text-serif text-sm print:bg-white">
      {data?.cart?.map((item, i) => {
        const quantity = item.quantity || 1;
        
        // Debug each item
        console.log(`Item ${i}:`, { title: item.title, price: item.price, wholePrice: item.wholePrice, mrp: item.mrp });
        
        // FORCE: Check if item has wholePrice to detect wholesaler product
        const isWholesaler = isWholesalerOrder || item.wholePrice > 0 || item.price < item.mrp;
        
        // For wholesalers, use item.price (which should be wholesale price)
        // For customers, use MRP
        const displayPrice = isWholesaler 
          ? (Math.abs(Number(item.price)) || Math.abs(Number(item.wholePrice)) || 0)
          : (Math.abs(Number(item.mrp)) || Math.abs(Number(item.originalPrice)) || Math.abs(Number(item.price)) || 0);
        
        // Calculate discount per item - ONLY for non-wholesaler
        // Match frontend OrderTable.js logic
        const mrpForCalc = Math.abs(Number(item.mrp)) || Math.abs(Number(item.originalPrice)) || Math.abs(Number(item.price)) || 0;
        const itemPrice = Math.abs(Number(item.price)) || 0;
        const hasValidPrice = !isNaN(itemPrice) && itemPrice > 0;
        
        let discountPerItem = 0;
        if (!isWholesaler) {
          if (hasValidPrice) {
            discountPerItem = mrpForCalc - itemPrice;
          } else if (typeof item.discount === "number") {
            discountPerItem = (mrpForCalc * item.discount) / 100;
          }
        }
        
        // Calculate GST on selling price
        const gstRateVal = Math.abs(Number(item.taxRate || item.gstRate || item.gstPercentage || 0));
        
        // Selling price is always positive
        const sellingPrice = Math.abs(Number(item.price)) || 0;
        const gstAmt = Math.abs(((sellingPrice * quantity * gstRateVal) / 100) || 0);
        
        // Line total - ensure always positive
        const lineTotal = Math.abs(Number(item.itemTotal)) || 
                         Math.abs((sellingPrice * quantity) + gstAmt) || 0;
        
        console.log(`Item ${i} calculations:`, { isWholesaler, displayPrice, discountPerItem, gstAmt, lineTotal });

        return (
          <tr
            key={i}
            className={`${
              i % 2 === 0 ? "bg-white" : "bg-gray-50"
            } border-t border-gray-100 print:bg-white print:border-gray-300`}
          >
            <th className="px-2 py-1 whitespace-nowrap font-normal text-gray-700 text-left border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {i + 1}
            </th>
            <td className="product-column px-2 py-1 font-normal text-gray-700 border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:break-words">
              {item.title}
            </td>
            <td className="px-2 py-1 whitespace-nowrap font-normal text-gray-700 text-center border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {item.hsn || "-"}
            </td>
            <td className="px-2 py-1 whitespace-nowrap font-normal text-gray-700 text-center border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {item.batchNo || "-"}
            </td>
            <td className="px-2 py-1 whitespace-nowrap font-normal text-gray-700 text-center border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {item.expDate
                ? (typeof item.expDate === "string"
                    ? item.expDate.split("T")[0]
                    : new Date(item.expDate).toLocaleDateString("en-GB"))
                : "-"}
            </td>
            <td className="px-2 py-1 whitespace-nowrap font-bold text-center border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {item.quantity}
            </td>
            <td className="px-2 py-1 whitespace-nowrap font-bold text-center font-DejaVu border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {currency}
              {getNumberTwo(displayPrice)}
            </td>
            <td className="px-2 py-1 whitespace-nowrap text-center font-normal border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {isWholesaler 
                ? `${currency}0.00`
                : (discountPerItem > 0
                  ? `${currency}${getNumberTwo(discountPerItem * quantity)}`
                  : `${currency}0.00`)}
            </td>
            <td className="px-2 py-1 whitespace-nowrap text-center font-normal border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {gstRateVal}%
            </td>
            <td className="px-2 py-1 whitespace-nowrap text-center font-normal border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {currency}{getNumberTwo(gstAmt)}
            </td>
            <td className="px-2 py-1 whitespace-nowrap text-right font-bold font-DejaVu text-gray-600 print:px-1 print:py-1 print:text-xs">
              {isWholesaler 
                ? `${currency}${getNumberTwo(sellingPrice * quantity)}`
                : `${currency}${getNumberTwo(lineTotal)}`}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default InvoiceOrderTable;



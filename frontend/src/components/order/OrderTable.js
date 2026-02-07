import useUtilsFunction from "@hooks/useUtilsFunction";
import React, { useContext } from "react";
import { UserContext } from "@context/UserContext";

const OrderTable = ({ data, currency }) => {
  const { getNumberTwo } = useUtilsFunction();
  const { state } = useContext(UserContext) || {};
  const isWholesaler = state?.userInfo?.role && state.userInfo.role.toString().toLowerCase() === "wholesaler";

  return (
    <tbody className="bg-white text-serif text-sm print:bg-white">
      {data?.cart?.map((item, i) => {
        const quantity = item.quantity || 1;
        
        // For wholesalers, use wholePrice instead of MRP
        const mrp = isWholesaler 
          ? (item.wholePrice ?? item.price ?? 0)
          : (item.mrp ?? item.originalPrice ?? item.price ?? 0);
        
        // Get the actual selling price from item.price or calculate from MRP
        const itemPrice = Number(item.price);
        const hasValidPrice = !isNaN(itemPrice) && itemPrice > 0;
        
        // Calculate discount per item - if item.price exists, discount = MRP - price
        // otherwise use the discount percentage if available
        let discountPerItem = 0;
        if (!isWholesaler) {
          if (hasValidPrice) {
            discountPerItem = mrp - itemPrice;
          } else if (typeof item.discount === "number") {
            discountPerItem = (mrp * item.discount) / 100;
          }
        }
        
        // Calculate GST on selling price (SP = MRP - discount)
        // GST Amount = (Selling Price × Quantity × GST Rate) / 100
        const gstRateVal = Number(item.taxRate || item.gstRate || item.gstPercentage);
        
        // Selling price = item.price or (MRP - discount)
        const sellingPrice = hasValidPrice ? itemPrice : (mrp - discountPerItem);
        const gstAmt = ((sellingPrice * quantity * gstRateVal) / 100) || 0;
        
        const lineTotal =
          item.itemTotal ??
          (sellingPrice * quantity) + gstAmt;

        return (
          <tr
            key={i}
            className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t border-gray-100 print:bg-white print:border-0`}
          >
            <th className="px-2 py-1 whitespace-nowrap font-normal text-gray-700 text-left border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {i + 1}
            </th>
            <td className="product-column px-2 py-1 font-normal text-gray-700 border-r border-gray-200 print:px-1 print:py-1 print:text-xs print:break-words">
              {item.title}
            </td>
            {/* <td className="px-2 py-1 whitespace-nowrap font-normal text-gray-700 text-left border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {item.manufacturer && item.brand 
                ? `${item.manufacturer} (${item.brand})`
                : item.manufacturer || item.brand || "-"}
            </td> */}
            <td className="px-2 py-1 whitespace-nowrap font-normal text-gray-700 text-center border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {item.hsn || "-"}
            </td>
            <td className="px-2 py-1 whitespace-nowrap font-normal text-gray-700 text-center border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {item.batchNo || "-"}
            </td>
            <td className="px-2 py-1 whitespace-nowrap font-normal text-gray-700 text-center border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {item.expDate
                ? (typeof item.expDate === "string"
                    ? item.expDate.split("T")[0] // string हो तो सिर्फ date वाला हिस्सा
                    : new Date(item.expDate).toLocaleDateString("en-GB")) // Date/number हो तो formatted date
                : "-"}
            </td>
            <td className="px-2 py-1 whitespace-nowrap font-bold text-center border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {item.quantity}
            </td>
            <td className="px-2 py-1 whitespace-nowrap font-bold text-center font-DejaVu border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {currency}
              {getNumberTwo(isWholesaler ? (item.price || 0) : mrp)}
            </td>
            <td className="px-2 py-1 whitespace-nowrap text-center font-normal border-r border-gray-200 print:px-1 print:py-1 print:text-xs">
              {isWholesaler 
                ? `${currency}0.00`
                : (typeof discountPerItem === "number"
                  ? `${currency}${getNumberTwo(discountPerItem * quantity)}`
                  : "-")}
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

export default OrderTable;

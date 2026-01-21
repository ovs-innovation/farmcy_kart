import dayjs from "dayjs";
import React from "react";
import Link from "next/link";
import Image from "next/image";
//internal import
import OrderTable from "@components/order/OrderTable";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useGetSetting from "@hooks/useGetSetting";

const Invoice = ({ data, printRef, globalSetting, currency }) => {
  // console.log('invoice data',data)

  const { getNumberTwo } = useUtilsFunction();
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";

  return (
    <div ref={printRef}>
      <div className="bg-indigo-50 p-8 rounded-t-xl">
        <div className="flex lg:flex-row md:flex-row flex-col lg:items-center justify-between pb-4 border-b border-gray-50">
          <div>
            <h1 className="font-bold font-serif text-2xl uppercase">Invoice</h1>
            <h6 className="text-gray-700">
              Status :{" "}
              {data.status === "Delivered" && (
                <span className={`text-store-500`}>{data.status}</span>
              )}
              {data.status === "POS-Completed" && (
                <span className={`text-store-500`}>{data.status}</span>
              )}
              {data.status === "Pending" && (
                <span className="text-orange-500">{data.status}</span>
              )}
              {data.status === "Cancel" && (
                <span className="text-red-500">{data.status}</span>
              )}
              {data.status === "Processing" && (
                <span className="text-indigo-500">{data.status}</span>
              )}
              {data.status === "Deleted" && (
                <span className="text-red-700">{data.status}</span>
              )}
            </h6>
          </div>
          <div className="lg:text-right text-left">
            <h2 className="text-lg font-serif font-semibold mt-4 lg:mt-0 md:mt-0">
              <Link href="/">
                <Image
                  width={110}
                  height={40}
                  src={storeCustomizationSetting?.navbar?.logo || "/logo/logo.png"}
                  alt="logo"
                />
              </Link>
            </h2>
            <p className="text-sm text-gray-500">
              {globalSetting?.address ||
                "Cecilia Chapman, 561-4535 Nulla LA, <br /> United States 96522"}
            </p>
          </div>
        </div>
        <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
          <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
            <span className="font-bold font-serif text-sm uppercase text-gray-600 block">
              Date
            </span>
            <span className="text-sm text-gray-500 block">
              {data.createdAt !== undefined && (
                <span>{dayjs(data?.createdAt).format("MMMM D, YYYY")}</span>
              )}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
            <span className="font-bold font-serif text-sm uppercase text-gray-600 block">
              Invoice No.
            </span>
            <span className="text-sm text-gray-500 block">
              #{data?.invoice}
            </span>
          </div>
          <div className="flex flex-col lg:text-right text-left">
            <span className="font-bold font-serif text-sm uppercase text-gray-600 block">
              Invoice To.
            </span>
            <span className="text-sm text-gray-500 block">
              {data?.user_info?.name} <br />
              {data?.user_info?.email}{" "}
              <span className="ml-2">{data?.user_info?.contact}</span>
              <br />
              {data?.user_info?.address}
              <br />
              {data?.city} {data?.country} {data?.zipCode}
            </span>
          </div>
        </div>
      </div>
      <div className="s">
        {/* Desktop / Tablet view: keep original table layout */}
        <div className="hidden md:block overflow-hidden lg:overflow-visible px-8 my-10">
          <div className="-my-2 overflow-x-auto">
            <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-xs bg-gray-100">
                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-left"
                  >
                    Sr.
                  </th>
                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-left"
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-center"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-center"
                  >
                    Item Price
                  </th>

                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-right"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <OrderTable data={data} currency={currency} />
            </table>
          </div>
        </div>

        {/* Mobile view: responsive two-column cards */}
        <div className="block md:hidden px-4 my-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            {data?.cart?.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-500">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    Qty: {item.quantity}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                  {item.title}
                </p>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-600">
                    Item: {currency}
                    {getNumberTwo(item.price)}
                  </span>
                  <span className="font-semibold text-red-500">
                    Total: {currency}
                    {getNumberTwo(item.itemTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`border-t border-b border-gray-100 p-10 bg-store-50`}>
        <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
              Payment Method
            </span>
            <span className="text-sm text-gray-500 font-semibold font-serif block">
              {data?.paymentMethod}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
              Shipping Cost
            </span>
            <span className="text-sm text-gray-500 font-semibold font-serif block">
              {currency}
              {getNumberTwo(data.shippingCost)}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
              Discount
            </span>
            <span className="text-sm text-gray-500 font-semibold font-serif block">
              {currency}
              {getNumberTwo(data.discount)}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
              TAX/GST
            </span>
            <span className="text-sm text-gray-500 font-semibold font-serif block">
              {currency}
              {getNumberTwo(data?.taxSummary?.totalTax || 0)}
            </span>
          </div>
          <div className="flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
              Total Amount
            </span>
            <span className="text-2xl font-serif font-bold text-red-500 block">
              {currency}
              {getNumberTwo(data.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;


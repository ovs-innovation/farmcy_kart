import React from "react";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";

import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";

//internal import
import Status from "@/components/table/Status";
import Tooltip from "@/components/tooltip/Tooltip";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import SelectStatus from "@/components/form/selectOption/SelectStatus";

// import Status from '../table/Status';
// import SelectStatus from '../form/SelectStatus';

const CustomerOrderTable = ({ orders }) => {
  const { showDateTimeFormat, getNumberTwo, currency } = useUtilsFunction();
  return (
    <>
      <TableBody>
        {orders?.map((order) => (
          <TableRow key={order._id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {order?._id?.substring(20, 24)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {/* {dayjs(order.createdAt).format("MMM D, YYYY")} */}
                {showDateTimeFormat(order.createdAt)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">{order?.user_info?.address}</span>
            </TableCell>
            <TableCell>
              {" "}
              <span className="text-sm">{order.user_info?.contact}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold">
                {order.paymentMethod}
              </span>
            </TableCell>
            <TableCell>
              {" "}
              <span className="text-sm font-semibold">
                {currency}
                {getNumberTwo(order.total)}
              </span>{" "}
            </TableCell>
            <TableCell className="text-center">
              <Status status={order.status} />
            </TableCell>
            <TableCell className="text-right flex justify-end items-center gap-4">
              <SelectStatus id={order._id} order={order} />
              <Link to={`/order/${order._id}`} className="text-teal-600 hover:text-teal-800 transition-colors p-2 bg-teal-50 dark:bg-teal-900/10 rounded-lg shadow-sm">
                <Tooltip id="view" title="View Invoice">
                  <FiZoomIn size={18} />
                </Tooltip>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CustomerOrderTable;

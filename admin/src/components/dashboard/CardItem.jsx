import React from "react";
import { Card, CardBody } from "@windmill/react-ui";
import Skeleton from "react-loading-skeleton";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const CardItem = ({
  title,
  Icon,
  quantity,
  amount,
  className,
  loading,
  mode,
  pending,
  todayPending,
  olderPending,
}) => {
  const { getNumberTwo } = useUtilsFunction();

  return (
    <div className="h-full w-full">
      {loading ? (
        <Skeleton height={110} borderRadius={16} />
      ) : (
        <Card className="h-full border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
          <CardBody className="p-4 flex items-center h-full">
            {/* Icon Box */}
            <div className={`flex items-center justify-center rounded-2xl h-12 w-12 md:h-14 md:w-14 mr-4 shrink-0 shadow-inner bg-opacity-10 ${className.split(' ').find(c => c.startsWith('bg-'))} ${className.split(' ').find(c => c.startsWith('text-'))}`}>
              <Icon className="text-xl md:text-2xl" />
            </div>

            <div className="flex-grow overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <h6 className="text-[10px] md:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider truncate">
                  {title}
                </h6>
                {amount && (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-md">
                    {getNumberTwo(amount)}
                  </span>
                )}
              </div>

              {pending && (
                <div className="flex gap-3 mb-2 pb-2 border-b border-gray-50 dark:border-gray-700">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 uppercase">Today</span>
                    <span className="text-[11px] font-bold text-teal-600">({getNumberTwo(todayPending)})</span>
                  </div>
                  <div className="flex flex-col border-l border-gray-100 dark:border-gray-700 pl-3">
                    <span className="text-[9px] text-gray-400 uppercase">Older</span>
                    <span className="text-[11px] font-bold text-orange-500">({getNumberTwo(olderPending)})</span>
                  </div>
                </div>
              )}

              <p className="text-xl md:text-2xl font-black text-gray-700 dark:text-gray-200 leading-none">
                {quantity}
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default CardItem;
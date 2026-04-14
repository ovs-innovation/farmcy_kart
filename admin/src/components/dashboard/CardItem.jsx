import React from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import useUtilsFunction from "@/hooks/useUtilsFunction";

// Map className color tokens → gradient/ring config
const colorMap = {
  orange: {
    gradient: "from-orange-50 to-white dark:from-orange-950/30 dark:to-gray-800",
    ring: "ring-orange-200 dark:ring-orange-800/40",
    icon: "bg-orange-500/10 text-orange-500 dark:bg-orange-400/20 dark:text-orange-300",
    dot: "bg-orange-400",
  },
  blue: {
    gradient: "from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-800",
    ring: "ring-blue-200 dark:ring-blue-800/40",
    icon: "bg-blue-500/10 text-blue-500 dark:bg-blue-400/20 dark:text-blue-300",
    dot: "bg-blue-400",
  },
  teal: {
    gradient: "from-teal-50 to-white dark:from-teal-950/30 dark:to-gray-800",
    ring: "ring-teal-200 dark:ring-teal-800/40",
    icon: "bg-teal-500/10 text-teal-500 dark:bg-teal-400/20 dark:text-teal-300",
    dot: "bg-teal-400",
  },
  green: {
    gradient: "from-green-50 to-white dark:from-green-950/30 dark:to-gray-800",
    ring: "ring-green-200 dark:ring-green-800/40",
    icon: "bg-green-500/10 text-green-500 dark:bg-green-400/20 dark:text-green-300",
    dot: "bg-green-400",
  },
  purple: {
    gradient: "from-purple-50 to-white dark:from-purple-950/30 dark:to-gray-800",
    ring: "ring-purple-200 dark:ring-purple-800/40",
    icon: "bg-purple-500/10 text-purple-500 dark:bg-purple-400/20 dark:text-purple-300",
    dot: "bg-purple-400",
  },
  emerald: {
    gradient: "from-emerald-50 to-white dark:from-emerald-950/30 dark:to-gray-800",
    ring: "ring-emerald-200 dark:ring-emerald-800/40",
    icon: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-400/20 dark:text-emerald-300",
    dot: "bg-emerald-400",
  },
  red: {
    gradient: "from-red-50 to-white dark:from-red-950/30 dark:to-gray-800",
    ring: "ring-red-200 dark:ring-red-800/40",
    icon: "bg-red-500/10 text-red-500 dark:bg-red-400/20 dark:text-red-300",
    dot: "bg-red-400",
  },
};

const CardItem = ({
  title,
  Icon,
  quantity,
  amount,
  className,
  loading,
  pending,
  todayPending,
  olderPending,
  isAmount,
  link,
}) => {
  const { getNumberTwo, currency } = useUtilsFunction();

  // Detect color from className string
  const colorKey = Object.keys(colorMap).find((key) =>
    className?.includes(key)
  ) || "teal";
  const colors = colorMap[colorKey];

  return (
    <div className="h-full w-full">
      {loading ? (
        <Skeleton height={148} borderRadius={16} />
      ) : (
        <Link
          to={link || "#"}
          className={`relative flex flex-col justify-between h-full bg-gradient-to-br ${colors.gradient} rounded-2xl ring-1 ${colors.ring} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden p-6 group no-underline`}
        >
          {/* Top: Icon + optional amount badge */}
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${colors.icon} shrink-0`}>
              <Icon className="text-[18px]" />
            </div>
            {amount ? (
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-700/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-gray-100 dark:border-gray-600 leading-none">
                {currency}{getNumberTwo(amount)}
              </span>
            ) : null}
          </div>

          {/* Label */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} shrink-0`} />
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-[0.12em] leading-none truncate">
                {title}
              </span>
            </div>

            {pending && (
              <div className="flex gap-3 mt-1 mb-1">
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider">Today</span>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                    {getNumberTwo(todayPending)}
                  </span>
                </div>
                <div className="flex flex-col border-l border-gray-200 dark:border-gray-700 pl-3">
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider">Older</span>
                  <span className="text-xs font-bold text-orange-500 dark:text-orange-400">
                    {getNumberTwo(olderPending)}
                  </span>
                </div>
              </div>
            )}

            {/* Big Number */}
            <p className="text-[1.8rem] font-black text-gray-800 dark:text-white leading-none mt-2 tracking-tight">
              {isAmount ? `${currency}${getNumberTwo(quantity)}` : quantity ?? 0}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default CardItem;
import { Card, CardBody } from "@windmill/react-ui";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const CardItemTwo = ({
  mode,
  title,
  Icon,
  className, // Pass gradients here: e.g., "from-blue-500 to-blue-600"
  price,
  cash,
  card,
  credit,
  loading,
  title2,
}) => {
  const { t } = useTranslation();
  const { currency, getNumberTwo } = useUtilsFunction();

  return (
    <div className="w-full p-1 md:p-2">
      {loading ? (
        <Skeleton
          height={140}
          borderRadius={16}
          baseColor={mode === "dark" ? "#1a1c23" : "#e5e7eb"}
          highlightColor={mode === "dark" ? "#24262d" : "#f3f4f6"}
        />
      ) : (
        <Card className={`relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br ${className || 'from-gray-700 to-gray-800'}`}>
          <CardBody className="p-4 flex flex-col justify-between min-h-[140px] md:min-h-[160px]">
            
            {/* Top: Icon and Label */}
            <div className="flex justify-between items-start">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl shadow-inner">
                <Icon className="text-white text-xl md:text-2xl" />
              </div>
              <p className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-wider text-right max-w-[60%]">
                {title2 ? t(`${title2}`) : "Statistics"}
              </p>
            </div>

            {/* Middle: Big Value */}
            <div className="mt-2">
              <h3 className="text-lg md:text-2xl font-black text-white leading-tight">
                {currency}{getNumberTwo(price)}
              </h3>
            </div>

            {/* Bottom: Breakdown (Only for Orders) */}
            {(title === "Today Order" || title === "Yesterday Order") && (
              <div className="mt-3 pt-2 border-t border-white/20 space-y-0.5">
                <div className="flex justify-between items-center text-[10px] md:text-xs">
                  <span className="text-white/70">{t("Cash")}</span>
                  <span className="text-white font-bold">{currency}{getNumberTwo(cash)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] md:text-xs">
                  <span className="text-white/70">{t("Card")}</span>
                  <span className="text-white font-bold">{currency}{getNumberTwo(card)}</span>
                </div>
              </div>
            )}

            {/* Decorative background shape to prevent "blank" look */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default CardItemTwo;
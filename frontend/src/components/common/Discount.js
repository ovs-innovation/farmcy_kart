import useUtilsFunction from "@hooks/useUtilsFunction";

const Discount = ({ discount, product, slug, modal }) => {
  const { getNumber } = useUtilsFunction();

  const price = product?.isCombination
    ? getNumber(product?.variants[0]?.price)
    : getNumber(product?.prices?.price);
  
  const discountVal = product?.isCombination
    ? getNumber(product?.variants[0]?.discount)
    : getNumber(product?.prices?.discount);

  let originalPrice = product?.isCombination
    ? getNumber(product?.variants[0]?.originalPrice)
    : getNumber(product?.prices?.originalPrice);

  if (!originalPrice && discountVal) {
    originalPrice = price + discountVal;
  }

  const discountPercentage = originalPrice > 0 ? getNumber(
    ((originalPrice - price) / originalPrice) * 100
  ) : 0;

  return (
    <>
      {discount > 1 && (
        <span
          className={
            modal
              ? "absolute text-xs sm:text-sm text-white py-1 sm:py-1.5 px-2 sm:px-3 md:px-4 rounded-l-none rounded-r-full font-bold uppercase z-10 left-0 top-6 whitespace-nowrap"
              : slug
              ? "absolute text-xs sm:text-sm text-white py-1 sm:py-1.5 px-2 sm:px-3 md:px-4 rounded-l-none rounded-r-full font-bold uppercase z-10 left-0 top-6 whitespace-nowrap"
              : "absolute text-[10px] sm:text-xs md:text-sm text-white py-0.5 sm:py-1 md:py-1.5 px-1.5 sm:px-2 md:px-3 lg:px-4 rounded-l-none rounded-r-full font-bold uppercase z-10 left-0 top-1 sm:top-2 whitespace-nowrap"
          }
          style={{ backgroundColor: '#006E44' }}
        >
          {discount}% OFF
        </span>
      )}
      {discount === undefined && discountPercentage > 1 && (
        <span
          className={
            modal
              ? "absolute text-xs sm:text-sm text-white py-1 sm:py-1.5 px-2 sm:px-3 md:px-4 rounded-l-none rounded-r-full font-bold uppercase z-10 left-0 top-6 whitespace-nowrap"
              : slug
              ? "absolute text-xs sm:text-sm text-white py-1 sm:py-1.5 px-2 sm:px-3 md:px-4 rounded-l-none rounded-r-full font-bold uppercase z-10 left-0 top-6 whitespace-nowrap"
              : "absolute text-[10px] sm:text-xs md:text-sm text-white py-0.5 sm:py-1 md:py-1.5 px-1.5 sm:px-2 md:px-3 lg:px-4 rounded-l-none rounded-r-full font-bold uppercase z-10 left-0 top-1 sm:top-2 whitespace-nowrap"
          }
          style={{ backgroundColor: '#006E44' }}
        >
          {discountPercentage}% OFF
        </span>
      )}
    </>
  );
};

export default Discount;

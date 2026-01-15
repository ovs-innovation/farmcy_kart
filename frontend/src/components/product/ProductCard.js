import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { IoAdd, IoBagAddSharp, IoRemove } from "react-icons/io5";
import { FiHeart, FiShuffle } from "react-icons/fi";
import { useCart } from "react-use-cart";
import { useRouter } from "next/router";

//internal import
import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import { notifyError, notifySuccess } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import useGetSetting from "@hooks/useGetSetting";
import Discount from "@components/common/Discount";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductModal from "@components/modal/ProductModal";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { handleLogEvent } from "src/lib/analytics";
import { addToWishlist } from "@lib/wishlist";

const ProductCard = ({ product, attributes, hidePriceAndAdd = false, hideDiscount = false, hideWishlistCompare = false }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { items, addItem, updateItemQuantity, inCart, getItem } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue, getNumberTwo } = useUtilsFunction();
  const router = useRouter();

  const storeColor = storeCustomizationSetting?.theme?.color || "green";
  const currency = globalSetting?.default_currency || "₹";



  const handleAddItem = (p) => {
    if (p.stock < 1) return notifyError("Insufficient stock!");

    if (p?.variants?.length > 0) {
      setModalOpen(!modalOpen);
      return;
    }
    const { slug, variants, categories, description, ...updatedProduct } =
      product;
    const newItem = {
      ...updatedProduct,
      title: showingTranslateValue(p?.title),
      id: p._id,
      variant: p.prices,
      price: p.prices.price,
      originalPrice: product.prices?.originalPrice,
      image: product.image?.[0] || product.images?.[0],
    };
    addItem(newItem);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;
    
    try {
      const result = addToWishlist(product);

      if (!result.ok && result.reason === "exists") {
        notifyError("Product already in wishlist");
        return;
      }

      if (!result.ok) {
        notifyError("Failed to add to wishlist");
        return;
      }

      notifySuccess("Product added to wishlist");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      notifyError("Failed to add to wishlist");
    }
  };

  const handleAddToCompare = (e) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;
    
    try {
      const storedCompare = localStorage.getItem("compare");
      let compare = storedCompare ? JSON.parse(storedCompare) : [];
      
      const exists = compare.some((item) => item._id === product._id);
      
      if (exists) {
        notifyError("Product already in compare list");
        return;
      }
      
      if (compare.length >= 4) {
        notifyError("You can compare maximum 4 products");
        return;
      }
      
      compare.push(product);
      localStorage.setItem("compare", JSON.stringify(compare));
      notifySuccess("Product added to compare list");
    } catch (error) {
      console.error("Error adding to compare:", error);
      notifyError("Failed to add to compare list");
    }
  };

  return (
    <>
      {modalOpen && (
        <ProductModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          product={product}
          currency={currency}
          attributes={attributes}
        />
      )}

  <div className="group box-border w-full h-full max-w-full overflow-hidden flex rounded-lg border border-gray-200 flex-col items-center bg-white relative transition-shadow duration-300">
        
        {/* Product Name - Moved to top */}
        <div className="w-full px-2 sm:px-3 md:px-4 pt-1.5 sm:pt-2 md:pt-2.5 pb-0.5 flex-shrink-0">
          <h2 
            className="text-heading mb-0 block text-xs sm:text-sm font-normal text-gray-600 leading-tight truncate overflow-hidden text-ellipsis whitespace-nowrap z-20" 
            title={showingTranslateValue(product?.title)}
          >
            {showingTranslateValue(product?.title)}
          </h2>
        </div>

        {/* Product Image - Full display, no cover */}
        <div
          onClick={() => {
            router.push(`/product/${product.slug}`);
            handleLogEvent(
              "product",
              `navigated to ${showingTranslateValue(product?.title)} product page`
            );
          }}
          className="relative flex justify-center items-center cursor-pointer w-full p-1 sm:p-1.5 h-[80px] sm:h-[100px] md:h-[140px] lg:h-[160px] flex-shrink-0"
        >
          {/* Discount Badge - Top Left (hide if hideDiscount prop is true) */}
          {!hideDiscount && (
            <div className="absolute top-2 sm:top-2 md:bottom-10 left-0 z-10">
              <Discount product={product} />
            </div>
          )}
          
          {/* Stock Badge - Top Right (only show if out of stock) */}
          {product.stock < 1 && (
            <div className="absolute top-2 right-2 z-10">
              <Stock product={product} stock={product.stock} card />
            </div>
          )}

          {/* Wishlist and Compare buttons - Bottom Right */}
          {!hideWishlistCompare && (
            <div className="absolute bottom-2 right-2 z-30 flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleAddToWishlist}
                className={`p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors`}
                aria-label="Add to wishlist"
              >
                <FiHeart className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleAddToCompare}
                className={`p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-purple-500 hover:text-white transition-colors`}
                aria-label="Add to compare"
              >
                <FiShuffle className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}

          <div className="relative w-full h-full flex items-center justify-center">
            {product.image[0] ? (
              <ImageWithFallback
                src={product.image[0]}
                alt="product"
                width={300}
                height={300}
                className="w-full h-auto max-h-[80px] sm:max-h-[100px] md:max-h-[140px] lg:max-h-[160px] object-contain"
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <Image
                src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                width={300}
                height={300}
                style={{
                  objectFit: "contain",
                  maxHeight: "100px"
                }}
                sizes="100%"
                alt="product"
                className="w-full h-auto"
              />
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full px-2 sm:px-3 md:px-4 pb-1.5 sm:pb-2 md:pb-2.5 overflow-hidden flex-shrink-0 mt-auto">
          <hr />
          {/* Price and Add Button */}
          {!hidePriceAndAdd && (
          <div className="flex justify-between items-end mt-2 sm:mt-3">
            {/* Price Section */}
            <div className="flex flex-col">
              {(() => {
                const currentPrice = product?.isCombination
                  ? product?.variants[0]?.price
                  : product?.prices?.price;
                
                const discount = product?.isCombination
                  ? product?.variants[0]?.discount
                  : product?.prices?.discount;

                let originalPriceValue = product?.isCombination
                  ? product?.variants[0]?.originalPrice
                  : product?.prices?.originalPrice;

                if (!originalPriceValue && discount) {
                  originalPriceValue = (currentPrice || 0) + (discount || 0);
                }
                
                return (
                  <>
                    {originalPriceValue > currentPrice && (
                      <p className="text-xs text-gray-500 mb-1 font-normal">
                        MRP <span className="line-through">{currency}{getNumberTwo(originalPriceValue)}</span>
                      </p>
                    )}
                    <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                      {currency}{getNumberTwo(currentPrice)}
                    </p>
                  </>
                );
              })()}
            </div>

            {/* Add Button */}
            {inCart(product._id) ? (
              <div>
                {(() => {
                  const item = getItem(product._id);
                  return (
                    item && (
                      <div
                        key={item.id}
                        className={`h-9 w-auto flex items-center justify-evenly py-1 px-3 bg-store-500 text-white rounded-md`}
                      >
                        <button
                          onClick={() =>
                            updateItemQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <span className="text-white text-base">
                            <IoRemove />
                          </span>
                        </button>
                        <p className="text-sm text-white px-2 font-serif font-semibold">
                          {item.quantity}
                        </p>
                        <button
                          onClick={() =>
                            item?.variants?.length > 0
                              ? handleAddItem(item)
                              : handleIncreaseQuantity({ ...item, stock: product.stock })
                          }
                        >
                          <span className="text-white text-base">
                            <IoAdd />
                          </span>
                        </button>
                      </div>
                    )
                  );
                })()}
              </div>
            ) : (
              <button
                onClick={() => handleAddItem(product)}
                aria-label="Add to cart"
                className={`h-8 sm:h-9 px-4 sm:px-6 md:px-10 min-w-[60px] sm:min-w-[80px] flex items-center justify-center bg-blue-100 text-blue-700 border border-blue-300 rounded-md font-medium text-xs sm:text-sm hover:bg-blue-200 transition-colors`}
                style={{
                  backgroundColor: `var(--store-color-50)`,
                  color: `var(--store-color-700)`,
                  borderColor: `var(--store-color-300)`
                }}
              >
                Add
              </button>
            )}
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });



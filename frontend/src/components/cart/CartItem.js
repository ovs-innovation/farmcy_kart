import { useContext } from "react";
import Link from "next/link";
import { useCart } from "react-use-cart";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import Image from "next/image";

//internal import
import useAddToCart from "@hooks/useAddToCart";
import { SidebarContext } from "@context/SidebarContext";
import { notifyError } from "@utils/toast";

const CartItem = ({ item, currency = "₹" }) => {
  const { updateItemQuantity, removeItem } = useCart();
  const { closeCartDrawer } = useContext(SidebarContext);
  const { handleIncreaseQuantity } = useAddToCart();
  
  // Calculate MRP and discount - Check multiple possible price fields
  const originalPrice = item.originalPrice || item.mrp || item.prices?.original || (item.price * 1.2); // Add 20% markup as fallback
  const currentPrice = item.price || item.prices?.sale || 0;
  const discount = originalPrice > currentPrice ? originalPrice - currentPrice : 0;
  const discountPercentage = originalPrice > currentPrice ? ((discount / originalPrice) * 100).toFixed(0) : 0;
  
  // Debug logging
  console.log('CartItem Debug:', {
    title: item.title,
    originalPrice,
    currentPrice,
    discount,
    discountPercentage,
    itemData: item
  });


  return (
    <div className="group w-full h-auto flex justify-start items-center bg-white py-3 px-4 border-b hover:bg-gray-50 transition-all border-gray-100 relative last:border-b-0">
      <div className="relative flex rounded-full border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 cursor-pointer mr-4">
        <Image
          key={item.id}
          src={
            (Array.isArray(item.image) ? item.image[0] : item.image) ||
            (Array.isArray(item.images) ? item.images[0] : item.images) ||
            "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
          }
          width={40}
          height={40}
          alt={item.title}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col w-full overflow-hidden">
        <Link
          href={`/product/${item.slug || item.id || item._id}`}
          onClick={closeCartDrawer}
          className="truncate text-sm font-medium text-gray-700 text-heading line-clamp-1"
        >
          {item.title}
        </Link>
        
        {/* Show MRP and Discount */}
        {originalPrice > currentPrice && (
          <div className="flex items-center gap-2 text-xs mb-1">
            <span className="text-gray-400 line-through">
              MRP: {currency}{originalPrice.toFixed(2)}
            </span>
            <span className="text-green-600 rounded text-xs font-bold">
              {discountPercentage}% OFF
            </span>
             
          </div>
        )}
        
         
        
        <span className="text-xs text-gray-400 mb-1">
          Item Price {currency}{item.price}
        </span>
        <div className="flex items-center justify-between">
          <div className="font-bold text-sm md:text-base text-heading leading-5">
            <span>
              {currency}
              {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
          <div className="h-8 w-22 md:w-24 lg:w-24 flex flex-wrap items-center justify-evenly p-1 border border-gray-100 bg-white text-gray-600 rounded-md">
            <button
              onClick={() => {
                const minQty = item?.minQuantity ? Number(item.minQuantity) : 1;
                if (item.quantity - 1 < minQty) {
                  notifyError(`Minimum quantity is ${minQty}`);
                  return;
                }
                updateItemQuantity(item.id, item.quantity - 1);
              }}
            >
              <span className="text-dark text-base">
                <FiMinus />
              </span>
            </button>
            <p className="text-sm font-semibold text-dark px-1">
              {item.quantity}
            </p>
            <button onClick={() => handleIncreaseQuantity(item)}>
              <span className="text-dark text-base">
                <FiPlus />
              </span>
            </button>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="hover:text-red-600 text-red-400 text-lg cursor-pointer"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

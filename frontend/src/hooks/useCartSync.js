import { useEffect, useRef } from "react";
import { useCart } from "react-use-cart";
import { useContext } from "react";
import { UserContext } from "@context/UserContext";
import CustomerServices from "@services/CustomerServices";

const useCartSync = () => {
  const { addItem, items, updateItemQuantity, getItem } = useCart();
  const {
    state: { userInfo },
  } = useContext(UserContext);
  
  const isSyncedRef = useRef(false);
  const lastUserIdRef = useRef(null);

  // Sync from Customer.cart (Backend Cart)
  useEffect(() => {
    const syncBackendCart = async () => {
      const userId = userInfo?._id || userInfo?.id;
      
      // Reset sync state if user changes or logs out
      if (!userId) {
        isSyncedRef.current = false;
        lastUserIdRef.current = null;
        return;
      }

      // Allow re-sync if user changed
      if (lastUserIdRef.current !== userId) {
        isSyncedRef.current = false;
      }

      // If already synced for this user, skip
      if (isSyncedRef.current) {
        return;
      }

      try {
        const res = await CustomerServices.getCustomerById(userId);
        const backendCart = res.cart || [];

        if (backendCart.length > 0) {
          backendCart.forEach((cartItem) => {
            const product = cartItem.productId;
            // Ensure product is valid and populated
            if (!product || !product._id) {
              return;
            }

            const id = product._id;
            const backendQty = cartItem.quantity || 1;
            
            // Check if item exists in local cart
            const localItem = getItem(id);
            
            // Check if any variant of this product exists in local cart
            // Variant IDs are constructed as "PRODUCT_ID-VARIANT_INFO"
            const hasVariantInCart = items.some(item => String(item.id).startsWith(String(id) + '-'));

            if (localItem) {
              // If local quantity is less than backend quantity, update it
              if (localItem.quantity < backendQty) {
                updateItemQuantity(id, backendQty);
              }
            } else if (hasVariantInCart) {
              // If a variant exists locally, we assume the backend item corresponds to it.
              // We do NOT add the generic item to avoid duplication.
              // This handles the case where backend doesn't store variant info but frontend does.
            } else {
              // Add new item from backend
              const newItem = {
                id: id,
                price: product.prices?.price || product.prices?.originalPrice || 0,
                title: product.title?.en || product.title || "Product",
                image: Array.isArray(product.image) ? product.image[0] : (typeof product.image === 'string' ? product.image : ''),
                quantity: backendQty,
                slug: product.slug
              };
              addItem(newItem, backendQty);
            }
          });
        }
        
        // Mark as synced for this user
        isSyncedRef.current = true;
        lastUserIdRef.current = userId;

      } catch (err) {
        console.error("Error syncing cart:", err);
      }
    };

    syncBackendCart();
  }, [userInfo, items, addItem, updateItemQuantity, getItem]);
};

export default useCartSync;

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
  const isSyncingRef = useRef(false);

  // Sync from Customer.cart (Backend Cart)
  useEffect(() => {
    const syncBackendCart = async () => {
      const userId = userInfo?._id || userInfo?.id;
      
      // Reset sync state if user changes or logs out
      if (!userId) {
        isSyncedRef.current = false;
        lastUserIdRef.current = null;
        isSyncingRef.current = false;
        return;
      }

      // Allow re-sync if user changed
      if (lastUserIdRef.current !== userId) {
        isSyncedRef.current = false;
      }

      // If already synced for this user or currently syncing, skip
      if (isSyncedRef.current || isSyncingRef.current) {
        return;
      }

      // Mark as syncing to prevent multiple simultaneous syncs
      isSyncingRef.current = true;

      try {
        const res = await CustomerServices.getCustomerById(userId);
        const backendCart = res.cart || [];

        if (backendCart.length > 0) {
          // Collect all items to add/update first
          const itemsToProcess = [];
          
          backendCart.forEach((cartItem) => {
            const product = cartItem.productId;
            // Ensure product is valid and populated
            if (!product || !product._id) {
              return;
            }

            const id = product._id;
            const backendQty = cartItem.quantity || 1;
            
            // Check if item exists in local cart with exact ID
            const localItem = getItem(id);
            
            // Check if any variant of this product exists in local cart
            // Variant IDs are constructed as "PRODUCT_ID-VARIANT_INFO"
            const hasVariantInCart = items.some(item => String(item.id).startsWith(String(id) + '-'));

            if (localItem) {
              // Sync policy: only apply backend quantity updates if backend increased
              if (localItem.quantity !== backendQty) {
                if (backendQty > localItem.quantity) {
                  // Backend has a higher quantity (e.g., admin increased) -> update local
                  itemsToProcess.push({ type: 'update', id, quantity: backendQty });
                } else {
                  // Backend qty is lower than local (user may have increased locally). Preserve user's local choice and do not downgrade.
                  // Add a console warning for visibility during debugging.
                  console.warn(`[Cart Sync] Skipping downgrade for item ${id}: localQty=${localItem.quantity}, backendQty=${backendQty}`);
                }
              }
            } else if (!hasVariantInCart) {
              // Only add if no variant exists and no exact match exists
              // Determine effective price based on customer role (wholesaler vs retail)
              const isWholesalerUser = userInfo?.role && String(userInfo.role).toLowerCase() === 'wholesaler';
              const effectivePrice = isWholesalerUser && product.wholePrice && Number(product.wholePrice) > 0
                ? Number(product.wholePrice)
                : (product.prices?.price || product.prices?.originalPrice || 0);

              itemsToProcess.push({
                type: 'add',
                item: {
                  id: id,
                  price: effectivePrice,
                  title: product.title?.en || product.title || "Product",
                  image: Array.isArray(product.image) ? product.image[0] : (typeof product.image === 'string' ? product.image : ''),
                  quantity: backendQty,
                  slug: product.slug,
                  // include stock/minQuantity so cart operations (increment/decrement) can work correctly
                  stock: (product?.stock !== undefined ? product.stock : (product?.variants && product.variants[0] ? product.variants[0].quantity : undefined)),
                  minQuantity: product?.minQuantity
                },
                quantity: backendQty
              });
            }
          });

          // Process all updates/adds in batch
          itemsToProcess.forEach((action) => {
            if (action.type === 'update') {
              updateItemQuantity(action.id, action.quantity);
            } else if (action.type === 'add') {
              // Double-check item doesn't exist before adding
              if (!getItem(action.item.id)) {
                addItem(action.item, action.quantity);
              }
            }
          });
        }
        
        // Mark as synced for this user
        isSyncedRef.current = true;
        lastUserIdRef.current = userId;

      } catch (err) {
        console.error("Error syncing cart:", err);
      } finally {
        isSyncingRef.current = false;
      }
    };

    syncBackendCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?._id, userInfo?.id]); // Only sync when user changes, not when cart items change
};

export default useCartSync;

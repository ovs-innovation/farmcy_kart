import { useState, useContext } from "react";
import { useCart } from "react-use-cart";
import { UserContext } from "@context/UserContext";

import { notifyError, notifySuccess } from "@utils/toast";

const useAddToCart = () => {
  const [item, setItem] = useState(1);
  const { addItem, items, updateItemQuantity } = useCart();
  // console.log('products',products)
  // console.log("items", items);

  const { state: { userInfo } } = useContext(UserContext) || {};
  const isWholesalerUser = userInfo?.role && String(userInfo.role).toLowerCase() === 'wholesaler';

  // Helper: return available stock number; if undefined/null, treat as unlimited for wholesalers
  const getAvailableStock = (product) => {
    if (!product) return isWholesalerUser ? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    // If user is wholesaler, we treat stock as unlimited (allow ordering)
    if (isWholesalerUser) return Number.MAX_SAFE_INTEGER;
    // Variant-level quantity preferred
    if (product?.variants?.length > 0) {
      // product.variant may be the selected variant object on the product detail modal
      if (product?.variant && typeof product.variant.quantity === 'number') return Number(product.variant.quantity);
      // or variants[0]
      if (product?.variants[0] && typeof product.variants[0].quantity === 'number') return Number(product.variants[0].quantity);
    }
    if (typeof product?.stock === 'number') return Number(product.stock);
    // fallback unlimited if no stock info
    return Number.MAX_SAFE_INTEGER;
  };

  const handleAddItem = (product, qty) => {
    const quantityToAdd = typeof qty === 'number' ? qty : item;
    const result = items.find((i) => i.id === product.id);

    const { variants, categories, description, ...updatedProduct } = product;

    // Ensure product items added to cart carry minQuantity and effective price for wholesalers
    const minQuantity = isWholesalerUser ? (product?.minQuantity ? Number(product.minQuantity) : 1) : 1;
    const effectivePrice = (isWholesalerUser && product?.wholePrice && Number(product.wholePrice) > 0)
      ? Number(product.wholePrice)
      : (product.prices?.price || product.prices?.originalPrice || product.price || 0);

    // attach metadata used by cart UI
    updatedProduct.minQuantity = minQuantity;
    updatedProduct.price = effectivePrice;
    updatedProduct.stock = (product?.stock !== undefined ? product.stock : (product?.variants && product.variants[0] ? product.variants[0].quantity : undefined));
    updatedProduct.wholePrice = product?.wholePrice;

    const available = getAvailableStock(product);

    if (result !== undefined) {
      if (result?.quantity + quantityToAdd <= available) {
        addItem(updatedProduct, quantityToAdd);
        notifySuccess(`${quantityToAdd} ${product.title} added to cart!`);
      } else {
        notifyError("Insufficient stock!");
      }
    } else {
      if (quantityToAdd <= available) {
        addItem(updatedProduct, quantityToAdd);
        notifySuccess(`${quantityToAdd} ${product.title} added to cart!`);
      } else {
        notifyError("Insufficient stock!");
      }
    }
  };

  const handleIncreaseQuantity = (product) => {
    const result = items?.find((p) => p.id === product.id);
    const available = getAvailableStock(product);

    // console.log("handleIncreaseQuantity", product, result?.quantity + item, available);
    if (result) {
      if (result?.quantity + 1 <= available) {
        updateItemQuantity(product.id, product.quantity + 1);
      } else {
        notifyError("Insufficient stock!");
      }
    }
  };

  return {
    setItem,
    item,
    handleAddItem,
    handleIncreaseQuantity,
  };
};

export default useAddToCart;

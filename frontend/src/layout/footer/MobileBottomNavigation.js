import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "react-use-cart";
import { FiHome, FiShoppingCart, FiHeart, FiFileText, FiSearch } from "react-icons/fi";
import { SidebarContext } from "@context/SidebarContext";
import useWishlist from "@hooks/useWishlist";
import useGetSetting from "@hooks/useGetSetting";

const MobileBottomNavigation = () => {
  const router = useRouter();
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { toggleCartDrawer, toggleSearch, showSearch } = useContext(SidebarContext);
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "emerald";

  // Helper to check if link is active
  const isActive = (href) => router.pathname === href;

  return (
    <div className="lg:hidden fixed bottom-0 w-full bg-white z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-100">
      <div className="flex justify-between items-center px-4 py-2 pt-3">
        {/* Home */}
        <Link href="/" className={`flex flex-col items-center justify-center w-full ${isActive("/") ? "text-store-500" : "text-gray-500"}`}>
          <FiHome className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        {/* My Orders */}
        <Link href="/user/my-orders" className={`flex flex-col items-center justify-center w-full ${isActive("/user/my-orders") ? "text-store-500" : "text-gray-500"}`}>
          <FiFileText className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">My Orders</span>
        </Link>

        {/* Cart */}
        <button 
          onClick={toggleCartDrawer} 
          className={`flex flex-col items-center justify-center w-full relative ${router.pathname === "/cart" ? "text-store-500" : "text-gray-500"}`}
        >
          <div className="relative">
            <FiShoppingCart className="w-6 h-6 mb-1" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-store-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </button>

        {/* Search */}
        <button 
          onClick={toggleSearch} 
          className={`flex flex-col items-center justify-center w-full ${showSearch ? "text-store-500" : "text-gray-500"}`}
        >
          <FiSearch className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Search</span>
        </button>

        {/* WishList */}
        <Link href="/wishlist" className={`flex flex-col items-center justify-center w-full ${isActive("/wishlist") ? "text-store-500" : "text-gray-500"}`}>
          <div className="relative">
            <FiHeart className="w-6 h-6 mb-1" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-store-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">WishList</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNavigation;

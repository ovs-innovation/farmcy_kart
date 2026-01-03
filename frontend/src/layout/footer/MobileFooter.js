import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useCart } from "react-use-cart";
import { FiHome, FiUser, FiShoppingCart, FiAlignLeft, FiHeart } from "react-icons/fi";
import { IoSearchOutline, IoLockClosedOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

//internal imports
import { getUserSession } from "@lib/auth";
import { SidebarContext } from "@context/SidebarContext";
import CategoryDrawer from "@components/drawer/CategoryDrawer";
import useGetSetting from "@hooks/useGetSetting";
import useWishlist from "@hooks/useWishlist";

const MobileFooter = () => {
  const [modalOpen, setModalOpen] = useState(false);
  // const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { toggleCategoryDrawer, showSearch, setShowSearch } = useContext(SidebarContext);
  const userInfo = getUserSession();
  const router = useRouter();
  const { t } = useTranslation("common");
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "pink";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchText) {
      router.push(`/search?query=${searchText}`);
      setSearchText("");
      setShowSearch(false);
    } else {
      router.push(`/`);
      setSearchText("");
      setShowSearch(false);
    }
  };

  return (
    <>
      {/* Drawer lives off-canvas; keep it mounted without forcing page layout/scroll */}
      <CategoryDrawer />
      <footer className="lg:hidden fixed z-30 top-0 bg-white flex items-center justify-between w-full h-16 px-3 sm:px-10 shadow-sm">
       <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center justify-center"
          rel="noreferrer"
          aria-label="Home"
        >
          <div className="relative w-16 h-16">
            <Image
              src="/logo/logojwellary.png"
              alt="logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </Link>
       </div>
        <div className="flex items-center gap-4">
        <button
          aria-label="User"
          type="button"
          className={`text-xl text-store-500 indicator justify-center`}
        >
          {userInfo?.image ? (
            <Link href="/user/dashboard" className="relative top-1 w-6 h-6">
              <Image
                width={29}
                height={29}
                src={userInfo.image}
                alt="user"
                className="rounded-full"
              />
            </Link>
          ) : userInfo?.name ? (
            <Link
              href="/user/dashboard"
              className={`leading-none font-bold font-serif block px-3 py-2 border rounded-full border-store-500 text-store-500`}
            >
              {userInfo?.name[0]}
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="bg-store-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold text-sm hover:bg-store-600 transition-colors"
            >
              <IoLockClosedOutline className="text-lg" /> Sign In
            </Link>
          )}
        </button>
         <button
          aria-label="Bar"
          onClick={toggleCategoryDrawer}
          className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none"
        >
          <span className={`text-xl text-store-500`}>
            <FiAlignLeft className="w-6 h-6 drop-shadow-xl" />
          </span>
        </button>
        </div>
      </footer>
      {showSearch && (
        <div className="fixed z-30 top-16 left-0 w-full bg-white px-3 py-2 shadow">
          <form
            onSubmit={handleSubmit}
            className="relative pr-12 bg-white overflow-hidden shadow-sm rounded-md w-full"
          >
            <label className="flex items-center py-0.5">
              <input
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                className="form-input w-full pl-5 appearance-none transition ease-in-out border text-input text-sm font-sans rounded-md min-h-10 h-10 duration-200 bg-[#F3F4F6] focus:ring-0 outline-none border-none focus:outline-none placeholder-gray-500 placeholder-opacity-75"
                placeholder={t("Search Health and Herbs...")}
              />
            </label>
            <button
              aria-label="Search"
              type="submit"
              className={`outline-none text-xl text-gray-400 absolute top-0 right-0 end-0 w-12 h-full flex items-center justify-center transition duration-200 ease-in-out hover:text-heading focus:outline-none text-store-500`}
            >
              <IoSearchOutline />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(MobileFooter), { ssr: false });


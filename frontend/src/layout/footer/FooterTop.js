import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoArrowForward } from "react-icons/io5";

//internal import
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CMSkeleton from "@components/preloader/CMSkeleton";
import NewsletterServices from "@services/NewsletterServices";
import { notifySuccess, notifyError } from "@utils/toast";

const FooterTop = () => {
  const { storeCustomizationSetting, loading, error } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const [email, setEmail] = useState("");
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);

  // Get data from home section (Get Your Daily Needs)
  const homeData = storeCustomizationSetting?.home;
  
  // Map home data to footer structure
  const footerTitle = showingTranslateValue(homeData?.daily_need_title);
  const footerSubtitle = showingTranslateValue(homeData?.daily_need_description);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      notifyError("Please enter your email address!");
      return;
    }
    setLoadingSubscribe(true);
    try {
      await NewsletterServices.addNewsletter({ email });
      notifySuccess("Subscribed Successfully!");
      setEmail("");
    } catch (err) {
      notifyError(err ? err.response.data.message : err.message);
    }
    setLoadingSubscribe(false);
  };

  const leftImg = homeData?.daily_need_img_left;
  const rightImg = homeData?.daily_need_img_right;
  const appStoreLink = homeData?.daily_need_app_link;
  const playStoreLink = homeData?.daily_need_google_link;
  const appStoreImg = homeData?.button1_img;
  const playStoreImg = homeData?.button2_img;
  
  console.log("FooterTop - home data:", {
    footerTitle,
    footerSubtitle,
    leftImg,
    rightImg,
    appStoreLink,
    playStoreLink,
    appStoreImg,
    playStoreImg
  });

  return (
    <>
      <div
        id="downloadApp"
        className="bg-indigo-50 py-10 lg:py-16 bg-repeat bg-center overflow-hidden"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 bg-store-50 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-2 md:gap-3 lg:gap-3 items-center">
            <div className="flex-grow hidden lg:flex md:flex md:justify-items-center lg:justify-start">
              <Image
                src={leftImg || "/app-download-img-left.png"}
                alt="app download"
                width={500}
                height={394}
                className="block w-auto"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold font-serif mb-3">
                {loading ? (
                  <CMSkeleton
                    count={1}
                    height={30}
                    loading={loading}
                  />
                ) : (
                  footerTitle || "Get Your Daily Needs"
                )}
              </h3>
              <p className="text-base opacity-90 leading-7">
                {loading ? (
                  <CMSkeleton
                    count={1}
                    height={20}
                    loading={loading}
                  />
                ) : (
                  footerSubtitle || "There are many products you will find in our shop"
                )}
              </p>
              <div className="mt-8 flex gap-3 lg:gap-4 justify-center">
                {(appStoreLink || appStoreImg) && (
                  <Link
                    href={appStoreLink || "#"}
                    className="mx-2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      width={170}
                      height={50}
                      className="mr-2 rounded"
                      src={appStoreImg || "/app/app-store.svg"}
                      alt="app store"
                    />
                  </Link>
                )}
                {(playStoreLink || playStoreImg) && (
                  <Link
                    href={playStoreLink || "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      width={170}
                      height={10}
                      className="mr-2 rounded"
                      src={"/app/play-store.svg"}
                      alt="play store"
                    />
                  </Link>
                )}
              </div>
            </div>
            <div className="md:hidden lg:block">
              <div className="flex-grow hidden lg:flex md:flex lg:justify-end">
                <Image
                  src={rightImg || "/app-download-img.png"}
                  alt="app download"
                  width={500}
                  height={394}
                  className="block w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

       
    </>
  );
};

export default FooterTop;

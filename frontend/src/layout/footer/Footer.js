import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { IoArrowForward } from "react-icons/io5";
import {
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { 
  FaInstagram
} from "react-icons/fa";
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiChevronRight,
  FiChevronDown,
  FiFileText,
  FiShield,
  FiRefreshCw,
  FiTruck,
  FiUser,
  FiShoppingBag,
  FiPackage,
  FiSettings
} from "react-icons/fi";

//internal import
import { getUserSession } from "@lib/auth";
import useGetSetting from "@hooks/useGetSetting";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";
import FeatureCard from "@components/feature-card/FeatureCard";
import NewsletterServices from "@services/NewsletterServices";
import { notifySuccess, notifyError } from "@utils/toast";

const Footer = () => {
  const { t } = useTranslation();
  const userInfo = getUserSession();

  const { showingTranslateValue } = useUtilsFunction();
  const { loading, storeCustomizationSetting, globalSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";
  const [email, setEmail] = useState("");
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);
  
  // State for collapsible sections on mobile (only first 3 blocks)
  const [openSections, setOpenSections] = useState({
    block1: false,
    block2: false,
    block3: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // SafeLink: render a Next <Link> only when href is provided, otherwise render a span
  // This prevents Next Link prop-type errors when CMS settings don't include a URL
  const SafeLink = ({ href, children, ...props }) => {
    if (!href) {
      // remove props that are only valid on anchor elements
      const { target, rel, ...safeProps } = props;
      return <span {...safeProps}>{children}</span>;
    }

    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  };

  const handleNewsletterSubmit = async (e) => {
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

  return (
    <div className="pb-16 lg:pb-0 xl:pb-0 bg-blue-50 text-gray-800 relative overflow-hidden">
      {/* Decorative Top Section */}
      <div className="relative bg-gradient-to-b from-store-500/10 via-store-400/5 to-transparent">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Decorative Wave - Animated */}
        <div className="relative overflow-hidden">
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes waveMove {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .footer-wave {
                animation: waveMove 25s linear infinite;
              }
            `
          }} />
          <div className="footer-wave" style={{ width: '200%', display: 'flex' }}>
            <svg 
              className="h-12 md:h-16 lg:h-20 flex-shrink-0" 
              viewBox="0 0 1440 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              preserveAspectRatio="none"
              style={{ width: '50%', height: '100%' }}
            >
              <path 
                d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,64,576,58.7C672,53,768,53,864,58.7C960,64,1056,75,1152,80C1248,85,1344,85,1392,85.3L1440,85L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" 
                fill={`var(--store-color-500)`}
                opacity="0.4"
              />
            </svg>
            <svg 
              className="h-12 md:h-16 lg:h-20 flex-shrink-0" 
              viewBox="0 0 1440 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              preserveAspectRatio="none"
              style={{ width: '50%', height: '100%' }}
            >
              <path 
                d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,64,576,58.7C672,53,768,53,864,58.7C960,64,1056,75,1152,80C1248,85,1344,85,1392,85.3L1440,85L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" 
                fill={`var(--store-color-500)`}
                opacity="0.4"
              />
            </svg>
          </div>
        </div>
        
       
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 lg:px-16 xl:px-20 relative z-10">
        <div className="py-4 hidden md:block border-b border-gray-200">
           <FeatureCard />
        </div>
        
        {/* Logo at Top Left - Only visible on small screens */}
        <div className="py-4 border-b border-gray-200 block md:hidden">
          <Link href="/" className="inline-block" rel="noreferrer">
            <div className="relative w-32 sm:w-40 transition-transform duration-300 hover:scale-105">
              <Image
                src={
                  storeCustomizationSetting?.footer?.block4_logo ||
                  "/logo/logo.png"
                }
                alt="logo"
                width={200}
                height={80}
                className="w-full h-auto max-h-20 object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-2 md:gap-x-4 lg:gap-x-8 gap-y-4 md:gap-y-6 lg:gap-y-8 py-6 md:py-8 lg:py-12">
          {storeCustomizationSetting?.footer?.block1_status && (
            <div className="pb-3.5 sm:pb-0 border-b border-gray-200 md:border-0 md:border-r md:border-b-0 md:pr-6 lg:pr-8">
              <button
                onClick={() => toggleSection("block1")}
                className="w-full flex items-center justify-between py-2 md:py-0 md:pointer-events-none"
              >
                <h3 className="text-base md:text-lg font-bold text-gray-800 md:mb-3 relative inline-block">
                  <span className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-1 h-6 bg-store-500 rounded-full opacity-0 md:opacity-100"></span>
                  <CMSkeleton
                    count={1}
                    height={24}
                    loading={loading}
                    data={storeCustomizationSetting?.footer?.block1_title}
                  />
                </h3>
                <FiChevronDown
                  className={`w-5 h-5 text-gray-600 md:hidden transition-transform duration-300 ${
                    openSections.block1 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <ul
                className={`text-sm flex flex-col space-y-2 overflow-hidden transition-all duration-300 ${
                  openSections.block1 ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                } md:max-h-none md:opacity-100 md:mb-2`}
              >
                <li className="group">
                  <SafeLink
                    href={storeCustomizationSetting?.footer?.block1_sub_link1}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    <FiChevronRight className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" />
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block1_sub_title1
                      }
                    />
                  </SafeLink>
                </li>
                <li className="group">
                  <SafeLink
                    href={storeCustomizationSetting?.footer?.block1_sub_link2}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    <FiChevronRight className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" />
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block1_sub_title2
                      }
                    />
                  </SafeLink>
                </li>
                <li className="group">
                  <SafeLink
                    href={storeCustomizationSetting?.footer?.block1_sub_link3}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    <FiChevronRight className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" />
                    {showingTranslateValue(
                      storeCustomizationSetting?.footer_block_one_link_three_title
                    )}
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block1_sub_title3
                      }
                    />
                  </SafeLink>
                </li>
                <li className="group">
                  <SafeLink
                    href={storeCustomizationSetting?.footer?.block1_sub_link4}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    {/* <FiChevronRight className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" /> */}
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block1_sub_title4
                      }
                    />
                  </SafeLink>
                </li>
              </ul>
            </div>
          )}
          {storeCustomizationSetting?.footer?.block2_status && (
            <div className="pb-3.5 sm:pb-0 border-b border-gray-200 md:border-0 md:border-r md:border-b-0 md:pr-6 lg:pr-8">
              <button
                onClick={() => toggleSection("block2")}
                className="w-full flex items-center justify-between py-2 md:py-0 md:pointer-events-none"
              >
                <h3 className="text-base md:text-lg font-bold text-gray-800 md:mb-3 relative inline-block">
                  <span className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-1 h-6 bg-store-500 rounded-full opacity-0 md:opacity-100"></span>
                  <CMSkeleton
                    count={1}
                    height={24}
                    loading={loading}
                    data={storeCustomizationSetting?.footer?.block2_title}
                  />
                </h3>
                <FiChevronDown
                  className={`w-5 h-5 text-gray-600 md:hidden transition-transform duration-300 ${
                    openSections.block2 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <ul
                className={`text-sm lg:text-15px flex flex-col space-y-2 overflow-hidden transition-all duration-300 ${
                  openSections.block2 ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                } md:max-h-none md:opacity-100 md:mb-2`}
              >
                <li className="group">
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block2_sub_link1}`}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    <FiFileText className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" />
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block2_sub_title1
                      }
                    />
                  </Link>
                </li>

                <li className="group">
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block2_sub_link2}`}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    <FiShield className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" />
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block2_sub_title2
                      }
                    />
                  </Link>
                </li>
                <li className="group">
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block2_sub_link3}`}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    <FiRefreshCw className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" />
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block2_sub_title3
                      }
                    />
                  </Link>
                </li>
                <li className="group">
                  <Link
                    href={`${storeCustomizationSetting?.footer?.block2_sub_link4}`}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    <FiTruck className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" />
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block2_sub_title4
                      }
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {storeCustomizationSetting?.footer?.block3_status && (
            <div className="pb-3.5 sm:pb-0 border-b border-gray-200 md:border-0 md:border-r md:border-b-0 md:pr-6 lg:pr-8">
              <button
                onClick={() => toggleSection("block3")}
                className="w-full flex items-center justify-between py-2 md:py-0 md:pointer-events-none"
              >
                <h3 className="text-base md:text-lg font-bold text-gray-800 md:mb-3 relative inline-block">
                  <span className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-1 h-6 bg-store-500 rounded-full opacity-0 md:opacity-100"></span>
                  <CMSkeleton
                    count={1}
                    height={24}
                    loading={loading}
                    data={storeCustomizationSetting?.footer?.block3_title}
                  />
                </h3>
                <FiChevronDown
                  className={`w-5 h-5 text-gray-600 md:hidden transition-transform duration-300 ${
                    openSections.block3 ? "rotate-180" : ""
                  }`}
                />
              </button>
              <ul
                className={`text-sm lg:text-15px flex flex-col space-y-2 overflow-hidden transition-all duration-300 ${
                  openSections.block3 ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                } md:max-h-none md:opacity-100 md:mb-2`}
              >
                <li className="group">
                  <Link
                    href={storeCustomizationSetting?.footer?.block3_sub_link1}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    <FiSettings className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" />
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block3_sub_title1
                      }
                    />
                  </Link>
                </li>
                <li className="group">
                  <Link
                    href={storeCustomizationSetting?.footer?.block3_sub_link2}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    <FiPackage className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" />
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block3_sub_title2
                      }
                    />
                  </Link>
                </li>
                <li className="group">
                  <Link
                    href={storeCustomizationSetting?.footer?.block3_sub_link3}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    <FiShoppingBag className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" />
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block3_sub_title3
                      }
                    />
                  </Link>
                </li>
                <li className="group">
                  <Link
                    href={storeCustomizationSetting?.footer?.block3_sub_link4}
                    className="text-gray-600 inline-flex items-center w-full hover:text-store-600 transition-all duration-300"
                  >
                    <FiUser className="w-4 h-4 mr-2 text-gray-500 group-hover:text-store-600 transition-colors" />
                    <CMSkeleton
                      count={1}
                      height={16}
                      loading={loading}
                      data={
                        storeCustomizationSetting?.footer?.block3_sub_title4
                      }
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {storeCustomizationSetting?.footer?.block4_status && (
            <div className="pb-3.5 sm:pb-0">
              
              {/* Address Section - Always Visible */}
              <div className="space-y-2  ">
                <h3 className="text-base font-bold text-gray-800">
                  Registered Office Address
                </h3>
                
                {/* Company Name */}
                {loading ? (
                  <div className="mb-2">
                    <CMSkeleton count={1} height={24} loading={true} />
                  </div>
                ) : globalSetting?.company_name ? (
                  <div className="mb-1">
                    <p className="text-base font-semibold text-gray-800">
                      {globalSetting.company_name}
                    </p>
                  </div>
                ) : null}
                
                <div className="flex items-start gap-3 text-gray-600">
                  <FiMapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                  <p className="leading-6 font-sans text-sm text-left">
                    <CMSkeleton
                      count={1}
                      height={40}
                      loading={loading}
                      data={storeCustomizationSetting?.footer?.block4_address}
                    />
                  </p>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-store-600 transition-colors">
                  <FiPhone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <a 
                    href={`tel:${storeCustomizationSetting?.footer?.block4_phone}`}
                    className="text-sm hover:underline"
                  >
                    {storeCustomizationSetting?.footer?.block4_phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-store-600 transition-colors">
                  <FiMail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <a 
                    href={`mailto:${storeCustomizationSetting?.footer?.block4_email}`}
                    className="text-sm hover:underline break-all"
                  >
                    {storeCustomizationSetting?.footer?.block4_email}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        

        {/* Social Media Section */}
        <div className="py-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {storeCustomizationSetting?.footer?.social_links_status && (
              <div>
                {(storeCustomizationSetting?.footer?.social_facebook ||
                  storeCustomizationSetting?.footer?.social_twitter ||
                  storeCustomizationSetting?.footer?.social_instagram ||
                  storeCustomizationSetting?.footer?.social_linkedin ||
                  storeCustomizationSetting?.footer?.social_whatsapp) && (
                  <h3 className="text-base font-bold mb-2 text-gray-800">
                    Social
                  </h3>
                )}
                <ul className="text-sm flex flex-wrap gap-3">
                    {storeCustomizationSetting?.footer?.social_facebook && (
                      <li className="group">
                        <Link
                          href={`${storeCustomizationSetting?.footer?.social_facebook}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
                        >
                          <FacebookIcon size={40} round className="rounded-full group-hover:shadow-lg transition-shadow" />
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_twitter && (
                      <li className="group">
                        <Link
                          href={`${storeCustomizationSetting?.footer?.social_twitter}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
                        >
                          <TwitterIcon size={40} round className="rounded-full group-hover:shadow-lg transition-shadow" />
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_instagram && (
                      <li className="group">
                        <Link
                          href={`${storeCustomizationSetting?.footer?.social_instagram}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
                        >
                          <div className="rounded-full shadow-md group-hover:shadow-lg transition-shadow">
                            <FaInstagram size={40} style={{ color: "#E4405F" }} className="rounded-full" />
                          </div>
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_linkedin && (
                      <li className="group">
                        <Link
                          href={`${storeCustomizationSetting?.footer?.social_linkedin}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
                        >
                          <LinkedinIcon size={40} round className=" rounded-full group-hover:shadow-lg transition-shadow" />
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_whatsapp && (
                      <li className="group">
                        <Link
                          href={`${storeCustomizationSetting?.footer?.social_whatsapp}`}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto transition-transform duration-300 hover:scale-110 hover:-translate-y-1"
                        >
                          <WhatsappIcon size={40} round className="rounded-full group-hover:shadow-lg transition-shadow" />
                        </Link>
                      </li>
                    )}
                </ul>
              </div>
            )}
            {/* App Store & Google Play Store */}
            {(storeCustomizationSetting?.home?.daily_need_app_link ||
              storeCustomizationSetting?.home?.daily_need_google_link ||
              storeCustomizationSetting?.home?.button1_img ||
              storeCustomizationSetting?.home?.button2_img) && (
              <div>
                <h3 className="text-base font-bold mb-2 text-gray-800">
                  Download Our App
                </h3>
                <div className="flex gap-3">
                  {(storeCustomizationSetting?.home?.daily_need_app_link ||
                    storeCustomizationSetting?.home?.button1_img) && (
                    <Link
                      href={
                        storeCustomizationSetting?.home?.daily_need_app_link ||
                        "#"
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block transition-transform duration-300 hover:scale-105"
                    >
                      <Image
                        width={170}
                        height={50}
                        className="rounded"
                        src={
                          storeCustomizationSetting?.home?.button1_img ||
                          "/app/app-store.svg"
                        }
                        alt="Download on the App Store"
                      />
                    </Link>
                  )}
                  {(storeCustomizationSetting?.home?.daily_need_google_link ||
                    storeCustomizationSetting?.home?.button2_img) && (
                    <Link
                      href={
                        storeCustomizationSetting?.home?.daily_need_google_link ||
                        "#"
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block transition-transform duration-300 hover:scale-105"
                    >
                      <Image
                        width={170}
                        height={50}
                        className="rounded"
                        src={
                          "/app/play-store.svg" ||storeCustomizationSetting?.home?.button2_img 
                          
                        }
                        alt="Get it on Google Play"
                      />
                    </Link>
                  )}
                </div>
              </div>
            )}
            {storeCustomizationSetting?.footer?.payment_method_status && (
              <div>
                <h3 className="text-base font-bold mb-2 text-gray-800">
                  Payment Methods
                </h3>
                <div className="mt-2">
                  <Image
                    width={274}
                    height={20}
                    className="h-14 w-auto max-w-full rounded-lg object-contain"
                    src={
                      "/payment-method/razorpay_logo.svg" || storeCustomizationSetting?.footer?.payment_method_img 
                     
                    }
                    alt="payment method"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
 

        {/* Copyright Section */}
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 flex justify-center py-5 border-t border-gray-200">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-600 leading-6 text-center">
              Copyright 2025 @{" "}
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-store-600 font-bold hover:text-store-700 transition-colors duration-300"
              >
                Farmacykart
              </Link>
              , All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Footer), { ssr: false });


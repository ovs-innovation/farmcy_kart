import Head from "next/head";
import { ToastContainer } from "react-toastify";

//internal import

import Navbar from "@layout/navbar/Navbar";
import Footer from "@layout/footer/Footer";
import NavBarTop from "./navbar/NavBarTop";
import FooterTop from "@layout/footer/FooterTop";
import MobileFooter from "@layout/footer/MobileFooter";
import MobileBottomNavigation from "@layout/footer/MobileBottomNavigation";
import FeatureCard from "@components/feature-card/FeatureCard";
import useGetSetting from "@hooks/useGetSetting";
import { getPalette } from "@utils/themeColors";
import useCartSync from "@hooks/useCartSync";

const Layout = ({ title, description, children, hideMobileHeader }) => {
  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "pink";
  const palette = getPalette(storeColor);

  // Sync prescription medicines to cart
  useCartSync();

  return (
    <>
      <ToastContainer />

      <div className="font-sans">
        <Head>
          <style>
            {`
              :root {
                --store-color-50: ${palette[50]};
                --store-color-100: ${palette[100]};
                --store-color-200: ${palette[200]};
                --store-color-300: ${palette[300]};
                --store-color-400: ${palette[400]};
                --store-color-500: ${palette[500]};
                --store-color-600: ${palette[600]};
                --store-color-700: ${palette[700]};
                --store-color-800: ${palette[800]};
                --store-color-900: ${palette[900]};
              }
            `}
          </style>
          <title>
            {title
              ? `E-HealthandHerbs | ${title}`
              : "E-HealthandHerbs – Customized Promotional Items & Advertising Products Online Store"}
          </title>
          {description && <meta name="description" content={description || "Discover personalized merchandise, branded giveaways, and advertising essentials. Ideal for businesses, events, and promotions"} />}
          <link ref="icon" href="https://res.cloudinary.com/dhqcwkpzp/image/upload/v1750844959/download_wfxk5k.webp" />
        </Head>
        {/* Desktop header */}
        <div className="hidden lg:block">
          <NavBarTop />
        </div>
        <Navbar />

        {/* Mobile header bar (fixed) */}
        {!hideMobileHeader && <MobileFooter />}

        {/* Mobile Bottom Navigation */}
        {!hideMobileHeader && <MobileBottomNavigation />}

        {/* Add top padding on mobile so content doesn't sit behind fixed header */}
        <div className={`bg-gray-50 ${hideMobileHeader ? "pt-0" : "pt-16"} lg:pt-0 pb-16 lg:pb-0`}>{children}</div>
        <div className="  w-full">
          <FooterTop  />
          <div className="hidden  relative lg:block mx-auto max-w-screen-2xl py-6 px-3 sm:px-10">
            <FeatureCard />
          </div>
          <hr className="hr-line"></hr>
          <div className="border-t border-gray-100 w-full">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;

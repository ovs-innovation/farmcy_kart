import React from "react";
import { FiShield, FiLock, FiEye, FiFileText, FiAlertCircle, FiCheckCircle, FiUser, FiDatabase, FiGlobe, FiHeadphones } from "react-icons/fi";

//internal import
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import SimpleHeader from "@components/header/SimpleHeader";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";

const PrivacyPolicy = () => {
  const { storeCustomizationSetting, loading, error } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  return (
    <Layout title="Privacy Policy" description="This is privacy policy page">
      <SimpleHeader
        title={
          showingTranslateValue(storeCustomizationSetting?.privacy_policy?.title) ||
          "Privacy Policy"
        }
      />
      
      <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-0">
        <div className=" ">
          
          {/* Main Policy Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-justify">
            
            {/* Content Section with Box Style */}
            <div className="p-6 lg:p-8">
              
              {/* CMS Content in Box */}
              <div className="privacy-policy-content">
                <div className="text-gray-600 leading-relaxed">
                  <CMSkeleton
                    html
                    count={15}
                    height={15}
                    error={error}
                    loading={loading}
                    data={storeCustomizationSetting?.privacy_policy?.description}
                  />
                </div>
              </div>

              {/* Loading States */}
              {loading && (
                <div className="mt-6 space-y-4">
                  <CMSkeleton count={15} height={15} loading={loading} />
                  <CMSkeleton count={15} height={15} loading={loading} />
                </div>
              )}
            </div>
          </div>

          {/* Info Cards Grid - 2x2 Layout */}
          {!loading && !error && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Card 1 - Data Protection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiLock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Data Protection</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Your personal information is encrypted and securely stored using industry-standard security measures.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Transparency */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiEye className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Transparency</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We clearly explain how we collect, use, and protect your personal information.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Secure Storage */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiDatabase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Secure Storage</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      All data is stored in secure, encrypted databases with restricted access controls.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4 - Global Standards */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiGlobe className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-2">Global Standards</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We comply with international privacy regulations and data protection laws.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Contact Section - Box Style */}
          {!loading && !error && (
            <div className="mt-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                    <FiHeadphones className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Have Questions About Privacy?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      If you have any questions or concerns about our privacy policy, please contact our privacy team.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-blue-700 bg-white px-4 py-2 rounded-lg shadow-sm">
                        <FiShield className="w-4 h-4" />
                        <span className="font-medium">Your Privacy is Our Priority</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700 bg-white px-4 py-2 rounded-lg shadow-sm">
                        <FiCheckCircle className="w-4 h-4" />
                        <span className="font-medium">100% Secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;

import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  FiCheck,
  FiInfo,
  FiRefreshCw,
  FiSave,
} from "react-icons/fi";

// internal import
import PageTitle from "@/components/Typography/PageTitle";
import AnimatedContent from "@/components/common/AnimatedContent";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import SettingServices from "@/services/SettingServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import { SidebarContext } from "@/context/SidebarContext";
import spinnerLoadingImage from "@/assets/img/spinner.gif";

const PaymentSettings = () => {
  const { t } = useTranslation();
  const { setIsUpdate } = useContext(SidebarContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Local state for UI interaction
  const [paymentOptions, setPaymentOptions] = useState({
    cashOnDelivery: true,
    digitalPayment: true,
    offlinePayment: true,
    combinedPayment: true,
    remainingCOD: true,
    remainingDigital: true,
  });

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const res = await SettingServices.getStoreSetting();
        if (res) {
          setPaymentOptions({
            cashOnDelivery: res.cod_status ?? true,
            digitalPayment: res.razorpay_status ?? true,
            offlinePayment: res.offline_payment_status ?? true,
            combinedPayment: res.combined_payment_status ?? true,
            remainingCOD: res.remaining_cod_status ?? true,
            remainingDigital: res.remaining_digital_status ?? true,
          });
        }
      } catch (err) {
        console.error("Error fetching payment settings", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPaymentSettings();
  }, []);

  const toggleOption = (key) => {
    setPaymentOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        name: "storeSetting",
        setting: {
          cod_status: paymentOptions.cashOnDelivery,
          razorpay_status: paymentOptions.digitalPayment,
          offline_payment_status: paymentOptions.offlinePayment,
          combined_payment_status: paymentOptions.combinedPayment,
          remaining_cod_status: paymentOptions.remainingCOD,
          remaining_digital_status: paymentOptions.remainingDigital,
        },
      };

      const res = await SettingServices.updateStoreSetting(payload);
      setIsUpdate(true);
      notifySuccess(res.message || "Payment settings updated successfully!");
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle>Payment Options</PageTitle>
      <AnimatedContent>
        <div className="space-y-8 pb-20">
          
          {/* Payment Options Grid */}
          <section className="bg-white border border-[#f1f5f9] rounded-[24px] p-8 shadow-sm dark:bg-gray-800 dark:border-gray-700">
             <div className="mb-10">
                <h3 className="text-[20px] font-bold text-[#202938] dark:text-white mb-2">Payment Options</h3>
                <p className="text-[14px] text-[#73849b]">Setup your business payment options from here</p>
             </div>

             <div className="bg-[#f8fafc] p-10 rounded-3xl dark:bg-gray-900/40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <PaymentOptionCard
                      title="Cash On Delivery"
                      description="Let your customers pay when they receive their orders. A convenient option for those who prefer to pay with cash."
                      checked={paymentOptions.cashOnDelivery}
                      onClick={() => toggleOption("cashOnDelivery")}
                   />
                   <PaymentOptionCard
                      title="Digital Payment"
                      description="Enable customers to pay instantly using online payment gateways. To activate, please configure your payment gateway settings."
                      checked={paymentOptions.digitalPayment}
                      onClick={() => toggleOption("digitalPayment")}
                   />
                   <PaymentOptionCard
                      title="Offline payment"
                      description="Let customers complete payment outside the system. After placing the order, they will upload the payment proof for verification by the admin."
                      checked={paymentOptions.offlinePayment}
                      onClick={() => toggleOption("offlinePayment")}
                   />
                </div>
             </div>
          </section>

          {/* Combined Payment Section */}
          <section className="bg-white border border-[#f1f5f9] rounded-[24px] p-10 shadow-sm dark:bg-gray-800 dark:border-gray-700">
             <div className="mb-8 flex items-center gap-3 rounded-xl border border-[#ffe9a3] bg-[#fff9e6] p-5 dark:border-orange-800/20 dark:bg-orange-900/10">
                <div className="flex-shrink-0 mt-0.5">
                   <div className="bg-orange-400 rounded-full h-5 w-5 flex items-center justify-center">
                      <FiInfo className="text-white h-3 w-3" />
                   </div>
                </div>
                <div className="text-[14px] leading-relaxed text-[#42526b] dark:text-gray-300">
                   <p className="font-bold mb-1">To enable this feature, the following must be activated</p>
                   <ul className="list-disc ml-5 space-y-1">
                      <li>Customer Wallet from the <span className="text-[#1890ff] font-bold cursor-pointer">Customer Wallet</span> Page.</li>
                      <li>At least one payment method from the payment options above</li>
                   </ul>
                </div>
             </div>

             <div className="flex items-center justify-between mb-4">
                <div>
                   <h3 className="text-[20px] font-bold text-[#202938] dark:text-white mb-2">Allow Combined Payment</h3>
                   <p className="text-[14px] text-[#73849b]">This feature enables customers to partially pay with their wallet balance and complete the payment using other available payment methods.</p>
                </div>
                <div className="flex items-center gap-12 bg-white border border-[#e6ebf5] rounded-xl px-8 py-3.5 shadow-sm dark:bg-gray-900 dark:border-gray-700">
                   <span className="text-[16px] font-bold text-[#42526b] dark:text-white">Status</span>
                   <SwitchToggle
                      processOption={paymentOptions.combinedPayment}
                      handleProcess={() => toggleOption("combinedPayment")}
                   />
                </div>
             </div>

             {paymentOptions.combinedPayment && (
               <div className="mt-8 animate-fadeIn">
                  <label className="flex items-center gap-2 text-[15px] font-bold text-[#42526b] dark:text-gray-100 mb-6 uppercase tracking-wide">
                     Available Option To Pay The Remaining Bill <span className="text-red-500">*</span> <FiInfo className="h-4 w-4 text-[#93a1b3]" />
                  </label>
                  
                  <div className="bg-white border border-[#e6ebf5] rounded-2xl p-6 shadow-sm dark:bg-gray-900 dark:border-gray-700 flex flex-wrap gap-12 transition-all">
                     <CheckboxItem
                        label="Cash on Delivery (COD)"
                        checked={paymentOptions.remainingCOD}
                        onChange={() => toggleOption("remainingCOD")}
                     />
                     <CheckboxItem
                        label="Digital Payment"
                        checked={paymentOptions.remainingDigital}
                        onChange={() => toggleOption("remainingDigital")}
                     />
                  </div>
               </div>
             )}

             {/* Action Buttons */}
             <div className="mt-16 flex flex-row justify-end items-center gap-6 border-t border-[#eef2f7] pt-8 dark:border-gray-700">
               <button
                 type="button"
                 onClick={() => window.location.reload()}
                 className="h-14 px-12 rounded-xl border border-[#dbe4ef] bg-[#f4f7fb] text-[17px] font-bold text-[#324054] transition-all hover:bg-[#e9eef5] flex items-center justify-center gap-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-sm"
               >
                 <FiRefreshCw className="h-5 w-5" />
                 Reset
               </button>

               <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="h-14 px-12 rounded-xl bg-[#0e7e87] text-[17px] font-bold text-white shadow-[0_8px_20px_-8px_#0e7e87] transition-all hover:shadow-[0_12px_24px_-10px_#0e7e87] hover:bg-[#0c6c74] flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <img src={spinnerLoadingImage} alt="Saving" width={22} height={22} />
                  ) : (
                    <FiSave className="h-5 w-5" />
                  )}
                  <span>{isSubmitting ? "Saving..." : "Save Information"}</span>
                </button>
             </div>
          </section>

        </div>
      </AnimatedContent>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}} />
    </>
  );
};

const PaymentOptionCard = ({ title, description, checked, onClick }) => (
  <div 
     onClick={onClick}
     className={`p-8 bg-white border-2 rounded-[24px] cursor-pointer transition-all duration-300 shadow-sm relative group ${
        checked ? 'border-[#0e7e87] ring-1 ring-[#0e7e87]/10' : 'border-[#e6ebf5] hover:border-[#0e7e87]/40 dark:border-gray-700'
     }`}
  >
     <div className="flex items-center gap-4 mb-4">
        <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
           checked ? 'bg-[#0e7e87] text-white' : 'border-2 border-gray-200 dark:border-gray-700 group-hover:border-[#0e7e87]'
        }`}>
           {checked && <FiCheck className="w-4 h-4 stroke-[3]" />}
        </div>
        <h4 className="text-[17px] font-bold text-[#202938] dark:text-white group-hover:text-[#0e7e87] transition-colors">{title}</h4>
     </div>
     <p className="text-[14px] leading-relaxed text-[#73849b] group-hover:text-[#42526b] transition-colors">{description}</p>
  </div>
);

const CheckboxItem = ({ label, checked, onChange }) => (
   <div className="flex items-center gap-4 cursor-pointer group" onClick={onChange}>
      <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
         checked ? 'bg-[#0e7e87] text-white' : 'border-2 border-gray-200 dark:border-gray-700 group-hover:border-[#0e7e87]'
      }`}>
         {checked && <FiCheck className="w-4 h-4 stroke-[3]" />}
      </div>
      <span className="text-[16px] font-bold text-[#42526b] dark:text-gray-300 group-hover:text-[#202938] transition-colors">{label}</span>
   </div>
);

export default PaymentSettings;

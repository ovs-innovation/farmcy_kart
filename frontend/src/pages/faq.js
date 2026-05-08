import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

//internal import
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import PageHeader from "@components/header/PageHeader";
import useUtilsFunction from "@hooks/useUtilsFunction";
import FaqServices from "@services/FaqServices";
import { notifyError } from "@utils/toast";

const AccordionItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center py-5 text-left focus:outline-none"
    >
      <span className="text-lg font-semibold text-gray-900">{question}</span>
      <span
        className={`flex items-center justify-center w-9 h-9 rounded-full border border-purple-500 text-purple-600 text-2xl font-light transition-transform ${
          isOpen ? "" : ""
        }`}
      >
        {isOpen ? "−" : "+"}
      </span>
    </button>
    {isOpen && (
      <div className="pb-6 text-base leading-7 text-gray-700">{answer}</div>
    )}
  </div>
);

const Faq = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    setLoadingFaqs(true);
    FaqServices.getPublicFaqs()
      .then((res) => {
        // Filter out video type FAQs for the main list if needed, or handle them
        const qaFaqs = (res || []).filter(item => item.type !== 'video');
        setFaqs(qaFaqs);
      })
      .catch((err) => {
        console.error("Failed to load FAQs:", err);
      })
      .finally(() => setLoadingFaqs(false));
  }, []);

  const defaultFaqs = [
    {
      question: "How can I cancel my order?",
      answer: "If you wish to cancel your order, please message us on WhatsApp with your Order ID for a cancellation request. Our support team will assist you immediately.",
    },
    {
      question: "What is the typical delivery time?",
      answer: "Most orders are delivered within 24-48 hours. For certain locations, it may take up to 3-5 business days. You can track your order in the 'My Orders' section.",
    },
    {
      question: "Are the medicines sold on Farmacykart authentic?",
      answer: "Absolutely. We only source products directly from authorized distributors and reputable manufacturers. All medicines undergo strict quality checks.",
    },
    {
      question: "Do I need a prescription to buy medicines?",
      answer: "Yes, for prescription-only medicines (Schedule H & H1), a valid prescription from a registered medical practitioner is mandatory. You can upload it during checkout.",
    },
    {
      question: "How do I return an item?",
      answer: "Returns are accepted within 7 days of delivery for unopened and undamaged products. Please refer to our Refund & Return Policy for more details.",
    },
    {
      question: "Can I pay using Cash on Delivery (COD)?",
      answer: "Yes, we offer Cash on Delivery for most locations. You can also pay online using UPI, Credit/Debit cards, or Net Banking for a contactless experience.",
    },
  ];

  // Combine API faqs with default ones if API is empty, or just show API ones if they exist
  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <Layout title="FAQ" description="Frequently Asked Questions - Farmacykart">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-store-600 to-store-800 py-16 lg:py-24">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-store-100 text-lg md:text-xl max-w-3xl mx-auto">
            Find answers to common questions about ordering, delivery, prescriptions, and more. We're here to help you.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-10">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6 md:p-10 lg:p-16">
              {loadingFaqs ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayFaqs.map((faq, idx) => (
                    <div 
                      key={faq._id || idx} 
                      className={`border rounded-2xl transition-all duration-300 ${
                        openIndex === idx ? 'border-store-200 bg-store-50/30' : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        className="w-full flex justify-between items-center p-5 md:p-6 text-left focus:outline-none"
                      >
                        <span className={`text-lg font-bold transition-colors ${openIndex === idx ? 'text-store-700' : 'text-gray-900'}`}>
                          {faq.question}
                        </span>
                        <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                          openIndex === idx ? 'bg-store-600 border-store-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-400'
                        }`}>
                          <span className="text-xl leading-none">{openIndex === idx ? "−" : "+"}</span>
                        </div>
                      </button>
                      {openIndex === idx && (
                        <div className="px-5 pb-6 md:px-6 md:pb-8 animate-fadeIn">
                          <div className="h-px bg-gray-200/50 mb-6 w-full" />
                          <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Still have questions? Section */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
              <p className="text-gray-500 mb-6">If you couldn't find the answer you're looking for, please get in touch with our team.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href={storeCustomizationSetting?.footer?.social_whatsapp?.startsWith('http') 
                    ? storeCustomizationSetting.footer.social_whatsapp 
                    : `https://wa.me/${storeCustomizationSetting?.footer?.social_whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all shadow-md"
                >
                  Message on WhatsApp
                </a>
                <a 
                  href="/contact-us" 
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
};

export default Faq;

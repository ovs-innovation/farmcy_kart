import { useParams } from "react-router";
import ReactToPrint from "react-to-print";
import React, { useContext, useRef, useState } from "react";
import { FiPrinter, FiMail } from "react-icons/fi";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { Button } from "@windmill/react-ui";
import { WindmillContext } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";

//internal import
import useAsync from "@/hooks/useAsync";
import useError from "@/hooks/useError";
import { notifyError, notifySuccess } from "@/utils/toast";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import OrderServices from "@/services/OrderServices";
import InvoiceLayout from "@/components/invoice/InvoiceLayout";
import Loading from "@/components/preloader/Loading";
import logoDark from "@/assets/img/logo/logo-color.png";
import logoLight from "@/assets/img/logo/logo-color.png";
import PageTitle from "@/components/Typography/PageTitle";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import useDisableForDemo from "@/hooks/useDisableForDemo";
import InvoiceForDownload from "@/components/invoice/InvoiceForDownload";

const OrderInvoice = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { id } = useParams();
  const printRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error } = useAsync(() =>
    OrderServices.getOrderById(id)
  );

  const { handleErrorNotification } = useError();
  const { handleDisableForDemo } = useDisableForDemo();

  // console.log("data", data);

  const { currency, globalSetting, showDateFormat, getNumberTwo } =
    useUtilsFunction();

  const handleEmailInvoice = async (inv) => {
    // console.log("inv", inv);
    if (handleDisableForDemo()) {
      return; // Exit the function if the feature is disabled
    }

    // if (adminInfo?.role !== "Super Admin")
    //   return notifyError(
    //     "You don't have permission to sent email of this order!"
    //   );
    setIsSubmitting(true);
    try {
      const updatedData = {
        ...inv,
        date: showDateFormat(inv.createdAt),
        company_info: {
          currency: currency,
          vat_number: globalSetting?.vat_number,
          company: globalSetting?.company_name,
          address: globalSetting?.address,
          phone: globalSetting?.contact,
          email: globalSetting?.email,
          website: globalSetting?.website,
          from_email: globalSetting?.from_email,
        },
      };
      // console.log("updatedData", updatedData);

      // return setIsSubmitting(false);
      const res = await OrderServices.sendEmailInvoiceToCustomer(updatedData);
      notifySuccess(res.message);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      handleErrorNotification(err, "handleEmailInvoice");
    }
  };

  return (
    <>
      <PageTitle> {t("InvoicePageTittle")} </PageTitle>

      <div
        ref={printRef}
        className="bg-white dark:bg-gray-800 mb-4 p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <Loading loading={loading} />
        ) : error ? (
          <span className="text-center mx-auto text-red-500">{error}</span>
        ) : (
          <InvoiceLayout
            data={data}
            currency={currency}
            globalSetting={globalSetting}
            getNumberTwo={getNumberTwo}
            printRef={printRef}
          />
        )}
      </div>
      {!loading && !error && (
        <div className="mb-4 mt-3 flex md:flex-row flex-col items-center justify-between">
          <PDFDownloadLink
            document={
              <InvoiceForDownload
                data={data}
                currency={currency}
                globalSetting={globalSetting}
                getNumberTwo={getNumberTwo}
                logo={globalSetting?.logo}
                isWholesaler={
                  data?.user_info?.role?.toString().toLowerCase().trim() === "wholesaler" ||
                  data?.user?.role?.toString().toLowerCase().trim() === "wholesaler" ||
                  data?.role?.toString().toLowerCase().trim() === "wholesaler" ||
                  data?.user_info?.userType?.toString().toLowerCase().trim() === "wholesaler" ||
                  data?.userType?.toString().toLowerCase().trim() === "wholesaler" ||
                  data?.cart?.[0]?.wholePrice > 0
                }
              />
            }
            fileName="Invoice"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                "Loading..."
              ) : (
                <button className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-store-500 border border-transparent active:bg-store-600 hover:bg-store-600  w-auto cursor-pointer">
                  Download Invoice
                  <span className="ml-2 text-base">
                    <IoCloudDownloadOutline />
                  </span>
                </button>
              )
            }
          </PDFDownloadLink>

          <div className="flex md:mt-0 mt-3 gap-4 md:w-auto w-full">
            {globalSetting?.email_to_customer && (
              <div className="flex justify-end md:w-auto w-full">
                {isSubmitting ? (
                  <Button
                    disabled={true}
                    type="button"
                    className="text-sm h-10 leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none text-white px-2 ml-4 md:px-4 lg:px-6 py-4 md:py-3.5 lg:py-4 hover:text-white bg-store-400 hover:bg-store-500"
                  >
                    <img
                      src={spinnerLoadingImage}
                      alt="Loading"
                      width={20}
                      height={10}
                    />{" "}
                    <span className="font-serif ml-2 font-light">
                      {" "}
                      Processing
                    </span>
                  </Button>
                ) : (
                  <button
                    onClick={() => handleEmailInvoice(data)}
                    className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-teal-500 border border-transparent active:bg-teal-600 hover:bg-teal-600  md:w-auto w-full h-10 justify-center"
                  >
                    Email Invoice
                    <span className="ml-2">
                      <FiMail />
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* <div className="md:w-auto w-full">
              <ReactToPrint
                trigger={() => (
                  <button className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-store-500 border border-transparent active:bg-store-600 hover:bg-store-600  md:w-auto w-full h-10 justify-center">
                    {t("PrintInvoice")}{" "}
                    <span className="ml-2">
                      <FiPrinter />
                    </span>
                  </button>
                )}
                content={() => printRef.current}
                documentTitle={data?.invoice}
              />
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderInvoice;

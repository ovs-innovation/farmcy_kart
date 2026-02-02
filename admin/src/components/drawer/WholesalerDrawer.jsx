import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useWholesalerSubmit from "@/hooks/useWholesalerSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";
import Uploader from "@/components/image-uploader/Uploader";
import { notifySuccess, notifyError } from "@/utils/toast";
import CustomerServices from "@/services/CustomerServices";

const WholesalerDrawer = ({ id }) => {
  const { register, handleSubmit, onSubmit, errors, isSubmitting, setFieldValue, removeAsset, wholesalerData, getValues, watch, sendCredentials } =
    useWholesalerSubmit(id);

  const acceptDocs = {
    "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    "application/pdf": [".pdf"],
  };

  const handleDocUploadComplete = async (field, publicField, publicDeleteField, data) => {
    try {
      const url = data?.secure_url || data?.url || "";
      const publicId = data?.public_id || "";
      const deleteToken = data?.delete_token || "";
      setFieldValue(field, url, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setFieldValue(publicField, publicId, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      if (publicDeleteField) {
        setFieldValue(publicDeleteField, deleteToken, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      }
      if (id) {
        const updateObj = { [field]: url, [publicField]: publicId };
        if (publicDeleteField && deleteToken) updateObj[publicDeleteField] = deleteToken;
        await CustomerServices.updateCustomer(id, updateObj);
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message || "Failed to save document");
    }
  };

  const handleDocRemove = async (field, publicField, publicDeleteField) => {
    try {
      setFieldValue(field, "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setFieldValue(publicField, "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      if (publicDeleteField) {
        setFieldValue(publicDeleteField, "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      }
      if (id) {
        await removeAsset(field);
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message || "Failed to remove document");
    }
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title title={"Update Wholesaler"} description={"Update Wholesaler information from here"} />
        ) : (
          <Title title={"Add Wholesaler"} description={"Add Wholesaler necessary information from here"} />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Name"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea required={true} register={register} label="Name" name="name" type="text" placeholder={"Name"} />
                <Error errorName={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Email"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea required={true} register={register} label="Email" name="email" type="email" placeholder={"Email"} />
                <Error errorName={errors.email} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Phone"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea register={register} label="Phone" name="phone" type="text" placeholder={"Phone"} />
                <Error errorName={errors.phone} />
              </div>
            </div>

            {/* Password generation for wholesaler */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Password"} />
              <div className="col-span-10 sm:col-span-4 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-grow">
                  <InputArea register={register} label="Password" name="password" type="text" placeholder={"Password"} />
                </div>
                <div className="flex gap-2">
                  {id ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded"
                        onClick={async (e) => {
                          e.preventDefault();
                          const pwd = (getValues && getValues('password')) ? String(getValues('password')).trim() : '';
                          if (!pwd) {
                            notifyError('Please enter a password before sending');
                            return;
                          }
                          try {
                            await sendCredentials(pwd);
                          } catch (err) {
                            // handled in hook
                          }
                        }}
                      >Send Credentials</button>

                      <div className="text-xs text-gray-600">
                        Sent: <strong>{wholesalerData?.credentialEmailCount || 0}</strong>
                        {wholesalerData?.lastCredentialEmailSentAt ? (
                          <span className="block">Last: {new Date(wholesalerData.lastCredentialEmailSentAt).toLocaleString()}</span>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">Save the wholesaler to send credentials</div>
                  )}
                </div>
              </div>
            </div>

            {/* Wholesaler specific fields */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Aadhar URL"} />
              <div className="col-span-8 sm:col-span-4">
                <div className="mt-2 text-xs text-gray-600 flex items-center gap-3">
                  <Uploader
                    imageUrl={watch?.("aadhar") || wholesalerData?.aadhar || getValues("aadhar") || ""}
                    setImageUrl={(url) => setFieldValue("aadhar", url, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                    folder="wholesaler"
                    accept={acceptDocs}
                    maxSize={10 * 1024 * 1024}
                    useOriginalSize={true}
                    uniquePublicId={true}
                    onUploadComplete={(data) => handleDocUploadComplete("aadhar", "aadharPublicId", "aadharDeleteToken", data)}
                    onRemove={() => handleDocRemove("aadhar", "aadharPublicId", "aadharDeleteToken")}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"PAN URL"} />
              <div className="col-span-8 sm:col-span-4">
                <div className="mt-2 text-xs text-gray-600 flex items-center gap-3">
                  <Uploader
                    imageUrl={watch?.("pan") || wholesalerData?.pan || getValues("pan") || ""}
                    setImageUrl={(url) => setFieldValue("pan", url, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                    folder="wholesaler"
                    accept={acceptDocs}
                    maxSize={10 * 1024 * 1024}
                    useOriginalSize={true}
                    uniquePublicId={true}
                    onUploadComplete={(data) => handleDocUploadComplete("pan", "panPublicId", "panDeleteToken", data)}
                    onRemove={() => handleDocRemove("pan", "panPublicId", "panDeleteToken")}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"GST URL"} />
              <div className="col-span-8 sm:col-span-4">
                <div className="mt-2 text-xs text-gray-600 flex items-center gap-3">
                  <Uploader
                    imageUrl={watch?.("gst") || wholesalerData?.gst || getValues("gst") || ""}
                    setImageUrl={(url) => setFieldValue("gst", url, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                    folder="wholesaler"
                    accept={acceptDocs}
                    maxSize={10 * 1024 * 1024}
                    useOriginalSize={true}
                    uniquePublicId={true}
                    onUploadComplete={(data) => handleDocUploadComplete("gst", "gstPublicId", "gstDeleteToken", data)}
                    onRemove={() => handleDocRemove("gst", "gstPublicId", "gstDeleteToken")}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={"Drug License URL"} />
              <div className="col-span-8 sm:col-span-4">
                <div className="mt-2 text-xs text-gray-600 flex items-center gap-3">
                  <Uploader
                    imageUrl={watch?.("drugLicense") || wholesalerData?.drugLicense || getValues("drugLicense") || ""}
                    setImageUrl={(url) => setFieldValue("drugLicense", url, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                    folder="wholesaler"
                    accept={acceptDocs}
                    maxSize={10 * 1024 * 1024}
                    useOriginalSize={true}
                    uniquePublicId={true}
                    onUploadComplete={(data) => handleDocUploadComplete("drugLicense", "drugLicensePublicId", "drugLicenseDeleteToken", data)}
                    onRemove={() => handleDocRemove("drugLicense", "drugLicensePublicId", "drugLicenseDeleteToken")}
                  />
                </div>
              </div>
            </div>

          </div>

          <DrawerButton id={id} title="Wholesaler" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default WholesalerDrawer;

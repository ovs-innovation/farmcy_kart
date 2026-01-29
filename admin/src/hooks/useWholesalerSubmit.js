import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

import { SidebarContext } from "@/context/SidebarContext";
import CustomerServices from "@/services/CustomerServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useWholesalerSubmit = (id) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeDrawer, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await CustomerServices.getCustomerById(id);
          if (res) {
            setValue("name", res.name);
            setValue("phone", res.phone);
            setValue("email", res.email);
            setValue("aadhar", res.aadhar || "");
            setValue("pan", res.pan || "");
            setValue("gst", res.gst || "");
            setValue("drugLicense", res.drugLicense || "");
            setValue("gstNotRequired", !!res.gstNotRequired);
            setValue("drugLicenseNotRequired", !!res.drugLicenseNotRequired);
            // store public ids for deletion if needed
            setWholesalerData(res);
          }
        } catch (err) {
          notifyError(err?.response?.data?.message || err?.message);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [wholesalerData, setWholesalerData] = useState(null);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const update = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        aadhar: data.aadhar || "",
        aadharPublicId: getValues('aadharPublicId') || "",
        pan: data.pan || "",
        panPublicId: getValues('panPublicId') || "",
        gst: data.gst || "",
        gstPublicId: getValues('gstPublicId') || "",
        drugLicense: data.drugLicense || "",
        drugLicensePublicId: getValues('drugLicensePublicId') || "",
        gstNotRequired: !!data.gstNotRequired,
        drugLicenseNotRequired: !!data.drugLicenseNotRequired,
      };

      if (id) {
        if (data.password) update.password = data.password;
        const res = await CustomerServices.updateCustomer(id, update);
        setIsUpdate(true);
        notifySuccess(res.message || "Updated successfully");
        closeDrawer();
      } else {
        // create wholesaler via admin
        const payload = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password || undefined,
          gstNotRequired: !!data.gstNotRequired,
          drugLicenseNotRequired: !!data.drugLicenseNotRequired,
          aadharUrl: data.aadhar || "",
          aadharPublicId: getValues('aadharPublicId') || "",
          aadharDeleteToken: getValues('aadharDeleteToken') || "",
          panUrl: data.pan || "",
          panPublicId: getValues('panPublicId') || "",
          panDeleteToken: getValues('panDeleteToken') || "",
          gstUrl: data.gst || "",
          gstPublicId: getValues('gstPublicId') || "",
          gstDeleteToken: getValues('gstDeleteToken') || "",
          drugUrl: data.drugLicense || "",
          drugPublicId: getValues('drugLicensePublicId') || "",
          drugDeleteToken: getValues('drugLicenseDeleteToken') || "",
        };
        const res = await CustomerServices.createWholesaler(payload);
        setIsUpdate(true);
        notifySuccess(res.message || "Wholesaler created successfully");
        closeDrawer();
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
      closeDrawer();
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAsset = async (type) => {
    // Determine field names
    let field = null;
    let publicField = null;

    switch (type) {
      case "aadhar":
        field = "aadhar";
        publicField = "aadharPublicId";
        break;
      case "pan":
        field = "pan";
        publicField = "panPublicId";
        break;
      case "gst":
        field = "gst";
        publicField = "gstPublicId";
        break;
      case "drugLicense":
        field = "drugLicense";
        publicField = "drugLicensePublicId";
        break;
      default:
        return;
    }

    // If editing existing wholesaler (id present)
    if (id && wholesalerData) {
      const publicId = wholesalerData[publicField];
      const deleteToken = wholesalerData[publicField.replace('PublicId','DeleteToken')] || wholesalerData[publicField + 'DeleteToken'] || getValues(publicField.replace('PublicId','DeleteToken')) || getValues(publicField + 'DeleteToken');

      // If we have a delete token from cloudinary, attempt client-side delete (no secret needed)
      if (deleteToken) {
        try {
          const cloudinaryDeleteUrl = import.meta.env.VITE_APP_CLOUDINARY_URL.replace('/image/upload', '/delete_by_token');
          await axios.post(cloudinaryDeleteUrl, { token: deleteToken });
          notifySuccess('Deleted from Cloudinary');
        } catch (err) {
          console.warn('Client-side Cloudinary deletion failed:', err?.message || err);
          notifyError('Could not delete file from Cloudinary (client). We will still clear local references.');
        }
      } else {
        // No delete token available, try server-side fallback
        try {
          if (publicId) {
            await CustomerServices.deleteCloudinaryAsset(publicId);
          }
        } catch (err) {
          console.warn('Server-side Cloudinary deletion failed:', err?.message || err);
          notifyError('Could not delete file from Cloudinary (server). We will still clear local references.');
        }
      }

      try {
        const updateObj = {};
        updateObj[field] = "";
        updateObj[publicField] = "";
        // clear delete token fields if present
        const deleteTokenField = publicField.replace('PublicId','DeleteToken');
        updateObj[deleteTokenField] = "";

        await CustomerServices.updateCustomer(id, updateObj);
        notifySuccess("Removed successfully");

        const res = await CustomerServices.getCustomerById(id);
        setWholesalerData(res);
        setValue(field, "");
        setValue(publicField, "");
        setValue(deleteTokenField, "");
      } catch (err) {
        console.error("removeAsset error while clearing DB:", err);
        notifyError(err?.response?.data?.message || err?.message || "Failed to remove asset");
      }

      return;
    }

    // If creating new wholesaler (no id), just clear the form values
    try {
      setValue(field, "");
      setValue(publicField, "");
      notifySuccess("Removed");
    } catch (err) {
      console.error("removeAsset (create) error:", err);
      notifyError(err?.response?.data?.message || err?.message || "Failed to remove asset");
    }
  };

  const sendCredentials = async (password) => {
    if (!id) {
      notifyError('Please save the wholesaler before sending credentials');
      return;
    }
    if (!password || String(password).trim().length === 0) {
      notifyError('Please generate or enter a password before sending');
      return;
    }
    try {
      const res = await CustomerServices.sendCredentials(id, { password });
      notifySuccess(res.message || 'Credentials sent successfully');
      // Refresh data
      const updated = await CustomerServices.getCustomerById(id);
      setWholesalerData(updated);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message || 'Failed to send credentials');
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    setFieldValue: setValue,
    removeAsset,
    wholesalerData,
    getValues,
    sendCredentials,
  };
};

export default useWholesalerSubmit;

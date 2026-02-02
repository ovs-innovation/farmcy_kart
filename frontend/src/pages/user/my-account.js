import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

//internal imports
import { getUserSession } from "@lib/auth";
import Dashboard from "@pages/user/dashboard";
import Error from "@components/form/Error";
import CustomerServices from "@services/CustomerServices";
import { setToken } from "@services/httpServices";
import Uploader from "@components/image-uploader/Uploader";
import { notifySuccess, notifyError } from "@utils/toast";

const MyAccount = () => {
  const userInfo = getUserSession();
  const userId = userInfo?._id || userInfo?.id || null;
  const queryClient = useQueryClient();

  const [isEditingWholesaler, setIsEditingWholesaler] = useState(false);
  const [docs, setDocs] = useState({
    aadhar: "",
    aadharPublicId: "",
    aadharDeleteToken: "",
    pan: "",
    panPublicId: "",
    panDeleteToken: "",
    gst: "",
    gstPublicId: "",
    gstDeleteToken: "",
    gstNotRequired: false,
    drugLicense: "",
    drugLicensePublicId: "",
    drugLicenseDeleteToken: "",
    drugLicenseNotRequired: false,
  });

  // ensure axios has token if cookie holds token but context hasn't set it
  useEffect(() => {
    if (userInfo?.token) {
      setToken(userInfo.token);
    }
  }, [userInfo?.token]);

  const {
    data: customer,
    error: customerError,
    isLoading: customerLoading,
  } = useQuery({
    queryKey: ["customer", { id: userId }],
    queryFn: async () => await CustomerServices.getCustomerById(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (customer) {
      setDocs({
        aadhar: customer?.aadhar || "",
        aadharPublicId: customer?.aadharPublicId || "",
        aadharDeleteToken: customer?.aadharDeleteToken || "",
        pan: customer?.pan || "",
        panPublicId: customer?.panPublicId || "",
        panDeleteToken: customer?.panDeleteToken || "",
        gst: customer?.gst || "",
        gstPublicId: customer?.gstPublicId || "",
        gstDeleteToken: customer?.gstDeleteToken || "",
        gstNotRequired: !!customer?.gstNotRequired,
        drugLicense: customer?.drugLicense || "",
        drugLicensePublicId: customer?.drugLicensePublicId || "",
        drugLicenseDeleteToken: customer?.drugLicenseDeleteToken || "",
        drugLicenseNotRequired: !!customer?.drugLicenseNotRequired,
      });
    }
  }, [customer]);

  const isWholesaler = useMemo(() => {
    const role = customer?.role || userInfo?.role;
    return role === "wholesaler";
  }, [customer?.role, userInfo?.role]);

  const acceptDocs = useMemo(
    () => ({
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      "application/pdf": [".pdf"],
    }),
    []
  );

  const handleDocUploadComplete = async (
    field,
    publicField,
    deleteTokenField,
    data
  ) => {
    try {
      const url = data?.secure_url || data?.url || "";
      const publicId = data?.public_id || "";
      const deleteToken = data?.delete_token || data?.deleteToken || "";

      setDocs((prev) => ({
        ...prev,
        [field]: url,
        [publicField]: publicId,
        ...(deleteTokenField ? { [deleteTokenField]: deleteToken } : {}),
      }));

      if (!userId) return;

      const updateObj = { [field]: url, [publicField]: publicId };
      if (deleteTokenField && deleteToken) {
        updateObj[deleteTokenField] = deleteToken;
      }

      await CustomerServices.updateCustomer(userId, updateObj);
      notifySuccess("Saved successfully");
      queryClient.invalidateQueries({ queryKey: ["customer", { id: userId }] });
    } catch (err) {
      notifyError(
        err?.response?.data?.message || err?.message || "Failed to save document"
      );
    }
  };

  const handleDocRemove = async (field, publicField, deleteTokenField) => {
    try {
      const publicId = docs?.[publicField] || "";

      if (publicId) {
        try {
          await CustomerServices.deleteCloudinary({ publicId });
        } catch (err) {
          // still allow clearing the DB fields even if cloud deletion fails
          console.warn(
            "Cloudinary delete failed:",
            err?.response?.data || err?.message || err
          );
        }
      }

      setDocs((prev) => ({
        ...prev,
        [field]: "",
        [publicField]: "",
        ...(deleteTokenField ? { [deleteTokenField]: "" } : {}),
      }));

      if (!userId) return;

      const updateObj = { [field]: "", [publicField]: "" };
      if (deleteTokenField) updateObj[deleteTokenField] = "";
      await CustomerServices.updateCustomer(userId, updateObj);
      notifySuccess("Removed successfully");
      queryClient.invalidateQueries({ queryKey: ["customer", { id: userId }] });
    } catch (err) {
      notifyError(
        err?.response?.data?.message || err?.message || "Failed to remove document"
      );
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["shippingAddress", { id: userId }],
    queryFn: async () =>
      await CustomerServices.getShippingAddress({
        userId: userId,
      }),
    select: (data) => data?.shippingAddress,
    enabled: !!userId,
  });

  const hasShippingAddress = data && Object.keys(data).length > 0;

  // console.log("data", data?.shippingAddress);

  return (
    <Dashboard title="my-account" description="This is my account page">
      <div className="overflow-hidden">
        <div className="grid gap-4 mb-8 sm:grid-cols-2 grid-cols-1">
          {/* User Info Card */}
          <div className="flex h-full relative">
            <div className="flex items-center border border-gray-200 w-full rounded-lg p-4 relative">
              <Link
                href="/user/update-profile"
                className="absolute top-2 right-2 bg-store-500 text-white px-3 py-1 rounded hover:bg-store-600"
              >
                Edit
              </Link>
              <div className="flex items-center justify-center rounded-full text-xl text-center mr-4 bg-gray-200">
                {userInfo?.image ? (
                  <img
                    src={userInfo.image}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-300"
                    alt={userInfo?.name[0]}
                  />
                ) : (
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-200 text-xl font-bold text-center mr-4 border-2 border-gray-300">
                    {userInfo?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h5 className="leading-none mb-2 text-base font-medium text-gray-700">
                  {userInfo?.name}
                </h5>
                <p className="text-sm text-gray-500">{userInfo?.email}</p>
                <p className="text-sm text-gray-500">{userInfo?.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          {hasShippingAddress ? (
            <div className="flex h-full relative">
              <div className="flex items-center border border-gray-200 w-full rounded-lg p-4 relative">
                <Link
                  href={`/user/add-shipping-address?id=${userId}`}
                  className="absolute top-2 right-2 bg-store-500 text-white px-3 py-1 rounded hover:bg-store-600"
                >
                  Edit
                </Link>
                <div className="flex-grow">
                  {!isLoading && error ? (
                    <Error error={error} />
                  ) : (
                    <>
                      <h5 className="leading-none mb-2 text-base font-medium text-gray-700">
                        {data?.name}{" "}
                        <span className="text-xs text-gray-500">
                          (Default Shipping Address)
                        </span>
                      </h5>
                      <p className="text-sm text-gray-500">{data?.contact} </p>
                      <p className="text-sm text-gray-500">{data?.address} </p>
                      <p className="text-sm text-gray-500">
                        {data?.country}, {data?.city}, {data?.area} -
                        {data?.zipCode}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full relative">
              <Link
                href="/user/add-shipping-address"
                className="flex items-center bg-store-500 text-white hover:bg-store-600 w-full rounded-lg py-3 px-4 text-center relative"
              >
                <FiPlus className="text-xl font-bold text-center mr-4" /> Add
                Default Shipping Address
              </Link>
            </div>
          )}
        </div>

        {isWholesaler && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-base font-medium text-gray-700">
                Wholesaler Details
              </h5>
              <button
                type="button"
                onClick={() => setIsEditingWholesaler((v) => !v)}
                className="bg-store-500 text-white px-3 py-1 rounded hover:bg-store-600"
              >
                {isEditingWholesaler ? "Close" : "Edit"}
              </button>
            </div>

            {!customerLoading && customerError && <Error error={customerError} />}

            <div className="grid gap-6 sm:grid-cols-2 grid-cols-1">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-700">Aadhar</div>
                  <div className="flex-1 flex justify-end">
                    {isEditingWholesaler ? (
                      <Uploader
                        compact
                        imageUrl={docs.aadhar}
                        setImageUrl={(url) =>
                          setDocs((p) => ({ ...p, aadhar: url || "" }))
                        }
                        folder="wholesaler"
                        accept={acceptDocs}
                        maxSize={10 * 1024 * 1024}
                        uniquePublicId={true}
                        onUploadComplete={(data) =>
                          handleDocUploadComplete(
                            "aadhar",
                            "aadharPublicId",
                            "aadharDeleteToken",
                            data
                          )
                        }
                        onRemove={() =>
                          handleDocRemove(
                            "aadhar",
                            "aadharPublicId",
                            "aadharDeleteToken"
                          )
                        }
                      />
                    ) : docs?.aadhar ? (
                      <a
                        href={docs.aadhar}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline text-store-600"
                      >
                        View
                      </a>
                    ) : (
                      <div className="text-sm text-gray-500">Not uploaded</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-700">PAN</div>
                  <div className="flex-1 flex justify-end">
                    {isEditingWholesaler ? (
                      <Uploader
                        compact
                        imageUrl={docs.pan}
                        setImageUrl={(url) =>
                          setDocs((p) => ({ ...p, pan: url || "" }))
                        }
                        folder="wholesaler"
                        accept={acceptDocs}
                        maxSize={10 * 1024 * 1024}
                        uniquePublicId={true}
                        onUploadComplete={(data) =>
                          handleDocUploadComplete(
                            "pan",
                            "panPublicId",
                            "panDeleteToken",
                            data
                          )
                        }
                        onRemove={() =>
                          handleDocRemove(
                            "pan",
                            "panPublicId",
                            "panDeleteToken"
                          )
                        }
                      />
                    ) : docs?.pan ? (
                      <a
                        href={docs.pan}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline text-store-600"
                      >
                        View
                      </a>
                    ) : (
                      <div className="text-sm text-gray-500">Not uploaded</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-700">GST</div>
                  <div className="flex-1 flex justify-end">
                    {docs?.gstNotRequired && !isEditingWholesaler ? (
                      <div className="text-sm text-gray-500">Not required</div>
                    ) : isEditingWholesaler ? (
                      <Uploader
                        compact
                        imageUrl={docs.gst}
                        setImageUrl={(url) =>
                          setDocs((p) => ({ ...p, gst: url || "" }))
                        }
                        folder="wholesaler"
                        accept={acceptDocs}
                        maxSize={10 * 1024 * 1024}
                        uniquePublicId={true}
                        onUploadComplete={(data) =>
                          handleDocUploadComplete(
                            "gst",
                            "gstPublicId",
                            "gstDeleteToken",
                            data
                          )
                        }
                        onRemove={() =>
                          handleDocRemove(
                            "gst",
                            "gstPublicId",
                            "gstDeleteToken"
                          )
                        }
                      />
                    ) : docs?.gst ? (
                      <a
                        href={docs.gst}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline text-store-600"
                      >
                        View
                      </a>
                    ) : (
                      <div className="text-sm text-gray-500">Not uploaded</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-700">Drug License</div>
                  <div className="flex-1 flex justify-end">
                    {docs?.drugLicenseNotRequired && !isEditingWholesaler ? (
                      <div className="text-sm text-gray-500">Not required</div>
                    ) : isEditingWholesaler ? (
                      <Uploader
                        compact
                        imageUrl={docs.drugLicense}
                        setImageUrl={(url) =>
                          setDocs((p) => ({ ...p, drugLicense: url || "" }))
                        }
                        folder="wholesaler"
                        accept={acceptDocs}
                        maxSize={10 * 1024 * 1024}
                        uniquePublicId={true}
                        onUploadComplete={(data) =>
                          handleDocUploadComplete(
                            "drugLicense",
                            "drugLicensePublicId",
                            "drugLicenseDeleteToken",
                            data
                          )
                        }
                        onRemove={() =>
                          handleDocRemove(
                            "drugLicense",
                            "drugLicensePublicId",
                            "drugLicenseDeleteToken"
                          )
                        }
                      />
                    ) : docs?.drugLicense ? (
                      <a
                        href={docs.drugLicense}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline text-store-600"
                      >
                        View
                      </a>
                    ) : (
                      <div className="text-sm text-gray-500">Not uploaded</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default MyAccount;

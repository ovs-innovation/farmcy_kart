import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
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
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    phone: "",
    addressType: "Home",
    isDefault: false
  });
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

  const { data: shippingAddressesResponse, error, isLoading } = useQuery({
    queryKey: ["shippingAddress", { id: userId }],
    queryFn: async () =>
      await CustomerServices.getShippingAddress({
        userId: userId,
      }),
    enabled: !!userId,
  });

  // Normalize to array
  const shippingAddresses = Array.isArray(shippingAddressesResponse?.shippingAddress)
    ? shippingAddressesResponse.shippingAddress
    : shippingAddressesResponse?.shippingAddress
      ? [shippingAddressesResponse.shippingAddress]
      : [];

  const hasShippingAddress = shippingAddresses && shippingAddresses.length > 0;

  // Handle address form input changes
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Open modal for adding new address
  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      name: userInfo?.name || "",
      address: "",
      city: "",
      country: "",
      zipCode: "",
      phone: userInfo?.phone || "",
      addressType: "Home",
      isDefault: !hasShippingAddress
    });
    setShowAddressModal(true);
  };

  // Open modal for editing address
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name || "",
      address: address.address || "",
      city: address.city || "",
      country: address.country || "",
      zipCode: address.zipCode || "",
      phone: address.phone || address.contact || "",
      addressType: address.addressType || "Home",
      isDefault: address.isDefault || false
    });
    setShowAddressModal(true);
  };

  // Handle address submission (add or update)
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userId) {
        notifyError("User ID not found");
        return;
      }

      let response;
      if (editingAddress && editingAddress._id) {
        // Update existing address
        response = await CustomerServices.updateShippingAddress({
          userId: userId,
          shippingId: editingAddress._id,
          shippingAddressData: addressForm
        });
      } else {
        // Add new address
        response = await CustomerServices.addShippingAddress({
          userId: userId,
          shippingAddressData: addressForm
        });
      }

      if (response.success || response.message) {
        setShowAddressModal(false);
        setEditingAddress(null);
        setAddressForm({
          name: "",
          address: "",
          city: "",
          country: "",
          zipCode: "",
          phone: "",
          addressType: "Home",
          isDefault: false
        });
        queryClient.invalidateQueries({ queryKey: ["shippingAddress", { id: userId }] });
        notifySuccess(editingAddress ? "Address updated successfully" : "Address added successfully");
      } else {
        notifyError(response.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      notifyError(error?.response?.data?.message || error?.message || "Failed to save address");
    }
  };

  // Handle address deletion
  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await CustomerServices.deleteShippingAddress({
        userId: userId,
        shippingId: addressId
      });

      if (response.message || response.success) {
        queryClient.invalidateQueries({ queryKey: ["shippingAddress", { id: userId }] });
        notifySuccess("Address deleted successfully");
      } else {
        notifyError(response.message || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      notifyError(error?.response?.data?.message || error?.message || "Failed to delete address");
    }
  };

  // console.log("data", data?.shippingAddress);

  return (
    <Dashboard title="my-account" description="This is my account page">
      <div className="overflow-hidden">
        <div className="grid gap-4 mb-8 grid-cols-1">
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

          {/* Shipping Addresses Section */}
          <div className="sm:col-span-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-base font-medium text-gray-700">Shipping Addresses</h5>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="bg-store-500 text-white px-3 py-1 rounded hover:bg-store-600 text-sm"
                >
                  + Add Address
                </button>
              </div>

              {!isLoading && error ? (
                <Error error={error} />
              ) : hasShippingAddress ? (
                <div className="space-y-3">
                  {shippingAddresses.map((address) => (
                    <div
                      key={address._id || address.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-store-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h6 className="text-sm font-semibold text-gray-900">
                              {address.addressType || 'Home'} ({address.city || ''}, {address.zipCode || ''})
                            </h6>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 font-medium mb-1">{address.name}</p>
                          <p className="text-sm text-gray-500">{address.phone}</p>
                          <p className="text-sm text-gray-500">
                            {address.address}, {address.city}, {address.country} - {address.zipCode}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            type="button"
                            onClick={() => handleEditAddress(address)}
                            className="text-gray-400 hover:text-store-600 p-1 transition-colors"
                            title="Edit address"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {shippingAddresses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(address._id || address.id)}
                              className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                              title="Delete address"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">No shipping addresses found</p>
                  <p className="text-xs text-gray-500 mt-1">Add your first shipping address</p>
                </div>
              )}
            </div>
          </div>
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

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowAddressModal(false)}
          />
          
          {/* Modal Panel - Slide from right */}
          <div className="absolute inset-y-0 right-0 max-w-full w-full md:max-w-lg">
            <div className="h-full flex flex-col bg-white shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingAddress ? "Edit Shipping Address" : "Add Shipping Address"}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-colors"
                  onClick={() => {
                    setShowAddressModal(false);
                    setEditingAddress(null);
                    setAddressForm({
                      name: "",
                      address: "",
                      city: "",
                      country: "",
                      zipCode: "",
                      phone: "",
                      addressType: "Home",
                      isDefault: false
                    });
                  }}
                >
                  <IoClose className="h-6 w-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddressSubmit} className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-store-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <textarea
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-store-500 focus:border-transparent"
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-store-500 focus:border-transparent"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-store-500 focus:border-transparent"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={addressForm.zipCode}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-store-500 focus:border-transparent"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-store-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Type
                      </label>
                      <select
                        name="addressType"
                        value={addressForm.addressType}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-store-500 focus:border-transparent"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-7">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={addressForm.isDefault}
                        onChange={handleAddressChange}
                        className="h-4 w-4 text-store-600 focus:ring-store-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Set as default address
                      </label>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-store-500"
                    onClick={() => setShowAddressModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-store-500 hover:bg-store-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-store-500"
                  >
                    {editingAddress ? "Update Address" : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Dashboard>
  );
};

export default MyAccount;

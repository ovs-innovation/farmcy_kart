import React, { useState, useEffect } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";

//internal import
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useCustomerSubmit from "@/hooks/useCustomerSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";
import CustomerServices from "@/services/CustomerServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const CustomerDrawer = ({ id }) => {
  const { register, handleSubmit, onSubmit, errors, isSubmitting } =
    useCustomerSubmit(id);

  // Shipping addresses state
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  // Address form state
  const [addressForm, setAddressForm] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    phone: "",
    addressType: "Home",
    isDefault: false,
  });

  // Fetch shipping addresses when drawer opens with id
  useEffect(() => {
    if (id) {
      fetchShippingAddresses();
    }
  }, [id]);

  const fetchShippingAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await CustomerServices.getShippingAddresses(id);
      if (res && res.shippingAddress) {
        setShippingAddresses(res.shippingAddress);
      }
    } catch (err) {
      console.error("Failed to fetch shipping addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetAddressForm = () => {
    setAddressForm({
      name: "",
      address: "",
      city: "",
      country: "",
      zipCode: "",
      phone: "",
      addressType: "Home",
      isDefault: false,
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleAddAddress = async (e) => {
    console.log("handleAddAddress called", { id, addressForm });
    if (!id) {
      notifyError("Please save the customer first before adding addresses");
      return;
    }

    setAddressSubmitting(true);
    try {
      const res = await CustomerServices.addShippingAddress(id, addressForm);
      console.log("addShippingAddress response:", res);
      if (res && res.success) {
        notifySuccess("Shipping address added successfully");
        setShippingAddresses(res.shippingAddress || []);
        resetAddressForm();
      }
    } catch (err) {
      console.error("addShippingAddress error:", err);
      notifyError(err?.response?.data?.message || "Failed to add address");
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleUpdateAddress = async (e) => {
    console.log("handleUpdateAddress called", { id, editingAddressId, addressForm });
    if (!id || !editingAddressId) {
      console.log("Missing id or editingAddressId", { id, editingAddressId });
      return;
    }

    setAddressSubmitting(true);
    try {
      const res = await CustomerServices.updateShippingAddress(
        id,
        editingAddressId,
        addressForm
      );
      console.log("updateShippingAddress response:", res);
      if (res && res.success) {
        notifySuccess("Shipping address updated successfully");
        setShippingAddresses(res.shippingAddress || []);
        resetAddressForm();
      }
    } catch (err) {
      console.error("updateShippingAddress error:", err);
      notifyError(err?.response?.data?.message || "Failed to update address");
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await CustomerServices.deleteShippingAddress(id, addressId);
      if (res && res.success) {
        notifySuccess("Address deleted successfully");
        setShippingAddresses((prev) =>
          prev.filter((addr) => addr._id !== addressId)
        );
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to delete address");
    }
  };

  const startEditingAddress = (address) => {
    setAddressForm({
      name: address.name || "",
      address: address.address || "",
      city: address.city || "",
      country: address.country || "",
      zipCode: address.zipCode || "",
      phone: address.phone || "",
      addressType: address.addressType || "Home",
      isDefault: address.isDefault || false,
    });
    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };
  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title={"Update Customer"}
            description={"Update your Customer necessary information from here"}
          />
        ) : (
          <Title
            title={"Add Customer"}
            description={"Add your Customer necessary information from here"}
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
            {/* Basic Info Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 uppercase tracking-wide">
                Basic Information
              </h3>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Name"} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    required={true}
                    register={register}
                    label="Name"
                    name="name"
                    type="text"
                    placeholder={"Name"}
                  />
                  <Error errorName={errors.name} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Email"} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    required={true}
                    register={register}
                    label="Email"
                    name="email"
                    type="email"
                    placeholder={"Email"}
                  />
                  <Error errorName={errors.email} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Phone"} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Phone"
                    name="phone"
                    type="text"
                    placeholder={"Phone"}
                  />
                  <Error errorName={errors.phone} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label={"Address"} />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    label="Address"
                    name="address"
                    type="text"
                    placeholder={"Address"}
                  />
                  <Error errorName={errors.address} />
                </div>
              </div>
            </div>

            {/* Shipping Addresses Section */}
            {id && (
              <div className="mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                    Shipping Addresses
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-store-600 rounded-md hover:bg-store-700 transition-colors"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    Add Address
                  </button>
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3 uppercase">
                      {editingAddressId ? "Edit Address" : "New Address"}
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={addressForm.name}
                            onChange={handleAddressInputChange}
                            placeholder="Full Name"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-store-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={addressForm.phone}
                            onChange={handleAddressInputChange}
                            placeholder="Phone Number"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-store-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Street Address
                        </label>
                        <textarea
                          name="address"
                          value={addressForm.address}
                          onChange={handleAddressInputChange}
                          placeholder="Street Address"
                          rows="2"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-store-500 dark:bg-gray-700 dark:text-white resize-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressInputChange}
                            placeholder="City"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-store-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            State/Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={addressForm.country}
                            onChange={handleAddressInputChange}
                            placeholder="State/Country"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-store-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={addressForm.zipCode}
                            onChange={handleAddressInputChange}
                            placeholder="ZIP Code"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-store-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Address Type
                          </label>
                          <select
                            name="addressType"
                            value={addressForm.addressType}
                            onChange={handleAddressInputChange}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-store-500 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="isDefault"
                              checked={addressForm.isDefault}
                              onChange={handleAddressInputChange}
                              className="w-4 h-4 text-store-600 border-gray-300 rounded focus:ring-store-500"
                            />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Set as default address
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={editingAddressId ? handleUpdateAddress : handleAddAddress}
                          disabled={addressSubmitting}
                          className="px-4 py-2 text-xs font-medium text-white bg-store-600 rounded-md hover:bg-store-700 transition-colors disabled:opacity-50"
                        >
                          {addressSubmitting
                            ? "Saving..."
                            : editingAddressId
                            ? "Update Address"
                            : "Save Address"}
                        </button>
                        <button
                          type="button"
                          onClick={resetAddressForm}
                          className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address List */}
                {loadingAddresses ? (
                  <div className="text-center py-4 text-sm text-gray-500">
                    Loading addresses...
                  </div>
                ) : shippingAddresses.length === 0 ? (
                  <div className="text-center py-4 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    No shipping addresses added yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {shippingAddresses.map((address, index) => (
                      <div
                        key={address._id || index}
                        className={`p-3 rounded-lg border ${
                          address.isDefault
                            ? "border-store-300 bg-store-50 dark:bg-store-900/20"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FiMapPin className="w-3.5 h-3.5 text-store-600" />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {address.name}
                              </span>
                              {address.isDefault && (
                                <span className="px-2 py-0.5 text-[10px] font-medium text-store-700 bg-store-100 rounded-full">
                                  Default
                                </span>
                              )}
                              <span className="px-2 py-0.5 text-[10px] font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 rounded-full">
                                {address.addressType}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 ml-5.5">
                              {address.address}, {address.city}, {address.country}{" "}
                              - {address.zipCode}
                            </p>
                            {address.phone && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 ml-5.5 mt-0.5">
                                Phone: {address.phone}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => startEditingAddress(address)}
                              className="p-1.5 text-gray-400 hover:text-store-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              title="Edit address"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(address._id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Delete address"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Note for new customers */}
            {!id && (
              <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Save the customer first to add multiple shipping addresses.
                </p>
              </div>
            )}
          </div>

          <DrawerButton id={id} title="Customer" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default CustomerDrawer;

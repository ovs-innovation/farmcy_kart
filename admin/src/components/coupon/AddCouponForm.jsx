import { Button, Input, Select } from "@windmill/react-ui";
import React, { useState } from "react";
import { FiFileText, FiRefreshCw } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Error from "@/components/form/others/Error";

const AddCouponForm = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  setImageUrl,
  imageUrl,
  published,
  setPublished,
  currency,
  discountType,
  setDiscountType,
  isSubmitting,
  handleSelectLanguage,
  setValue,
  reset,
  id,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("default");

  const handleReset = () => {
    reset();
    setActiveTab("default");
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setValue("couponCode", code);
  };

  const tabs = [
    { id: "default", name: "Default" },
    { id: "en", name: "English(EN)" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8 overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
        <FiFileText className="text-xl" />
        <h2 className="text-lg font-semibold">{id ? "Update Coupon" : "Add New Coupon"}</h2>
      </div>

      <div className="p-6">
        <div className="flex gap-6 border-b border-gray-100 dark:border-gray-700 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                handleSelectLanguage(tab.id === "default" ? "en" : tab.id);
              }}
              className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-teal-600"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.name}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Title ({activeTab === "default" ? "Default" : activeTab.toUpperCase()})
              </label>
              <Input
                {...register("title", { required: "Title is required" })}
                placeholder="New coupon"
                className="w-full"
              />
              <Error errorName={errors.title} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Coupon type
              </label>
              <Select {...register("couponType")} className="w-full">
                <option value="">---Select coupon type---</option>
                <option value="store_wise">Store wise</option>
                <option value="customer_wise">Customer wise</option>
                <option value="first_order">First order</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Select customer
              </label>
              <Select {...register("customer")} className="w-full">
                <option value="">Select customer</option>
                <option value="all">All customers</option>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-400">
                  Code
                </label>
                {/* <button
                  type="button"
                  onClick={generateCode}
                  className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <FiRefreshCw className="text-[10px]" />
                  Generate Code
                </button> */}
              </div>
              <Input
                {...register("couponCode", { required: "Code is required" })}
                placeholder="fxWXgBHK"
                className="w-full"
              />
              <Error errorName={errors.couponCode} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Limit for same user
              </label>
              <Input
                {...register("limitSameUser")}
                type="number"
                min="1"
                onKeyDown={(e) => (e.key === '-' || e.key === 'e' || e.key === '.') && e.preventDefault()}
                placeholder="EX: 10"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Start date
              </label>
              <Input
                {...register("startTime")}
                type="date"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Expire date
              </label>
              <Input
                {...register("endTime", { required: "Expire date is required" })}
                type="date"
                className="w-full"
              />
              <Error errorName={errors.endTime} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Discount type
              </label>
              <Select
                onChange={(e) => setDiscountType(e.target.value === "percentage")}
                className="w-full"
              >
                <option value="fixed">Amount ({currency})</option>
                <option value="percentage">Percentage (%)</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Min purchase ({currency})
              </label>
              <Input
                {...register("minimumAmount")}
                type="number"
                min="0"
                step="0.01"
                onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
                defaultValue={0}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2 flex items-center gap-1">
                Discount
                <span className="text-gray-400 text-xs">ⓘ</span>
              </label>
              <Input
                {...register("discountPercentage")}
                type="number"
                min="0"
                step="0.01"
                onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
                placeholder="EX: 100"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Max discount ({currency})
              </label>
              <Input
                {...register("maxDiscount")}
                type="number"
                min="0"
                step="0.01"
                onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
                defaultValue={0}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              onClick={handleReset}
              layout="outline"
              className=" px-8 !w-auto !min-w-0 flex-none"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 !w-auto !min-w-0 flex-none bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isSubmitting ? "Processing..." : id ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCouponForm;

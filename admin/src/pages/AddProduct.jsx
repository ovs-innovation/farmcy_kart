import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Input, Textarea, Select } from "@windmill/react-ui";
import { FiChevronLeft, FiImage, FiCloudRain, FiUploadCloud, FiLayers } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5"; // For ✨ Generate
import { useTranslation } from "react-i18next";
import ReactTagInput from "@pathofdev/react-tag-input";

// Internal imports
import useProductSubmit from "@/hooks/useProductSubmit";
import Uploader from "@/components/image-uploader/Uploader";
import ParentCategory from "@/components/category/ParentCategory";
import { SidebarContext } from "@/context/SidebarContext";
import Error from "@/components/form/others/Error";
import Multiselect from "multiselect-react-dropdown";

const AddProduct = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [activeTab, setActiveTab] = useState("Default");
  const languages = ["Default", "English (EN)"];

  // useProductSubmit doesn't require an id for "Add New"
  const {
    tag,
    setTag,
    values,
    language,
    register,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    thumbnailUrl,
    setThumbnailUrl,
    handleSubmit,
    isSubmitting,
    selectedCategory,
    setSelectedCategory,
    setDefaultCategory,
    defaultCategory,
    brandOptions,
    brand,
    setBrand,
    watch,
  } = useProductSubmit();

  const [selectedAttributes, setSelectedAttributes] = useState([]);

  const attributeOptions = [
    { name: "Color", id: "color" },
    { name: "Size", id: "size" },
    { name: "Type", id: "type" },
  ];

  const onSelectAttribute = (selectedList) => {
    setSelectedAttributes(selectedList);
  };

  const onRemoveAttribute = (selectedList) => {
    setSelectedAttributes(selectedList);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    // Placeholder for AI generation feature
    console.log("AI Generate clicked");
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => history.goBack()}
              className="p-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600"
            >
              <FiChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Add New Item</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm text-[#008f89] hover:text-[#00706b]">See how it works!</a>
            <Button className="bg-[#e0f1f0] text-[#008f89] border border-[#008f89] hover:bg-[#d0e9e8]">
              <FiImage className="mr-2" /> Add Info From Gallery
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Top Row: General Info & Images */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* General Info Card */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              {/* Language Tabs */}
              <div className="flex space-x-6 border-b border-gray-200 mb-6">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveTab(lang)}
                    className={`pb-3 text-sm font-medium ${
                      activeTab === lang
                        ? "text-[#008f89] border-b-2 border-[#008f89]"
                        : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Name (Default) */}
              <div className="mb-6 relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Name (Default) <span className="text-red-500">*</span></label>
                  <button type="button" onClick={handleGenerate} className="text-sm font-medium text-[#008f89] flex items-center hover:opacity-80">
                    {/* <IoSparkles className="mr-1" /> Generate */}
                  </button>
                </div>
                <Input
                  {...register("title", { required: "Name is required!" })}
                  placeholder="New food"
                  className="w-full border-gray-200 focus:border-[#008f89] focus:ring focus:ring-[#008f89] focus:ring-opacity-20"
                />
                <Error errorName={errors.title} />
              </div>

              {/* Short Description */}
              <div className="mb-2 relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Short description (Default) <span className="text-red-500">*</span></label>
                  <button type="button" onClick={handleGenerate} className="text-sm font-medium text-[#008f89] flex items-center hover:opacity-80">
                    {/* <IoSparkles className="mr-1" /> Generate */}
                  </button>
                </div>
                <Textarea
                  {...register("description", { required: "Description is required!" })}
                  rows="4"
                  placeholder="Short description"
                  className="w-full border-gray-200 focus:border-[#008f89] focus:ring focus:ring-[#008f89] focus:ring-opacity-20"
                />
                <div className="absolute bottom-2 right-2 cursor-pointer flex items-center text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </div>
                <Error errorName={errors.description} />
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col space-y-6">
               {/* Product Images Section */}
               <div className="flex-1 flex flex-col">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Item Images <span className="text-gray-400 text-xs">(Ratio 1:1, Multi-upload enabled)</span></label>
                 <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                   <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} folder="product" product={true} useOriginalSize={true} />
                 </div>
               </div>

               {/* Thumbnail Section */}
               <div className="flex-1 flex flex-col">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Images <span className="text-gray-400 text-xs">(Ratio 1:1, Single-upload)</span></label>
                 <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                   <Uploader imageUrl={thumbnailUrl} setImageUrl={setThumbnailUrl} folder="product" product={false} useOriginalSize={true} />
                 </div>
               </div>
            </div>
          </div>

          {/* Store & Category Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <FiLayers className="mr-2 text-gray-500" /> Store & Category Info
              </h2>
              <button type="button" onClick={handleGenerate} className="text-sm font-medium text-[#008f89] flex items-center hover:opacity-80">
                {/* <IoSparkles className="mr-1" /> Generate */}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Store */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store <span className="text-red-500">*</span></label>
                <Select
                  value={brand?._id || ""}
                  onChange={(e) => {
                    const selected = brandOptions?.find((item) => item._id === e.target.value);
                    setBrand(selected || null);
                  }}
                  className="w-full border-gray-200"
                >
                  <option value="">Select store</option>
                  {brandOptions?.map((item) => (
                    <option key={item._id} value={item._id}>{item.name?.en || item.name}</option>
                  ))}
                </Select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                <ParentCategory
                  lang={language}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  setDefaultCategory={setDefaultCategory}
                />
              </div>

              {/* Sub category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub category (Optional)</label>
                <Select className="w-full border-gray-200 text-gray-500">
                  <option value="">Select Sub Category</option>
                </Select>
              </div>

              {/* Suitable For */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Suitable For</label>
                <Select {...register("suitableFor")} className="w-full border-gray-200 text-gray-500">
                  <option value="">Select Condition</option>
                  <option value="Kids">Kids</option>
                  <option value="Adults">Adults</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <Input {...register("unit")} placeholder="Kg" className="w-full border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Generic name (Optional)</label>
                  <Input {...register("genericName")} className="w-full border-gray-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                  <label className="flex items-center text-sm text-gray-600">
                    <input type="checkbox" {...register("isBasicMedicine")} className="mr-2 h-4 w-4 text-[#008f89] border-gray-300 rounded focus:ring-[#008f89]" />
                    Is Basic Medicine
                  </label>
                  <label className="flex items-center text-sm text-gray-600">
                    <input type="checkbox" {...register("isPrescriptionRequired")} className="mr-2 h-4 w-4 text-[#008f89] border-gray-300 rounded focus:ring-[#008f89]" />
                    Is prescription required
                  </label>
              </div>
            </div>
          </div>

          {/* Search Tags */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
              Search Tags
            </h2>
            <div className="border border-gray-200 rounded p-1">
              <ReactTagInput
                placeholder="Search tags"
                tags={tag}
                onChange={(newTags) => setTag(newTags)}
              />
            </div>
          </div>

          {/* Price Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                {/* <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> */}
                Price Information
              </h2>
              <button type="button" onClick={handleGenerate} className="text-sm font-medium text-[#008f89] flex items-center hover:opacity-80">
                {/* <IoSparkles className="mr-1" /> Generate */}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price ₹ <span className="text-red-500">*</span></label>
                <Input type="number" {...register("originalPrice")} placeholder="0" className="w-full border-gray-200" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                <Select {...register("discountType")} className="w-full border-gray-200">
                  <option value="flat">Flat (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount {watch("discountType") === "percentage" ? "(%)" : "(₹)"}</label>
                <Input type="number" {...register("discount")} placeholder="0" className="w-full border-gray-200" />
              </div>
                
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price ₹ <span className="text-red-500">*</span></label>
                <Input 
                   type="number" 
                   readOnly 
                   tabIndex="-1"
                   value={
                     watch("discountType") === "percentage"
                       ? (Math.max(0, (Number(watch("originalPrice")) || 0) - ((Number(watch("originalPrice")) || 0) * (Number(watch("discount")) || 0) / 100))).toFixed(2)
                       : Math.max(0, (Number(watch("originalPrice")) || 0) - (Number(watch("discount")) || 0))
                   } 
                   className="w-full border-teal-200 bg-teal-50 font-bold text-teal-700 select-none cursor-default" 
                />
                <span className="text-[11px] text-gray-400 mt-1 block">Calculated automatically</span>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Purchase Quantity Limit (Optional)</label>
                <Input placeholder="Ex: 10" className="w-full border-gray-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total stock</label>
                  <Input type="number" {...register("stock")} placeholder="0" className="w-full border-gray-200 bg-gray-50" />
               </div>
            </div>
          </div>

          {/* Attribute */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                Attribute
              </h2>
              <button type="button" onClick={handleGenerate} className="text-sm font-medium text-[#008f89] flex items-center hover:opacity-80">
                <IoSparkles className="mr-1" /> Generate
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attribute</label>
              <Multiselect
                options={attributeOptions}
                selectedValues={selectedAttributes}
                onSelect={onSelectAttribute}
                onRemove={onRemoveAttribute}
                displayValue="name"
                placeholder="Select attribute"
                className="w-full border-gray-200"
                style={{
                  chips: { background: "#008f89" },
                  searchBox: { border: "1px solid #e5e7eb", borderRadius: "0.375rem" }
                }}
              />
            </div>

            {selectedAttributes.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in mb-6">
                  {selectedAttributes.map((attr) => (
                    <div key={attr.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{attr.name}</label>
                      <Input
                        placeholder="Enter choice values"
                        className="w-full border-gray-200 focus:border-[#008f89] focus:ring focus:ring-[#008f89] focus:ring-opacity-20"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                  <Button 
                    type="button" 
                    layout="outline" 
                    size="small"
                    onClick={() => setSelectedAttributes([])}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Reset
                  </Button>
                  <Button 
                    type="button" 
                    size="small"
                    className="bg-[#101935] hover:bg-[#1f2d5c] text-white"
                  >
                    Submit
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Action Button Section */}
          <div className="flex justify-end mt-8">
            <Button 
               type="submit" 
               disabled={isSubmitting} 
               className="bg-[#008f89] hover:bg-[#00706b] text-white px-10 py-3 rounded-md flex items-center shadow-sm font-semibold transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Save & Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

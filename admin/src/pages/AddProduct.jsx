import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Input, Textarea, Select } from "@windmill/react-ui";
import { FiChevronLeft, FiImage, FiCloudRain, FiUploadCloud, FiLayers, FiTrash2 } from "react-icons/fi";
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
import { Controller } from "react-hook-form";
import useAsync from "@/hooks/useAsync";
import TaxServices from "@/services/TaxServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const AddProduct = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Default");
  const languages = ["Default", "English (EN)"];

  const { currency, showingTranslateValue } = useUtilsFunction();
  
  const {
    tag,
    setTag,
    values,
    setValues,
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
    control,
    slug,
    handleProductSlug,
    // Dynamic / Media Sections
    dynamicSections,
    setDynamicSections,
    mediaSections,
    setMediaSections,
    // New Sections Props
    productDescription: productDescriptionSection, setProductDescription: setProductDescriptionSection,
    ingredients, setIngredients,
    keyUses, setKeyUses,
    howToUse, setHowToUse,
    safetyInformation, setSafetyInformation,
    additionalInformation, setAdditionalInformation,
    composition, setComposition,
    productHighlights, setProductHighlights,
    manufacturerDetails, setManufacturerDetails,
    disclaimer, setDisclaimer,
    faqSection, setFaqSection,
    // Attribute & Variant Handlers
    handleGenerateCombination,
    onSelectAttribute: handleAddAtt,
    variants,
    setVariants,
    attribue, // Backend attributes
    attributes, // User selected attribute values state in hook
    setAttributes,
  } = useProductSubmit();

  const { data: taxOptionsFromApi, loading: taxLoading } = useAsync(TaxServices.getAll);
  const [taxOptions, setTaxOptions] = useState([]);
  React.useEffect(() => {
    if (taxOptionsFromApi && Array.isArray(taxOptionsFromApi)) {
      setTaxOptions(taxOptionsFromApi);
    }
  }, [taxOptionsFromApi]);

  const defaultGstRates = [
    { label: "GST 0%", value: 0 },
    { label: "GST 5%", value: 5 },
    { label: "GST 12%", value: 12 },
    { label: "GST 18%", value: 18 },
    { label: "GST 28%", value: 28 },
  ];

  const gstRates = React.useMemo(() => {
    const ratesMap = new Map();
    defaultGstRates.forEach(rate => {
      ratesMap.set(rate.value, rate);
    });
    if (taxOptions && Array.isArray(taxOptions) && taxOptions.length > 0) {
      taxOptions.forEach((tax) => {
        const rateValue = tax.rate || 0;
        ratesMap.set(rateValue, {
          label: tax.name || `GST ${rateValue}%`,
          value: rateValue,
        });
      });
    }
    return Array.from(ratesMap.values()).sort((a, b) => a.value - b.value);
  }, [taxOptions]);

  const isPriceInclusiveChecked = Boolean(watch("isPriceInclusive"));

  const onSelectAttribute = (selectedList) => {
    setAttributes(selectedList);
    handleAddAtt(selectedList);
  };

  const onRemoveAttribute = (selectedList) => {
    setAttributes(selectedList);
    handleAddAtt(selectedList);
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  // Auto-generate variants when attribute values change
  React.useEffect(() => {
    if (Object.keys(values).length > 0) {
      const hasValues = Object.values(values).some(arr => arr && arr.length > 0);
      if (hasValues) {
        handleGenerateCombination(true);
      } else {
        setVariants([]);
      }
    } else {
      setVariants([]);
    }
  }, [values]);

  const handleGenerate = (e) => {
    e.preventDefault();
    console.log("AI Generate clicked");
  };

  const isVideoUrl = (url = "") => {
    if (!url || typeof url !== "string") return false;
    const lowered = url.toLowerCase();
    return lowered.includes("youtube.com/") || lowered.includes("youtu.be/");
  };

  const handleAddDynamicSection = () => {
    setDynamicSections((prev) => [
      ...prev,
      { name: "", description: "", isVisible: true, subsections: [] },
    ]);
  };

  const handleDynamicSectionChange = (sectionIndex, field, value) => {
    setDynamicSections((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex ? { ...section, [field]: value } : section
      )
    );
  };

  const handleRemoveDynamicSection = (sectionIndex) => {
    setDynamicSections((prev) => prev.filter((_, idx) => idx !== sectionIndex));
  };

  const handleAddSubsection = (sectionIndex, type = "keyValue") => {
    setDynamicSections((prev) =>
      prev.map((section, idx) => {
        if (idx === sectionIndex) {
          const newSubsection =
            type === "paragraph"
              ? { type: "paragraph", content: "", isVisible: true }
              : { type: "keyValue", key: "", value: "", isVisible: true };
          return {
            ...section,
            subsections: [...(section.subsections || []), newSubsection],
          };
        }
        return section;
      })
    );
  };

  const handleSubsectionChange = (sectionIndex, subsectionIndex, field, value) => {
    setDynamicSections((prev) =>
      prev.map((section, idx) => {
        if (idx === sectionIndex) {
          const updatedSubsections = (section.subsections || []).map((sub, subIdx) =>
            subIdx === subsectionIndex ? { ...sub, [field]: value } : sub
          );
          return { ...section, subsections: updatedSubsections };
        }
        return section;
      })
    );
  };

  const handleSubsectionTypeChange = (sectionIndex, subsectionIndex, type) => {
    setDynamicSections((prev) =>
      prev.map((section, idx) => {
        if (idx === sectionIndex) {
          const updatedSubsections = (section.subsections || []).map((sub, subIdx) => {
            if (subIdx === subsectionIndex) {
              if (type === "paragraph") {
                return { type: "paragraph", content: sub.content || "", isVisible: true };
              }
              return { type: "keyValue", key: sub.key || "", value: sub.value || "", isVisible: true };
            }
            return sub;
          });
          return { ...section, subsections: updatedSubsections };
        }
        return section;
      })
    );
  };

  const handleRemoveSubsection = (sectionIndex, subsectionIndex) => {
    setDynamicSections((prev) =>
      prev.map((section, idx) => {
        if (idx === sectionIndex) {
          return {
            ...section,
            subsections: (section.subsections || []).filter((_, subIdx) => subIdx !== subsectionIndex),
          };
        }
        return section;
      })
    );
  };

  const handleAddMediaSection = () => {
    setMediaSections((prev) => [
      ...prev,
      { name: "", description: "", isVisible: true, items: [] },
    ]);
  };

  const handleMediaSectionChange = (sectionIndex, field, value) => {
    setMediaSections((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex ? { ...section, [field]: value } : section
      )
    );
  };

  const handleRemoveMediaSection = (sectionIndex) => {
    setMediaSections((prev) => prev.filter((_, idx) => idx !== sectionIndex));
  };

  const handleAddMediaItem = (sectionIndex) => {
    setMediaSections((prev) =>
      prev.map((section, idx) => {
        if (idx === sectionIndex) {
          return {
            ...section,
            items: [...(section.items || []), { image: "", details: "" }],
          };
        }
        return section;
      })
    );
  };

  const handleMediaItemChange = (sectionIndex, itemIndex, field, value) => {
    setMediaSections((prev) =>
      prev.map((section, idx) => {
        if (idx === sectionIndex) {
          const updatedItems = (section.items || []).map((item, subIdx) =>
            subIdx === itemIndex ? { ...item, [field]: value } : item
          );
          return { ...section, items: updatedItems };
        }
        return section;
      })
    );
  };

  const handleRemoveMediaItem = (sectionIndex, itemIndex) => {
    setMediaSections((prev) =>
      prev.map((section, idx) => {
        if (idx === sectionIndex) {
          return {
            ...section,
            items: (section.items || []).filter((_, subIdx) => subIdx !== itemIndex),
          };
        }
        return section;
      })
    );
  };

  return (
    <div className="bg-[#f0f2f5] dark:bg-gray-900 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <button onClick={() => history.goBack()} className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
              <FiChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Add New Item</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                {languages.map((lang) => (
                  <button key={lang} type="button" onClick={() => setActiveTab(lang)} className={`pb-3 text-sm font-medium ${activeTab === lang ? "text-[#008f89] border-b-2 border-[#008f89]" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                    {lang}
                  </button>
                ))}
              </div>
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name (Default) <span className="text-red-500">*</span></label>
                  <Input {...register("title", { required: "Name is required!" })} placeholder="New food" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-[#008f89]" />
                <Error errorName={errors.title} />
              </div>
              <div className="mb-2 relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Short description (Default) <span className="text-red-500">*</span></label>
                  <Textarea {...register("description", { required: "Description is required!" })} rows="4" placeholder="Short description" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-[#008f89]" />
                <Error errorName={errors.description} />
              </div>
              <div className="mb-2 relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Slug <span className="text-red-500">*</span></label>
                  <Input {...register("slug", { required: "Slug is required!" })} defaultValue={slug} placeholder="product-slug" onBlur={(e) => handleProductSlug(e.target.value)} className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-[#008f89]" />
                <Error errorName={errors.slug} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SKU</label>
                  <Input {...register("sku")} placeholder="SKU" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Barcode</label>
                  <Input {...register("barcode")} placeholder="Barcode" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col space-y-6">
               <div className="flex-1 flex flex-col">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item Images</label>
                 <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                   <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} folder="product" product={true} useOriginalSize={true} />
                 </div>
               </div>
               <div className="flex-1 flex flex-col">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thumbnail Image</label>
                 <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                   <Uploader imageUrl={thumbnailUrl} setImageUrl={setThumbnailUrl} folder="product" product={false} useOriginalSize={true} />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Video URL</label>
                 <Input type="text" placeholder="https://www.youtube.com/..." value={Array.isArray(imageUrl) ? imageUrl.find((item) => typeof item === "string" && isVideoUrl(item)) || "" : ""} onChange={(e) => { const url = e.target.value.trim(); setImageUrl((prev = []) => { const prevArray = Array.isArray(prev) ? prev : [prev]; const filtered = prevArray.filter(item => !(typeof item === "string" && isVideoUrl(item))); return isVideoUrl(url) ? [...filtered, url] : filtered; }); }} className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center"><FiLayers className="mr-2 text-gray-500 dark:text-gray-400" /> Store & Category Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store <span className="text-red-500">*</span></label>
                <Select value={brand?._id || ""} onChange={(e) => { const selected = brandOptions?.find(item => item._id === e.target.value); setBrand(selected || null); }} className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                  <option value="" className="dark:bg-gray-800">Select store</option>
                  {brandOptions?.map(item => <option key={item._id} value={item._id} className="dark:bg-gray-800">{item.name?.en || item.name}</option>)}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category <span className="text-red-500">*</span></label>
                <ParentCategory lang={language} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} setDefaultCategory={setDefaultCategory} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Category</label>
                <Multiselect displayValue="name" isObject={true} singleSelect={true} onSelect={(v) => setDefaultCategory(v)} selectedValues={defaultCategory} options={selectedCategory} placeholder="Default Category" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Suitable For</label>
                <Select {...register("suitableFor")} className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                  <option value="" className="dark:bg-gray-800">Select Condition</option>
                  <option value="Kids" className="dark:bg-gray-800">Kids</option>
                  <option value="Adults" className="dark:bg-gray-800">Adults</option>
                  <option value="Adults" className="dark:bg-gray-800">Other</option>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center"><FiLayers className="mr-2 text-gray-500 dark:text-gray-400" /> Batch & Manufacturing Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Batch No.</label><Input {...register("batchNo")} placeholder="Batch Number" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label><Input type="date" {...register("expDate")} className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Manufacturing Date</label><Input type="date" {...register("manufactureDate")} className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" /></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">Price Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit Price ₹ <span className="text-red-500">*</span></label><Input type="number" step="0.01" min="0" onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()} {...register("originalPrice")} placeholder="0" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discount Type</label><Select {...register("discountType")} className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"><option value="flat" className="dark:bg-gray-800">Flat (₹)</option><option value="percentage" className="dark:bg-gray-800">Percentage (%)</option></Select></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discount</label><Input type="number" step="0.01" min="0" onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()} {...register("discount")} placeholder="0" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sale Price ₹</label><Input type="number" readOnly value={watch("discountType") === "percentage" ? (Math.max(0, (Number(watch("originalPrice")) || 0) - ((Number(watch("originalPrice")) || 0) * (Number(watch("discount")) || 0) / 100))).toFixed(2) : Math.max(0, (Number(watch("originalPrice")) || 0) - (Number(watch("discount")) || 0))} className="w-full border-teal-200 dark:border-teal-900/30 bg-teal-50 dark:bg-teal-900/20 font-bold text-teal-700 dark:text-teal-400" /></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">Product Details & Rich Content</h2>
            <div className="space-y-10">
              {/* Composition */}
              <div className="border border-gray-100 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Composition</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Title</label><Input value={composition?.title || ""} onChange={(e) => setComposition({ ...composition, title: e.target.value })} placeholder="Section Title" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Description</label><Textarea rows="3" value={composition?.description || ""} onChange={(e) => setComposition({ ...composition, description: e.target.value })} placeholder="Composition details" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" /></div>
                </div>
              </div>
              {/* Highlights */}
              <div className="border border-gray-100 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Product Highlights</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Title</label><Input value={productHighlights?.title || ""} onChange={(e) => setProductHighlights({ ...productHighlights, title: e.target.value })} placeholder="Section Title" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Highlights (List)</label>
                    <div className="space-y-3">
                      {productHighlights?.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input placeholder="Item" value={item || ""} onChange={(e) => { const newItems = [...(productHighlights?.items || [])]; newItems[idx] = e.target.value; setProductHighlights({ ...productHighlights, items: newItems }); }} className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
                          <button type="button" onClick={() => { const newItems = (productHighlights?.items || []).filter((_, i) => i !== idx); setProductHighlights({ ...productHighlights, items: newItems }); }} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"><FiTrash2 /></button>
                        </div>
                      ))}
                      <Button type="button" size="small" onClick={() => setProductHighlights({ ...productHighlights, items: [...(productHighlights?.items || []), ""] })} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">Add Item</Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Ingredients */}
              <div className="border border-gray-100 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Ingredients</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Icon</label><Uploader product={false} folder="product-icons" imageUrl={ingredients?.icon} setImageUrl={(url) => setIngredients({ ...ingredients, icon: url })} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Title</label><Input value={ingredients?.title || ""} onChange={(e) => setIngredients({ ...ingredients, title: e.target.value })} placeholder="Section Title" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" /></div>
                  <div className="space-y-3">
                    {ingredients?.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input placeholder="Key" value={item?.key || ""} onChange={(e) => { const newItems = [...(ingredients?.items || [])]; newItems[idx] = { ...newItems[idx], key: e.target.value }; setIngredients({ ...ingredients, items: newItems }); }} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                        <Input placeholder="Value" value={item?.value || ""} onChange={(e) => { const newItems = [...(ingredients?.items || [])]; newItems[idx] = { ...newItems[idx], value: e.target.value }; setIngredients({ ...ingredients, items: newItems }); }} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                        <button type="button" onClick={() => { const newItems = (ingredients?.items || []).filter((_, i) => i !== idx); setIngredients({ ...ingredients, items: newItems }); }} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"><FiTrash2 /></button>
                      </div>
                    ))}
                    <Button type="button" size="small" onClick={() => setIngredients({ ...ingredients, items: [...(ingredients?.items || []), { key: "", value: "" }] })} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">Add Ingredient</Button>
                  </div>
                </div>
              </div>
              {/* How to Use */}
              <div className="border border-gray-100 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">How to Use</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Icon</label><Uploader product={false} folder="product-icons" imageUrl={howToUse?.icon} setImageUrl={(url) => setHowToUse({ ...howToUse, icon: url })} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Title</label><Input value={howToUse?.title || ""} onChange={(e) => setHowToUse({ ...howToUse, title: e.target.value })} placeholder="Section Title" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" /></div>
                  <div className="space-y-3">
                    {howToUse?.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input placeholder="Instruction" value={item || ""} onChange={(e) => { const newItems = [...(howToUse?.items || [])]; newItems[idx] = e.target.value; setHowToUse({ ...howToUse, items: newItems }); }} className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                        <button type="button" onClick={() => { const newItems = (howToUse?.items || []).filter((_, i) => i !== idx); setHowToUse({ ...howToUse, items: newItems }); }} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"><FiTrash2 /></button>
                      </div>
                    ))}
                    <Button type="button" size="small" onClick={() => setHowToUse({ ...howToUse, items: [...(howToUse?.items || []), ""] })} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">Add Instruction</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Layout Sections */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Custom Layout Sections</h2>
              <Button size="small" type="button" onClick={handleAddDynamicSection} className="bg-[#008f89] hover:bg-[#00706b]">Add Layout Section</Button>
            </div>
            <div className="space-y-6">
              {dynamicSections?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between gap-4 mb-4">
                    <Input value={section.name || ""} onChange={(e) => handleDynamicSectionChange(sectionIndex, "name", e.target.value)} placeholder="Section name" className="flex-1 font-bold border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
                    <button type="button" className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" onClick={() => handleRemoveDynamicSection(sectionIndex)}><FiTrash2 /></button>
                  </div>
                  <Textarea className="mb-4 w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" rows="2" value={section.description || ""} onChange={(e) => handleDynamicSectionChange(sectionIndex, "description", e.target.value)} placeholder="Description" />
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 mb-4">
                    {section.subsections?.map((subsection, subsectionIndex) => (
                      <div key={subsectionIndex} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between gap-4 mb-3">
                          <Select value={subsection.type || "keyValue"} onChange={(e) => handleSubsectionTypeChange(sectionIndex, subsectionIndex, e.target.value)} className="w-48 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                            <option value="keyValue" className="dark:bg-gray-800">Key / Value</option>
                            <option value="paragraph" className="dark:bg-gray-800">Paragraph</option>
                          </Select>
                          <button type="button" className="text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" onClick={() => handleRemoveSubsection(sectionIndex, subsectionIndex)}><FiTrash2 size={16} /></button>
                        </div>
                        {subsection.type === "paragraph" ? (
                          <Textarea rows="3" value={subsection.content || ""} onChange={(e) => handleSubsectionChange(sectionIndex, subsectionIndex, "content", e.target.value)} placeholder="Content" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input value={subsection.key || ""} onChange={(e) => handleSubsectionChange(sectionIndex, subsectionIndex, "key", e.target.value)} placeholder="Key" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
                            <Input value={subsection.value || ""} onChange={(e) => handleSubsectionChange(sectionIndex, subsectionIndex, "value", e.target.value)} placeholder="Value" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button size="small" type="button" layout="outline" onClick={() => handleAddSubsection(sectionIndex, "keyValue")}>+ Add Key / Value</Button>
                    <Button size="small" type="button" layout="outline" onClick={() => handleAddSubsection(sectionIndex, "paragraph")}>+ Add Paragraph</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Sections */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Media Blocks</h2>
              <Button size="small" type="button" onClick={handleAddMediaSection} className="bg-[#008f89] hover:bg-[#00706b]">Add Media Block</Button>
            </div>
            <div className="space-y-6">
              {mediaSections?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex justify-between gap-4 mb-4">
                    <Input value={section.name || ""} onChange={(e) => handleMediaSectionChange(sectionIndex, "name", e.target.value)} placeholder="Block title" className="flex-1 font-bold border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" />
                    <button type="button" className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" onClick={() => handleRemoveMediaSection(sectionIndex)}><FiTrash2 /></button>
                  </div>
                  <Textarea className="mb-4 w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200" rows="2" value={section.description || ""} onChange={(e) => handleMediaSectionChange(sectionIndex, "description", e.target.value)} placeholder="Description" />
                  <div className="space-y-4">
                    {section.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
                        <div className="w-1/3">
                          <Uploader product={false} folder="media-blocks" imageUrl={item.image} setImageUrl={(url) => handleMediaItemChange(sectionIndex, itemIndex, "image", url)} />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                           <Textarea rows="3" value={item.details || ""} onChange={(e) => handleMediaItemChange(sectionIndex, itemIndex, "details", e.target.value)} placeholder="Details" className="w-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 mb-2" />
                           <div className="flex justify-end">
                             <button type="button" className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center transition-colors" onClick={() => handleRemoveMediaItem(sectionIndex, itemIndex)}><FiTrash2 className="mr-1" /> Remove</button>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button size="small" type="button" layout="outline" onClick={() => handleAddMediaItem(sectionIndex)}>+ Add Image</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attribute & Variants */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-20">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">Product Attributes & Variants</h2>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attribute</label>
              <Multiselect
                options={attribue?.map(a => ({ name: showingTranslateValue(a.title), _id: a._id }))}
                selectedValues={attributes}
                onSelect={onSelectAttribute}
                onRemove={onRemoveAttribute}
                displayValue="name"
                placeholder="Choose attributes"
                className="w-full"
                style={{ 
                  chips: { background: "#e6f4f3", color: "#008f89", borderRadius: "4px" },
                  searchBox: { border: "1px solid #e2e8f0", borderRadius: "4px", padding: "8px" }
                }}
              />
            </div>
            {attributes.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attributes.map((attr) => {
                    return (
                      <div key={attr._id} className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{attr.name}</label>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-1 focus-within:border-[#008f89] transition-all bg-white dark:bg-gray-800">
                          <ReactTagInput
                            placeholder={`Enter choice values`}
                            tags={values[attr._id] || []}
                            onChange={(newTags) => setValues({ ...values, [attr._id]: newTags })}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {variants.length > 0 && (
              <div className="mt-10 overflow-x-auto border border-gray-100 dark:border-gray-700 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#e6f4f3] dark:bg-teal-900/30 text-gray-700 dark:text-teal-400 uppercase text-xs font-bold">
                    <tr>
                      <th className="px-6 py-4">Variant</th>
                      <th className="px-6 py-4">Variant Price</th>
                      <th className="px-6 py-4">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {variants.map((variant, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">
                           {Object.keys(variant).filter(k => !['price', 'originalPrice', 'discount', 'quantity', 'barcode', 'sku', 'image', 'productId', 'title', 'description', 'slug', 'dynamicSections', 'mediaSections'].includes(k)).map(k => variant[k]).join('-')}
                        </td>
                        <td className="px-6 py-4">
                          <Input 
                            type="number" 
                            value={variant.originalPrice || 0} 
                            onChange={(e) => handleVariantChange(index, "originalPrice", e.target.value)} 
                            className="h-10 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-[#008f89] w-full" 
                            min="0"
                            step="0.01"
                            onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input 
                            type="number" 
                            value={variant.quantity || 0} 
                            onChange={(e) => handleVariantChange(index, "quantity", e.target.value)} 
                            className="h-10 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:border-[#008f89] w-full" 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}


          </div>

          <div className="flex justify-end mt-8">
            <Button type="submit" disabled={isSubmitting} className="bg-[#008f89] hover:bg-[#00706b] text-white px-10 py-3 rounded-md flex items-center shadow-sm font-semibold transition-all">
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

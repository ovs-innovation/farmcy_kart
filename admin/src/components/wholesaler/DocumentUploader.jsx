import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SidebarContext } from "@/context/SidebarContext";
import { FiUploadCloud, FiCheck } from "react-icons/fi";
import { notifyError, notifySuccess } from "@/utils/toast";

const DocumentUploader = ({
  id,
  name,
  publicField,
  publicDeleteField,
  value,
  publicId,
  deleteToken,
  setValue,
  removeAsset,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [removing, setRemoving] = useState(false);
  const { setIsUpdate } = useContext(SidebarContext);

  useEffect(() => {
    // Don't wipe local preview when parent "value" is still empty (getValues() doesn't trigger rerenders).
    if (value) setPreview(value);
  }, [value]);

  const handleFile = async (e) => {
    const file = e.dataTransfer ? e.dataTransfer.files?.[0] : e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      notifyError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      notifyError("Only JPEG, PNG, WEBP images and PDF files are allowed");
      return;
    }

    // Check Cloudinary configuration from admin env
    const cloudinaryUrl = import.meta.env.VITE_APP_CLOUDINARY_URL;
    const uploadPreset = import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;

    if (!cloudinaryUrl || !uploadPreset) {
      notifyError("Cloudinary configuration is missing. Please check environment variables.");
      return;
    }

    // Show quick local preview for images
    let localUrl = null;
    if (file.type && file.type.startsWith("image/")) {
      localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
    } else if (file.type === 'application/pdf') {
      // For PDF, show a placeholder
      setPreview('pdf-placeholder');
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Determine upload URL based on file type
      let uploadUrl = cloudinaryUrl;
      if (file.type === 'application/pdf') {
        // For PDFs, use auto/upload endpoint
        uploadUrl = cloudinaryUrl.replace('/image/upload', '/auto/upload');
      }

      // Generate unique public_id
      const fileName = file.name.replace(/\s/g, '').replace(/[^a-zA-Z0-9.-]/g, '');
      const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || 'file';
      const publicIdCandidate = `wholesaler/${name}_${Date.now()}_${baseName}`;

      // Create FormData for direct Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      if (cloudName) {
        formData.append("cloud_name", cloudName);
      }
      formData.append("folder", "wholesaler");
      formData.append("public_id", publicIdCandidate);

      // Upload directly to Cloudinary with progress tracking
      setUploadProgress(10);

      const response = await axios({
        url: uploadUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 80) / progressEvent.total
            );
            setUploadProgress(10 + percentCompleted); // 10% to 90%
          }
        },
      });

      setUploadProgress(90);

      const url = response.data.secure_url || response.data.url || null;
      const pubId = response.data.public_id || publicIdCandidate || null;
      // Note: delete_token is only available with signed uploads, not with upload_preset
      const deleteToken = response.data.delete_token || null;

      // Update preview with uploaded URL
      if (url) {
        setPreview(url);
      }

      // Set form values
      setValue(name, url, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setValue(publicField, pubId, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      if (publicDeleteField && deleteToken) {
        setValue(publicDeleteField, deleteToken, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      }

      setUploadProgress(95);

      // Save to database via backend API
      if (id) {
        // If editing existing wholesaler, save immediately to database
        const updateObj = { 
          [name]: url, 
          [publicField]: pubId 
        };
        if (publicDeleteField && deleteToken) {
          updateObj[publicDeleteField] = deleteToken;
        }
        
        await import("@/services/CustomerServices").then((mod) =>
          mod.default.updateCustomer(id, updateObj)
        );
        notifySuccess("Uploaded and saved to database successfully");
        if (setIsUpdate) setIsUpdate(true);
      } else {
        // For new wholesaler, just notify - will be saved when form is submitted
        notifySuccess("File uploaded successfully");
      }

      setUploadProgress(100);

      // Revoke local object URL if we created it
      if (localUrl) {
        URL.revokeObjectURL(localUrl);
      }

      // Small delay to show 100% before hiding progress
      setTimeout(() => {
        setUploadProgress(0);
      }, 500);
    } catch (err) {
      console.error("Document upload error:", err);
      const errorMessage = err?.response?.data?.error?.message || 
                          err?.response?.data?.message || 
                          err?.message || 
                          "Upload failed";
      
      notifyError(errorMessage);
      
      // Revert preview if upload failed
      if (localUrl) {
        URL.revokeObjectURL(localUrl);
      }
      setPreview(value || null); // Revert to previous value
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (e) => {
    e?.stopPropagation?.();
    if (removing) return;
    
    // for create (no id) remove locally, otherwise call removeAsset
    if (!id) {
      setValue(name, "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      setValue(publicField, "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      if (publicDeleteField) {
        setValue(publicDeleteField, "", { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      }
      setPreview(null);
      notifySuccess("Removed");
    } else {
      try {
        setRemoving(true);
        await removeAsset(name);
        setPreview(null);
      } catch (err) {
        console.error("Remove error:", err);
      } finally {
        setRemoving(false);
      }
    }
  };

  const getDocumentName = () => {
    const nameMap = {
      aadhar: "Aadhar Card",
      pan: "PAN Card",
      gst: "GST Certificate",
      drugLicense: "Drug License"
    };
    return nameMap[name] || name.replace(/([A-Z])/g, " $1");
  };

  return (
    <div className="w-full">
      <div
        className={`px-4 py-6 border-2 border-dashed rounded-md flex items-center justify-center text-center relative transition-all ${
          uploading 
            ? 'opacity-90 pointer-events-none border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : removing
            ? 'opacity-70 pointer-events-none border-gray-300'
            : preview && preview !== 'pdf-placeholder'
            ? 'border-green-300 bg-green-50 dark:bg-green-900/20 hover:border-green-400 cursor-default'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading && !removing) {
            e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
          }
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (!uploading && !removing && !preview) {
            e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (!uploading && !removing) {
            e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
            handleFile(e);
          }
        }}
        onClick={() => {
          if (!uploading && !removing && (!preview || preview === 'pdf-placeholder')) {
            document.getElementById(`${name}-input`)?.click();
          }
        }}
      >
        <input 
          id={`${name}-input`} 
          type="file" 
          accept="image/*,application/pdf" 
          onChange={handleFile} 
          className="hidden" 
          disabled={uploading || removing}
        />

        {/* Uploading state */}
        {uploading ? (
          <div className="flex flex-col items-center w-full">
            <div className="relative w-12 h-12 mb-3">
              <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
              Uploading {getDocumentName()}...
            </div>
            {uploadProgress > 0 && (
              <>
                <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{uploadProgress}%</div>
              </>
            )}
          </div>
        ) : removing ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mb-2"></div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Removing...</div>
          </div>
        ) : preview && preview !== 'pdf-placeholder' ? (
          <div className="flex items-center gap-4 w-full">
            {/\.pdf(\?|$)/i.test(preview) ? (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded border border-red-200 dark:border-red-800">
                <div className="text-red-600 dark:text-red-400 font-bold text-lg">PDF</div>
                <a 
                  href={preview} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  View PDF
                </a>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={preview} 
                  alt={getDocumentName()} 
                  className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm" 
                />
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                  <FiCheck className="text-white text-xs" />
                </div>
              </div>
            )}
            <div className="flex flex-col items-start flex-grow">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                {getDocumentName()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {value ? 'Uploaded successfully' : 'Ready to upload'}
              </div>
              <button 
                type="button" 
                onClick={handleRemove} 
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <FiUploadCloud className="text-4xl text-gray-400 dark:text-gray-500 mb-3" />
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize mb-1">
              {getDocumentName()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Upload Image or PDF
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              (Max 10MB, JPEG/PNG/WEBP/PDF)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;

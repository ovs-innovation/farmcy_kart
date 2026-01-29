import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SidebarContext } from "@/context/SidebarContext";
import { FiUploadCloud, FiX } from "react-icons/fi";
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
  const [preview, setPreview] = useState(null);
  const { setIsUpdate } = useContext(SidebarContext);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFile = async (e) => {
    const file = e.dataTransfer ? e.dataTransfer.files?.[0] : e.target.files?.[0];
    if (!file) return;

    // show quick local preview for images
    let localUrl = null;
    if (file.type && file.type.startsWith("image/")) {
      localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
    }

    try {
      // Server-side upload will be used; no client preset is required. Ensure backend is configured for Cloudinary.

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      // Add a unique public id to avoid clashes
      const publicIdCandidate = `${name}_${Date.now()}`;
      formData.append("public_id", publicIdCandidate);
      formData.append("folder", "wholesaler");

      let signed = false;
      // Try to get signature from server to perform signed upload (returns delete token)
      try {
        const signRes = await axios.post(`/api/customer/cloudinary-sign`, { publicId: publicIdCandidate, folder: 'wholesaler' });
        if (signRes && signRes.data && signRes.data.signature) {
          const { signature, timestamp, apiKey } = signRes.data;
          formData.append('timestamp', timestamp);
          formData.append('api_key', apiKey);
          formData.append('signature', signature);
          // request delete token in signed upload
          formData.append('return_delete_token', 'true');
          signed = true;
        }
      } catch (signErr) {
        // If signing fails, fallback to unsigned upload (upload_preset)
        console.warn('Cloudinary signing unavailable, falling back to unsigned upload:', signErr?.response?.data || signErr?.message || signErr);
        formData.append("upload_preset", import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET);
        // remove any return_delete_token that might have been set
      }

      // Upload via server endpoint by sending the file as a data URL (avoid client-side Cloudinary complexity)
      const readFileAsDataUrl = (f) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(f);
      });

      let dataUrl;
      try {
        dataUrl = await readFileAsDataUrl(file);
      } catch (err) {
        console.error('Failed to read file:', err);
        notifyError('Failed to read file');
        setUploading(false);
        return;
      }

      let res;
      try {
        res = await axios.post('/api/customer/cloudinary-upload', { file: dataUrl, publicId: publicIdCandidate, folder: 'wholesaler' });
      } catch (err) {
        console.error('Server-side upload failed:', err?.response?.data || err?.message || err);
        notifyError(err?.response?.data?.message || err?.message || 'Upload failed');
        setUploading(false);
        return;
      }

      const url = res.data.url || res.data.secure_url || null;
      const pubId = res.data.publicId || res.data.public_id || null;
      const deleteToken = res.data.deleteToken || res.data.delete_token || null;

      // set form values
      setValue(name, url);
      setValue(publicField, pubId);
      if (publicDeleteField && deleteToken) setValue(publicDeleteField, deleteToken);

      // If editing existing wholesaler (id present), persist immediately
      if (id) {
        const updateObj = { [name]: url, [publicField]: pubId };
        if (publicDeleteField && deleteToken) updateObj[publicDeleteField] = deleteToken;
        await import("@/services/CustomerServices").then((mod) =>
          mod.default.updateCustomer(id, updateObj)
        );
        notifySuccess("Uploaded and saved successfully");
        if (setIsUpdate) setIsUpdate(true);
      }
      // revoke local object url if we created it
      if (localUrl) URL.revokeObjectURL(localUrl);
    } catch (err) {
      console.error("Document upload error:", err);
      const msg = err?.response?.data?.message || err?.message || "Upload failed";
      if (String(msg).includes("Return delete token parameter is not allowed")) {
        // Clear local preview and inform user about unsigned uploads limitation
        notifyError("Cloudinary rejected return_delete_token for unsigned uploads. Delete tokens require signed uploads; falling back to server-side deletion when needed.");
      } else {
        notifyError(msg);
      }
      // revert preview if upload failed
      if (localUrl) setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    // for create (no id) remove locally, otherwise call removeAsset
    if (!id) {
      setValue(name, "");
      setValue(publicField, "");
      setPreview(null);
      notifySuccess("Removed");
    } else {
      await removeAsset(name);
      setPreview(null);
    }
  };

  return (
    <div>
      <div
        className={`px-4 py-6 border-2 border-dashed rounded-md flex items-center justify-center text-center relative ${uploading ? 'opacity-80 pointer-events-none border-store-300 bg-store-50' : 'hover:border-store-500'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e);
        }}
        onClick={() => document.getElementById(`${name}-input`)?.click()}
      >
        <input id={`${name}-input`} type="file" accept="image/*,application/pdf" onChange={handleFile} className="hidden" />

        {/* Uploading state */}
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-store-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <div className="text-sm text-store-600 font-medium">Uploading...</div>
          </div>
        ) : preview ? (
          <div className="flex items-center gap-3">
            {(/\.pdf(\?|$)/i.test(preview)) ? (
              <a href={preview} target="_blank" rel="noreferrer" className="text-sm underline text-store-600">View PDF</a>
            ) : (
              <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded" />
            )}
            <div className="flex flex-col items-start">
              <div className="text-sm font-medium">{name.replace(/([A-Z])/g, " $1")}</div>
              <button type="button" onClick={handleRemove} className="text-red-500 text-sm mt-1">Remove</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <FiUploadCloud className="text-2xl text-store-500" />
            <div className="text-left">
              <div className="text-sm font-medium">{name.replace(/([A-Z])/g, " $1")}</div>
              <div className="text-xs text-gray-500">Upload Image or PDF</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;

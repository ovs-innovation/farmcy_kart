import React, { useEffect, useState } from "react";
import { t } from "i18next";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";
import Pica from "pica";

// Internal imports
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { notifyError, notifySuccess } from "@/utils/toast";
import Container from "@/components/image-uploader/Container";

const Uploader = ({
  setImageUrl,
  imageUrl,
  product,
  folder,
  targetWidth = 800, // Set default fixed width
  targetHeight = 800, // Set default fixed height
  useOriginalSize = false,
  accept,
  maxSize = 5242880,
  uniquePublicId = false,
  onUploadComplete,
  onRemove,
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const pica = Pica(); // Initialize Pica instance
  const { globalSetting } = useUtilsFunction();

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept:
      accept ||
      {
        "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      },
    multiple: product ? true : false,
    maxSize,
    maxFiles: globalSetting?.number_of_image_per_product || 2,
    onDrop: async (acceptedFiles) => {
      let filesToUpload;

      filesToUpload = await Promise.all(
        acceptedFiles.map((file) => {
          if (useOriginalSize) return file;
          if (file?.type && file.type.startsWith("image/")) {
            return resizeImageToFixedDimensions(file, targetWidth, targetHeight);
          }
          return file;
        })
      );

      setFiles(
        filesToUpload.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const resizeImageToFixedDimensions = async (file, width, height) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    return new Promise((resolve) => {
      pica
        .resize(img, canvas, {
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2,
        })
        .then((result) => pica.toBlob(result, file.type, 0.9))
        .then((blob) => {
          const resizedFile = new File([blob], file.name, { type: file.type });
          resolve(resizedFile);
        });
    });
  };

  useEffect(() => {
    if (fileRejections) {
      fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map((e) => (
              <li key={e.code}>
                {e.code === "too-many-files"
                  ? notifyError(
                      `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`
                    )
                  : notifyError(e.message)}
              </li>
            ))}
          </ul>
        </li>
      ));
    }

    if (files) {
      files.forEach((file) => {
        if (
          product &&
          imageUrl?.length + files?.length >
            globalSetting?.number_of_image_per_product
        ) {
          return notifyError(
            `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`
          );
        }

        setLoading(true);
        setError("Uploading....");

        const name = file.name.replaceAll(/\s/g, "");
        const basePublicId = name?.substring(0, name.lastIndexOf("."));
        const public_id = uniquePublicId ? `${basePublicId}_${Date.now()}` : basePublicId;

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET
        );
        formData.append("cloud_name", import.meta.env.VITE_APP_CLOUD_NAME);
        formData.append("folder", folder);
        formData.append("public_id", public_id);

        const baseUrl = import.meta.env.VITE_APP_CLOUDINARY_URL;
        const uploadUrl =
          file?.type === "application/pdf" && typeof baseUrl === "string"
            ? baseUrl.replace("/image/upload", "/auto/upload")
            : baseUrl;

        axios({
          url: uploadUrl,
          method: "POST",
          data: formData,
        })
          .then((res) => {
            notifySuccess("Image Uploaded successfully!");
            setLoading(false);
            if (typeof onUploadComplete === "function") {
              onUploadComplete(res.data);
            }
            if (product) {
              setImageUrl((imgUrl) => [...imgUrl, res.data.secure_url]);
            } else {
              setImageUrl(res.data.secure_url);
            }
          })
          .catch((err) => {
            console.error("err", err);
            notifyError(err.Message);
            setLoading(false);
          });
      });
    }
  }, [files]);

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className="inline-flex border-2 border-gray-100 w-24 max-h-24"
          src={file.preview}
          alt={file.name}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const handleRemoveImage = async (img) => {
    try {
      setLoading(false);
      notifyError("Image delete successfully!");
      if (typeof onRemove === "function") {
        await onRemove(img);
      }
      if (product) {
        const result = imageUrl?.filter((i) => i !== img);
        setImageUrl(result);
      } else {
        setImageUrl("");
      }
    } catch (err) {
      console.error("err", err);
      notifyError(err.Message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      <div
        className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-store-500" />
        </span>
        <p className="text-sm mt-2">{t("DragYourImage")}</p>
        <em className="text-xs text-gray-400">
          {t("imageFormat")}
          {useOriginalSize ? " (Original Size)" : ` (${targetWidth}x${targetHeight})`}
        </em>
      </div>

      <div className="text-store-500">{loading && err}</div>
      <aside className="flex flex-row flex-wrap mt-4">
        {product ? (
          <DndProvider backend={HTML5Backend}>
            <Container
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              handleRemoveImage={handleRemoveImage}
            />
          </DndProvider>
        ) : !product && imageUrl ? (
          <div className="relative">
            {typeof imageUrl === "string" && /\.pdf(\?|$)/i.test(imageUrl) ? (
              <a
                className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 items-center justify-center text-sm underline"
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
              >
                PDF
              </a>
            ) : (
              <img
                className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2"
                src={imageUrl}
                alt="product"
              />
            )}
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500 focus:outline-none"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <FiXCircle />
            </button>
          </div>
        ) : (
          thumbs
        )}
      </aside>
    </div>
  );
};

export default Uploader;

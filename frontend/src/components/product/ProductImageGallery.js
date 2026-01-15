import { useState, useEffect } from "react";

const ProductImageGallery = ({ images, productTitle = "Product", buttons }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Only treat direct video files as video; YouTube URLs will be shown as images (thumbnail)
  const isVideoUrl = (url = "") => {
    if (!url || typeof url !== "string") return false;
    const lowered = url.toLowerCase();
    return (
      lowered.includes(".mp4") ||
      lowered.includes(".mov") ||
      lowered.includes(".webm")
    );
  };

  const isYoutubeUrl = (url = "") => {
    if (!url || typeof url !== "string") return false;
    const lowered = url.toLowerCase();
    return lowered.includes("youtube.com/") || lowered.includes("youtu.be/");
  };

  const getYoutubeThumbnail = (url = "") => {
    if (!isYoutubeUrl(url)) return null;
    // Extract video id from common YouTube URL formats
    const ytMatch =
      url.match(/[?&]v=([^&#]+)/i) || // https://www.youtube.com/watch?v=ID
      url.match(/youtu\.be\/([^&#?/]+)/i) || // https://youtu.be/ID
      url.match(/\/embed\/([^&#?/]+)/i); // embedded format
    const videoId = ytMatch?.[1];
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const getYoutubeEmbedUrl = (url = "") => {
    if (!isYoutubeUrl(url)) return null;
    const ytMatch =
      url.match(/[?&]v=([^&#]+)/i) ||
      url.match(/youtu\.be\/([^&#?/]+)/i) ||
      url.match(/\/embed\/([^&#?/]+)/i);
    const videoId = ytMatch?.[1];
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // Filter valid media (images + videos)
  const validMedia = Array.isArray(images)
    ? images.filter((url) => url && typeof url === "string" && url.trim() !== "")
    : [];

  // If no media, show placeholder
  const displayImages = validMedia.length > 0 
    ? validMedia 
    : ["https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"];
  
  const activeImage = displayImages[activeIndex] || displayImages[0];
  const placeholder = "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

  // Reset active index when images change
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    if (index >= 0 && index < displayImages.length) {
      setActiveIndex(index);
    }
  };

  // Handle image error
  const handleImageError = (e) => {
    if (e.target.src !== placeholder) {
      e.target.src = placeholder;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:items-start bg-white rounded-2xl ">
      {/* Vertical Thumbnail Gallery - Left Side (Flipkart Style) */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col flex-row gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto max-h-[560px] pb-2 lg:pb-0 scrollbar-thin">
          {displayImages.map((mediaUrl, index) => (
            <button
              key={`thumb-${index}-${mediaUrl}`}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 relative w-16 h-16 lg:w-20 lg:h-20 rounded border-2 overflow-hidden transition-all duration-200 cursor-pointer ${
                index === activeIndex
                  ? "border-store-500 ring-2 ring-store-200 shadow-md"
                  : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
              }`}
              type="button"
            >
              {isVideoUrl(mediaUrl) ? (
                <video
                  src={mediaUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <>
                  <img
                    src={
                      isYoutubeUrl(mediaUrl)
                        ? getYoutubeThumbnail(mediaUrl) || placeholder
                        : mediaUrl || placeholder
                    }
                    alt={`${productTitle} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  {isYoutubeUrl(mediaUrl) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                      <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                        <span className="ml-0.5 border-l-8 border-y-4 border-l-red-600 border-y-transparent" />
                      </span>
                    </div>
                  )}
                </>
              )}
              {index === activeIndex && (
                <div className="absolute inset-0 border-2 border-store-500" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Preview Image / Video - Right Side (Flipkart Style) */}
      <div className="flex-1 order-1 lg:order-2 w-full">
        <div className="relative w-full aspect-square bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Buttons overlay - positioned inside main image container */}
          {buttons}
          {activeImage ? (
            isVideoUrl(activeImage) ? (
              <video
                key={`main-video-${activeIndex}-${activeImage}`}
                src={activeImage}
                className="w-full h-full object-contain"
                controls
              />
            ) : isYoutubeUrl(activeImage) ? (
              <iframe
                key={`main-yt-${activeIndex}-${activeImage}`}
                src={getYoutubeEmbedUrl(activeImage) || ""}
                title={productTitle}
                className="w-full min-h-[400px] object-contain"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <img
                key={`main-img-${activeIndex}-${activeImage}`}
                src={activeImage}
                alt={productTitle}
                className="w-full h-full max-h-[400px] object-contain transition-opacity duration-300"
                onError={handleImageError}
                loading="eager"
              />
            )
          ) : (
            <img
              src={placeholder}
              alt="Product placeholder"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;


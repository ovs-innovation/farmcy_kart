import React, { useState, useMemo } from "react";
import { AiFillStar } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { notifyError, notifySuccess } from "@utils/toast";
import { UserContext } from "@context/UserContext";
import { useContext } from "react";

const StarSelector = ({ value, onChange, disabled }) => {
  const [hover, setHover] = useState(0);
  const current = hover || value || 0;

  return (
    <div className="flex items-center space-x-1 mb-1">
      {Array.from({ length: 5 }).map((_, idx) => {
        const starValue = idx + 1;
        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => !disabled && setHover(starValue)}
            onMouseLeave={() => !disabled && setHover(0)}
            className="focus:outline-none"
          >
            <AiFillStar
              className={
                starValue <= current
                  ? "w-6 h-6 text-yellow-400"
                  : "w-6 h-6 text-gray-300"
              }
            />
          </button>
        );
      })}
      <span className="ml-2 text-xs text-gray-500">
        {current ? `${current} / 5` : "Select rating"}
      </span>
    </div>
  );
};

const WriteReviewForm = ({
  productId,
  existingReview,
  onSubmitReview,
  isSubmitting,
}) => {
  const { data: session, status } = useSession();
  const { state: userState } = useContext(UserContext) || {};
  
  // Robust login check using both NextAuth and Custom Context
  const isLoggedIn = (status === "authenticated" && session?.user) || !!userState?.userInfo;
  const userInfo = session?.user || userState?.userInfo;

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(
    existingReview?.reviewText || ""
  );

  const isEditing = useMemo(
    () => Boolean(existingReview && existingReview._id),
    [existingReview]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      return notifyError("Please login to write a review.");
    }
    if (!rating) {
      return notifyError("Please select a star rating.");
    }
    if (!reviewText || reviewText.trim().length < 5) {
      return notifyError("Review text must be at least 5 characters.");
    }

    try {
      await onSubmitReview({
        productId,
        rating,
        reviewText: reviewText.trim(),
      });
      notifySuccess(
        isEditing ? "Review updated successfully." : "Review added successfully."
      );
    } catch (err) {
      // Error is already surfaced via toast in caller when possible
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
        {isEditing ? "Update your review" : "Rate and review this product"}
      </h3>
      <p className="text-xs md:text-sm text-gray-500 mb-3">
        Only customers who have actually purchased this product will be marked
        as <span className="font-semibold">Verified Buyer</span>.
      </p>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <StarSelector
              value={rating}
              onChange={setRating}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              placeholder="Share your experience with this product..."
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-white bg-store-600 rounded-md hover:bg-store-700 disabled:opacity-60"
            >
              {isSubmitting
                ? "Submitting..."
                : isEditing
                ? "Update Review"
                : "Submit Review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-sm text-gray-600">
          Please{" "}
          <a
            href="/auth/login"
            className="text-store-600 hover:text-store-700 font-semibold"
          >
            login
          </a>{" "}
          to write a review.
        </div>
      )}
    </div>
  );
};

export default WriteReviewForm;



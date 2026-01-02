import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiFileText, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import PrescriptionServices from "@services/PrescriptionServices";

const PrescriptionStatus = ({ userId }) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["prescriptions", userId],
    queryFn: async () => {
      const response = await PrescriptionServices.getUserPrescriptions(userId);
      return response;
    },
    enabled: !!userId,
  });

  // Extract prescriptions array from response
  const prescriptions = data?.prescriptions || [];
  
  // Get the latest prescription
  const latestPrescription = prescriptions.length > 0 ? prescriptions[0] : null;

  // Don't render if no userId or still loading
  if (!userId || isLoading) {
    return null;
  }

  // Don't render if there's an error
  if (error) {
    console.error("PrescriptionStatus error:", error);
    return null;
  }

  // Don't render if no prescriptions
  if (!latestPrescription) {
    return null;
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          message: "Doctor is reviewing your prescription",
          icon: FiClock,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          iconColor: "text-yellow-600",
        };
      case "processed":
        return {
          message: "Your prescription has been processed",
          icon: FiCheckCircle,
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          iconColor: "text-green-600",
        };
      case "rejected":
        return {
          message: "Your prescription was rejected",
          icon: FiXCircle,
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          iconColor: "text-red-600",
        };
      default:
        return {
          message: "Prescription status unknown",
          icon: FiFileText,
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          iconColor: "text-gray-600",
        };
    }
  };

  const statusConfig = getStatusConfig(latestPrescription.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`mb-8 p-4 rounded-lg border ${statusConfig.bgColor} border-gray-200`}>
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center p-3 rounded-full h-12 w-12 ${statusConfig.iconColor} bg-white mr-4`}
        >
          <StatusIcon className="text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold font-serif text-gray-800 mb-1">
            Prescription Status
          </h3>
          <p className={`text-sm font-medium ${statusConfig.textColor}`}>
            {statusConfig.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionStatus;


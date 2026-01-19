import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiUser } from "react-icons/fi";
import PrescriptionServices from "@services/PrescriptionServices";
import useGetSetting from "@hooks/useGetSetting";
import { getPalette } from "@utils/themeColors";
import dayjs from "dayjs";

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

  const { storeCustomizationSetting } = useGetSetting();
  const storeColor = storeCustomizationSetting?.theme?.color || "green";
  const palette = getPalette(storeColor);

  // Extract prescriptions array from response
  const prescriptions = data?.prescriptions || [];
  
  // Get the latest prescription (or all recent ones)
  const recentPrescriptions = prescriptions.slice(0, 2); // Show latest 2

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
  if (prescriptions.length === 0) {
    return null;
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          message: "Doctor is reviewing your prescription",
          subMessage: "We'll notify you once it's reviewed",
          icon: FiClock,
          bgGradient: "from-amber-50 to-orange-50",
          borderColor: "border-amber-300",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          textColor: "text-amber-800",
          statusBadge: "bg-amber-500",
          pulse: true,
        };
      case "processed":
        return {
          message: "Your prescription has been processed",
          subMessage: "Medicines are ready for delivery",
          icon: FiCheckCircle,
          bgGradient: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          textColor: "text-green-800",
          statusBadge: "bg-green-500",
          statusBadgeColor: "#006E44",
          pulse: false,
        };
      case "rejected":
        return {
          message: "Your prescription was rejected",
          subMessage: "Please contact support for assistance",
          icon: FiXCircle,
          bgGradient: "from-red-50 to-rose-50",
          borderColor: "border-red-300",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          textColor: "text-red-800",
          statusBadge: "bg-red-500",
          pulse: false,
        };
      default:
        return {
          message: "Prescription status unknown",
          subMessage: "Please check with support",
          icon: FiFileText,
          bgGradient: "from-gray-50 to-slate-50",
          borderColor: "border-gray-300",
          iconBg: "bg-gray-100",
          iconColor: "text-gray-600",
          textColor: "text-gray-800",
          statusBadge: "bg-gray-500",
          pulse: false,
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return dayjs(date).format("MMM DD, YYYY");
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Prescription Status</h2>
        {prescriptions.length > 1 && (
          <span className="text-sm text-gray-500">Showing {recentPrescriptions.length} of {prescriptions.length}</span>
        )}
      </div>

      {recentPrescriptions.map((prescription, index) => {
        const statusConfig = getStatusConfig(prescription.status);
        const StatusIcon = statusConfig.icon;

        return (
          <div
            key={prescription._id || index}
            className={`relative overflow-hidden rounded-2xl border-2 ${statusConfig.borderColor} bg-gradient-to-br ${statusConfig.bgGradient} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            {/* Status Badge */}
            <div 
              className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}
              style={{ backgroundColor: statusConfig.statusBadgeColor || undefined }}
            >
              {prescription.status}
            </div>

            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, ${palette[500]} 0%, transparent 50%),
                                 radial-gradient(circle at 80% 80%, ${palette[400]} 0%, transparent 50%)`,
              }}></div>
            </div>

            <div className="relative p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Icon Section */}
                <div className={`relative flex-shrink-0 ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
                  <div className={`p-4 rounded-2xl ${statusConfig.iconBg} shadow-md`}>
                    <StatusIcon className={`text-3xl ${statusConfig.iconColor}`} />
                  </div>
                  {statusConfig.pulse && (
                    <div className={`absolute inset-0 rounded-2xl ${statusConfig.iconBg} animate-ping opacity-20`}></div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-lg font-bold ${statusConfig.textColor}`}>
                      {statusConfig.message}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {statusConfig.subMessage}
                  </p>

                  {/* Prescription Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-white border-opacity-30">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FiCalendar className="text-gray-500" />
                      <span className="font-medium">Submitted:</span>
                      <span>{formatDate(prescription.createdAt)}</span>
                    </div>
                    {prescription.updatedAt && prescription.updatedAt !== prescription.createdAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FiClock className="text-gray-500" />
                        <span className="font-medium">Updated:</span>
                        <span>{formatDate(prescription.updatedAt)}</span>
                      </div>
                    )}
                    {prescription.prescriptionNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FiFileText className="text-gray-500" />
                        <span className="font-medium">Prescription #:</span>
                        <span className="font-mono">{prescription.prescriptionNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrescriptionStatus;


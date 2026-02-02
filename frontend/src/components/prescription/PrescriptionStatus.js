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
  const showStatusCards = false;

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

  const renderStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "processed") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          PROCESSED
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
          REJECTED
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
        PENDING
      </span>
    );
  };

  return (
    <div className="mb-8 space-y-4">
      {showStatusCards && (
        <>
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
        </>
      )}

      <div className="max-w-screen-2xl mx-auto pt-2">
        <div className="rounded-md font-serif">
          <div className="flex flex-col">
            <h3 className="text-lg font-serif font-medium mb-5">Prescription Details</h3>
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="align-middle inline-block border border-gray-100 rounded-md min-w-full pb-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden border-b last:border-b-0 border-gray-100 rounded-md">
                  <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="bg-gray-100">
                        <th
                          scope="col"
                          className="text-left text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          Submitted
                        </th>
                        <th
                          scope="col"
                          className="text-center text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="text-left text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          Files
                        </th>
                        <th
                          scope="col"
                          className="text-left text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          Notes
                        </th>
                        <th
                          scope="col"
                          className="text-right text-xs font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {prescriptions.map((p) => {
                        const shortId = p?._id
                          ? String(p._id).slice(-4).toUpperCase()
                          : "";
                        const files = Array.isArray(p?.files) ? p.files : [];

                        return (
                          <tr key={p?._id || `${p?.createdAt}-${shortId}`}
                          >
                            <td className="px-6 py-3 whitespace-nowrap text-left text-sm">
                              <span className="font-semibold uppercase text-xs">
                                {shortId}
                              </span>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-center text-sm text-gray-600">
                              {formatDate(p?.createdAt)}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-center text-sm">
                              {renderStatusBadge(p?.status)}
                            </td>
                            <td className="px-6 py-3 text-left text-sm">
                              {files.length === 0 ? (
                                <span className="text-gray-500">N/A</span>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {files.slice(0, 4).map((f, idx) => (
                                    <a
                                      key={`${p?._id || "p"}-${idx}`}
                                      href={f?.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-2 py-1 text-xs rounded-full bg-store-100 text-store-600 hover:bg-store-500 hover:text-white transition-all font-semibold"
                                    >
                                      {String(f?.type || "file").toUpperCase()} {idx + 1}
                                    </a>
                                  ))}
                                  {files.length > 4 && (
                                    <span className="text-xs text-gray-500">
                                      +{files.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-3 text-left text-sm text-gray-600">
                              {p?.notes ? (
                                <span className="line-clamp-2">{p.notes}</span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-right text-sm">
                              {files?.[0]?.url ? (
                                <a
                                  href={files[0].url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1 bg-store-100 text-xs text-store-600 hover:bg-store-500 hover:text-white transition-all font-semibold rounded-full"
                                >
                                  View
                                </a>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionStatus;


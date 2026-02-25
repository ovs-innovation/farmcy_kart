import { TableBody, TableCell, TableRow, Badge } from "@windmill/react-ui";
import dayjs from "dayjs";
import React, { useState } from "react";
import { FiZoomIn, FiCheck, FiX, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";

import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import Tooltip from "@/components/tooltip/Tooltip";
import WholesalerDrawer from "@/components/drawer/WholesalerDrawer";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import CustomerServices from "@/services/CustomerServices";
import { notifySuccess, notifyError } from "@/utils/toast";

/* ── Status pill component ── */
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-100 text-amber-800 border border-amber-300",
    approved: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    rejected: "bg-red-100 text-red-800 border border-red-300",
  };
  const labels = { pending: "Pending", approved: "Approved", rejected: "Rejected" };
  const icons = {
    pending: <FiClock className="inline mr-1 text-amber-600" size={11} />,
    approved: <FiCheck className="inline mr-1 text-emerald-600" size={11} />,
    rejected: <FiX className="inline mr-1 text-red-600" size={11} />,
  };
  const s = status || "pending";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${styles[s]}`}>
      {icons[s]}
      {labels[s]}
    </span>
  );
};

const WholesalerTable = ({ wholesalers: initialWholesalers, onStatusChange }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const [wholesalers, setWholesalers] = useState(initialWholesalers || []);
  const [loadingId, setLoadingId] = useState(null);

  // Keep local list in sync if parent passes updated prop
  React.useEffect(() => {
    setWholesalers(initialWholesalers || []);
  }, [initialWholesalers]);

  const handleStatusChange = async (id, newStatus) => {
    setLoadingId(id);
    try {
      await CustomerServices.updateWholesalerStatus(id, newStatus);
      // Optimistic update
      setWholesalers((prev) =>
        prev.map((w) => (w._id === id ? { ...w, wholesalerStatus: newStatus } : w))
      );
      notifySuccess(
        newStatus === "approved"
          ? "Wholesaler approved! They can now login."
          : "Wholesaler application rejected."
      );
      if (onStatusChange) onStatusChange(id, newStatus);
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      <MainDrawer>
        <WholesalerDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {wholesalers?.map((user) => {
          const status = user.wholesalerStatus || "pending";
          const isLoading = loadingId === user._id;

          return (
            <TableRow key={user._id}>
              {/* ID */}
              <TableCell>
                <span className="font-semibold uppercase text-xs">
                  {user?._id?.substring(20, 24)}
                </span>
              </TableCell>

              {/* Date */}
              <TableCell>
                <span className="text-sm">{dayjs(user.createdAt).format("MMM D, YYYY")}</span>
              </TableCell>

              {/* Name */}
              <TableCell>
                <span className="text-sm">{user.name}</span>
              </TableCell>

              {/* Email */}
              <TableCell>
                <span className="text-sm">{user.email}</span>
              </TableCell>

              {/* Phone */}
              <TableCell>
                <span className="text-sm font-medium">{user.phone}</span>
              </TableCell>

              {/* Aadhar */}
              <TableCell>
                <div className="text-sm">
                  {user.aadhar ? (
                    <a className="underline text-store-600" target="_blank" rel="noreferrer" href={user.aadhar}>
                      View
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
              </TableCell>

              {/* PAN */}
              <TableCell>
                <div className="text-sm">
                  {user.pan ? (
                    <a className="underline text-store-600" target="_blank" rel="noreferrer" href={user.pan}>
                      View
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
              </TableCell>

              {/* GST */}
              <TableCell>
                <div className="text-sm">
                  {user.gst ? (
                    <a className="underline text-store-600" target="_blank" rel="noreferrer" href={user.gst}>
                      View
                    </a>
                  ) : user.gstNotRequired ? (
                    <span className="text-xs text-gray-500">N/A</span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
              </TableCell>

              {/* Drug License */}
              <TableCell>
                <div className="text-sm">
                  {user.drugLicense ? (
                    <a className="underline text-store-600" target="_blank" rel="noreferrer" href={user.drugLicense}>
                      View
                    </a>
                  ) : user.drugLicenseNotRequired ? (
                    <span className="text-xs text-gray-500">N/A</span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
              </TableCell>

              {/* ── STATUS COLUMN ── */}
              <TableCell>
                <div className="flex flex-col items-start gap-2 min-w-[140px]">
                  <StatusBadge status={status} />

                  {isLoading ? (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="animate-spin h-3 w-3 text-gray-500" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Updating…
                    </span>
                  ) : (
                    <div className="flex gap-1">
                      {status !== "approved" && (
                        <button
                          onClick={() => handleStatusChange(user._id, "approved")}
                          className="flex items-center gap-0.5 px-2 py-1 text-[11px] font-semibold
                            bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                          title="Approve wholesaler"
                        >
                          <FiCheck size={10} />
                          Approve
                        </button>
                      )}
                      {status !== "rejected" && (
                        <button
                          onClick={() => handleStatusChange(user._id, "rejected")}
                          className="flex items-center gap-0.5 px-2 py-1 text-[11px] font-semibold
                            bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                          title="Reject wholesaler"
                        >
                          <FiX size={10} />
                          Reject
                        </button>
                      )}
                      {status !== "pending" && (
                        <button
                          onClick={() => handleStatusChange(user._id, "pending")}
                          className="flex items-center gap-0.5 px-2 py-1 text-[11px] font-semibold
                            bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors"
                          title="Reset to pending"
                        >
                          <FiClock size={10} />
                          Pending
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex justify-end text-right">
                  <div className="p-2 cursor-pointer text-gray-400 hover:text-store-600">
                    <Link to={`/customer-order/${user._id}`}>
                      <Tooltip id="view" Icon={FiZoomIn} title={"View Orders"} bgColor="#34D399" />
                    </Link>
                  </div>

                  <EditDeleteButton
                    title={user.name}
                    id={user._id}
                    handleUpdate={handleUpdate}
                    handleModalOpen={handleModalOpen}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </>
  );
};

export default WholesalerTable;

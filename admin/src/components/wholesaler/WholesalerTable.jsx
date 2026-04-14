import { TableBody, TableCell, TableRow, Badge, Avatar } from "@windmill/react-ui";
import dayjs from "dayjs";
import React, { useState, useContext } from "react";
import { FiZoomIn, FiCheck, FiX, FiClock, FiShield, FiFileText, FiEye, FiDownload, FiTrash2, FiEdit, FiShoppingCart, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import Tooltip from "@/components/tooltip/Tooltip";
import WholesalerDrawer from "@/components/drawer/WholesalerDrawer";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import CustomerServices from "@/services/CustomerServices";
import { SidebarContext } from "@/context/SidebarContext";

/* ── Status pill component ── */
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-100 text-amber-800 border-amber-300",
    approved: "bg-emerald-100 text-emerald-800 border-emerald-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
  };
  const labels = { pending: "Pending", approved: "Approved", rejected: "Rejected" };
  const icons = {
    pending: <FiClock className="inline mr-1 text-amber-600" size={11} />,
    approved: <FiCheck className="inline mr-1 text-emerald-600" size={11} />,
    rejected: <FiX className="inline mr-1 text-red-600" size={11} />,
  };
  const s = status || "pending";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${styles[s]}`}>
      {icons[s]}
      {labels[s]}
    </span>
  );
};

const DocButton = ({ url, label, fallback }) => {
  if (!url) return <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{fallback || 'No Doc'}</span>;
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noreferrer"
      className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group"
      title={`View ${label}`}
    >
      <FiEye size={12} className="group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-bold uppercase">{label}</span>
    </a>
  );
};

const WholesalerTable = ({ wholesalers: initialWholesalers, onStatusChange }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const { showAlert } = useContext(SidebarContext);
  const [wholesalers, setWholesalers] = useState(initialWholesalers || []);
  const [loadingId, setLoadingId] = useState(null);

  React.useEffect(() => {
    setWholesalers(initialWholesalers || []);
  }, [initialWholesalers]);

  const handleStatusChange = async (id, newStatus) => {
    setLoadingId(id);
    try {
      await CustomerServices.updateWholesalerStatus(id, newStatus);
      setWholesalers((prev) =>
        prev.map((w) => (w._id === id ? { ...w, wholesalerStatus: newStatus } : w))
      );
      showAlert(
        newStatus === "approved"
          ? "Retailer approved successfully!"
          : newStatus === "rejected"
          ? "Retailer application rejected."
          : "Retailer status moved to pending."
      , "success");
      if (onStatusChange) onStatusChange(id, newStatus);
    } catch (err) {
      showAlert(err?.response?.data?.message || "Failed to update status", "error");
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

      <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
        {wholesalers?.map((user) => {
          const status = user.wholesalerStatus || "pending";
          const isLoading = loadingId === user._id;

          return (
            <TableRow key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors group">
              <TableCell className="py-4 pl-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                    <FiShield size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {user.name.substring(0, 15)}{user.name.length > 15 ? '...' : ''}
                    </h2>
                    <div className="text-[11px] text-gray-400 font-medium font-mono uppercase">
                      ID: {user?._id?.substring(18, 24)}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {dayjs(user.createdAt).format("MMM D, YYYY")}
                </div>
              </TableCell>

              <TableCell className="py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.email}</span>
                  <span className="text-xs text-gray-500 font-bold">{user.phone || 'NO PHONE'}</span>
                </div>
              </TableCell>

              <TableCell className="py-4">
                <div className="grid grid-cols-2 gap-2 max-w-[180px] mx-auto">
                  <DocButton url={user.aadhar} label="Aadhar" />
                  <DocButton url={user.pan} label="PAN" />
                  <DocButton url={user.gst} label="GST" fallback={user.gstNotRequired ? 'N/A' : null} />
                  <DocButton url={user.drugLicense} label="Drugs" fallback={user.drugLicenseNotRequired ? 'N/A' : null} />
                </div>
              </TableCell>

              <TableCell className="py-4 text-center">
                <div className="flex flex-col items-center gap-3">
                              {isLoading ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 animate-pulse">
                        <div className="w-3 h-3 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Applying...</span>
                    </div>
                  ) : (
                    <div className="relative group/sel">
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                        className={`appearance-none bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 pr-10 text-[11px] font-black uppercase tracking-wider focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer outline-none shadow-sm ${
                          status === "approved" ? "text-emerald-600" : status === "rejected" ? "text-red-500" : "text-amber-500"
                        }`}
                      >
                        <option value="pending" className="text-amber-600 font-bold">Pending</option>
                        <option value="approved" className="text-emerald-600 font-bold">Approved</option>
                        <option value="rejected" className="text-red-600 font-bold">Rejected</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover/sel:text-emerald-500 transition-colors pointer-events-none" size={12} />
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell className="py-4 pr-6">
                <div className="flex justify-end items-center gap-2">
                   <Link to={`/customer-order/${user._id}`}>
                     <div className="p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-500 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
                      <FiShoppingCart size={18} />
                     </div>
                   </Link>
                   
                   <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-500 shadow-sm overflow-hidden flex divide-x divide-gray-100 dark:divide-gray-600">
                     <EditDeleteButton
                        title={user.name}
                        id={user._id}
                        handleUpdate={handleUpdate}
                        handleModalOpen={handleModalOpen}
                      />
                   </div>
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

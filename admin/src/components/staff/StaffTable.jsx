import { Avatar, TableBody, TableCell, TableRow, Badge } from "@windmill/react-ui";
import React, { useState } from "react";
import { FiZoomIn, FiMail, FiPhone, FiCalendar, FiShield, FiToggleLeft } from "react-icons/fi";

//internal import
import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import Tooltip from "@/components/tooltip/Tooltip";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";
import AccessListModal from "@/components/modal/AccessListModal";

const StaffTable = ({ staffs, lang }) => {
  const {
    title,
    serviceId,
    handleModalOpen,
    handleUpdate,
    isSubmitting,
    handleResetPassword,
  } = useToggleDrawer();

  const { showDateFormat, showingTranslateValue } = useUtilsFunction();
  // State for access list modal
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  // Function to open the access list modal
  const handleAccessModalOpen = (staff) => {
    setSelectedStaff(staff);
    setIsAccessModalOpen(true);
  };

  // Function to close the access list modal
  const handleAccessModalClose = () => {
    setSelectedStaff(null);
    setIsAccessModalOpen(false);
  };

  return (
    <>
      <DeleteModal id={serviceId} title={title} />
      {/* Access List Modal */}
      {isAccessModalOpen && (
        <AccessListModal
          staff={selectedStaff}
          isOpen={isAccessModalOpen}
          onClose={handleAccessModalClose}
          showingTranslateValue={showingTranslateValue}
        />
      )}

      <MainDrawer>
        <StaffDrawer id={serviceId} />
      </MainDrawer>

      <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
        {staffs?.map((staff) => (
          <TableRow key={staff._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors group">
            <TableCell className="py-4 pl-6">
              <div className="flex items-center gap-3">
                <Avatar
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 dark:border-gray-700 shadow-sm group-hover:scale-110 transition-transform"
                  src={staff.image}
                  alt="staff"
                />
                <div>
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {showingTranslateValue(staff?.name)}
                  </h2>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                    <FiShield size={10} className="text-teal-500" />
                    <span>User ID: {staff?._id?.substring(18, 24)}</span>
                  </div>
                </div>
              </div>
            </TableCell>

            <TableCell className="py-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FiMail className="text-gray-400" size={14} />
                <span className="text-sm">{staff.email}</span>
              </div>
            </TableCell>

            <TableCell className="py-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FiPhone className="text-gray-400" size={14} />
                <span className="text-sm font-medium">{staff.phone || 'N/A'}</span>
              </div>
            </TableCell>

            <TableCell className="py-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <FiCalendar className="text-gray-400" size={14} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {showDateFormat(staff.joiningData)}
                </span>
              </div>
            </TableCell>

            <TableCell className="py-4 text-center">
              <Badge 
                type={staff?.role === 'Admin' || staff?.role === 'Super Admin' ? 'success' : 'warning'}
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"
              >
                {staff?.role}
              </Badge>
            </TableCell>

            <TableCell className="py-4 text-center">
              <Status status={staff.status} />
            </TableCell>

            <TableCell className="py-4 text-center">
              <div className="flex justify-center group/toggle">
                <ActiveInActiveButton
                  id={staff?._id}
                  staff={staff}
                  option="staff"
                  status={staff.status}
                />
              </div>
            </TableCell>

            <TableCell className="py-4 pr-6">
              <div className="flex justify-end items-center gap-2">
                <button
                  onClick={() => handleAccessModalOpen(staff)}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all shadow-sm"
                >
                  <Tooltip
                    id="view"
                    Icon={FiZoomIn}
                    title="View Access Route"
                    bgColor="#059669"
                  />
                </button>
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden flex divide-x divide-gray-100 dark:divide-gray-600">
                  <EditDeleteButton
                    id={staff._id}
                    staff={staff}
                    isSubmitting={isSubmitting}
                    handleUpdate={handleUpdate}
                    handleModalOpen={handleModalOpen}
                    handleResetPassword={handleResetPassword}
                    title={showingTranslateValue(staff?.name)}
                  />
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default StaffTable;

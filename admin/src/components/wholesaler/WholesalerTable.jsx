import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import dayjs from "dayjs";
import React from "react";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";

import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import Tooltip from "@/components/tooltip/Tooltip";
import WholesalerDrawer from "@/components/drawer/WholesalerDrawer";
import EditDeleteButton from "@/components/table/EditDeleteButton";

const WholesalerTable = ({ wholesalers }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      <MainDrawer>
        <WholesalerDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {wholesalers?.map((user) => (
          <TableRow key={user._id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs"> {user?._id?.substring(20, 24)}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{dayjs(user.createdAt).format("MMM D, YYYY")}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.name}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.email}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium">{user.phone}</span>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {user.aadhar ? (
                  <a className="underline text-store-600" target="_blank" rel="noreferrer" href={user.aadhar}>View</a>
                ) : (
                  <span className="text-xs text-gray-400">No</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {user.pan ? (
                  <a className="underline text-store-600" target="_blank" rel="noreferrer" href={user.pan}>View</a>
                ) : (
                  <span className="text-xs text-gray-400">No</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {user.gst ? (
                  <a className="underline text-store-600" target="_blank" rel="noreferrer" href={user.gst}>View</a>
                ) : user.gstNotRequired ? (
                  <span className="text-xs text-gray-500">N/A</span>
                ) : (
                  <span className="text-xs text-gray-400">No</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {user.drugLicense ? (
                  <a className="underline text-store-600" target="_blank" rel="noreferrer" href={user.drugLicense}>View</a>
                ) : user.drugLicenseNotRequired ? (
                  <span className="text-xs text-gray-500">N/A</span>
                ) : (
                  <span className="text-xs text-gray-400">No</span>
                )}
              </div>
            </TableCell>

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
        ))}
      </TableBody>
    </>
  );
};

export default WholesalerTable;

import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

//internal import
import useUtilsFunction from "@/hooks/useUtilsFunction";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import AttributeDrawer from "@/components/drawer/AttributeDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";

const AttributeTable = ({ attributes, isCheck, setIsCheck }) => {
  const { title, serviceId, handleUpdate, handleModalOpen } = useToggleDrawer();
  const { showingTranslateValue } = useUtilsFunction();

  return (
    <>
      <DeleteModal id={serviceId} title={title} />
      
      <MainDrawer>
        <AttributeDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {attributes?.map((attribute, index) => (
          <TableRow key={attribute._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-700">
            <TableCell className="px-6 py-4 text-sm text-gray-500 w-24">
              {index + 1}
            </TableCell>
            <TableCell className="px-6 py-4 text-sm text-gray-500 w-32">
              {attribute?._id?.substring(20, 24)}
            </TableCell>
            <TableCell className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              {showingTranslateValue(attribute.name) || showingTranslateValue(attribute.title)}
            </TableCell>
            <TableCell className="px-6 py-4 w-32 text-center">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleUpdate(attribute._id)}
                  className="p-1.5 flex items-center justify-center rounded border border-teal-500 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors outline-none cursor-pointer"
                >
                  <FiEdit size={16} />
                </button>
                <button
                  onClick={() => handleModalOpen(attribute._id, showingTranslateValue(attribute.name))}
                  className="p-1.5 flex items-center justify-center rounded border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors outline-none cursor-pointer"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default AttributeTable;

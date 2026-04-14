import { TableBody, TableCell, TableRow, Select } from "@windmill/react-ui";
import { FiEdit, FiTrash2, FiCheck, FiSearch } from "react-icons/fi";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";

//internal import
import ShowHideButton from "@/components/table/ShowHideButton";
import FeaturedButton from "@/components/table/FeaturedButton";
import { SidebarContext } from "@/context/SidebarContext";
import CategoryServices from "@/services/CategoryServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const CategoryTable = ({
  categories,
  lang,
  handleUpdate,
  handleModalOpen,
  isSubCategory,
}) => {
  const { setIsUpdate } = useContext(SidebarContext);
  
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (msg, type = "success") => {
    setAlert({ show: true, message: msg, type: type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3500);
  };

  const handlePriorityChange = async (id, priority) => {
    try {
      const res = await CategoryServices.updateCategory(id, { priority });
      setIsUpdate(true);
      showAlert(res.message, "success");
    } catch (err) {
      showAlert(err ? err?.response?.data?.message : err?.message, "error");
    }
  };

  return (
    <>
      <TableBody>
        {categories?.map((category, i) => (
          <TableRow key={category._id} className="text-gray-600 dark:text-gray-300 border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
            <TableCell className="text-xs font-semibold">{i + 1}</TableCell>
            <TableCell className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              {category._id.substring(category._id.length - 3)}
            </TableCell>
            
            {isSubCategory ? (
                <>
                    <TableCell className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        {category.parentName || "Main Category"}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                        {category.name[lang] || category.name["en"] || category.name["default"]}
                    </TableCell>
                </>
            ) : (
                <>
                  <TableCell className="text-center">
                    {category.icon ? (
                      <div className="flex justify-center items-center">
                        <img 
                          src={category.icon} 
                          alt="icon" 
                          className="w-10 h-10 object-cover rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-1 shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 mx-auto bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 text-xs shadow-sm shadow-inner">
                        Img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      {category.name[lang] || category.name["en"] || category.name["default"] || "Untitled"}
                  </TableCell>
                </>
            )}

            <TableCell>
              <ShowHideButton
                id={category._id}
                category
                status={category.status}
              />
            </TableCell>
            <TableCell>
              <FeaturedButton 
                id={category._id} 
                featured={category.featured} 
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Select
                  className={`text-[11px] font-bold h-8 rounded-lg border-0 ring-1 ring-gray-100 dark:ring-gray-700 px-3 w-28 cursor-pointer focus:ring-teal-500 transition-all appearance-none
                    ${category.priority === 'High' ? 'text-red-600 bg-red-50 dark:bg-red-900/30 ring-red-100 dark:ring-red-900' : 
                      category.priority === 'Medium' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 ring-blue-100 dark:ring-blue-900' : 
                      'text-teal-600 bg-teal-50 dark:bg-teal-900/30 ring-teal-100 dark:ring-teal-900'}`}
                  value={category.priority || "Normal"}
                  onChange={(e) => handlePriorityChange(category._id, e.target.value)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </Select>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUpdate(category._id)}
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all border border-blue-50 dark:border-blue-900/30"
                >
                  <FiEdit size={16} />
                </button>
                <button
                  onClick={() => handleModalOpen(category._id, category.name[lang] || category.name["en"])}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all border border-red-50 dark:border-red-900/30 hover:rotate-6 shadow-sm"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* Custom Professional Notification Banner */}
      {alert.show && createPortal(
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[9999] max-w-sm w-full px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-4 border backdrop-blur-md animate-in slide-in-from-top-10 duration-500 ${alert.type === 'success' ? 'bg-teal-600/95 border-teal-500 text-white' : 'bg-red-600/95 border-red-500 text-white'}`}>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
             {alert.type === 'success' ? <FiCheck size={20} /> : <FiSearch size={20} />}
          </div>
          <div className="flex-1 text-left">
             <p className="font-extrabold text-[15px]">{alert.type === 'success' ? 'Success ✓' : 'Action Required'}</p>
             <p className="text-[13px] opacity-90 font-medium">{alert.message}</p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CategoryTable;

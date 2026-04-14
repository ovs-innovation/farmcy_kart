import { useContext, useState } from "react";
import Switch from "react-switch";
import { FiCheck, FiSearch } from "react-icons/fi";
import { createPortal } from "react-dom";
import { SidebarContext } from "@/context/SidebarContext";
import CategoryServices from "@/services/CategoryServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const FeaturedButton = ({ id, featured }) => {
  const { setIsUpdate } = useContext(SidebarContext);
  const [checked, setChecked] = useState(featured || false);

  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (msg, type = "success") => {
    setAlert({ show: true, message: msg, type: type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3500);
  };

  const handleChange = async (val) => {
    try {
      setChecked(val);
      const res = await CategoryServices.updateFeatured(id, { featured: val });
      setIsUpdate(true);
      showAlert(res.message, val === false ? "disable" : "success");
    } catch (err) {
      showAlert(err ? err?.response?.data?.message : err?.message, "error");
    }
  };

  return (
    <>
      <Switch
        onChange={handleChange}
        checked={checked}
        className="react-switch"
        uncheckedIcon={false}
        checkedIcon={false}
        height={22}
        width={45}
        handleDiameter={18}
        onColor="#0e7670"
        offColor="#e5e7eb"
      />
      {/* Custom Professional Notification Banner */}
      {alert.show && createPortal(
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[9999] max-w-sm w-full px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-4 border backdrop-blur-md animate-in slide-in-from-top-10 duration-500 ${alert.type === 'success' ? 'bg-teal-600/95 border-teal-500 text-white' : alert.type === 'disable' ? 'bg-amber-600/95 border-amber-500 text-white' : 'bg-red-600/95 border-red-500 text-white'}`}>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
             {alert.type === 'success' ? <FiCheck size={20} /> : <FiSearch size={20} />}
          </div>
          <div className="flex-1 text-left">
             <p className="font-extrabold text-[15px]">{alert.type === 'success' ? 'Success ✓' : alert.type === 'disable' ? 'Disabled \u26A0' : 'Action Required'}</p>
             <p className="text-[13px] opacity-90 font-medium">{alert.message}</p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default FeaturedButton;

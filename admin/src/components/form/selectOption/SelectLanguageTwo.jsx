import React, { useContext } from "react";
import { FiChevronDown, FiGlobe } from "react-icons/fi";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const SelectLanguageTwo = ({ handleSelectLanguage, register }) => {
  const { languages, langError, langLoading } = useUtilsFunction();
  const { lang } = useContext(SidebarContext);

  return (
    <div className="relative inline-flex items-center">
      <div className="absolute left-1 flex items-center pointer-events-none text-gray-500">
        <FiGlobe className="text-lg" />
      </div>
      
      <select
        name="language"
        {...register(`language`, {
          required: `language is required!`,
        })}
        onChange={(e) => handleSelectLanguage(e.target.value)}
        className="appearance-none block w-[110px] h-11 pl-10 pr-10 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 cursor-pointer"
      >
        <option value={lang} defaultChecked hidden>
          {lang}
        </option>
        {!langError &&
          !langLoading &&
          languages?.map((l) => (
            <option key={l._id} value={l.iso_code}>
              {l.iso_code}
            </option>
          ))}
      </select>
      
      <div className="absolute right-1 flex items-center pointer-events-none text-gray-400">
        <FiChevronDown className="text-lg" />
      </div>
    </div>
  );
};

export default SelectLanguageTwo;

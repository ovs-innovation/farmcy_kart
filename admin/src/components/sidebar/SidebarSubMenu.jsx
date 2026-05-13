import React, { useState } from "react";
import { NavLink, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoRemoveSharp,
} from "react-icons/io5";

const SidebarSubMenu = ({ route }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <li className="relative px-6 py-3" key={route.name}>
        <button
          className="inline-flex items-center justify-between focus:outline-none w-full text-sm font-semibold transition-colors duration-150 text-gray-500 dark:text-[#9fb1b1] hover:text-emerald-500 dark:hover:text-white"
          onClick={() => setOpen(!open)}
          aria-haspopup="true"
        >
          <span className="inline-flex items-center">
            <route.icon className="w-5 h-5" aria-hidden="true" />
            <span className="ml-4 mt-1">{t(`${route.name}`)}</span>
          </span>
          <span className="mt-1">
            {open ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
          </span>
        </button>
        {open && route.routes && (
          <ul
            className="mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 dark:text-gray-400"
            aria-label="submenu"
          >
            {route.routes.map((child, index) => (
              <li key={index} className="pl-4">
                {child.outside ? (
                  <a
                    href={child.path}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center py-1 text-sm transition-colors duration-150 hover:text-green-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></span>
                    <span>{t(`${child.name}`)}</span>
                  </a>
                ) : (
                  <NavLink
                    to={child.path}
                    className="flex items-center py-1 text-sm transition-colors duration-150 hover:text-emerald-500 dark:hover:text-white"
                    activeClassName="text-emerald-500 dark:text-white"
                    rel="noreferrer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-3"></span>
                    <span>{t(`${child.name}`)}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    </>
  );
};

export default SidebarSubMenu;

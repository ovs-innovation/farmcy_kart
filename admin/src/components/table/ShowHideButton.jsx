import React, { useContext, useState } from "react";
import Switch from "react-switch";
import { useLocation } from "react-router-dom";
import { FiCheck, FiSearch } from "react-icons/fi";
import { createPortal } from "react-dom";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import AttributeServices from "@/services/AttributeServices";
import CategoryServices from "@/services/CategoryServices";
import CouponServices from "@/services/CouponServices";
import CurrencyServices from "@/services/CurrencyServices";
import LanguageServices from "@/services/LanguageServices";
import ProductServices from "@/services/ProductServices";
import BrandServices from "@/services/BrandServices";
import PushNotificationServices from "@/services/PushNotificationServices";


const ShowHideButton = ({ id, status, category, currencyStatusName, service }) => {

  const location = useLocation();
  const { setIsUpdate, showAlert } = useContext(SidebarContext);

  const handleChangeStatus = async (id) => {
    // return notifyError("This option disabled for this option!");
    try {
      let newStatus;
      if (status === "show") {
        newStatus = "hide";
      } else {
        newStatus = "show";
      }

      if (location.pathname === "/push-notification") {
        const res = await PushNotificationServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        showAlert(res.message, newStatus === "hide" ? "disable" : "success");
        return;
      }

      if (location.pathname === "/categories" || category) {

        const res = await CategoryServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        showAlert(res.message, newStatus === "hide" ? "disable" : "success");
      }

      if (location.pathname === "/products") {
        const res = await ProductServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        showAlert(res.message, newStatus === "hide" ? "disable" : "success");
      }

      if (location.pathname === "/languages") {
        const res = await LanguageServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        showAlert(res.message, newStatus === "hide" ? "disable" : "success");
      }
      if (location.pathname === "/currencies") {
        if (currencyStatusName === "status") {
          const res = await CurrencyServices.updateEnabledStatus(id, {
            status: newStatus,
          });
          setIsUpdate(true);
          showAlert(res.message, newStatus === "hide" ? "disable" : "success");
        } else {
          const res = await CurrencyServices.updateLiveExchangeRateStatus(id, {
            live_exchange_rates: newStatus,
          });
          setIsUpdate(true);
          showAlert(res.message, newStatus === "hide" ? "disable" : "success");
        }
      }

      if (location.pathname === "/attributes") {
        const res = await AttributeServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        showAlert(res.message, newStatus === "hide" ? "disable" : "success");
      }

      if (
        location.pathname === `/attributes/${location.pathname.split("/")[2]}`
      ) {
        const res = await AttributeServices.updateChildStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        showAlert(res.message, newStatus === "hide" ? "disable" : "success");
      }

      if (location.pathname === "/coupons") {
        // console.log('coupns',id)
        const res = await CouponServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        showAlert(res.message, newStatus === "hide" ? "disable" : "success");
      }

      if (location.pathname === "/brands") {
        const res = await BrandServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        showAlert(res.message, newStatus === "hide" ? "disable" : "success");
      }

      if (location.pathname === "/our-staff") {
        // console.log('coupns',id)
        const res = await CouponServices.updateStaffStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        showAlert(res.message, newStatus === "hide" ? "disable" : "success");
      }
    } catch (err) {
      showAlert(err ? err?.response?.data?.message : err?.message, "error");
    }
  };

  return (
    <>
      <Switch
        onChange={() => handleChangeStatus(id)}
        checked={status === "show" ? true : false}
        className="react-switch md:ml-0"
        uncheckedIcon={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              width: 120,
              fontSize: 14,
              color: "white",
              paddingRight: 22,
              paddingTop: 1,
            }}
          ></div>
        }
        width={30}
        height={15}
        handleDiameter={13}
        offColor="#E53E3E"
        onColor={"#2F855A"}
        checkedIcon={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 73,
              height: "100%",
              fontSize: 14,
              color: "white",
              paddingLeft: 20,
              paddingTop: 1,
            }}
          ></div>
        }
      />
    </>
  );
};

export default ShowHideButton;

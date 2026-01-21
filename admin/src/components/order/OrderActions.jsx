import { useEffect, useRef, useState } from "react";
import { Button } from "@windmill/react-ui";
import { FiMoreVertical } from "react-icons/fi";

// internal imports
import { notifyError, notifySuccess } from "@/utils/toast";
import ShiprocketServices from "@/services/ShiprocketServices";
import OrderServices from "@/services/OrderServices";
import { Link } from "react-router-dom";

const OrderActions = ({ order }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  const handleDownloadShiprocketInvoice = async () => {
    try {
      const srOrderId = order?.shiprocket?.order_id;
      if (!srOrderId) {
        return notifyError("Shiprocket order ID not found for this order.");
      }
      const res = await ShiprocketServices.downloadInvoice({
        srOrderId,
        orderId: order._id,
      });
      const url =
        res?.data?.invoice_url ||
        res?.data?.url ||
        res?.invoice_url ||
        res?.pdf_url;

      if (!url) {
        return notifyError("No invoice URL returned from Shiprocket.");
      }
      window.open(url, "_blank");
      notifySuccess("Invoice downloaded successfully.");
    } catch (err) {
      notifyError(err?.response?.data?.error || err.message);
    } finally {
      setOpen(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      if (!window.confirm("Are you sure you want to cancel this order?")) {
        return;
      }

      // Try to cancel shipment in Shiprocket (if exists)
      if (order?.shiprocket?.shipment_id) {
        await ShiprocketServices.cancelShipment({
          orderId: order._id,
          shipment_id: order.shiprocket.shipment_id,
        }).catch(() => {});
      }

      await OrderServices.updateOrder(order._id, { status: "Cancel" });
      notifySuccess("Order cancelled.");
    } catch (err) {
      notifyError(err?.response?.data?.error || err.message);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        ref={btnRef}
        onClick={toggleMenu}
        className="p-2 text-gray-500 hover:text-store-600 focus:outline-none"
      >
        <FiMoreVertical />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute z-40 right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md shadow-lg text-sm"
        >
          <Link
            to={`/order/${order._id}`}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 block text-gray-700 dark:text-gray-300"
            onClick={() => setOpen(false)}
          >
            View Invoice
          </Link>
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleDownloadShiprocketInvoice}
          >
            Download Invoice
          </button>
          <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
            onClick={handleCancelOrder}
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderActions;



import {
  Avatar,
  Badge,
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

//internal import
import useUtilsFunction from "@/hooks/useUtilsFunction";
import CheckBox from "@/components/form/others/CheckBox";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import CouponDrawer from "@/components/drawer/CouponDrawer";
import ShowHideButton from "@/components/table/ShowHideButton";
import EditDeleteButton from "@/components/table/EditDeleteButton";

const CouponTable = ({ isCheck, coupons, setIsCheck }) => {
  const [updatedCoupons, setUpdatedCoupons] = useState([]);

  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  const { currency, showDateFormat, globalSetting, showingTranslateValue } =
    useUtilsFunction();

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  useEffect(() => {
    const result = coupons?.map((el) => {
      let newDate;
      try {
        const timeZone = globalSetting?.default_time_zone && globalSetting.default_time_zone.trim() !== "" 
          ? globalSetting.default_time_zone 
          : undefined;
        newDate = new Date(el?.updatedAt).toLocaleString("en-US", 
          timeZone ? { timeZone } : undefined
        );
      } catch (error) {
        // If timezone is invalid, use default locale string without timezone
        newDate = new Date(el?.updatedAt).toLocaleString("en-US");
      }
      const newObj = {
        ...el,
        updatedDate: newDate === "Invalid Date" || !newDate ? "" : newDate,
      };
      return newObj;
    });
    setUpdatedCoupons(result);
  }, [coupons, globalSetting?.default_time_zone]);

  return (
    <>
      {isCheck.length < 1 && <DeleteModal id={serviceId} title={title} />}

      {isCheck.length < 2 && (
        <MainDrawer>
          <CouponDrawer id={serviceId} />
        </MainDrawer>
      )}

      <TableBody>
        {updatedCoupons?.map((coupon, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name={coupon?.title?.en}
                id={coupon._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(coupon._id)}
              />
            </TableCell>

            <TableCell>
              <span className="text-sm">{i + 1}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-medium">
                {showingTranslateValue(coupon?.title)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">{coupon.couponCode}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">{coupon.couponType || "Store wise"}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">{coupon.totalUses || 0}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {currency} {coupon.minimumAmount || 0}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {currency} {coupon.maxDiscount || 0}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-bold">
                {coupon.discountType?.value || 0}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm text-gray-500">
                {coupon.discountType?.type === "percentage" ? "Percent %" : `Amount ${currency}`}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">{showDateFormat(coupon.startTime)}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">{showDateFormat(coupon.endTime)}</span>
            </TableCell>

            <TableCell>
              <ShowHideButton id={coupon._id} status={coupon.status} />
            </TableCell>

            <TableCell className="text-right">
              <EditDeleteButton
                id={coupon?._id}
                isCheck={isCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(coupon?.title)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CouponTable;

import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//internal import
import useUtilsFunction from "./useUtilsFunction";
import { SidebarContext } from "@/context/SidebarContext";
import CouponServices from "@/services/CouponServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import useTranslationValue from "./useTranslationValue";

const useCouponSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [imageUrl, setImageUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [resData, setResData] = useState({});
  const [published, setPublished] = useState(false);
  const [discountType, setDiscountType] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currency } = useUtilsFunction();

  const { handlerTextTranslateHandler } = useTranslationValue();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const title = data?.title; // Extract title from data
      const titleTranslates = await handlerTextTranslateHandler(
        title,
        language,
        resData?.title
      );

      const couponData = {
        title: {
          ...titleTranslates,
          [language]: title,
        },
        couponCode: data?.couponCode,
        couponType: data?.couponType,
        customer: data?.customer,
        limitSameUser: data?.limitSameUser,
        startTime: data?.startTime,
        endTime: data?.endTime,
        minimumAmount: data?.minimumAmount,
        maxDiscount: data?.maxDiscount,
        logo: imageUrl,
        lang: language,
        status: published ? "show" : "hide",
        discountType: {
          type: discountType ? "percentage" : "fixed",
          value: data?.discountPercentage,
        },
        productType: data?.productType,
      };

      // setIsSubmitting(false);
      // return;

      if (id) {
        const res = await CouponServices.updateCoupon(id, couponData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await CouponServices.addCoupon(couponData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
      setIsSubmitting(false);
      closeDrawer();
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("title", resData.title[lang ? lang : "en"]);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("title");
      setValue("productType");
      setValue("couponCode");
      setValue("endTime");
      setValue("startTime");
      setValue("discountPercentage");
      setValue("minimumAmount");
      setValue("couponType");
      setValue("customer");
      setValue("limitSameUser");
      setValue("maxDiscount");
      setImageUrl("");
      setPublished(true);
      setDiscountType(false);
      clearErrors("title");
      clearErrors("productType");
      clearErrors("couponCode");
      clearErrors("endTime");
      clearErrors("startTime");
      clearErrors("discountPercentage");
      clearErrors("minimumAmount");
      clearErrors("couponType");
      clearErrors("customer");
      clearErrors("limitSameUser");
      clearErrors("maxDiscount");
      setLanguage(lang);
      setValue("language", language);
      return;
    }
    if (id) {
      (async () => {
        try {
          const res = await CouponServices.getCouponById(id);
          if (res) {
            // console.log('res coupon', res);
            setResData(res);
            setValue("title", res.title[language ? language : "en"]);
            setValue("productType", res.productType);
            setValue("couponCode", res.couponCode);

            setValue("endTime", dayjs(res.endTime).format("YYYY-MM-DD"));
            setValue("startTime", dayjs(res.startTime).format("YYYY-MM-DD"));
            setValue("discountPercentage", res.discountType?.value);
            setValue("minimumAmount", res.minimumAmount);
            setValue("couponType", res.couponType);
            setValue("customer", res.customer);
            setValue("limitSameUser", res.limitSameUser);
            setValue("maxDiscount", res.maxDiscount);
            setPublished(res.status === "show" ? true : false);
            setDiscountType(
              res.discountType?.type === "percentage" ? true : false
            );
            setImageUrl(res.logo);
          }
        } catch (err) {
          notifyError(err?.response?.data?.message || err?.message);
        }
      })();
    }
  }, [id, setValue, isDrawerOpen, clearErrors, language, lang]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setImageUrl,
    imageUrl,
    published,
    setPublished,
    currency,
    discountType,
    isSubmitting,
    setDiscountType,
    handleSelectLanguage,
    reset,
  };
};

export default useCouponSubmit;

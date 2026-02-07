import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import React, { useEffect, useState, useContext } from "react";

import Label from "@components/form/Label";
import Error from "@components/form/Error";
import Dashboard from "@pages/user/dashboard";
import InputArea from "@components/form/InputArea";
import useGetSetting from "@hooks/useGetSetting";
import CustomerServices from "@services/CustomerServices";
import Uploader from "@components/image-uploader/Uploader";
import { notifySuccess, notifyError } from "@utils/toast";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { UserContext } from "@context/UserContext";

const UpdateProfile = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();
  const { state: userState, dispatch } = useContext(UserContext);

  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const userInfo = userState?.userInfo || session?.user;
  const isPhoneLogin = userInfo?.email?.includes("@farmcykart.com");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!imageUrl && !userInfo?.image) {
      notifyError("Please upload a profile photo before saving.");
      return;
    }

    setLoading(true);

    const userData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      image: imageUrl || userInfo?.image || "",
    };

    try {
      const userId = userInfo?._id || userInfo?.id;
      if (!userId) {
        throw new Error("User ID not found. Please login again.");
      }

      const response = await CustomerServices.updateCustomer(userId, userData);

      const updatedUserInfo = {
        ...userInfo,
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: userData.image,
      };

      Cookies.set("userInfo", JSON.stringify(updatedUserInfo), { expires: 1 });
      dispatch({ type: "USER_LOGIN", payload: updatedUserInfo });

      if (session?.user) {
        update({
          ...session,
          user: {
            ...session.user,
            name: data.name,
            email: data.email,
            phone: data.phone,
            image: userData.image,
          },
        });
      }

      setLoading(false);
      notifySuccess("Profile Updated Successfully! 🎉");
    } catch (error) {
      setLoading(false);
      notifyError(error?.response?.data?.message || error?.message || "Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    if (userInfo) {
      setValue("name", userInfo?.name);
      setValue("email", userInfo?.email);
      setValue("phone", userInfo?.phone);
      setImageUrl(userInfo?.image || "");
    }
  }, [userInfo, setValue]);

  return (
    <Dashboard
      title={showingTranslateValue(
        storeCustomizationSetting?.dashboard?.update_profile
      )}
      description="This is edit profile page"
    >
      <div className="max-w-screen-2xl">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h2 className="text-xl font-serif font-semibold mb-5">
                {showingTranslateValue(
                  storeCustomizationSetting?.dashboard?.update_profile
                )}
              </h2>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="bg-white space-y-6">
              <div>
                <Label label="Photo" />
                <div className="mt-1 flex items-center">
                  <div className="w-full">
                    <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
                    {imageUrl && (
                      <p className="text-xs mt-2 text-center" style={{ color: '#006E44' }}>
                        ✓ Image ready to save
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 sm:mt-0">
              <div className="md:grid-cols-6 md:gap-6">
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="lg:mt-6 mt-4 bg-white">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.full_name
                          )}
                          name="name"
                          type="text"
                          placeholder={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.full_name
                          )}
                        />
                        <Error errorName={errors.name} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.user_phone
                          )}
                          name="phone"
                          type="tel"
                          placeholder={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.user_phone
                          )}
                        />
                        <Error errorName={errors.phone} />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <InputArea
                          register={register}
                          name="email"
                          type="email"
                          readOnly={true}
                          label={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.user_email
                          )}
                          placeholder={showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.user_email
                          )}
                          required={true}
                        />
                        <Error errorName={errors.email} />
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-3 mt-5 text-right">
                      {loading ? (
                        <button
                          disabled={loading}
                          type="submit"
                          className={`md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-store-500 text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-store-600 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto`}
                        >
                          <img
                            src="/loader/spinner.gif"
                            alt="Loading"
                            width={20}
                            height={10}
                          />
                          <span className="font-serif ml-2 font-light">
                            Processing
                          </span>
                        </button>
                      ) : (
                        <button
                          disabled={loading}
                          type="submit"
                          className={`md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-store-500 text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-store-600 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto`}
                        >
                          {showingTranslateValue(
                            storeCustomizationSetting?.dashboard?.update_button
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Dashboard>
  );
};

export default UpdateProfile;

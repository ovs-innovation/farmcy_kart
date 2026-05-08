import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//internal import
import { getUserSession } from "@lib/auth";
import Error from "@components/form/Error";
import Dashboard from "@pages/user/dashboard";
import InputArea from "@components/form/InputArea";
import useGetSetting from "@hooks/useGetSetting";
import CustomerServices from "@services/CustomerServices";
import { notifyError, notifySuccess } from "@utils/toast";
import useUtilsFunction from "@hooks/useUtilsFunction";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const userInfo = getUserSession();

  const onSubmit = async ({ email, currentPassword, newPassword }) => {
    // return notifySuccess("This Feature is disabled for demo!");

    setLoading(true);
    try {
      const res = await CustomerServices.changePassword({
        email,
        currentPassword,
        newPassword,
      });
      notifySuccess(res.message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notifyError(error ? error.response.data.message : error.message);
    }
  };

  useEffect(() => {
    setValue("email", userInfo?.email);
  }, []);

  return (
    <Dashboard
      title={showingTranslateValue(
        storeCustomizationSetting?.dashboard?.change_password
      )}
      description="This is change-password page"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-50 transition-all hover:shadow-md">
          <div className="mb-8 border-b border-gray-50 pb-6 text-center sm:text-left">
            <h2 className="text-2xl font-serif font-bold text-gray-800">
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.change_password
              )}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Keep your account secure by updating your password regularly</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <InputArea
                  register={register}
                  label={showingTranslateValue(
                    storeCustomizationSetting?.dashboard?.user_email
                  )}
                  name="email"
                  type="email"
                  autocomplete="username"
                  placeholder="Your Email"
                  readOnly={true}
                />
                <Error errorName={errors.email} />
              </div>

              <div className="space-y-1">
                <InputArea
                  register={register}
                  label={showingTranslateValue(
                    storeCustomizationSetting?.dashboard?.current_password
                  )}
                  name="currentPassword"
                  type="password"
                  autocomplete="current-password"
                  placeholder="Enter Current Password"
                />
                <Error errorName={errors.currentPassword} />
              </div>

              <div className="space-y-1">
                <InputArea
                  register={register}
                  label={showingTranslateValue(
                    storeCustomizationSetting?.dashboard?.new_password
                  )}
                  name="newPassword"
                  type="password"
                  autocomplete="new-password"
                  placeholder="Enter New Password (min. 8 characters)"
                  pattern={/.{8,}/}
                  patternMessage={"Password must be at least 8 characters long."}
                />
                <Error errorName={errors.newPassword} />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 flex justify-center sm:justify-end">
              <button
                disabled={loading}
                type="submit"
                className={`group flex items-center justify-center gap-2 px-8 py-3.5 bg-store-500 text-white font-bold rounded-xl hover:bg-store-600 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]`}
              >
                {loading ? (
                  <>
                    <img
                      src="/loader/spinner.gif"
                      alt="Loading"
                      width={20}
                      height={20}
                      className="brightness-0 invert"
                    />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    {showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.change_password
                    )}
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default ChangePassword;

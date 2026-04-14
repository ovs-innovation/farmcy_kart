import { useTranslation } from "react-i18next";
import { 
  FiSettings, 
  FiCreditCard, 
  FiLogIn, 
  FiActivity, 
  FiMessageSquare,
  FiSave,
  FiInfo,
  FiCheck
} from "react-icons/fi";

// internal import
import Label from "@/components/form/label/Label";
import Error from "@/components/form/others/Error";
import PageTitle from "@/components/Typography/PageTitle";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import useStoreSettingSubmit from "@/hooks/useStoreSettingSubmit";
import AnimatedContent from "@/components/common/AnimatedContent";
import spinnerLoadingImage from "@/assets/img/spinner.gif";

const StoreSetting = () => {
  const { t } = useTranslation();
  const {
    isSave,
    errors,
    register,
    onSubmit,
    handleSubmit,
    isSubmitting,
    enabledCOD,
    setEnabledCOD,
    enabledStripe,
    setEnabledStripe,
    enabledRazorPay,
    setEnabledRazorPay,
    enabledFbPixel,
    setEnableFbPixel,
    enabledTawkChat,
    setEnabledTawkChat,
    enabledGoogleLogin,
    setEnabledGoogleLogin,
    enabledGithubLogin,
    setEnabledGithubLogin,
    enabledFacebookLogin,
    setEnabledFacebookLogin,
    enabledGoogleAnalytics,
    setEnabledGoogleAnalytics,
  } = useStoreSettingSubmit();

  const handleEnableDisableMethod = (checked, event, id) => {
    if (id === "stripe" && !checked) {
      setEnabledStripe(!enabledStripe);
      setEnabledCOD(true);
    } else if (id === "stripe" && checked) {
      setEnabledStripe(!enabledStripe);
    } else if (id === "cod" && !checked) {
      setEnabledCOD(!enabledCOD);
      setEnabledStripe(true);
    } else {
      setEnabledCOD(!enabledCOD);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <PageTitle>{t("StoreSetting")}</PageTitle>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 group disabled:opacity-50"
        >
          {isSubmitting ? (
            <img src={spinnerLoadingImage} alt="Loading" className="w-5 h-5 animate-spin" />
          ) : (
            <FiSave className="group-hover:scale-110 transition-transform" />
          )}
          {isSave ? t("SaveBtn") : t("UpdateBtn")}
        </button>
      </div>

      <AnimatedContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-12">
          
          {/* Payment Configuration */}
          <SectionCard 
            icon={<FiCreditCard className="text-emerald-500" />}
            title="Payment Configuration"
            description="Manage your store's payment gateways and transaction methods."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <ToggleCard 
                label={t("EnableCOD")}
                info="(This is enabled by default)"
                checked={enabledCOD}
                onChange={(checked) => handleEnableDisableMethod(checked, null, "cod")}
              />
              <ToggleCard 
                label={t("EnableStripe")}
                checked={enabledStripe}
                onChange={(checked) => handleEnableDisableMethod(checked, null, "stripe")}
              />
              <ToggleCard 
                label="Enable RazorPay"
                checked={enabledRazorPay}
                onChange={setEnabledRazorPay}
              />
            </div>

            {/* Stripe Credentials */}
            {enabledStripe && (
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4 mb-6 animate-fadeIn">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FiCheck className="text-emerald-500" /> Stripe API Credentials
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label label={t("StripeKey")} />
                    <InputAreaTwo
                      required={enabledStripe}
                      register={register}
                      name="stripe_key"
                      type="password"
                      placeholder="Enter your Stripe Publishable Key"
                    />
                    <Error errorName={errors.stripe_key} />
                  </div>
                  <div>
                    <Label label={t("StripeSecret")} />
                    <InputAreaTwo
                      required={enabledStripe}
                      register={register}
                      name="stripe_secret"
                      type="password"
                      placeholder="Enter your Stripe Secret Key"
                    />
                    <Error errorName={errors.stripe_secret} />
                  </div>
                </div>
              </div>
            )}

            {/* RazorPay Credentials */}
            {enabledRazorPay && (
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4 animate-fadeIn">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FiCheck className="text-emerald-500" /> RazorPay API Credentials
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label label="RazorPay ID" />
                    <InputAreaTwo
                      required={enabledRazorPay}
                      register={register}
                      name="razorpay_id"
                      type="password"
                      placeholder="Enter your RazorPay Key ID"
                    />
                    <Error errorName={errors.razorpay_id} />
                  </div>
                  <div>
                    <Label label="RazorPay Secret" />
                    <InputAreaTwo
                      required={enabledRazorPay}
                      register={register}
                      name="razorpay_secret"
                      type="password"
                      placeholder="Enter your RazorPay Key Secret"
                    />
                    <Error errorName={errors.razorpay_secret} />
                  </div>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Authentication Setup */}
          <SectionCard 
            icon={<FiLogIn className="text-blue-500" />}
            title="Authentication & Social Login"
            description="Enable social login providers to simplify customer sign-in."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <ToggleCard 
                label={t("EnableGoogleLogin")}
                checked={enabledGoogleLogin}
                onChange={setEnabledGoogleLogin}
              />
              <ToggleCard 
                label="Enable Github Login"
                checked={enabledGithubLogin}
                onChange={setEnabledGithubLogin}
              />
              <ToggleCard 
                label="Enable Facebook Login"
                checked={enabledFacebookLogin}
                onChange={setEnabledFacebookLogin}
              />
            </div>

            <div className="space-y-6">
              {enabledGoogleLogin && (
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Google OAuth Credentials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label label={t("GoogleClientId")} />
                      <InputAreaTwo
                        required={enabledGoogleLogin}
                        register={register}
                        name="google_id"
                        type="password"
                        placeholder="Google Client ID"
                      />
                      <Error errorName={errors.google_id} />
                    </div>
                    <div>
                      <Label label={t("GoogleSecret")} />
                      <InputAreaTwo
                        required={enabledGoogleLogin}
                        register={register}
                        name="google_secret"
                        type="password"
                        placeholder="Google Client Secret"
                      />
                      <Error errorName={errors.google_secret} />
                    </div>
                  </div>
                </div>
              )}

              {enabledGithubLogin && (
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Github OAuth Credentials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label label="Github ID" />
                      <InputAreaTwo
                        required={enabledGithubLogin}
                        register={register}
                        name="github_id"
                        type="password"
                        placeholder="Github Client ID"
                      />
                      <Error errorName={errors.github_id} />
                    </div>
                    <div>
                      <Label label="Github Secret" />
                      <InputAreaTwo
                        required={enabledGithubLogin}
                        register={register}
                        name="github_secret"
                        type="password"
                        placeholder="Github Client Secret"
                      />
                      <Error errorName={errors.github_secret} />
                    </div>
                  </div>
                </div>
              )}

              {enabledFacebookLogin && (
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Facebook OAuth Credentials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label label="Facebook ID" />
                      <InputAreaTwo
                        required={enabledFacebookLogin}
                        register={register}
                        name="facebook_id"
                        type="password"
                        placeholder="Facebook App ID"
                      />
                      <Error errorName={errors.facebook_id} />
                    </div>
                    <div>
                      <Label label="Facebook Secret" />
                      <InputAreaTwo
                        required={enabledFacebookLogin}
                        register={register}
                        name="facebook_secret"
                        type="password"
                        placeholder="Facebook App Secret"
                      />
                      <Error errorName={errors.facebook_secret} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Analytics & Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SectionCard 
              icon={<FiActivity className="text-purple-500" />}
              title="Analytics"
              description="Track store performance and visitor behavior."
            >
              <div className="space-y-6">
                <ToggleCard 
                  label={t("EnableGoggleAnalytics")}
                  checked={enabledGoogleAnalytics}
                  onChange={setEnabledGoogleAnalytics}
                />
                {enabledGoogleAnalytics && (
                  <div className="animate-fadeIn">
                    <Label label={t("GoogleAnalyticKey")} />
                    <InputAreaTwo
                      required={enabledGoogleAnalytics}
                      register={register}
                      name="google_analytic_key"
                      type="password"
                      placeholder="Measurement ID (G-XXXXXXX)"
                    />
                    <Error errorName={errors.google_analytic_key} />
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard 
              icon={<FiMessageSquare className="text-orange-500" />}
              title="Customer Support"
              description="Connect with your customers via live chat."
            >
              <div className="space-y-6">
                <ToggleCard 
                  label={t("EnableTawkChat")}
                  checked={enabledTawkChat}
                  onChange={setEnabledTawkChat}
                />
                {enabledTawkChat && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                    <div>
                      <Label label={t("TawkChatPropertyID")} />
                      <InputAreaTwo
                        required={enabledTawkChat}
                        register={register}
                        name="tawk_chat_property_id"
                        type="password"
                        placeholder="Property ID"
                      />
                      <Error errorName={errors.tawk_chat_property_id} />
                    </div>
                    <div>
                      <Label label={t("TawkChatWidgetID")} />
                      <InputAreaTwo
                        required={enabledTawkChat}
                        register={register}
                        name="tawk_chat_widget_id"
                        type="password"
                        placeholder="Widget ID"
                      />
                      <Error errorName={errors.tawk_chat_widget_id} />
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

        </form>
      </AnimatedContent>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </>
  );
};

const SectionCard = ({ icon, title, description, children }) => (
  <section className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[28px] p-8 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-5 mb-8">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
    {children}
  </section>
);

const ToggleCard = ({ label, info, checked, onChange }) => (
  <div className="bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 group flex items-center justify-between transition-all hover:bg-white dark:hover:bg-gray-800 hover:border-emerald-100">
    <div>
      <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 transition-colors uppercase tracking-wider text-[11px] mb-1">{label}</h4>
      {info && <p className="text-[10px] text-gray-400 font-medium italic">{info}</p>}
    </div>
    <div className="flex-shrink-0 ml-4 scale-90 origin-right">
      <SwitchToggle
        processOption={checked}
        handleProcess={(val) => onChange(val)}
      />
    </div>
  </div>
);

export default StoreSetting;

import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import { FiSmartphone } from "react-icons/fi";
import Cookies from "js-cookie";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@lib/firebase";
import { useForm } from "react-hook-form";

import Layout from "@layout/Layout";
import Error from "@components/form/Error";
import InputArea from "@components/form/InputArea";
import BottomNavigation from "@components/login/BottomNavigation";
import CustomerServices from "@services/CustomerServices";
import { setToken } from "@services/httpServices";
import { UserContext } from "@context/UserContext";
import { notifySuccess, notifyError } from "@utils/toast";

const OTPLogin = () => {
  const router = useRouter();
  const { dispatch } = useContext(UserContext);
  const [step, setStep] = useState("phone");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const recaptchaContainerRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const phoneNumber = watch("phoneNumber");

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (!isNaN(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    otpInputRefs.current[lastFilledIndex]?.focus();
  };

  const clearRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (err) {
        // Silently ignore - reCAPTCHA may already be cleared
      }
      recaptchaVerifierRef.current = null;
    }
    setRecaptchaVerifier(null);
  };

  useEffect(() => {
    let timer;
    let isMounted = true;

    if (typeof window !== "undefined" && auth && step === "phone") {
      timer = setTimeout(() => {
        if (!isMounted) return;

        try {
          const container = document.getElementById("recaptcha-container");
          if (!container || recaptchaVerifierRef.current) return;

          const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "normal",
            callback: () => {},
            "expired-callback": () =>
              setError("reCAPTCHA expired. Please try again."),
          });

          recaptchaVerifierRef.current = verifier;
          setRecaptchaVerifier(verifier);
        } catch (err) {
          console.error("Error initializing reCAPTCHA:", err);
          if (isMounted) {
            setError("Failed to initialize reCAPTCHA. Please refresh the page.");
          }
        }
      }, 300);
    }

    if (step === "otp") {
      clearRecaptcha();
    }

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [step]);

  const onPhoneSubmit = async (data) => {
    if (!auth) {
      setError("Firebase is not initialized. Please check your configuration.");
      return;
    }

    const verifier = recaptchaVerifierRef.current || recaptchaVerifier;
    if (!verifier) {
      setError("reCAPTCHA is not ready. Please wait a moment and try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const phoneNumber = data.phoneNumber;
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        verifier
      );

      setConfirmationResult(confirmation);
      setStep("otp");
      setLoading(false);
    } catch (err) {
      console.error("Error sending OTP:", err);
      const errorMessage =
        err.message ||
        "Failed to send OTP. Please check your phone number and try again.";
      setError(errorMessage);
      notifyError(errorMessage);
      setLoading(false);
      clearRecaptcha();
      setStep("phone");
    }
  };

  const onOTPSubmit = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (!confirmationResult) {
      setError("Session expired. Please start again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await CustomerServices.loginWithPhone({
        phoneNumber: user.phoneNumber,
        idToken: idToken,
      });
      // console.log("OTP login response:", response);
      if (response?.token) {
        const userInfo = {
          _id: response._id,
          name: response.name,
          email: response.email,
          phone: response.phone,
          address: response.address || "",
          image: response.image || "",
          token: response.token,
          role: response.role || "customer",
        };

        Cookies.set("userInfo", JSON.stringify(userInfo), { expires: 1 });
        setToken(response.token);
        dispatch({ type: "USER_LOGIN", payload: userInfo });
        
        notifySuccess("Login Successful!");
        router.push("/user/dashboard");
      } else {
        setError("Authentication failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      const errorMessage =
        err.message || "Invalid OTP. Please check the code and try again.";
      setError(errorMessage);
      notifyError(errorMessage);
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (!phoneNumber) {
      setError("Phone number is required.");
      return;
    }

    clearRecaptcha();
    setConfirmationResult(null);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setStep("phone");
  };

  const handleEditPhone = () => {
    clearRecaptcha();
    setConfirmationResult(null);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setStep("phone");
  };

  return (
    <Layout title="OTP Login" description="Login with OTP using your phone number">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="py-10 flex flex-col lg:flex-row w-full">
          <div className="w-full sm:p-5 lg:p-8">
            <div className="mx-auto text-left justify-center rounded-lg w-full max-w-lg px-6 py-10 sm:p-12 overflow-hidden align-middle transition-all transform bg-white shadow-2xl">
              <div className="overflow-hidden mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold font-serif text-gray-800">
                    {step === "phone" ? "OTP Login" : "Verify your OTP"}
                  </h2>
                  <p className="text-sm md:text-base text-gray-500 mt-3">
                    {step === "phone"
                      ? "Enter your phone number to receive OTP"
                      : "Enter one time password sent on"}
                  </p>
                  {step === "otp" && phoneNumber && (
                    <div className="flex items-center justify-center mt-2 gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {phoneNumber}
                      </span>
                      <button
                        type="button"
                        onClick={handleEditPhone}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {step === "phone" && error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error?.response?.data?.message || error?.message || String(error)}
                  </div>
                )}

                {step === "phone" ? (
                  <form
                    onSubmit={handleSubmit(onPhoneSubmit)}
                    className="flex flex-col justify-center space-y-6"
                  >
                    <div className="form-group">
                      <InputArea
                        register={register}
                        label="Phone Number"
                        name="phoneNumber"
                        type="tel"
                        placeholder="+91 9876543210"
                        Icon={FiSmartphone}
                        autocomplete="tel"
                        required={true}
                        pattern="^\+?[1-9]\d{1,14}$"
                        patternMessage="Please enter a valid phone number with country code"
                      />
                      <Error errorName={errors.phoneNumber} />
                    </div>

                    <div
                      id="recaptcha-container"
                      ref={recaptchaContainerRef}
                      className="flex justify-center my-4"
                    ></div>

                    <button
                      disabled={loading}
                      type="submit"
                      className={`w-full text-center py-3.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-store-500 hover:bg-store-600 focus:ring-store-500"
                      } text-white shadow-md`}
                    >
                      {loading ? (
                        <span className="inline-flex items-center">
                          <img
                            src="/loader/spinner.gif"
                            alt="Loading"
                            width={20}
                            height={10}
                            className="mr-2"
                          />
                          Sending OTP...
                        </span>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </form>
                ) : step === "otp" ? (
                  <form
                    onSubmit={onOTPSubmit}
                    className="flex flex-col justify-center space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-center gap-3">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (otpInputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={index === 0 ? handleOtpPaste : undefined}
                            className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border-2 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
                            style={{
                              borderColor: digit ? "#3B82F6" : "#E5E7EB",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-600">
                        Didn't receive OTP?
                      </p>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Resend OTP
                      </button>
                    </div>

                    <button
                      disabled={loading || otp.join("").length !== 6}
                      type="submit"
                      className={`w-full text-center py-3.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        loading || otp.join("").length !== 6
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-store-500 hover:bg-store-600 focus:ring-store-500"
                      } text-white shadow-md`}
                    >
                      {loading ? (
                        <span className="inline-flex items-center">
                          <img
                            src="/loader/spinner.gif"
                            alt="Loading"
                            width={20}
                            height={10}
                            className="mr-2"
                          />
                          Verifying...
                        </span>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </form>
                ) : null}

                <BottomNavigation
                  or={false}
                  route={"/auth/login"}
                  pageName={"Login with Email"}
                  loginTitle="OTP Login"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OTPLogin;


import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiLock, FiMail, FiSmartphone } from "react-icons/fi";
import Cookies from "js-cookie";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@lib/firebase";

//internal  import
import Layout from "@layout/Layout";
import Error from "@components/form/Error";
import useLoginSubmit from "@hooks/useLoginSubmit";
import InputArea from "@components/form/InputArea";
import BottomNavigation from "@components/login/BottomNavigation";
import CustomerServices from "@services/CustomerServices";
import { setToken } from "@services/httpServices";
import { UserContext } from "@context/UserContext";
import { notifySuccess, notifyError } from "@utils/toast";

const Login = () => {
  const router = useRouter();
  const { dispatch } = useContext(UserContext);
  const [loginMethod, setLoginMethod] = useState("otp"); // "email" or "otp"
  const { handleSubmit, submitHandler, register, errors, loading } = useLoginSubmit();

  // OTP states
  const [step, setStep] = useState("phone");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const recaptchaVerifierRef = useRef(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);
  const [phoneNumber, setPhoneNumber] = useState("");

  // OTP handlers
  const ensureOtpArray = (value) => {
    if (Array.isArray(value) && value.length === 6) return value;
    if (Array.isArray(value) && value.length > 0) {
      const padded = [...value.slice(0, 6)];
      while (padded.length < 6) padded.push("");
      return padded;
    }
    return ["", "", "", "", "", ""];
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const digit = value.slice(-1);

    setOtp((prev) => {
      const next = [...ensureOtpArray(prev)];
      next[index] = digit;
      return next;
    });

    if (digit && index < 5) {
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
    const newOtp = ensureOtpArray([]);
    for (let i = 0; i < pastedData.length; i++) {
      if (!isNaN(pastedData[i])) newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    otpInputRefs.current[lastFilledIndex]?.focus();
  };

  const clearRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (err) {}
      recaptchaVerifierRef.current = null;
    }
    setRecaptchaVerifier(null);
  };

  useEffect(() => {
    let timer;
    let isMounted = true;

    if (typeof window !== "undefined" && auth && step === "phone" && loginMethod === "otp") {
      timer = setTimeout(() => {
        if (!isMounted) return;
        try {
          const container = document.getElementById("recaptcha-container");
          if (!container || recaptchaVerifierRef.current) return;
          const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "normal",
            callback: () => {},
            "expired-callback": () => {},
          });
          recaptchaVerifierRef.current = verifier;
          setRecaptchaVerifier(verifier);
        } catch (err) {
          console.error("reCAPTCHA initialization error:", err);
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
  }, [step, loginMethod]);

  useEffect(() => {
    return () => {
      clearRecaptcha();
    };
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setOtpError("Please enter a valid phone number");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const formattedPhone = phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
      setStep("otp");
      notifySuccess("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;
      const idToken = await user.getIdToken();
      const response = await CustomerServices.loginWithPhone({
        phoneNumber: user.phoneNumber,
        idToken,
      });

      if (response.token) {
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

        setToken(response.token);
        Cookies.set("userInfo", JSON.stringify(userInfo), { expires: 1 });
        dispatch({ type: "USER_LOGIN", payload: userInfo });
        notifySuccess("Login successful!");
        router.push("/");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleEditPhone = () => {
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    clearRecaptcha();
  };

  return (
    <Layout title="Login" description="This is login page">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="py-4 flex flex-col lg:flex-row w-full">
          <div className="w-full sm:p-5 lg:p-8">
            <div className="mx-auto text-left justify-center rounded-md w-full max-w-lg px-4 py-8 sm:p-10 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2x">
              <div className="overflow-hidden mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold font-serif">Login</h2>
                  <p className="text-sm md:text-base text-gray-500 mt-2 mb-4">
                    {loginMethod === "email" ? "Login with your email and password" : "Login with your phone number"}
                  </p>

                  {/* Toggle Buttons */}
                  <div className="flex gap-2 justify-center mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("email");
                        setStep("phone");
                        setOtp(["", "", "", "", "", ""]);
                        setOtpError("");
                      }}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                        loginMethod === "email"
                          ? "bg-store-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <FiMail className="w-4 h-4" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod("otp");
                        setStep("phone");
                        setOtp(["", "", "", "", "", ""]);
                        setOtpError("");
                        setPhoneNumber("");
                      }}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                        loginMethod === "otp"
                          ? "bg-store-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <FiSmartphone className="w-4 h-4" />
                      Phone
                    </button>
                  </div>
                </div>
                {/* Email Login Form */}
                {loginMethod === "email" && (
                  <div>
                    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col justify-center">
                    <div className="grid grid-cols-1 gap-5">
                      <div className="form-group">
                        <InputArea
                          register={register}
                          label="Email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          Icon={FiMail}
                          autocomplete="email"
                        />
                        <Error errorName={errors.email} />
                      </div>
                      <div className="form-group">
                        <InputArea
                          register={register}
                          label="Password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          Icon={FiLock}
                          autocomplete="current-password"
                        />
                        <Error errorName={errors.password} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex ms-auto">
                          <Link
                            href="/auth/forget-password"
                            className="text-end text-sm text-heading ps-3 underline hover:no-underline focus:outline-none"
                          >
                            Forgot password?
                          </Link>
                        </div>
                      </div>
                      {loading ? (
                        <button
                          disabled={loading}
                          type="submit"
                          className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-store-500 text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-store-600 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
                        >
                          <img src="/loader/spinner.gif" alt="Loading" width={20} height={10} />
                          <span className="font-serif ml-2 font-light">Processing</span>
                        </button>
                      ) : (
                        <button
                          disabled={loading}
                          type="submit"
                          className="w-full text-center py-3 rounded bg-store-500 text-white hover:bg-store-600 transition-all focus:outline-none my-1"
                        >
                          Login
                        </button>
                      )}
                    </div>
                  </form>
                  </div>
                )}
                
                {/* OTP Login Form */}
                {loginMethod === "otp" && (
                  <>
                    {step === "phone" ? (
                      <form onSubmit={handleSendOTP} className="flex flex-col justify-center">
                        <div className="grid grid-cols-1 gap-5">
                          <div className="form-group">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                              Phone Number
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSmartphone className="text-gray-400" />
                              </div>
                              <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter 10-digit phone number"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-store-500"
                                maxLength="10"
                                required
                              />
                            </div>
                            {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}
                          </div>

                          <div id="recaptcha-container"></div>

                          {otpLoading ? (
                            <button
                              disabled
                              type="button"
                              className="w-full text-center py-3 rounded bg-store-400 text-white cursor-not-allowed"
                            >
                              <img src="/loader/spinner.gif" alt="Loading" width={20} height={10} className="inline mr-2" />
                              Sending OTP...
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="w-full text-center py-3 rounded bg-store-500 text-white hover:bg-store-600 transition-all focus:outline-none my-1"
                            >
                              Send OTP
                            </button>
                          )}
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOTP} className="flex flex-col justify-center space-y-6">
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-600">
                            OTP sent to <span className="font-semibold">+91{phoneNumber}</span>
                            <button
                              type="button"
                              onClick={handleEditPhone}
                              className="ml-2 text-store-500 hover:text-store-600 underline"
                            >
                              Edit
                            </button>
                          </p>
                        </div>

                        <div className="space-y-4">
                          <label className="block text-gray-700 text-sm font-medium mb-3 text-center">
                            Enter 6-Digit OTP
                          </label>
                          <div className="flex justify-center gap-3">
                            {Array.from({ length: 6 }).map((_, index) => {
                              const currentOtp = ensureOtpArray(otp);
                              const digit = currentOtp[index] || "";
                              return (
                                <input
                                  key={`otp-input-${index}`}
                                  ref={(el) => {
                                    if (el) otpInputRefs.current[index] = el;
                                  }}
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
                                    backgroundColor: "#FFFFFF",
                                    color: "#111827",
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {otpError && (
                          <div className="text-center">
                            <p className="text-red-500 text-sm">{otpError}</p>
                          </div>
                        )}

                        {otpLoading ? (
                          <button
                            disabled
                            type="button"
                            className="w-full text-center py-3 rounded bg-store-400 text-white cursor-not-allowed"
                          >
                            <img src="/loader/spinner.gif" alt="Loading" width={20} height={10} className="inline mr-2" />
                            Verifying...
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="w-full text-center py-3 rounded bg-store-500 text-white hover:bg-store-600 transition-all focus:outline-none my-1"
                          >
                            Verify OTP
                          </button>
                        )}
                      </form>
                    )}
                  </>
                )}
                <BottomNavigation
                  or={true}
                  route={"/auth/signup"}
                  pageName={"Sign Up"}
                  loginTitle="Login"
                  hideSignUp={loginMethod === "otp"}
                  hideSocial={loginMethod === "otp"}
                />
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

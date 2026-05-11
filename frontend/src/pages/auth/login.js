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
  const [loginMethod, setLoginMethod] = useState("otp"); 
  const { handleSubmit, submitHandler, register, reset, setValue, errors, loading } = useLoginSubmit();

  useEffect(() => {
    // Stage 1: Initial reset
    reset({ email: "", password: "" });
    setValue("email", "");
    setValue("password", "");

    // Stage 2: Aggressive interval clearing for 2 seconds (to catch late autofills)
    const interval = setInterval(() => {
      try {
        const emailField = document.querySelector('input[name="email"]');
        const passwordField = document.querySelector('input[name="password"]');
        
        // Clear if field has value and user is NOT currently typing in it
        if (emailField && document.activeElement !== emailField && emailField.value !== "") {
          emailField.value = "";
          emailField.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (passwordField && document.activeElement !== passwordField && passwordField.value !== "") {
          passwordField.value = "";
          passwordField.dispatchEvent(new Event("input", { bubbles: true }));
        }
      } catch (e) {}
    }, 100);

    // Stop the interval after 2 seconds
    const timer = setTimeout(() => clearInterval(interval), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [reset, setValue]);

  // OTP states
  const [step, setStep] = useState("phone");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);
  const [phoneNumber, setPhoneNumber] = useState("");

  const clearRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {}
      window.recaptchaVerifier = null;
    }
    const container = document.getElementById("recaptcha-container");
    if (container) container.innerHTML = "";
  };

  useEffect(() => {
    return () => clearRecaptcha();
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setOtpError("Please enter a 10-digit number");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      if (!auth) throw new Error("Firebase Auth is not initialized. Check your configuration.");
      
      // 1. Check if user exists in our DB first
      const checkRes = await CustomerServices.checkCustomerExistance({ phone: phoneNumber });
      if (!checkRes.exists) {
        setOtpError("Account not found. Please register first.");
        setOtpLoading(false);
        return;
      }

      clearRecaptcha();

      // 2. Create Verifier (Using invisible for better UX on production)
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved");
        },
        "expired-callback": () => {
          setOtpError("reCAPTCHA expired. Please try again.");
          clearRecaptcha();
        }
      });
      
      window.recaptchaVerifier = verifier;

      const formattedPhone = phoneNumber.startsWith("+") 
        ? phoneNumber 
        : (phoneNumber.startsWith("91") ? `+${phoneNumber}` : `+91${phoneNumber}`);

      console.log("Sending OTP to:", formattedPhone);

      // 3. Send OTP
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(confirmation);
      setStep("otp");
      notifySuccess("OTP sent successfully!");
    } catch (error) {
      console.error("Firebase OTP Error:", error);
      let msg = "Failed to send OTP.";
      
      // Specific Firebase Error handling
      if (error.code === "auth/invalid-app-credential") {
        msg = "Domain not authorized in Firebase Console.";
      } else if (error.code === "auth/too-many-requests") {
        msg = "Too many requests. Please try again later.";
      } else if (error.code === "auth/operation-not-allowed") {
        msg = "Phone Auth is not enabled in Firebase Console.";
      } else {
        msg = error.message || "Failed to send OTP.";
      }

      setOtpError(`${msg} (${error.code || 'unknown_error'})`);
      notifyError(msg);
      clearRecaptcha();
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    setOtpLoading(true);
    try {
      const result = await confirmationResult.confirm(otpCode);
      const idToken = await result.user.getIdToken();
      
      const response = await CustomerServices.loginWithPhone({
        phoneNumber: result.user.phoneNumber,
        idToken,
      });

      if (response.token) {
        const userInfo = {
          _id: response._id,
          name: response.name,
          email: response.email,
          phone: response.phone,
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
      const backendMessage = error.response?.data?.message || error.message;
      console.error("OTP Error:", error);
      
      if (backendMessage.includes("invalid-verification-code") || backendMessage.includes("Invalid OTP")) {
        setOtpError("Invalid OTP code. Please try again.");
      } else if (backendMessage.includes("session-expired") || backendMessage.includes("SESSION_EXPIRED")) {
        setOtpError("OTP session expired. Please send OTP again.");
        setStep("phone");
      } else {
        setOtpError(backendMessage || "Login failed. Please try again.");
      }
      notifyError(backendMessage || "Login failed.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const digit = value.slice(-1);
    setOtp(prev => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpInputRefs.current[index - 1]?.focus();
  };

  return (
    <Layout title="Login">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 py-10">
        <div className="mx-auto max-w-lg bg-white shadow-xl rounded-2xl p-8 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Login</h2>
            <div className="flex gap-2 justify-center mt-6">
              <button onClick={() => { setLoginMethod("email"); setStep("phone"); setOtpError(""); }} className={`px-6 py-2.5 rounded-lg transition-all ${loginMethod === "email" ? "bg-store-500 text-white" : "bg-gray-100"}`}>Email</button>
              <button onClick={() => { setLoginMethod("otp"); setStep("phone"); setOtpError(""); }} className={`px-6 py-2.5 rounded-lg transition-all ${loginMethod === "otp" ? "bg-store-500 text-white" : "bg-gray-100"}`}>Phone</button>
            </div>
          </div>

          {loginMethod === "email" ? (
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4" autoComplete="off">
              {/* Invisible Trap inputs to catch browser autofill (more effective than display: none) */}
              <input type="text" name="dummy-email" style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }} tabIndex="-1" aria-hidden="true" />
              <input type="password" name="dummy-password" style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }} tabIndex="-1" aria-hidden="true" />
              <InputArea register={register} label="Email" name="email" type="email" placeholder="Email" Icon={FiMail} autocomplete="new-password" />
              <InputArea register={register} label="Password" name="password" type="password" placeholder="Password" Icon={FiLock} autocomplete="new-password" />
              <button disabled={loading} type="submit" className="w-full py-3 rounded bg-store-500 text-white h-12 flex items-center justify-center">
                {loading ? "Loading..." : "Login"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {step === "phone" ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">+91</span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="Enter 10-digit number"
                      maxLength="10"
                      required
                    />
                  </div>
                  {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}
                  
                  {/* VISIBLE container */}
                  <div id="recaptcha-container" className="flex justify-center my-4 min-h-[80px]"></div>

                  <button disabled={otpLoading} type="submit" className="w-full py-3 rounded bg-store-500 text-white h-12 flex items-center justify-center">
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => (
                      <input key={i} ref={el => otpInputRefs.current[i] = el} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)} className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg" />
                    ))}
                  </div>
                  <button disabled={otpLoading} type="submit" className="w-full py-3 rounded bg-store-500 text-white h-12">Verify OTP</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Login;
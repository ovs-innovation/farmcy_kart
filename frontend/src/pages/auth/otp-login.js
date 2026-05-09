import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import { FiSmartphone, FiArrowLeft } from "react-icons/fi";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@lib/firebase";
import Cookies from "js-cookie";

// Internal imports
import Layout from "@layout/Layout";
import { UserContext } from "@context/UserContext";
import CustomerServices from "@services/CustomerServices";
import { setToken } from "@services/httpServices";
import { notifySuccess, notifyError } from "@utils/toast";

const OTPLogin = () => {
  const router = useRouter();
  const { dispatch } = useContext(UserContext);
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const otpInputRefs = useRef([]);

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
      setError("Please enter a 10-digit number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!auth) throw new Error("Auth not ready");
      
      clearRecaptcha();

      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: () => {
          console.log("reCAPTCHA solved manually");
        },
      });
      
      window.recaptchaVerifier = verifier;
      await verifier.render();

      const formattedPhone = phoneNumber.startsWith("+") 
        ? phoneNumber 
        : (phoneNumber.startsWith("91") ? `+${phoneNumber}` : `+91${phoneNumber}`);

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(confirmation);
      setStep("otp");
      notifySuccess("OTP sent successfully!");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to send OTP.");
      notifyError("Failed to send OTP.");
      clearRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    setLoading(true);
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
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.message;
      if (backendMessage.includes("invalid-verification-code") || backendMessage.includes("Invalid OTP")) {
        setError("Invalid OTP code. Please try again.");
      } else {
        setError(backendMessage || "Login failed. Please try again.");
      }
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
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
    <Layout title="OTP Login">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 py-10">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          {step === "phone" ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <h2 className="text-2xl font-bold text-center">Login with Phone</h2>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">+91</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="9876543210"
                  maxLength="10"
                />
              </div>
              <div id="recaptcha-container" className="flex justify-center my-4 min-h-[80px]"></div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button disabled={loading} type="submit" className="w-full bg-store-500 text-white py-3 rounded-lg h-12">
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-8">
              <button onClick={() => setStep("phone")} className="flex items-center text-gray-500 underline mb-4">Back</button>
              <h2 className="text-2xl font-bold text-center">Enter OTP</h2>
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input key={i} ref={el => otpInputRefs.current[i] = el} type="text" inputMode="numeric" value={digit} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)} className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg" />
                ))}
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button disabled={loading} type="submit" className="w-full bg-store-500 text-white py-3 rounded-lg h-12">
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OTPLogin;

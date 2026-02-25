import Link from "next/link";
import { FiShield, FiTruck, FiStar, FiArrowLeft } from "react-icons/fi";
import { IoLeafOutline, IoCheckmarkCircle } from "react-icons/io5";

// internal
import Layout from "@layout/Layout";
import { SignupContent } from "@components/modal/SignupModal";

/* ── Perks shown on the branding panel ── */
const PERKS = [
  {
    icon: <FiShield className="text-emerald-400 text-xl" />,
    title: "100% Secure & Trusted",
    desc: "Your data and documents are encrypted end-to-end.",
  },
  {
    icon: <FiTruck className="text-blue-400 text-xl" />,
    title: "Fast & Reliable Delivery",
    desc: "Express delivery to your doorstep across India.",
  },
  {
    icon: <FiStar className="text-amber-400 text-xl" />,
    title: "Genuine Medicines Only",
    desc: "Certified products sourced directly from manufacturers.",
  },
  {
    icon: <IoCheckmarkCircle className="text-purple-400 text-xl" />,
    title: "Wholesale B2B Pricing",
    desc: "Special rates for pharmacies, clinics & bulk buyers.",
  },
];

const SignUp = () => {
  return (
    <Layout title="Sign Up – FarmacyKart" description="Create your FarmacyKart account to shop medicines online">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900
                            transition-colors mb-8 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>

          {/* ── Two-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-start">

            {/* ──────── LEFT: Branding Panel ──────── */}
            <div className="relative hidden lg:flex flex-col justify-between
                            bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-600
                            rounded-3xl p-10 xl:p-12 overflow-hidden min-h-[640px]"
            >
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Brand */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/20 border border-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <IoLeafOutline className="text-white text-2xl" />
                  </div>
                  <div>
                    <span className="text-white font-extrabold text-xl tracking-tight">FarmacyKart</span>
                    <p className="text-blue-200 text-xs">India&apos;s Trusted Medicine Platform</p>
                  </div>
                </div>

                <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4">
                  Your Health,
                  <br />
                  <span className="text-emerald-300">Our Priority.</span>
                </h1>
                <p className="text-blue-100 text-base leading-relaxed max-w-xs">
                  Join over <strong className="text-white">50,000+ customers</strong> who
                  trust FarmacyKart for genuine medicines, fast delivery, and competitive pricing.
                </p>
              </div>

              {/* Perks list */}
              <div className="relative z-10 space-y-4 mt-10">
                {PERKS.map((perk, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                      {perk.icon}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{perk.title}</p>
                      <p className="text-blue-200 text-xs mt-0.5 leading-relaxed">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial strip */}
              <div className="relative z-10 mt-8 pt-8 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["A", "B", "C", "D"].map((l, i) => (
                      <div key={i}
                        className="w-8 h-8 rounded-full border-2 border-blue-600 bg-gradient-to-br from-blue-300 to-emerald-300 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{l}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-blue-100 text-xs leading-relaxed">
                    <strong className="text-white">4.8 ★</strong> rated by 12,000+ verified buyers
                  </p>
                </div>
              </div>
            </div>

            {/* ──────── RIGHT: Form Panel ──────── */}
            <div className="w-full">
              {/* Mobile brand header */}
              <div className="flex items-center gap-3 mb-6 lg:hidden">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center">
                  <IoLeafOutline className="text-white text-xl" />
                </div>
                <div>
                  <span className="font-extrabold text-gray-900 text-lg">FarmacyKart</span>
                  <p className="text-gray-400 text-xs">India&apos;s Trusted Medicine Platform</p>
                </div>
              </div>

              {/* Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-6 sm:p-8 xl:p-10">

                {/* Heading */}
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Create Your Account
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    Sign up in under 2 minutes — it&apos;s completely free.
                  </p>

                  {/* Progress dots */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-1.5 w-8 bg-blue-600 rounded-full" />
                    <div className="h-1.5 w-4 bg-gray-200 rounded-full" />
                    <div className="h-1.5 w-4 bg-gray-200 rounded-full" />
                    <span className="text-xs text-gray-400 ml-1">Step 1 of 3</span>
                  </div>
                </div>

                {/* Signup form content */}
                <SignupContent />

              </div>

              {/* Bottom trust note */}
              <p className="text-center text-xs text-gray-400 mt-5 flex items-center justify-center gap-1.5">
                <FiShield className="text-emerald-500" />
                Your information is safe &amp; never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;

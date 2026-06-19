import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const verifyOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setSuccess("Email Verified Successfully");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Verification Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {

    try {

      await api.post("/auth/resend-otp", {
        email,
      });

      setSuccess("OTP Sent Again");

      setSeconds(60);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to resend OTP"
      );

    }

  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-900">

      <div className="bg-slate-800 p-8 rounded-2xl shadow-lg w-[420px]">

        <h1 className="text-white text-3xl font-bold text-center mb-2">
          Verify Email
        </h1>

        <p className="text-slate-400 text-center mb-6">
          Enter the OTP sent to
        </p>

        <p className="text-indigo-400 text-center mb-6 font-semibold">
          {email}
        </p>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 text-green-400 p-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={verifyOTP}>

          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6 Digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-slate-700 text-white text-center tracking-[10px] text-2xl mb-6 outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white p-4 rounded-xl font-semibold"
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </form>

        <div className="mt-6 text-center">

          {
            seconds > 0 ? (

              <p className="text-slate-400">

                Resend OTP in

                <span className="text-indigo-400">

                  {" "}
                  {seconds}s

                </span>

              </p>

            ) : (

              <button
                onClick={resendOTP}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Resend OTP
              </button>

            )
          }

        </div>

      </div>

    </div>
  );
}

export default VerifyOtp;
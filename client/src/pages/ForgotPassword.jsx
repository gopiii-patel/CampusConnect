import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (!otpSent) return;

    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, otpSent]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(res.data.message);

      setOtpSent(true);

      setSeconds(60);

      setTimeout(() => {
        navigate("/reset-password", {
          state: {
            email,
          },
        });
      }, 1800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);

      setError("");

      setMessage("");

      const res = await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(
        res.data.message ||
          "OTP Sent Again"
      );

      setSeconds(60);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center px-4">

      <div className="w-full max-w-md bg-slate-800 rounded-3xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Forgot Password
        </h1>

        <p className="text-slate-400 text-center mb-8">
          Enter your registered email address.
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded-xl mb-5">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Email Address"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-slate-700 text-white outline-none mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

        </form>

        {otpSent && (
          <div className="mt-8 text-center">

            {seconds > 0 ? (
              <p className="text-slate-400">
                Resend OTP in{" "}
                <span className="text-indigo-400 font-semibold">
                  {seconds}s
                </span>
              </p>
            ) : (
              <button
                onClick={resendOtp}
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Resend OTP
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default ForgotPassword;
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get email passed from ForgotPassword
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please go back and try again.");
      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);

      // ✅ Send OTP with email in URL param
      const res = await axios.post(
        `${baseURL}/users/verify-otp/${email}`,
        { otp },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("OTP verified successfully!");
        navigate("/reset-password", { state: { email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <KeyRound className="w-10 h-10 text-blue-600 mb-2" />
          <h1 className="text-2xl font-semibold text-gray-800">Verify OTP</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter the 6-digit OTP sent to{" "}
            <span className="font-medium text-blue-600">{email}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
              One-Time Password
            </Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) setOtp(value);
              }}
              className="mt-1 w-full text-center text-lg tracking-widest border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm mt-6">
          <p>
            Didn’t receive the OTP?{" "}
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Resend
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ChangePassword = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get email from VerifyOtp page
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please try again.");
      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${baseURL}/users/change-password/${email}`,
        { newPassword, confirmPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success("Password changed successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <LockKeyhole className="w-10 h-10 text-blue-600 mb-2" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Create New Password
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Set a strong password for{" "}
            <span className="font-medium text-blue-600">{email}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Changing...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm mt-6">
          <p>
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

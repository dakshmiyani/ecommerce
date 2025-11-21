import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const VerfyEmail = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;` `
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const res = await axios.post(`${baseURL}/users/verify`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success) {
        setStatus("✅ Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setStatus("❌ Verification failed. The token may be invalid or expired.");
    }};
 useEffect(() => {
      verifyEmail();
    }, [token]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-100 to-blue-200 overflow-hidden px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md border border-blue-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">{status}</h2>
        <p className="text-gray-600 text-sm">
          Please wait while we verify your email...
        </p>
      </div>
    </div>
  );
};

export default VerfyEmail;

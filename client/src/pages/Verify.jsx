import React from "react";

const Verify = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-100 to-blue-200 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center border border-blue-100">
        <div className="flex flex-col items-center space-y-4">
         
          <h2 className="text-2xl font-semibold text-blue-700">
            ✅ Check your email for verification
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            We’ve sent a verification link to your email address.
            <br />
            Please click the link in the email to verify your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;

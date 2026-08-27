import React from "react";
import { useNavigate } from "react-router-dom";

const ResetPasswordRequestAccepted = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-62px)]  relative">
      <button
        onClick={handleBack}
        className=" absolute top-8 left-[130px] cursor-pointer px-5 py-2 bg-white text-[#EA454C] border hover:shadow-2xl font-semibold rounded-lg transition-all"
      >
        Back To Login
      </button>
      <div className="text-center p-6">
        <h1 className="text-3xl font-semibold text-red-600 mb-4 uppercase">
          Password Reset Request Sent
        </h1>
        <p className="text-gray-700 mb-4 uppercase">
          You Will Reccieve a email with your new passsword once your request
          gets accepted.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordRequestAccepted;

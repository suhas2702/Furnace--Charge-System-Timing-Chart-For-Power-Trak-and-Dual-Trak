import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { sendResetPasswordRequest } from "../../operations";
import Spinner from "./Spinner/Spinner";
import { useDispatch } from "react-redux";
import { setEmail } from "../../Slices/forgotPassword";
import { IoMdArrowRoundBack } from "react-icons/io";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    dispatch(sendResetPasswordRequest(data.email, setLoading, navigate));
  };

  const handleBack = () => {
    dispatch(setEmail(null));
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-62px)] w-10/12 mx-auto flex justify-center items-center relative">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-62px)] w-10/12 mx-auto flex justify-center items-center relative">
      <div className="bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-black text-center">
          Request Reset Password
        </h2>

        <p className="text-red-600 text-center mt-2">
          Please Enter Your Registered Email Address.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              placeholder="Enter your email"
              className="w-full p-[8px] border rounded-md placeholder:text-gray-400 outline-gray-700 focus:outline-black"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full mt-4 p-3 rounded-md text-white font-semibold transition-all cursor-pointer hover:shadow-xl bg-[#EA454C] hover:bg-[#D23E44]"
          >
            Next
          </button>
          <button
            className="bg-gray-300 w-full flex p-3 mt-4  rounded-lg border-0 text-black cursor-pointer  
                                             font-sans font-semibold items-center gap-1 justify-center"
            onClick={() => {
              dispatch(setEmail(null));
              navigate("/login");
            }}
          >
            <IoMdArrowRoundBack size={18} />
            <span>Back To Login</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

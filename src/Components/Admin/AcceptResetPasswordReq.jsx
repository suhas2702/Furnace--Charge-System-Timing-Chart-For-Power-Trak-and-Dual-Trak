import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { resetPasswordRequest } from "../../operations";
import { useSelector } from "react-redux";
import Spinner from "../Common/Spinner/Spinner.jsx";

const AcceptResetPasswordReq = () => {
  const { token } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onSubmit = (data) => {
    dispatch(resetPasswordRequest(data.email, setLoading, navigate, token));
  };
  const handleBack = () => {
    navigate("/");
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
      <button
        onClick={handleBack}
        className="absolute top-5 left-1 px-5 py-2 bg-white text-[#EA454C] border hover:shadow-2xl font-semibold cursor-pointer rounded-lg transition-all"
      >
        Back
      </button>

      <div className="bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-black text-center">
          Reset Password
        </h2>

        <p className="text-red-600 text-center mt-2">
          Please Enter The Email Of the User To Reset The Password.
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
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default AcceptResetPasswordReq;

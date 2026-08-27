import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner/Spinner.jsx";
import { resetPassword } from "../../operations/index.js";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setEmail } from "../../Slices/forgotPassword.js";
import { IoMdArrowRoundBack } from "react-icons/io";

const ResetForgotPassword = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.forgotPassword);
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (!email) {
      toast.error(
        "Do not refresh the page once you enter the email address in the first step."
      );
      navigate("/forgot-password");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New Password and Confirm Password do not match");
      return;
    }
    dispatch(
      resetPassword(email, data.newPassword, setLoading, navigate, token)
    );
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
          Reset Password
        </h2>

        <p className="text-red-600 text-center mt-2">
          <span className="text-black font-semibold">Note:</span> Enter a strong
          and secure new password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {[
            {
              label: "New Password",
              name: "newPassword",
              validation: {
                required: "New Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /.*[a-zA-Z].*/,
                  message: "Password must contain at least one alphabet",
                },
              },
            },
            {
              label: "Confirm New Password",
              name: "confirmPassword",
              validation: {
                required: "Confirm New Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /.*[a-zA-Z].*/,
                  message: "Password must contain at least one alphabet",
                },
              },
            },
          ].map((field, index) => (
            <div key={index} className="mb-4 relative">
              <label className="block font-medium text-gray-700 mb-1">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword[field.name] ? "text" : "password"}
                  {...register(field.name, field.validation)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full p-2 border rounded-md placeholder:text-gray-400 outline-gray-700 focus:outline-black pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.name)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                >
                  {showPassword[field.name] ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name].message}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={!isValid}
            className="w-full mt-4 p-3 rounded-md text-white font-semibold transition-all cursor-pointer hover:shadow-xl bg-[#EA454C] hover:bg-[#D23E44]"
          >
            Reset Password
          </button>
          <div
            className="bg-gray-300 w-full flex p-3 mt-4 rounded-lg border-0 text-black cursor-pointer  
                                   font-sans font-semibold items-center gap-1 justify-center"
            onClick={() => {
              dispatch(setEmail(null));
              navigate("/forgot-password");
            }}
          >
            <IoMdArrowRoundBack size={18} />
            <span>Back</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetForgotPassword;

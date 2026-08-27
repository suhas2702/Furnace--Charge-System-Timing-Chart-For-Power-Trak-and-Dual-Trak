import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Spinner from "../Common/Spinner/Spinner";
import { changePassword } from "../../operations/index.js";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

const ChangePassword = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New Passwords and Confirm New Password do not match");
      return;
    }
    if (data.newPassword === data.oldPassword) {
      toast.error("Old Password and New Password cannot be the same");
      return;
    }
    dispatch(
      changePassword(
        user.email,
        data.newPassword,
        data.oldPassword,
        setLoading,
        navigate,
        token
      )
    );
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
    <div className="h-[calc(100vh-62px)] w-10/12 p-4 mx-auto flex justify-center items-center relative">
      <div className="bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-black text-center">
          Change Password
        </h2>

        <p className="text-red-600 text-center mt-2">
          <span className="text-black font-semibold">Note:</span> Ensure your
          new password is strong and secure.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {[
            {
              label: "Old Password",
              name: "oldPassword",
              validation: { required: "Old Password is required" },
            },
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
                  message: "Password must contain at least one letter",
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
                  {showPassword[field.name] ? (
                    <FaEye className="text-black" />
                  ) : (
                    <FaEyeSlash className="text-black" />
                  )}
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
            Change Password
          </button>
          <button
            className="bg-gray-300 w-full flex p-3 mt-4  rounded-lg border-0 text-black cursor-pointer  
                                   font-sans font-semibold items-center gap-1 justify-center"
            onClick={() => {
              navigate("/");
            }}
          >
            <IoMdArrowRoundBack size={18} />
            <span>Back</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

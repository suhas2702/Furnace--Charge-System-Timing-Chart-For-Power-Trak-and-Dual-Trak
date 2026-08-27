import React, { useState } from "react";
import { useForm } from "react-hook-form";
import furnaceframe from "./../../assets/furnace_frame.jpg";
import { login } from "../../operations/index.js";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "./Spinner/Spinner.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../Slices/auth.js";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("------ Login Api Calling ------");
    dispatch(
      login(data.email, data.password, setIsFilled, navigate, setLoading)
    );

    if (!loading) {
      console.log(isFilled);
      if (!isFilled) navigate("/additional-details");
      else navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-62px)] w-10/12 mx-auto flex justify-center items-center relative">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-62px)] place-items-center">
      <div className="flex items-center w-11/12 lg:w-10/12 mt-[50px] lg:mt-[25px] relative gap-7 mx-auto h-[300px] md:h-[500px]  lg:h-[500px] justify-evenly">
        <div className="lg:space-y-[10px] flex flex-col justify-center w-[315px] md:w-[325px] lg:w-[400px] p-3 md:p-0 lg:p-0">
          <div className="space-y-[10px] lg:space-y-[10px]">
            <div className="text-[18px] md:text-[20px] lg:text-[35px] font-bold tracking-tight text-[#EA454C]">
              WELCOME BACK,
            </div>
            <h2 className="mt-[2px] text-[20px] md:text-[22px] text-2xl font-bold tracking-tight text-gray-900">
              Login to your account
            </h2>
          </div>

          <div className="mt-2">
            <form
              className="space-y-[20px] lg:space-y-[30px]"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Email Field */}
              <div>
                <label className="block text-[12px] md:text-[13px] lg:text-sm font-medium text-gray-900">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="block w-full h-[27px] md:h-[30px] lg:h-[36px] rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-700 focus:outline-black placeholder:text-gray-400 sm:text-sm"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field with Show/Hide Icon */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-[12px] md:text-[13px] lg:text-sm font-medium text-gray-900">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="text-blue-500 font-semibold text-[12px] md:text-[13px] transition-all
                         duration-100 lg:text-sm text-back hover:text-blue-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="block w-full h-[27px] md:h-[30px] lg:h-[36px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-700 focus:outline-black placeholder:text-gray-400 sm:text-sm"
                  />

                  <span
                    className="absolute right-3 top-[6px] md:top-2 lg:top-[10px] cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEye className="text-black" />
                    ) : (
                      <FaEyeSlash className="text-black" />
                    )}
                  </span>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  className="w-full mt-4 p-3 rounded-md text-white font-semibold transition-all cursor-pointer hover:shadow-xl bg-[#EA454C] hover:bg-[#D23E44]"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Image (for larger screens) */}
        <img
          src={furnaceframe}
          alt=""
          className="md:w-[300px] md:h-[275px] lg:w-[500px] lg:h-[425px] hidden md:block lg:block"
        />
      </div>
    </div>
  );
}

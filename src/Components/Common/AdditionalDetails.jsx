import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { setAdditionalDetails } from "../../operations/index.js";
import Spinner from "./Spinner/Spinner.jsx";
import { useState } from "react";

const AdditionalDetails = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    dispatch(
      setAdditionalDetails(
        user.email,
        data.nickname,
        data.college,
        data.school,
        navigate,
        setLoading,
        token
      )
    );
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
        className="absolute top-5 left-1 px-5 py-2 bg-white text-[#EA454C] border hover:shadow-2xl border-[] font-semibold cursor-pointer rounded-lg  transition-all"
      >
        Back
      </button>

      <div className="bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-black text-center">
          Hi, {user?.displayName || "there"}!
        </h2>

        <p className="text-red-600 text-center mt-2">
          <span className="text-black font-semibold">Note : </span> These
          details will be used to verify your identity if you forget your
          password. Please remember them carefully.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {[
            {
              label: "Nickname",
              name: "nickname",
              placeholder: "Enter your nickname",
            },
            {
              label: "School Name",
              name: "school",
              placeholder: "Enter your school name",
            },
            {
              label: "College Name",
              name: "college",
              placeholder: "Enter your college name",
            },
          ].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block font-medium text-gray-700 mb-1">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(field.name, {
                  required: `${field.label} is required`,
                })}
                placeholder={field.placeholder}
                className="w-full p-[5px] border rounded-md placeholder:text-gray-400 outline-gray-700 focus:outline-black"
              />
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
            className="w-full mt-4 p-3 rounded-md text-white font-semibold transition-all cursor-pointer hover:shadow-xl bg-[#EA454C]  hover:bg-[#D23E44]"
          >
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdditionalDetails;

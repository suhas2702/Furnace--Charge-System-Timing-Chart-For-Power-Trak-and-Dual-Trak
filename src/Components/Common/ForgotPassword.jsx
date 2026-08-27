import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner/Spinner";
import { verifyIdentity, verifyAdditionalDetails } from "../../operations";
import toast from "react-hot-toast";
import { setEmail } from "../../Slices/forgotPassword";
import { useSelector } from "react-redux";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";

const VerifyIdentity = () => {
  const navigate = useNavigate();
  const { email } = useSelector((state) => state.forgotPassword);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1); // Step 1: Enter emailAddress, Step 2: Answer Question
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const questions = [
    { label: "Nickname", name: "nickName" },
    { label: "School Name", name: "schoolName" },
    { label: "College Name", name: "collegeName" },
  ];

  useEffect(() => {
    if (step === 2) {
      const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];
      setSelectedQuestion(randomQuestion);
    }
  }, [step]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const handleEmailAddressSubmit = (data) => {
    dispatch(verifyIdentity(data.emailAddress, setLoading, setStep));
  };

  const handleAnswerSubmit = (data) => {
    if (email) {
      console.log(email);
      dispatch(
        verifyAdditionalDetails({
          email,
          selectedQuestion: selectedQuestion.name,
          details: { [selectedQuestion.name]: data[selectedQuestion.name] },
          setLoading,
          navigate,
        })
      );
    } else {
      toast.error(
        "Do Not Refresh The Page Once You Enter The Email Address in the First Step"
      );
      navigate("/forgot-password");
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
    <div className="min-h-[calc(100vh-62px)] w-10/12 mx-auto flex justify-center items-center relative">
      <div className="bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-black text-center">
          {step === 1
            ? "Please Enter Your Registered Email Address"
            : "Please Answer the question to verify your identity."}
        </h2>
        {step === 2 && (
          <p className="text-red-600 text-center mt-2">
            <span className="text-black font-semibold">Note: </span>
            If you don't remember these answer, please click on reset password .
          </p>
        )}
        {step === 1 && (
          <form
            onSubmit={handleSubmit(handleEmailAddressSubmit)}
            className="mt-6"
          >
            <div className="mb-4 relative">
              <label className="block font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                {...register("emailAddress", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                placeholder="Enter your email address"
                className="w-full p-2 border rounded-md"
              />

              {errors.emailAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emailAddress.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full mt-4 p-3 rounded-md text-white bg-red-500 hover:bg-red-600"
            >
              Next
            </button>
            <div
              className="bg-gray-300 w-full flex p-3 mt-4  rounded-lg border-0 text-black cursor-pointer  
                         font-sans font-semibold items-center gap-1 justify-center"
              onClick={() => {
                dispatch(setEmail(null));
                navigate("/login");
              }}
            >
              <IoMdArrowRoundBack size={18} />
              <span>Back To Login</span>
            </div>
            {/* add button to go back to login */}
          </form>
        )}

        {step === 2 && selectedQuestion && (
          <form onSubmit={handleSubmit(handleAnswerSubmit)} className="mt-6">
            {/* Non-editable Email Field */}
            <div className="mb-4">
              <div className=" relative">
                <label className="block font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>

                {/* Spinner or Tick Mark on the Right */}
                <div className="absolute right-3 top-1 transform ">
                  <span className="text-green-500 text-xl">
                    <BsCheckCircleFill />
                  </span>
                </div>
              </div>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full p-1 border rounded-md bg-gray-200 cursor-not-allowed"
              />
            </div>

            {/* Security Question */}
            <div className="mb-4">
              <div className="flex justify-between">
                <label className="block font-medium text-gray-700 mb-1">
                  {selectedQuestion.label}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => {
                    dispatch(setEmail(null));
                    navigate("/reset-password");
                  }}
                  className="text-blue-500 font-semibold text-[12px] md:text-[13px] transition-all
                                       duration-100 lg:text-sm text-back cursor-pointer hover:text-blue-700"
                >
                  Reset password?
                </div>
              </div>
              <input
                type="text"
                {...register(selectedQuestion.name, {
                  required: `${selectedQuestion.label} is required`,
                })}
                placeholder={`Enter your ${selectedQuestion.label.toLowerCase()}`}
                className="w-full p-1 border rounded-md placeholder:text-gray-400 outline-gray-700 focus:outline-black"
              />
              {errors[selectedQuestion.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[selectedQuestion.name].message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className="w-full mt-4 p-3 rounded-md text-white font-semibold transition-all cursor-pointer hover:shadow-xl bg-[#EA454C] hover:bg-[#D23E44]"
            >
              Verify Identity
            </button>
            <div
              className="bg-gray-300 w-full flex p-3 mt-4  rounded-lg border-0 text-black cursor-pointer  
                         font-sans font-semibold items-center gap-1 justify-center"
              onClick={() => {
                dispatch(setEmail(null));
                navigate("/login");
              }}
            >
              <IoMdArrowRoundBack size={18} />
              <span>Back To Login</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyIdentity;

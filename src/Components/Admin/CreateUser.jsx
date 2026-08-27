import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import furnaceframe from "../../assets/furnace_frame.jpg";
import { createUser } from "../../operations/index.js";
import Spinner from "../Common/Spinner/Spinner";
import { apiConnector } from "../../apiConnector";
import { Endpoints } from "../../apis";
import { IoMdArrowRoundBack } from "react-icons/io";

const CreateUser = () => {
  const { token } = useSelector((state) => state.auth);
  const { GETCOMPANYNAMES_API } = Endpoints;
  const [companyNames, setCompanyNames] = useState([]);
  useEffect(() => {
    const getCompanyNames = async () => {
      try {
        const response = await apiConnector("GET", GETCOMPANYNAMES_API, null, {
          Authorization: `${token}`,
        });
        setCompanyNames(response.data.companyNames);
      } catch (e) {
        console.log("-------Error While Fetching Company Names---------", e);
      }
    };
    getCompanyNames();
  }, []);
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password Do Not Match");
      return;
    }

    data.active = isActive ? "1" : "0";

    dispatch(
      createUser(
        data.firstName,
        data.lastName,
        data.email,
        data.role,
        data.companyName,
        data.departmentName,
        data.displayName,
        data.active,
        navigate,
        token
      )
    );
  };
  if (loading) {
    return (
      <div className="h-[calc(100vh-62px)] w-10/12 flex justify-center items-center relative">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="grid min-h-[calc(100vh-62px)] place-items-center">
      <div className="flex flex-col lg:flex-row items-center w-full max-w-6xl relative gap-7 mx-auto justify-evenly p-10">
        <div className="w-full max-w-md">
          <h2 className="mt-4 text-xl md:text-3xl lg:text-[35px] font-bold tracking-tight text-[#EA454C] text-center lg:text-left">
            Create User
          </h2>
          <div
            className="mt-2 text-sm
              tracking-tight text-black text-center lg:text-left"
          >
            The Fields Marked with <span className="text-red-500">*</span> are
            required
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col bg-white mt-4"
          >
            <div className="w-full flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-900">
                  Firstname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("firstName", { required: "Required" })}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-900">
                  Lastname
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-900">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email", { required: "Required" })}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
              />
            </div>

            <div className="mt-4 w-full flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-900">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("companyName", { required: "Required" })}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 focus:outline-indigo-600"
                >
                  <option value="">Select Company</option>
                  {companyNames.map((company, index) => (
                    <option key={index} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-900">
                  Department Name
                </label>
                <input
                  type="text"
                  {...register("departmentName")}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
                />
              </div>
            </div>

            <div className="mt-4 w-full flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-900">
                  Display name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("displayName", { required: "Required" })}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600"
                />
              </div>
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-900">
                  {" "}
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("role", { required: "Required" })}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 focus:outline-indigo-600"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Salesman">Salesman</option>
                </select>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-2 mt-6">
              <div className="flex h-6 items-center">
                <button
                  type="button"
                  className={`flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-gray-900/5 transition-colors duration-200 ease-in-out ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    isActive ? "bg-[#EA454C]" : "bg-gray-200"
                  }`}
                  role="switch"
                  aria-checked={isActive}
                  onClick={() => setIsActive(!isActive)}
                >
                  <span
                    aria-hidden="true"
                    className={`size-4 transform rounded-full bg-white ring-1 shadow-xs ring-gray-900/5 transition duration-200 ease-in-out ${
                      isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
              <label className="text-sm font-medium text-gray-900">
                Active <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="bg-[#EA454C]  hover:bg-[#D23E44] cursor-pointer text-white p-2 rounded w-full"
              >
                Create
              </button>
              <div
                className="bg-gray-300 w-full flex p-2 mt-4  rounded-lg border-0 text-black cursor-pointer  
                                                   font-sans font-semibold items-center gap-1 justify-center"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <IoMdArrowRoundBack size={18} />
                <span>Back</span>
              </div>
            </div>
          </form>
        </div>

        <img
          src={furnaceframe}
          alt=""
          className="hidden lg:block lg:w-[40%] max-w-[500px] mt-6"
        />
      </div>
    </div>
  );
};

export default CreateUser;

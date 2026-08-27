import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { apiConnector } from "../../apiConnector";
import { Endpoints } from "../../apis";
import Spinner from "../Common/Spinner/Spinner";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const EditUser = () => {
  const { GETUSERDETAILS_API, EDITUSERDETAILS_API } = Endpoints;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { email } = useParams();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await apiConnector(
          "POST",
          GETUSERDETAILS_API,
          { email },
          { Authorization: `${token}` }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }

        const user = response.data.UserDetail;
        setInitialData(user); // Save initial values for comparison

        // Set form values
        setValue("firstName", user?.firstName || "-");
        setValue("lastName", user?.lastName || "-");
        setValue("displayName", user.displayName || "-");
        setValue("email", user.email || "-");
        setValue("companyName", user.companyName || "-");
        setValue("departmentName", user.departmentName || "-");
        setValue("role", user.role || "-");
        setIsActive(user.active);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [email, setValue]);

  const onSubmit = async (data) => {
    // Check if any changes are made
    if (
      initialData &&
      data.firstName === initialData.firstName &&
      data.lastName === initialData.lastName &&
      data.displayName === initialData.displayName &&
      data.role === initialData.role &&
      isActive === initialData.active
    ) {
      toast.error(
        "No changes are made. Please make some changes before submitting."
      );
      return;
    }

    try {
      setLoading(true);
      let response = await apiConnector(
        "PUT",
        EDITUSERDETAILS_API,
        {
          email,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          role: data.role,
          isActive,
        },
        { Authorization: `${token}` }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("User Details Edited Successfully!");
      navigate("/manage-users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to edit user details. Try again.");
    } finally {
      setLoading(false);
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
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center mt-8 p-4 relative">
      <div className="flex flex-col items-center w-full max-w-lg p-8 bg-white rounded-lg shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
        <h2 className="text-4xl font-bold text-[#EA454C] mt-4">Edit User</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mt-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-900">
              First Name
            </label>
            <input
              type="text"
              {...register("firstName", { required: "Required" })}
              className="w-full mt-1 rounded-md border px-3 py-1"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Last Name
            </label>
            <input
              type="text"
              {...register("lastName")}
              className="w-full mt-1 rounded-md border px-3 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Display Name
            </label>
            <input
              type="text"
              {...register("displayName")}
              className="w-full mt-1 rounded-md border px-3 py-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Role
            </label>
            <select
              {...register("role")}
              className="w-full mt-1 rounded-md border px-3 py-1"
            >
              <option value="Admin">Admin</option>
              <option value="Salesman">Salesman</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full mt-1 rounded-md border px-3 py-1 bg-gray-200"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Company Name
            </label>
            <input
              type="text"
              {...register("companyName")}
              className="w-full mt-1 rounded-md border px-3 py-1 bg-gray-200"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Department Name
            </label>
            <input
              type="text"
              {...register("departmentName")}
              className="w-full mt-1 rounded-md border px-3 py-1 bg-gray-200"
              disabled
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-2 mt-6">
            <button
              type="button"
              className={`flex w-8 flex-none rounded-full p-px ring-1 ring-gray-900/5 transition-colors duration-200 ease-in-out ring-inset ${
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
            <label className="text-sm font-medium text-gray-900">Active</label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#EA454C] text-white p-2 rounded"
          >
            Edit Details
          </button>

          <div
            className="bg-gray-300 w-full flex p-2 rounded border-0 text-black cursor-pointer  
                font-sans font-semibold items-center gap-1 justify-center"
            onClick={() => navigate(-1)}
          >
            <IoMdArrowRoundBack size={18} />
            <span>Back</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;

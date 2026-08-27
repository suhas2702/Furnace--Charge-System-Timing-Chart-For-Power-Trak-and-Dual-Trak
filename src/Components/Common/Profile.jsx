import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateDisplayName } from "../../operations/index.js";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSave } from "react-icons/fa";
import Spinner from "./Spinner/Spinner.jsx";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");

  const handleSave = () => {
    dispatch(updateDisplayName(user.email, displayName, token, setLoading));
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-62px)] flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-62px)] relative  flex items-center justify-center">
      <div className="w-[475px] max-w-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)] h-[505] bg-white rounded-xl p-6">
        {/* Back Button */}
        <button
          className="absolute top-5 left-32 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md flex items-center gap-2 shadow-md transition-all"
          onClick={() => navigate("/")}
        >
          <IoMdArrowRoundBack size={18} />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center border-b pb-6">
          <div className="relative">
            <img
              src={user?.img}
              alt="Profile"
              className="w-18 h-18 rounded-full border-4 border-gray-300 shadow-md hover:shadow-lg transition-all"
            />
          </div>

          <div className=" flex items-baseline gap-3 justify-center mt-2">
            {editing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="p-2  w-64 border text-center text-xl font-semibold border-gray-300 shadow-sm"
              />
            ) : (
              <h2 className="text-xl  p-2 font-semibold text-gray-900">
                {displayName}
              </h2>
            )}

            <button
              onClick={editing ? handleSave : () => setEditing(true)}
              className="mt-3 px-5 py-2 flex items-center gap-2 text-black bg-gray-300 transition-all rounded-lg shadow-md"
            >
              {editing ? <FaSave /> : <FaEdit />}
              {editing ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4">
          {[
            { label: "First Name", value: user?.firstName },
            { label: "Last Name", value: user?.lastName },
            { label: "Email", value: user?.email },
            { label: "Company", value: user?.companyName },
            { label: "Department", value: user?.departmentName },
            { label: "Role", value: role },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 px-4 py-[7px] rounded-lg shadow-sm cursor-not-allowed"
            >
              <p className="font-bold text-gray-900 w-1/3">{item.label} :</p>
              <p className="w-2/3 text-gray-700 font-medium">
                {item.value || "-"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;

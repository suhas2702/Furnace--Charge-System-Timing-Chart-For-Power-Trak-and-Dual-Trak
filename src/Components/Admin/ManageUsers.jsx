import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiConnector } from "../../apiConnector";
import { Endpoints } from "../../apis";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RiAddFill } from "react-icons/ri";
import Spinner from "../Common/Spinner/Spinner";
import ConfirmationModal from "../Common/ConfimationModal";
import { useDispatch } from "react-redux";
import { resetPasswordRequest } from "../../operations";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  MdEdit,
  MdDelete,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const { GETALLUSERSDETAILS_API, DELETEUSER_API, TOGGLEACTIVE_API } = Endpoints;

const ManageUsers = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [dummy, setDummy] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [jumpPage, setJumpPage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const response = await apiConnector(
          "GET",
          GETALLUSERSDETAILS_API,
          null,
          { Authorization: `${token}` }
        );

        if (!response.data.success) {
          throw new error(response.data.message);
        }
        // let arr = [];
        // for (let i = 0; i < 50; i++) {
        //   arr.push(...response.data.Users);
        // }
        // setUsers(arr);
        setUsers(response.data.Users);
      } catch (error) {
        console.log("GET_USERS_API ERROR............", error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleEdit = (email) => {
    navigate(`/edit-user/${email}`);
  };

  const handleDelete = async (email) => {
    setConfirmationModal({
      text1: "Are You Sure You Want To Delete The User?",
      text2: "User Will Be Permenently Deleted",
      btn1Text: "Delete",
      btn2Text: "Cancel",
      btn1Handler: () => deleteUsers(email),
      btn2Handler: () => setConfirmationModal(null),
    });
    const deleteUsers = async (email) => {
      try {
        setLoading(true);
        const response = await apiConnector(
          "DELETE",
          DELETEUSER_API,
          { email },
          {
            Authorization: `${token}`,
          }
        );
        if (!response.data.success) {
          throw new error(response.data.message);
        }

        toast.success("User Deleted Successfully");
        const getUserResponse = await apiConnector(
          "GET",
          GETALLUSERSDETAILS_API,
          null,
          {
            Authorization: ` ${token}`,
          }
        );

        if (!getUserResponse.data.success) {
          throw new error(getUserResponse.data.message);
        }
        setUsers(getUserResponse.data.Users);
      } catch (error) {
        console.log("Delete User Api Error............", error);
        // toast.error("Failed to fetch user details");
      }
      setConfirmationModal(null);
      setLoading(false);
    };
  };

  const handleResetPassword = (email, setLoading, token) => {
    setConfirmationModal({
      text1: "Are You Sure You Want To Reset The Password Of The User?",
      text2: "New Password Will Be Sent To The User",
      btn1Text: "Reset",
      btn2Text: "Cancel",
      btn1Handler: () => resetPassword(email, setLoading, token),
      btn2Handler: () => setConfirmationModal(null),
    });
    const resetPassword = (email) => {
      dispatch(resetPasswordRequest(email, setLoading, token));
      setConfirmationModal(null);
    };
  };

  const handleActivate = async (email, isActive) => {
    const msg = isActive ? "Deactivate" : "Activate";
    const action = isActive ? "Deactivated" : "Activated";
    setConfirmationModal({
      text1: `Are You Sure You Want To ${msg} The User?`,
      text2: `The User Will be ${action}`,
      btn1Text: `${msg}`,
      btn2Text: "Cancel",
      btn1Handler: () => toggleActive(email, isActive),
      btn2Handler: () => setConfirmationModal(null),
    });
    const toggleActive = async (email, isActive) => {
      const msg = isActive ? "Deactivated" : "Activated";
      try {
        setLoading(true);
        const response = await apiConnector(
          "POST",
          TOGGLEACTIVE_API,
          { email, isActive },
          {
            Authorization: `${token}`,
          }
        );
        if (!response.data.success) {
          throw new error(response.data.message);
        }

        toast.success(`User ${msg} Successfully`);
        const getUserResponse = await apiConnector(
          "GET",
          GETALLUSERSDETAILS_API,
          null,
          {
            Authorization: `${token}`,
          }
        );

        if (!getUserResponse.data.success) {
          throw new error(getUserResponse.data.message);
        }
        setUsers(getUserResponse.data.Users);
      } catch (error) {
        console.log("Toggle ACTIVE Api Error............", error);
        toast.error(`User ${msg} Successfully`);
      }
      setConfirmationModal(null);
      setLoading(false);
    };
  };

  // Filtering users based on email search and selected filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.sEmailAddress
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (filterOption === "All") return matchesSearch;
    if (filterOption === "Admin")
      return matchesSearch && user.sRole === "Admin";
    if (filterOption === "Salesman")
      return matchesSearch && user.sRole === "Salesman";
    if (filterOption === "Active") return matchesSearch && user.bActive;
    if (filterOption === "Inactive") return matchesSearch && !user.bActive;

    return matchesSearch;
  });
  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpPage, 10);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      setCurrentPage(1); // Reset to first page if invalid
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="h-[calc(100vh-62px)] w-10/12 mx-auto flex justify-center items-center relative">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="h-[calc(100vh-62px)] bg-gray-50">
      <div className="w-11/12 mx-auto pt-6">
        <div className="mb-6 flex justify-between items-center bg-white p-4 shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-15 py-[4px] px-3">
            <button
              className="bg-gray-300 flex py-2 px-5  rounded-lg border-0 text-black cursor-pointer  
             font-sans font-semibold items-center gap-1"
              onClick={() => {
                navigate("/");
              }}
            >
              <IoMdArrowRoundBack size={18} />
              <span>Back</span>
            </button>
            <div className="text-[20px] font-bold text-black ">
              Total Users :
              <span className="py-[4px] px-3 text-[20px] font-bold text-red-500">
                {users.length}
              </span>
            </div>
          </div>
          <div className="flex space-x-4 relative">
            <button
              type="submit"
              className="flex items-center gap-1 rounded-md bg-gray-300  b-[#EA454C]   transition-all duration-200 cursor-pointer py-[4px] px-3 text-[16px] font-semibold text-black shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => {
                navigate("/create-user");
              }}
            >
              <RiAddFill /> Add
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Email"
              className="p-2 w-64 border border-gray-300 shadow-sm"
            />
            <FaSearch className="absolute right-30 top-3 text-gray-600" />
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="p-2 border appearance-none border-gray-300 shadow-md bg-white text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300"
            >
              <option value="All">All</option>
              <option value="Admin">Admin</option>
              <option value="Salesman">Salesman</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <MdKeyboardArrowDown className="absolute right-6 top-3" size={20} />
          </div>
        </div>

        <div className="overflow-x-auto bg-white p-3 shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
          <>
            <table className="min-w-full table-auto border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-gray-200 border border-black">
                  <th className="text-center px-4 py-2 w-[75px]  text-sm font-medium text-black border ">
                    Sl. No.
                  </th>
                  <th className="text-center px-4 py-2  text-sm font-medium text-black border ">
                    First Name
                  </th>
                  <th className="text-center px-4 py-2  text-sm font-medium text-black border ">
                    Last Name
                  </th>
                  <th className="text-center px-4 py-2  text-sm font-medium text-black border ">
                    Display Name
                  </th>
                  <th className="text-center px-4 py-2  text-sm font-medium text-black border ">
                    Email
                  </th>
                  <th className="text-center px-4 py-2  text-sm font-medium text-black border ">
                    Role
                  </th>
                  <th className="text-center px-4 py-2 w-[75px]  text-sm font-medium text-black border ">
                    Active
                  </th>
                  <th className="text-center px-4 py-2 w-[360px]  text-sm font-medium text-black border ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length == 0 && (
                  <tr className="hover:bg-gray-50 transition duration-300 text-sm font-medium text-gray-700 border ">
                    <td
                      colSpan="100%"
                      className="px-6 py-2 text-center font-bold text-gray-700 border "
                    >
                      No User Found
                    </td>
                  </tr>
                )}
                {currentUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition duration-300 border "
                  >
                    <td className="px-4 py-1 text-center text-sm font-medium text-gray-700 border w-[75px]">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 text-center py-1 text-sm font-medium text-gray-700 border ">
                      {user.sFirstName}
                    </td>
                    <td className="px-4 py-1 text-center text-sm font-medium text-gray-700 border ">
                      {user.sLastName || "N/A"}
                    </td>
                    <td className="px-4 py-1 text-center text-sm font-medium text-gray-700 border ">{`${user.sDisplayName}`}</td>
                    <td className="px-4 py-1 text-sm font-medium text-center text-gray-700 border ">
                      {user.sEmailAddress}
                    </td>
                    <td className="px-4 py-1 text-sm text-center font-medium text-gray-700 border ">
                      {user.sRole}
                    </td>
                    <td
                      className="px-4 py-1 w-[75]px text-sm text-center font-bold border border-black "
                      style={{ color: user.bActive ? "green" : "red" }}
                    >
                      {user.bActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-4 py-1 w-[360px]  flex items-center  text-center">
                      <button
                        className=" text-black px-3 py-1  rounded-lg cursor-pointer text-xl"
                        onClick={() => handleEdit(user.sEmailAddress)}
                      >
                        <MdEdit />
                      </button>
                      <button
                        className=" text-black px-3 py-1 rounded-lg text-xl cursor-pointer"
                        onClick={() => handleDelete(user.sEmailAddress)}
                      >
                        <MdDelete />
                      </button>
                      <button
                        className=" px-3 rounded-lg w-[100px] cursor-pointer text-md font-semibold "
                        style={{ color: user.bActive ? "red" : "green" }}
                        onClick={() =>
                          handleActivate(user.sEmailAddress, user.bActive)
                        }
                      >
                        {user.bActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className=" px-3 py-1 rounded-lg cursor-pointer text-md font-semibold text-blue-600"
                        onClick={() =>
                          handleResetPassword(
                            user.sEmailAddress,
                            setLoading,
                            token
                          )
                        }
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div></div>

            <div className="flex justify-center items-center mt-6 gap-15">
              <div className="flex space-x-3">
                <div
                  onClick={handleJumpToPage}
                  className="bg-gray-300 flex py-2 px-5  rounded-lg border-0 text-black cursor-pointer  
             font-sans font-semibold items-center gap-1"
                >
                  Go to Page
                </div>
                <input
                  type="text"
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (!isNaN(value)) {
                      setJumpPage(value);
                    }
                  }}
                  size={2}
                  className="p-2 border border-gray-300 shadow-sm text-center"
                />
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`p-2  ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (currentPage !== 1) setCurrentPage((prev) => prev - 1);
                  }}
                  disabled={currentPage === 1}
                >
                  <MdKeyboardDoubleArrowLeft size={24} />
                </div>
                <span className="text-md font-semibold select-none">
                  Page {currentPage} of {totalPages}
                </span>
                <div
                  className={`p-2  ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (currentPage !== totalPages)
                      setCurrentPage((prev) => prev + 1);
                  }}
                  disabled={currentPage === totalPages}
                >
                  <MdKeyboardDoubleArrowRight size={24} />
                </div>
              </div>
              <div className="flex ">
                <div
                  //onClick={}
                  className="flex select-none items-center gap-1 py-[4px] px-3 text-[16px] font-semibold text-black shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  No Of Records/Page :
                </div>
                <input
                  type="text"
                  value={dummy}
                  size={usersPerPage.length || 1}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDummy(value);
                    if (value != 0) setUsersPerPage(Number(value));
                    else setUsersPerPage(10);
                  }}
                  className="p-2 border border-gray-300 shadow-sm text-center"
                />
              </div>
            </div>
          </>
        </div>
      </div>
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ManageUsers;

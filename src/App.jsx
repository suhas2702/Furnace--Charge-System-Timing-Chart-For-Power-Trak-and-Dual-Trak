import NavBar from "./Components/Common/NavBar/Navbar.jsx";
import Login from "./Components/Common/Login.jsx";
import CreateUser from "./Components/Admin/CreateUser.jsx";
import { Route, Routes, useNavigate } from "react-router-dom";
import OpenRoute from "./Components/Common/OpenRoute.jsx";
import PrivateRoute from "./Components/Common/PrivateRoute.jsx";
import Home from "./Components/Common/Home.jsx";
import NotExistRoute from "./Components/Common/NotExistRoute.jsx";
import Profile from "./Components/Common/Profile.jsx";
import AdditionalDetails from "./Components/Common/AdditionalDetails.jsx";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CheckAdditionalFilled from "./Components/Common/CheckAdditionalFilled.jsx";
import ChangePassword from "./Components/Common/ChangePassword.jsx";
import ForgotPassword from "./Components/Common/ForgotPassword.jsx";
import ResetForgotPassword from "./Components/Common/ResetForgotPassword.jsx";
import ProgramInput from "./Components/Common/ProgramInput.jsx";
import ResetPasswordRequestAccepted from "./Components/Common/ResetPasswordRequestAccepted.jsx";
import ResetPassword from "./Components/Common/ResetPassword.jsx";
import { useSelector, useDispatch } from "react-redux";
import ManageUsers from "./Components/Admin/ManageUsers.jsx";
import AcceptResetPasswordReq from "./Components/Admin/AcceptResetPasswordReq.jsx";
import EditUser from "./Components/Admin/EditUser.jsx";
import { setRole } from "./Slices/auth.js";
import toast from "react-hot-toast";
import { apiConnector } from "./apiConnector.js";
import { Endpoints } from "./apis.js";
const { GETROLE_API } = Endpoints;
import Spinner from "./Components/Common/Spinner/Spinner.jsx";
import TimingChart from "./Components/Common/TimingChart.jsx";
import { setLoading } from "./Slices/auth.js";
import { setProgramInput } from "./Slices/programInputs.js";

function App() {
  const location = useLocation();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setProgramInput(false));
  }, [location.pathname]);
  useEffect(() => {
    if (token) {
      const getRole = async () => {
        try {
          dispatch(setLoading(true));
          const response = await apiConnector(
            "POST",
            GETROLE_API,
            { email: user.email },
            {
              Authorization: `${token}`,
            }
          );

          if (!response.data.success) {
            throw new error(response.data.message);
          }
          // let arr = [];
          // for (let i = 0; i < 50; i++) {
          //   arr.push(...response.data.Users);
          // }
          // setUsers(arr);

          dispatch(setRole(response.data.role));
        } catch (error) {
          toast.error("Failed to Get Role");
        }
        dispatch(setLoading(false));
      };

      getRole();
    }
  }, [token, user?.email, dispatch]);

  if (loading || (token && !role)) {
    return (
      <div className="h-[calc(100vh-62px)] w-10/12 mx-auto flex justify-center items-center relative">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-x-hidden bg-[rgba(33, 37, 41, .8)]">
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        {role === "Admin" && (
          <Route
            path="/create-user"
            element={
              <PrivateRoute>
                <CreateUser />
              </PrivateRoute>
            }
          />
        )}
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/additional-details"
          element={
            <PrivateRoute>
              <CheckAdditionalFilled>
                <AdditionalDetails />
              </CheckAdditionalFilled>
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="/reset-forgotpassword"
          element={
            <OpenRoute>
              <ResetForgotPassword />
            </OpenRoute>
          }
        />
        <Route path="program-input/:programName" element={<ProgramInput />} />
        <Route
          path="reset-password"
          element={
            <OpenRoute>
              <ResetPassword />
            </OpenRoute>
          }
        />
        <Route
          path="/reset-password-request-accepted"
          element={
            <OpenRoute>
              <ResetPasswordRequestAccepted />
            </OpenRoute>
          }
        />

        {role === "Admin" && (
          <Route
            path="/manage-users"
            element={
              <PrivateRoute>
                <ManageUsers />
              </PrivateRoute>
            }
          />
        )}
        {role === "Admin" && (
          <Route
            path="/accept-reset-password-req"
            element={
              <PrivateRoute>
                <AcceptResetPasswordReq />
              </PrivateRoute>
            }
          />
        )}
        <Route path="/timing-chart/:programName" element={<TimingChart />} />
        {role === "Admin" && (
          <Route
            path="/edit-user/:email"
            element={
              <PrivateRoute>
                <EditUser />
              </PrivateRoute>
            }
          />
        )}
        <Route path="*" element={<NotExistRoute />} />
      </Routes>
    </div>
  );
}

export default App;

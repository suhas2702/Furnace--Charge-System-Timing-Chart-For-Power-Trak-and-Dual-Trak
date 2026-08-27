import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";
import ProfileDropdown from "./ProfileDropdown";
import Menubar from "../../Admin/Menubar";
import logo from "../../../assets/inductotherm-group-logo.webp";
import { FaBell } from "react-icons/fa6";
import NotificationBox from "../NotificationBox";
import { apiConnector } from "../../../apiConnector";
import { Endpoints } from "../../../apis";
const { CHECKADDITIONALDETAILS_API } = Endpoints;
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const [notificationBoxOpen, setNotificationBoxOpen] = useState(false);
  const location = useLocation();
  // useEffect(() => {
  //   if (token && location.pathname != "/additional-details") {
  //     const chechkIsFilled = async (email, token) => {
  //       try {
  //         const response = await apiConnector(
  //           "POST",
  //           CHECKADDITIONALDETAILS_API,
  //           {
  //             email,
  //           },
  //           { Authorization: `${token}` }
  //         );
  //         console.log("Check Additional Details Response: ", response);

  //         if (!response.data.success) {
  //           throw new Error(response.data.message);
  //         }
  //         if (!response.data.additionalDetailsFilled) {
  //           setTimeout(() => {
  //             setNotificationBoxOpen(true);
  //             setShake(true);
  //           }, 20000);
  //         }
  //       } catch (error) {
  //         console.error("Error checking additional details:", error);
  //       }
  //     };
  //     chechkIsFilled(user.email, token);
  //   }
  // }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="w-screen h-[62px] bg-slate-50 shadow-[0px_2px_3px_2px_rgb(171,179,188)] relative z-10">
        <div className="flex justify-between w-10/12 mx-auto pt-[4px] lg:pt-[4px] pb-[4px] lg:pb-[8px] items-center">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="w-[100px] lg:w-[143px] h-[35px] lg:h-[50px]"
              />
            </Link>
          </div>

          {/* User Controls */}
          <div className="flex gap-10 items-end">
            {token && notificationBoxOpen && (
              <>
                <div
                  className={`text-black-600 ${
                    shake ? "animate-shake" : ""
                  } hover:animate-shake`}
                >
                  <FaBell size={24} />
                </div>
                <NotificationBox
                  setShake={setShake}
                  setNotificationBoxOpen={setNotificationBoxOpen}
                />
              </>
            )}
            {token && (
              <p className="text-black text-[18px] font-medium italic">
                Welcome, {user.displayName}
              </p>
            )}
            {token && role === "Admin" && (
              <div
                className="w-[40px] h-[30px] cursor-pointer relative"
                onClick={() => {
                  setOpen(false);
                  setIsOpen(!isOpen);
                }}
              >
                <TiThMenu className="w-full h-full" />
                <Menubar setIsOpen={setIsOpen} isOpen={isOpen} />
              </div>
            )}
            {token && (
              <ProfileDropdown
                setIsOpen={setIsOpen}
                open={open}
                setOpen={setOpen}
              />
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

import { useRef, useState } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../operations/index.js";
import { MdEdit } from "react-icons/md";
import ConfirmationModal from "../ConfimationModal";

const ProfileDropdown = ({ setIsOpen, open, setOpen }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmationModal, setConfirmationModal] = useState(null);
  const { user } = useSelector((state) => state.profile);

  const handleLogout = () => {
    setConfirmationModal({
      text1: "Are You Sure You Want To Logout?",
      text2: "You Will Be Logged Out",
      btn1Text: "Logout",
      btn2Text: "Cancel",
      btn1Handler: () => dispatch(logout(navigate)),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const menuItems = [
    { name: "Profile", path: "/profile", icon: <CgProfile /> },
    { name: "Change Password", path: "/change-password", icon: <MdEdit /> },
    { name: "Logout", action: handleLogout, icon: <VscSignOut /> },
  ];

  return (
    <button
      className="relative cursor-pointer"
      onClick={() => {
        setIsOpen(false);
        setOpen(!open);
      }}
    >
      <div className="flex items-center gap-x-1">
        <img
          src={user.img}
          className="w-[25px] lg:w-[32px] rounded-full object-cover border lg:border-2 border-blue-950 p-[1px]"
          alt=""
        />
        <AiOutlineCaretDown className="text-[11px] lg:text-sm text-[black] " />
      </div>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-1 top-[22px] lg:top-[30px] lg:right-0 z-10 mt-2 w-[130px] md:w-[155px] lg:w-[155px] origin-top-right rounded-md bg-white ring-1 shadow-[0px_5px_15px_rgba(0,0,0,0.35)] ring-black/5"
          ref={ref}
        >
          {menuItems.map((item, index) =>
            item.path ? (
              <Link
                key={index}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex gap-2 items-center h-[28px] lg:h-[42px] px-2 py-2 text-gray-700 text-xs md:text-sm lg:text-sm font-semibold hover:bg-gray-200 
                ${
                  index !== menuItems.length - 1
                    ? "border-b border-gray-300"
                    : ""
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ) : (
              <div
                key={index}
                onClick={item.action}
                className={`flex gap-2 items-center h-[28px] lg:h-[42px] px-2 py-1 text-gray-700 text-xs md:text-sm lg:text-sm font-semibold hover:bg-gray-200 cursor-pointer 
                ${
                  index !== menuItems.length - 1
                    ? "border-b border-gray-300"
                    : ""
                }`}
              >
                {item.icon}
                {item.name}
              </div>
            )
          )}
        </div>
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </button>
  );
};

export default ProfileDropdown;

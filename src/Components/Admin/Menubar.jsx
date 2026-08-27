import { useRef } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { IoMdAddCircle } from "react-icons/io";
import { RiResetLeftLine } from "react-icons/ri";

const MenubarDropdown = ({ isOpen, setIsOpen }) => {
  const ref = useRef(null);

  const MenubarLinks = [
    { name: "Create User", path: "/create-user", icon: <IoMdAddCircle /> },
    { name: "Manage User", path: "/manage-users", icon: <AiOutlineUser /> },
  ];

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-2 top-[30px] z-10 mt-2 w-[150px] md:w-[170px] bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.35)] ring-1 ring-black/5 rounded-md"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {MenubarLinks.map((link, index) => (
        <Link
          key={index}
          to={link.path}
          onClick={() => setIsOpen(false)}
          className={`flex gap-2 items-center h-[42px] px-3 text-gray-700 text-sm md:text-base font-medium transition 
            hover:bg-gray-200 ${
              index !== MenubarLinks.length - 1
                ? "border-b border-gray-300"
                : ""
            }`}
        >
          {link.icon}
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default MenubarDropdown;

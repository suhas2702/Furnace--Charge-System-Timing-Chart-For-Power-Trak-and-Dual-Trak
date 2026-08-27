import React from "react";
import { useNavigate } from "react-router-dom";

const ProgramCard = ({ programName, programImg, navigateTo }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 items-center bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-md overflow-hidden w-[425px] h-[500px] transform transition-all duration-100 p-3 ">
      {/* Image Section */}
      <img
        src={programImg}
        alt={programName}
        className="w-full h-[80%] object-cover "
      />

      {/* Content Section */}
      <div className="p-3                                                               flex  gap-10 w-full justify-center items-center text-center">
        <h2 className="text-xl font-semibold text-gray-800">{programName}</h2>

        {/* Button */}
        <button
          className="relative z-10 bg-[#e84949] text-white text-lg font-medium px-6 py-1 cursor-pointer transition-all duration-500 border-3 hover:scale-97 border-transparent shadow-[5px_5px_7px_0px_rgba(0,0,0,0.25)] overflow-hidden efore:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-white before:z-[-1] before:scale-x-0 before:origin-left before:transition-all before:duration-700 hover:before:scale-x-100
         hover:border-[#e84949] over:text-black"
          onClick={() => {
            navigate(`program-input/${navigateTo}`);
          }}
        >
          Input
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;

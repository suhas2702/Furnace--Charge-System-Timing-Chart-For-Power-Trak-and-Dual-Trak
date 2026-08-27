import React from "react";
import ProgramCard from "./ProgramCard";
import { programData } from "../../data";
import { useSelector } from "react-redux";
import NotificationBox from "./NotificationBox";

const Home = () => {
  return (
    <div className="h-[calc(100vh-62px)] w-screen flex flex-col items-center mx-auto pt-5">
      {/* Products Heading */}
      <div className="text-[40px] font-bold text-gray-800">PRODUCTS</div>
      {/* Mapping over programData to display ProgramCard components */}
      <div className="flex flex-wrap justify-center gap-20 mt-1 p-3 w-10/12">
        {programData.map((program, index) => (
          <ProgramCard
            key={index}
            programName={program.programName}
            programImg={program.img}
            navigateTo={program.navigateTo}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

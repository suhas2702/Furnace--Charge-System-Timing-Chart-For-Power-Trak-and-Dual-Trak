import React, { useEffect, useState } from "react";
import { GiCancel } from "react-icons/gi";
import { IoSearch } from "react-icons/io5";
import Spinner from "./Spinner/Spinner";
import { useDispatch } from "react-redux";
import { setprogramInputs, setProgramInput } from "../../Slices/programInputs";
import { MdDelete } from "react-icons/md";
import ConfimationModal from "../Common/ConfimationModal";
import { apiConnector } from "../../apiConnector";
import { Endpoints } from "../../apis";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
const SlideInCards = ({
  setShowPopup,
  showPopup,
  popUpLoading,
  programInputPopUpData,
  handleAutoFill,
}) => {
  const { DELETEPROGRAMINPUT_API } = Endpoints;
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(null);
  const filteredData = programInputPopUpData.filter((card) =>
    card.sCustomerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
  }, [showPopup]);

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains("modal-background")) {
      setShowPopup(false);
    }
  };
  const handleOnClick = (data) => {
    dispatch(setProgramInput(true));
    dispatch(
      setprogramInputs({
        nID: data.nID,
        numberOfPowerSupplies: data.nNoOfPowerSupplies,
        pourRatePerSystem: data.nPourRateperSystem,
        meltPower: data.nMeltPower,
        holdPower: data.nHoldPower,
        furnaceNominalCapacityMetricTons: data.nFurnaceNominalCapacity,
        tapSize: data.nTapSize,
        pourTimePerTap: data.nPourTimeperTap,
        timeToLoadInitialCharge: data.nTimeToLoadInitialChargeintoFurnace,
        lbsPerKW: data.nLBSperKW,
        pourTemperature: data.nPourTemperature,
        metalType: data.sMetalType,
        travelTimeToFurnace: data.nTravelTimeofChargeCarToFurnace,
        travelTimeToLoading: data.nTravelTimeofChargeCarToLoadingPosition,
        customerName: data.sCustomerName,
        name: "timeBetweenTaps",
        timeBetweenTaps: data.nTimebetweentaps,
        createdBy: data.sCreatedBy,
      })
    );
    setShowPopup(false);
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);

    // Date in YYYY-MM-DD
    const formattedDate = dateObj.toISOString().split("T")[0];

    // Convert to local 12-hour format
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    hours = hours.toString().padStart(2, "0");

    return `${formattedDate}    ${hours}:${minutes} ${ampm}`;
  };
  const handleDelete = async (id) => {
    try {
      const response = await apiConnector(
        "DELETE",
        DELETEPROGRAMINPUT_API,
        { id },
        {
          Authorization: `${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Input Deleted Successfully");
    } catch (error) {
      console.error("Error While Deleting the Program Inputs", error);
    }
    setConfirmationModal(null);
    handleAutoFill();
  };
  return (
    <>
      {showPopup && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          <div className="fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-700 ease-in-out translate-y-0 h-[75vh]">
            <div className="w-full h-full bg-white rounded-t-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)] p-6   animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-[#EA454C]">
                  Saved Inputs
                </h1>
                <button
                  onClick={() => {
                    setShowPopup(false);
                  }}
                  className="text-red-500 hover:text-red-700 text-lg font-semibold"
                >
                  <GiCancel size={35} />
                </button>
              </div>

              {/* Search bar */}
              <div className="mb-6 flex justify-center ">
                <input
                  type="text"
                  placeholder="Search "
                  className="w-[50%] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoSearch className="absolute right-127 top-[82px]" size={24} />
              </div>

              <div className="flex flex-wrap gap-12 justify-center w-full overflow-y-auto h-[calc(75vh-180px)] p-4">
                {popUpLoading ? (
                  <div className="h-full w-full mx-auto flex justify-center items-center relative">
                    <Spinner />
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="w-full text-center text-gray-700 font-bold text-lg">
                    No Data Found
                  </div>
                ) : (
                  filteredData.map((card, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-50 w-[25%] h-[190px] px-4 py-8 rounded-xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)] cursor-pointer"
                      onClick={() => handleOnClick(card)}
                    >
                      {/* Delete Icon */}
                      <div
                        className="absolute top-4 right-4 text-gray-800 hover:text-gray-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmationModal({
                            text1: `Are You Sure You Want To Delete The Input Details`,
                            text2: `The Input Details Will Be Deleted`,
                            btn1Text: `Delete`,
                            btn2Text: "Cancel",
                            btn1Handler: () => handleDelete(card.nID),
                            btn2Handler: () => setConfirmationModal(null),
                          });
                        }}
                      >
                        <MdDelete size={24} />
                      </div>

                      {/* Card Content */}
                      <h2 className="text-xl font-bold mb-2 text-[#EA454C]">
                        {card.sCustomerName}
                      </h2>
                      <p className="text-gray-600">
                        FCE Nominal Capacity:{" "}
                        <span className="font-bold">
                          {card.nFurnaceNominalCapacity} Metric Tons
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Melt Power:{" "}
                        <span className="font-bold">{card.nMeltPower} KW</span>
                      </p>
                      <p className="text-gray-600">
                        Pouring Temperature:{" "}
                        <span className="font-bold">
                          {card.nPourTemperature} Deg F
                        </span>
                      </p>
                      <div className="w-full flex justify-between">
                        <p className="text-gray-600 text-[12px] font-medium">
                          .......
                        </p>
                        <p className="text-gray-600 text-[12px] font-medium">
                          {formatDate(card.dtCreatedDate)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {confirmationModal ? (
            <ConfimationModal modalData={confirmationModal} />
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};

export default SlideInCards;

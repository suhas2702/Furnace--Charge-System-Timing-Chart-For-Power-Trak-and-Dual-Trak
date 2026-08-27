import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTimingChartInputs } from "../../Slices/timingChartValues";
import toast from "react-hot-toast";
import { MdErrorOutline } from "react-icons/md";
import { useParams } from "react-router-dom";
import ProgramInputPopUp from "./ProgramInputPopUp";
import { apiConnector } from "../../apiConnector";
import { Endpoints } from "../../apis";
import Spinner from "../Common/Spinner/Spinner";
import ConfirmationModal from "../Common/ConfimationModal";
import { useRef } from "react";
import { IoColorFill } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";

function truncateToDecimalPlace(num, decimalPlaces = 1) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.floor(num * factor) / factor;
}

import {
  programOutput,
  dualTrakProgramInput,
  chargingSystemInput,
  chargingSystemOutput,
} from "../../data";
import { setprogramInputs } from "../../Slices/programInputs";

const ProgramInput = () => {
  const { SETPROGRAMINPUT_API, GETPROGRAMINPUT_API, EDITPROGRAMINPUT_API } =
    Endpoints;
  const { token } = useSelector((state) => state.auth);
  const { programInputs, setProgramInput } = useSelector(
    (state) => state.programInputValues
  );
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popUpLoading, setPopUpLoading] = useState(false);
  const [programInputPopUpData, setProgramInputPopUpData] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const { programName } = useParams();
  const [customerName, setCustomerName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const buttonRef = useRef(null);

  const triggerClick = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [outputData, setOutputData] = useState({});
  const [chargingOutputData, setChargingOutputData] = useState({});
  const [districtManager, setDistrictManager] = useState(user.displayName);
  const numberOfPowerSupplies = watch("numberOfPowerSupplies", 1);
  const [noOfPowerSupplies, setNoOfPowerSuppies] = useState(1);
  const furnaceNominalCapacityMetricTons = watch(
    "furnaceNominalCapacityMetricTons",
    0
  );

  //FurnaceNominalCapacityTons for taps per melt
  const [furnaceNominalCapacityTonsValue, setfurnaceNominalCapacityTons] =
    useState(0);
  useEffect(() => {
    setfurnaceNominalCapacityTons(
      parseFloat(furnaceNominalCapacityMetricTons) * 1.1
    );
  }, [furnaceNominalCapacityMetricTons]);

  const pourRatePerSystemValue = watch("pourRatePerSystem", 0);
  const tapSizeValue = watch("tapSize", 0);
  //Taps Per MElt
  const [tapsPerMeltValue, setTapsPerMeltValue] = useState(0);
  //Calculating TAPS pER mELT vALUE
  useEffect(() => {
    setTapsPerMeltValue(
      Math.round(furnaceNominalCapacityTonsValue / parseFloat(tapSizeValue))
    );
  }, [furnaceNominalCapacityTonsValue, tapSizeValue]);

  useEffect(() => {
    setNoOfPowerSuppies(numberOfPowerSupplies);
  }, [numberOfPowerSupplies]);
  //Calculating Total Cycle time
  const meltPowerValue = watch("meltPower", 0);
  const lbsPerKwValue = watch("lbsPerKW", 0);
  //Calculating Power Utilization

  const [meltRateValue, setMeltRateValue] = useState(0);
  useEffect(() => {
    setMeltRateValue(
      (parseFloat(meltPowerValue) * parseFloat(lbsPerKwValue)) / 2000
    );
  }, [meltPowerValue, lbsPerKwValue]);

  const [powerUtilizationValue, setPowerUtilizationValue] = useState(0);

  useEffect(() => {
    if (pourRatePerSystemValue && meltRateValue) {
      setPowerUtilizationValue(
        parseFloat(
          parseFloat(pourRatePerSystemValue) / parseFloat(meltRateValue)
        )
      );
    }
  }, [meltRateValue, pourRatePerSystemValue]);

  const [meltTimeValue, setMeltTimeValue] = useState(0);
  useEffect(() => {
    setMeltTimeValue(
      (parseFloat(furnaceNominalCapacityTonsValue) /
        parseFloat(meltRateValue)) *
        60
    );
  }, [furnaceNominalCapacityTonsValue, meltRateValue]);
  //Total Cycle Time Calcualtion
  const [totalCycleTimeValue, setTotalCycleTimeValue] = useState(0);
  useEffect(() => {
    if (meltTimeValue && powerUtilizationValue) {
      setTotalCycleTimeValue(
        Math.round(
          (parseFloat(meltTimeValue) / parseFloat(powerUtilizationValue)) * 2
        )
      );
    }
  }, [powerUtilizationValue, meltTimeValue]);

  //------------------Calculating Taps Per Melt Value---------------
  const [timeBetweenTapValue, setTimeBetweenTapValue] = useState(0);
  useEffect(() => {
    if (tapsPerMeltValue) {
      if (tapsPerMeltValue === 1 && totalCycleTimeValue) {
        setTimeBetweenTapValue(Math.round(totalCycleTimeValue));
      } else if (
        pourRatePerSystemValue &&
        tapSizeValue &&
        tapsPerMeltValue !== 1
      ) {
        const n = Math.round(
          parseFloat(
            60 / (parseFloat(pourRatePerSystemValue) / parseFloat(tapSizeValue))
          ).toFixed(2)
        );
        setTimeBetweenTapValue(n);
      } else {
        setTimeBetweenTapValue(0);
      }
    }
  }, [
    pourRatePerSystemValue,
    tapSizeValue,
    tapsPerMeltValue,
    totalCycleTimeValue,
  ]);

  useEffect(() => {
    if (setProgramInput) {
      Object.entries(programInputs).map(([key, value]) => {
        setValue(key, value);
      });
      setCustomerName(programInputs.customerName);
      setDistrictManager(programInputs.createdBy);
      triggerClick();
    }
  }, [programInputs, setProgramInput]);

  const handleDataSubmit = (data, event) => {
    if (event.nativeEvent.submitter.name === "calculate") {
      handleCalculate(data);
    } else if (event.nativeEvent.submitter.name === "drawChart") {
      handleDrawChart(data);
    } else if (event.nativeEvent.submitter.name === "save") {
      if (customerName === "") {
        toast.error("Please Enter The Customer Name");
        return;
      }
      setConfirmationModal({
        text1: "Are You Sure You Want To Save The Inputs",
        text2: "The Input Data Will Be Saved",
        btn1Text: "Save",
        btn2Text: "Cancel",
        btn1Handler: () => handleSave(data),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
    // } else if (event.nativeEvent.submitter.name === "edit") {
    //   let hasChanged = Object.keys(data).some((key) => {
    //     console.log(data[key], programInputs[key]);
    //     return data[key] !== programInputs[key];
    //   });
    //   console.log(customerName);
    //   console.log(programInputs.customerName);
    //   if (customerName != programInputs.customerName) hasChanged = true;
    //   console.log(hasChanged);
    //   if (!hasChanged) {
    //     toast.error("No changes detected.");
    //     return;
    //   }

    //   setConfirmationModal({
    //     text1: "Are You Sure You Want To Edit The Inputs",
    //     text2: "The Input Data Will Be Edited",
    //     btn1Text: "Edit",
    //     btn2Text: "Cancel",
    //     btn1Handler: () => handleEdit(data),
    //     btn2Handler: () => setConfirmationModal(null),
    //   });
    // }
  };
  // const handleEdit = async (data) => {
  //   setConfirmationModal(null);
  //   const changedValues = {
  //     nID: programInputs.nID,
  //     lastUpdatedBy: user.displayName,
  //     customerName: customerName,
  //   };

  //   for (const key in data) {
  //     if (data[key] != programInputs[key]) {
  //       changedValues[key] = data[key];
  //     }
  //   }
  //   console.log("programInputs", programInputs);
  //   console.log(changedValues);
  //   setLoading(true);
  //   try {
  //     const response = await apiConnector(
  //       "POST",
  //       EDITPROGRAMINPUT_API,
  //       changedValues,
  //       {
  //         Authorization: `${token}`,
  //       }
  //     );
  //     console.log();
  //     if (!response.data.success) {
  //       throw new Error(response.data.message);
  //     }
  //     console.log("response.data", response.data.data[0]);
  //     const data = response.data.data[0];
  //     dispatch(
  //       setprogramInputs({
  //         nID: data.nID,
  //         numberOfPowerSupplies: data.nNoOfPowerSupplies,
  //         pourRatePerSystem: data.nPourRateperSystem,
  //         meltPower: data.nMeltPower,
  //         holdPower: data.nHoldPower,
  //         furnaceNominalCapacityMetricTons: data.nFurnaceNominalCapacity,
  //         tapSize: data.nTapSize,
  //         pourTimePerTap: data.nPourTimeperTap,
  //         timeToLoadInitialCharge: data.nTimeToLoadInitialChargeintoFurnace,
  //         lbsPerKW: data.nLBSperKW,
  //         pourTemperature: data.nPourTemperature,
  //         metalType: data.sMetalType,
  //         travelTimeToFurnace: data.nTravelTimeofChargeCarToFurnace,
  //         travelTimeToLoading: data.nTravelTimeofChargeCarToLoadingPosition,
  //         customerName: data.sCustomerName,
  //         name: "timeBetweenTaps",
  //         timeBetweenTaps: data.nTimebetweentaps,
  //         createdBy: data.sCreatedBy,
  //       })
  //     );
  //     toast.success("Inputs Edited Successfully");
  //   } catch (error) {
  //     console.error("Error While Editing the Program Inputs", error);
  //     toast.error("Failed to Edit Inputs.");
  //   }
  //   setLoading(false);
  // };

  const handleDrawChart = (data) => {
    const furnaceNominalCapacityTons =
      parseFloat(data.furnaceNominalCapacityMetricTons) * 1.1 || 0;

    const meltPower = parseFloat(data.meltPower) || 0;

    const lbsPerKW = parseFloat(data.lbsPerKW) || 0;

    const meltRate = (meltPower * lbsPerKW) / 2000; // MeltRate Has A Formatted Value

    const batchMeltTime = (furnaceNominalCapacityTons / meltRate) * 60 || 0;

    const timeToLoadInitialCharge =
      parseFloat(data.timeToLoadInitialCharge) || 0;

    const pourRatePerSystem = parseFloat(data.pourRatePerSystem) || 0;

    const powerUtilization = parseFloat(pourRatePerSystem / meltRate);

    const totalCycleTime =
      parseFloat(parseFloat((batchMeltTime / powerUtilization) * 2)) || 0;
    const pourTimePerTap = parseFloat(data.pourTimePerTap) || 0;

    const chargingTimeToFurnace = parseFloat(0.7 * batchMeltTime);

    const tapSize = parseFloat(data.tapSize) || 1;

    const tapsPerMelt = furnaceNominalCapacityTons / tapSize || 0;

    const batchPourTime = parseFloat(
      tapsPerMelt * pourTimePerTap +
        (timeBetweenTapValue - pourTimePerTap) * (tapsPerMelt - 1)
    );
    const timeBetweenTapsFCE = Math.round(
      Math.round(totalCycleTime) / numberOfPowerSupplies
    );

    const offTimeAvailable = parseFloat(
      (
        totalCycleTime -
        batchPourTime -
        batchMeltTime -
        timeToLoadInitialCharge
      ).toFixed(1)
    );
    dispatch(
      setTimingChartInputs({
        melting: Math.round(batchMeltTime),
        pourTemperature: Math.round(parseFloat(data.pourTemperature)),
        initialCharge: Math.round(timeToLoadInitialCharge),
        meltPrep: Math.round(offTimeAvailable),
        tapTime: Math.round(batchPourTime),
        noOfTaps: Math.round(furnaceNominalCapacityTons / tapSize),
        metalType: data.metalType,
        powerUtilization: Math.round(powerUtilization * 100),
        totalCycleTime: Math.round(totalCycleTime),
        travelTime: Math.round(parseFloat(data.travelTimeToFurnace)),
        refillTime: Math.round(
          totalCycleTime -
            chargingTimeToFurnace -
            parseFloat(data.travelTimeToFurnace) -
            parseFloat(data.travelTimeToLoading) -
            batchPourTime / 2
        ),
        chargingTime: Math.round(chargingTimeToFurnace),
        meltPower: Math.round(meltPower),
        furnaceNominalCapacityTons: parseFloat(
          furnaceNominalCapacityTons
        ).toFixed(2),
        furnaceNominalCapacityMetricTons: Math.round(
          furnaceNominalCapacityMetricTons
        ).toFixed(2),
        districtManager,
        pourTimePerTap: Math.round(parseFloat(data.pourTimePerTap)),
        timeBetweenTaps: Math.round(parseFloat(timeBetweenTapValue)),
        noOfFurnace: parseInt(data.numberOfPowerSupplies * 2),
        timeBetweenTapsFCE,
        travtravelTimeCarToLoadingPosWidth: Math.round(
          parseFloat(data.travelTimeToLoading)
        ),
        travtravelTimeCarToFCEPosWidth: Math.round(
          parseFloat(data.travelTimeToFurnace)
        ),
        totalOffTime: parseFloat(Math.round(totalCycleTime / 2)),
      })
    );
    navigate(`/timing-chart/${programName}`);
  };
  const handleSave = async (data) => {
    setConfirmationModal(null);

    const pName = programName;
    const furnaceNominalCapacity =
      parseFloat(data.furnaceNominalCapacityMetricTons) || 0;
    const meltPower = parseFloat(data.meltPower) || 0;
    const pourTemperture = parseFloat(data.pourTemperature);
    const lbsPerKw = parseFloat(data.lbsPerKW) || 0;
    const pourRatePerSystem = parseFloat(data.pourRatePerSystem) || 0;
    const pourTimePerTap = parseFloat(data.pourTimePerTap) || 0;
    const tapSize = parseFloat(data.tapSize) || 1;
    const timeToLoadInitialCharge =
      parseFloat(data.timeToLoadInitialCharge) || 0;
    const travelTimeCarToFurnace = parseFloat(data.travelTimeToFurnace) || 0;
    const travelTimeCarToLoadingPos = parseFloat(data.travelTimeToLoading) || 0;
    const continousMetalSupply = "Yes";
    const metalType = data.metalType || "";
    const holdPower = parseFloat(data.holdPower) || 0;
    const noOfFurnace = noOfPowerSupplies * 2;
    const noOfChargeCar = noOfPowerSupplies * 2;
    const createdBy = user.displayName;
    const lastUpdatedBy = user.displayName;
    const timeBetweenTaps = 0;
    // console.log({
    //   furnaceNominalCapacity,
    //   meltPower,
    //   pourTemperture,
    //   lbsPerKw,
    //   pourRatePerSystem,
    //   pourTimePerTap,
    //   tapSize,
    //   timeToLoadInitialCharge,
    //   travelTimeCarToFurnace,
    //   travelTimeCarToLoadingPos,
    //   continousMetalSupply,
    //   timeBetweenTaps,
    //   metalType,
    //   holdPower,
    // });

    setLoading(true);
    try {
      const response = await apiConnector(
        "POST",
        SETPROGRAMINPUT_API,
        {
          pName,
          lastUpdatedBy,
          createdBy,
          furnaceNominalCapacity,
          meltPower,
          pourTemperture,
          lbsPerKw,
          pourRatePerSystem,
          continousMetalSupply,
          pourTimePerTap,
          tapSize,
          timeToLoadInitialCharge,
          travelTimeCarToFurnace,
          travelTimeCarToLoadingPos,
          metalType,
          holdPower,
          timeBetweenTaps,
          noOfPowerSupplies,
          customerName,
          noOfFurnace,
          noOfChargeCar,
        },
        {
          Authorization: `${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Data Saved Successfully");
    } catch (error) {
      console.error("Error While Saving the Program Values", error);
    }
    setLoading(false);
  };
  const handleCalculate = (data) => {
    const pourRatePerSystem = parseFloat(data.pourRatePerSystem) || 0;
    const formattedPourRatePerSystem = parseFloat(
      Number.isInteger(pourRatePerSystem)
        ? pourRatePerSystem.toFixed(0)
        : pourRatePerSystem.toFixed(1)
    );
    const meltPower = parseFloat(data.meltPower) || 0;
    const lbsPerKW = parseFloat(data.lbsPerKW) || 0;
    //const effectivePourRate = noOfPowerSupplies * pourRatePerSystem || 1;
    const tapSize = parseFloat(data.tapSize) || 1;
    //const pourRate = parseFloat(data.pourRate) || 0;
    const pourTimePerTap = parseFloat(data.pourTimePerTap) || 0;
    const furnaceNominalCapacityTons =
      parseFloat(data.furnaceNominalCapacityMetricTons) * 1.1 || 0;
    const timeToLoadInitialCharge =
      parseFloat(data.timeToLoadInitialCharge) || 0;
    //const travelTimeToLoading = parseFloat(data.travelTimeToLoading) || 0;

    // const meltRate = ((meltPower * lbsPerKW) / 2000).toFixed(1) || 0;
    const meltRate = (meltPower * lbsPerKW) / 2000;
    const formattedMeltRate = parseFloat(
      Number.isInteger(meltRate) ? meltRate.toFixed(0) : meltRate.toFixed(1)
    );

    const powerUtilization = parseFloat(pourRatePerSystem / meltRate);
    const formattedPowerUtilization = parseFloat(
      Number.isInteger(powerUtilization * 100)
        ? (powerUtilization * 100).toFixed(0)
        : (powerUtilization * 100).toFixed(1)
    );

    const tapsPerHour = pourRatePerSystem / tapSize;
    const formattedTapsPerHour = parseFloat(
      Number.isInteger(tapsPerHour)
        ? tapsPerHour.toFixed(0)
        : tapsPerHour.toFixed(1)
    );

    const batchMeltTime = parseFloat(
      ((furnaceNominalCapacityTons / meltRate) * 60).toFixed(1) || 0
    );

    const totalCycleTime =
      truncateToDecimalPlace(
        parseFloat((batchMeltTime / powerUtilization) * 2)
      ) || 0;

    const formattedTotalCycleTime = parseFloat(
      Number.isInteger(totalCycleTime)
        ? totalCycleTime.toFixed(0)
        : totalCycleTime.toFixed(1)
    );

    const chargingTimeToFurnace = (0.7 * batchMeltTime).toFixed(1);
    const tapsPerMelt = furnaceNominalCapacityTons / tapSize || 0;
    if (tapsPerMelt == 1) {
      setTimeBetweenTapValue(totalCycleTime);
    }
    const formattedTapsPerMelt = parseFloat(
      Number.isInteger(tapsPerMelt)
        ? tapsPerMelt.toFixed(0)
        : tapsPerMelt.toFixed(1)
    );
    const timeBetweenTaps1 = parseFloat(60 / tapsPerHour);
    const formattedTimeBetweenTaps1 = parseFloat(
      Number.isInteger(timeBetweenTaps1)
        ? timeBetweenTaps1.toFixed(0)
        : timeBetweenTaps1.toFixed(1)
    );
    const timeBetweenTaps2 = parseFloat(
      60 * (tapSize / (pourRatePerSystem * 2))
    );
    const formattedTimeBetweenTaps2 = parseFloat(
      Number.isInteger(timeBetweenTaps2)
        ? timeBetweenTaps2.toFixed(0)
        : timeBetweenTaps2.toFixed(1)
    );
    const timeBetweenTaps3 = parseFloat(
      60 * (tapSize / (pourRatePerSystem * 3))
    );
    const formattedTimeBetweenTaps3 = parseFloat(
      Number.isInteger(timeBetweenTaps3)
        ? timeBetweenTaps3.toFixed(0)
        : timeBetweenTaps3.toFixed(1)
    );

    let batchPourTime = parseFloat(
      (
        tapsPerMelt * pourTimePerTap +
        (60 / (pourRatePerSystem / tapSize) - pourTimePerTap) *
          (tapsPerMelt - 1)
      ).toFixed(1)
    );
    if (tapsPerMelt < 2) {
      batchPourTime = pourTimePerTap;
    }
    const offTimeAvailable = parseFloat(
      (
        totalCycleTime -
          batchPourTime -
          batchMeltTime -
          timeToLoadInitialCharge || 0
      ).toFixed(1)
    );
    const powerDensity = parseFloat(
      (meltPower / furnaceNominalCapacityTons).toFixed(1)
    );
    const formattedPowerDensity = parseFloat(
      Number.isInteger(powerDensity)
        ? powerDensity.toFixed(0)
        : powerDensity.toFixed(1)
    );

    setOutputData({
      formattedMeltRate,
      formattedPowerDensity,
      formattedTapsPerHour,
      formattedPowerUtilization,
      batchMeltTime,
      batchPourTime,
      formattedTapsPerMelt,
      corelessFurnacePourRate1: formattedPourRatePerSystem || 0,
      corelessFurnacePourRate2: formattedPourRatePerSystem * 2 || 0,
      corelessFurnacePourRate3: formattedPourRatePerSystem * 3 || 0,
      formattedTimeBetweenTaps1,
      totalOffTime: (totalCycleTime / 2).toFixed(1) || 0,
      offTimeAvailable,
      formattedTotalCycleTime,
      timeToLoadInitialChargeintoFce: timeToLoadInitialCharge,
      formattedTimeBetweenTaps2,
      formattedTimeBetweenTaps3,
    });

    setChargingOutputData({
      chargingTimeToFurnace,
      refillTime:
        (
          totalCycleTime -
          chargingTimeToFurnace -
          data.travelTimeToFurnace -
          data.travelTimeToLoading -
          batchPourTime / 2
        ).toFixed(1) || 0,
    });
  };
  const handleAutoFill = async () => {
    setShowPopup(true);
    setPopUpLoading(true);

    try {
      const response = await apiConnector(
        "POST",
        GETPROGRAMINPUT_API,
        { programName },
        {
          Authorization: `${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setProgramInputPopUpData(response.data.data);
    } catch (error) {
      console.error("Error While Saving the Program Values", error);
    }
    setPopUpLoading(false);
  };
  const handleChange = (event) => {
    setCustomerName(event.target.value);
  };
  if (loading) {
    return (
      <div className="h-[calc(100vh-62px)] w-10/12 mx-auto flex justify-center items-center relative">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="w-[95%] mx-auto p-5 bg-gray-50 shadow-lg rounded-lg m mt-12">
      <ProgramInputPopUp
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        popUpLoading={popUpLoading}
        programInputPopUpData={programInputPopUpData}
        handleAutoFill={handleAutoFill}
      ></ProgramInputPopUp>
      <h1 className="text-4xl font-bold text-center text-[#EA454C] mb-8 uppercase">
        Furnace & Charging System Timing Chart
      </h1>

      {/* Customer & Manager Name */}
      <div className="mb-5 flex justify-between">
        <div className="w-[47%] pr-3 flex items-center">
          <label className="font-semibold text-black text-[17px] p-2 w-auto text-center">
            Customer Name <span className="text-red-500">*</span> :
          </label>
          <input
            type="text"
            className="border-b text-gray-700 text-[20px] font-semibold border-black p-2 outline-none flex-1"
            value={customerName}
            onChange={handleChange}
          />
        </div>

        <div className="w-1/2 pl-3 flex items-center">
          <label className="font-semibold text-black text-[17px] p-2 w-auto text-center">
            District Manager Name :
          </label>
          <input
            type="text"
            className="border-b text-gray-700 text-[20px] font-semibold border-black p-2 outline-none flex-1"
            value={districtManager}
            readOnly
          />
        </div>
      </div>
      <div
        name="autofill"
        className="px-6 py-3 w-[150px] text-center flex justify-center items-center gap-2 bg-[#EA454C] cursor-pointer text-black font-bold rounded-md transition duration-200"
        onClick={handleAutoFill}
      >
        <IoColorFill size={18} /> AutoFill
      </div>
      <form onSubmit={handleSubmit(handleDataSubmit)} className="space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mt-2 mb-4">
            FURNACE
          </h1>

          <div className="grid grid-cols-2 gap-5 shadow-[0px_5px_15px_rgba(0,0,0,0.35)] p-3">
            {/* Furnace Input Table */}
            <div className=" rounded-md p-3">
              {/* <h2 className="text-xl font-semibold text-black mb-4 text-center">
                Inputs
              </h2> */}
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#fa545d] text-black uppercase">
                    <th className="border p-2">Input</th>
                    <th className="border p-2 w-30">Value</th>
                    <th className="border p-2 w-15">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {dualTrakProgramInput.map(({ label, name, unit }) => (
                    <tr key={name} className="hover:bg-gray-100 relative">
                      <td className="border p-2 text-[14px] text-black font-semibold uppercase">
                        {label}
                      </td>
                      <td
                        className={`border p-2 ${
                          ![
                            "continuousMetalSupply",
                            "furnaceNominalCapacityTons",
                            "numOfFurnace",
                            "timeBetweenTaps",
                          ].includes(name)
                            ? "bg-[#bec8fc]"
                            : ""
                        }`}
                      >
                        {name === "numberOfPowerSupplies" ? (
                          <div className="relative w-full">
                            <select
                              {...register(name, {
                                required: "Required",
                              })}
                              className="w-full font-semibold box-border appearance-none text-center text-gray-800 rounded-md outline-none"
                            >
                              {errors[name] && (
                                <p className="text-red-500 absolute text-sm left-[350px] top-[10px] flex gap-2 items-center">
                                  <MdErrorOutline className="text-lg" />{" "}
                                  {errors[name]?.message}{" "}
                                </p>
                              )}
                              <option value="1">1</option>
                              <option value="2">2</option>
                            </select>
                            <MdKeyboardArrowDown className=" absolute top-1 right-[2px] pointer-events-none text-xl text-gray-800" />
                          </div>
                        ) : name === "metalType" ? (
                          <>
                            <select
                              {...register(name, { required: "Required" })}
                              className="w-full text-gray-800 font-semibold rounded-md outline-none"
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Select
                              </option>
                              <option value="Aluminium">Aluminium</option>
                              <option value="Brass">Brass</option>
                              <option value="Bronze">Bronze</option>
                              <option value="Iron">Iron</option>
                              <option value="Steel">Steel</option>
                              <option value="Stainless Steel">
                                Stainless Steel
                              </option>
                            </select>

                            {errors[name] && (
                              <p className="text-red-500 absolute text-sm left-[350px] top-[10px] flex gap-2 items-center">
                                <MdErrorOutline className="text-lg" />
                                {errors[name]?.message}
                              </p>
                            )}
                          </>
                        ) : name === "continuousMetalSupply" ? (
                          <>
                            {" "}
                            <input
                              type="text"
                              value="Yes"
                              readOnly
                              className="w-full text-gray-800 font-semibold text-center rounded-md outline-none"
                            />
                            {errors[name] && (
                              <p className="text-red-500 absolute text-sm left-[350px] top-[10px] flex gap-2 items-center">
                                <MdErrorOutline className="text-lg" />{" "}
                                {errors[name]?.message}{" "}
                              </p>
                            )}
                          </>
                        ) : name === "furnaceNominalCapacityTons" ? (
                          <>
                            {" "}
                            <input
                              type="text"
                              value={
                                Number(furnaceNominalCapacityMetricTons) *
                                  1.1 !==
                                0
                                  ? Number.isInteger(
                                      Number(furnaceNominalCapacityMetricTons) *
                                        1.1
                                    )
                                    ? Number(
                                        furnaceNominalCapacityMetricTons * 1.1
                                      ).toFixed(0)
                                    : Number(
                                        furnaceNominalCapacityMetricTons * 1.1
                                      ).toFixed(2)
                                  : "—"
                              }
                              readOnly
                              className="appearance-none w-full text-gray-800 font-semibold text-center rounded-md outline-none"
                            />
                            {errors[name] && (
                              <p className="text-red-500 absolute text-sm left-[350px] top-[10px] flex gap-2 items-center">
                                <MdErrorOutline className="text-lg" />{" "}
                                {errors[name]?.message}{" "}
                              </p>
                            )}
                          </>
                        ) : name === "numOfFurnace" ? (
                          <input
                            type="text"
                            value={numberOfPowerSupplies * 2}
                            readOnly
                            className="w-full text-gray-800 font-semibold text-center rounded-md outline-none "
                          />
                        ) : name === "timeBetweenTaps" ? (
                          <input
                            type="text"
                            value={
                              Number(timeBetweenTapValue) !== 0
                                ? Number.isInteger(Number(timeBetweenTapValue))
                                  ? Number(timeBetweenTapValue).toFixed(0)
                                  : Number(timeBetweenTapValue).toFixed(2)
                                : "—"
                            }
                            readOnly
                            className="w-full text-gray-800 font-semibold text-center rounded-md outline-none "
                          />
                        ) : (
                          <>
                            {" "}
                            <input
                              type="text"
                              {...register(name, { required: "Required" })}
                              className="w-full relative text-gray-800 font-semibold text-center rounded-md outline-none focus:border-transparent focus:ring-0"
                            />
                            {errors[name] && (
                              <p className="text-red-500 absolute text-sm left-[350px] top-[10px] flex gap-2 items-center">
                                <MdErrorOutline className="text-lg" />{" "}
                                {errors[name]?.message}{" "}
                              </p>
                            )}
                          </>
                        )}
                      </td>
                      <td className="border text-center font-medium p-2 text-[14px]">
                        {unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Furnace Output Table */}
            <div className=" rounded-md p-3">
              {/* <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                Outputs
              </h2> */}
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#fa545d] text-black uppercase">
                    <th className="border p-2">Output</th>
                    <th className="border p-2 w-28">Value</th>
                    <th className="border p-2 w-15">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {programOutput.map(({ label, key, unit }) => {
                    if (
                      noOfPowerSupplies != 2 &&
                      noOfPowerSupplies != 3 &&
                      (key === "corelessFurnacePourRate2" ||
                        key === "formattedTimeBetweenTaps2")
                    ) {
                      return null;
                    }
                    if (
                      noOfPowerSupplies != 3 &&
                      (key === "corelessFurnacePourRate3" ||
                        key === "formattedTimeBetweenTaps3")
                    ) {
                      return null;
                    }
                    return (
                      <tr key={key} className="hover:bg-gray-100">
                        <td className="border p-2 font-semibold uppercase text-[14px]">
                          {label}
                        </td>
                        <td className="border border-black p-2 text-center font-bold text-gray-800">
                          {outputData[key] ?? "—"}
                        </td>
                        <td className="border text-center font-medium p-2 text-[14px]">
                          {unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Charging System Input & Output Tables */}
        <div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mt-1 mb-4">
            CHARGING SYSTEM
          </h1>
          <div className="grid grid-cols-2 gap-5 shadow-[0px_5px_15px_rgba(0,0,0,0.35)] p-3">
            {/* Charging System Input Table */}
            <div className="rounded-md p-3">
              {/* <h2 className="text-xl font-semibold text-black mb-4 text-center">
                Inputs
              </h2> */}
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#fa545d] text-black uppercase">
                    <th className="border p-2">Input</th>
                    <th className="border p-2 w-28">Value</th>
                    <th className="border p-2 w-15">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {chargingSystemInput.map(({ label, name, unit }) => (
                    <tr key={name} className="hover:bg-gray-100 relative">
                      <td className="border p-2 text-black font-semibold uppercase text-[14px]">
                        {label}
                      </td>
                      <td
                        className={`border p-2 ${
                          !["numCars"].includes(name) ? "bg-[#bec8fc]" : ""
                        }`}
                      >
                        {name == "numCars" ? (
                          <>
                            <input
                              type="text"
                              value={numberOfPowerSupplies * 2}
                              readOnly
                              className="w-full text-gray-800 font-semibold text-center rounded-md outline-none"
                            />
                            {errors[name] && (
                              <p className="text-red-500 absolute text-sm left-[350px] top-[10px] flex gap-2 items-center">
                                <MdErrorOutline className="text-lg" />{" "}
                                {errors[name]?.message}{" "}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              {...register(name, { required: "Required" })}
                              className="w-full text-gray-800 font-semibold text-center rounded-md outline-none"
                            />
                            {errors[name] && (
                              <p className="text-red-500 absolute text-sm left-[350px] top-[10px] flex gap-2 items-center">
                                <MdErrorOutline className="text-lg" />{" "}
                                {errors[name]?.message}{" "}
                              </p>
                            )}
                          </>
                        )}
                      </td>
                      <td className="border text-center font-medium p-2 text-[14px]">
                        {unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Charging System Output Table */}
            <div className=" rounded-md p-3">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#fa545d] text-black uppercase">
                    <th className="border p-2">Output</th>
                    <th className="border p-2 w-28">Value</th>
                    <th className="border p-2 w-15">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {chargingSystemOutput.map(({ label, key, unit }) => (
                    <tr key={key} className="hover:bg-gray-100">
                      <td className="border border-black p-2 font-semibold uppercase text-[14px]">
                        {label}
                      </td>
                      <td className="border border-black p-2 text-center font-bold text-gray-800">
                        {chargingOutputData[key] ?? "—"}
                      </td>
                      <td className="border border-black text-center font-medium p-2 text-[14px]">
                        {unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className=" mt-8 flex  gap-5 justify-start">
          <button
            ref={buttonRef}
            type="submit"
            name="calculate"
            className="px-6 py-3 bg-gray-300 cursor-pointer text-black font-bold rounded-md transition duration-200"
          >
            Calculate
          </button>
          <button
            type="submit"
            name="drawChart"
            className="px-6 py-3 bg-gray-300 cursor-pointer text-black font-bold rounded-md transition duration-200"
          >
            Draw Chart
          </button>
          <button
            type="submit"
            name="save"
            className="px-6 py-3 bg-blue-500 flex items-center justify-center gap-2 cursor-pointer text-black font-bold rounded-md transition duration-200"
          >
            <FaRegSave size={18} /> Save
          </button>
        </div>
      </form>
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProgramInput;

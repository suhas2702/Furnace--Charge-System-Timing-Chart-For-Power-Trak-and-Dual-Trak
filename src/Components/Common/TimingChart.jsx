import chargingSystemImg from "../../assets/chargingSystem.jpg";
import furnaceImg from "../../assets/furnace.jpg";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Navigate } from "react-router-dom";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FaFileDownload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import DualTrakTimingChart from "./DualTrakTimingChart";

const TimingChart = () => {
  const { programName } = useParams();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });
  const navigate = useNavigate();
  const { timingChartInputs } = useSelector((state) => state.timingChartValues);

  const [width, setWidth] = useState(
    (((window.innerWidth / 100) * 90) / 100) * 90 - 100
  );
  let scale = 15;
  for (let i = 15; i > 0; i--) {
    scale = i;
    if (timingChartInputs.totalCycleTime * scale > width) continue;
    else {
      break;
    }
  }
  const [iteration, countIteration] = useState(1);
  const tapTime =
    timingChartInputs.noOfTaps * timingChartInputs.pourTimePerTap +
    (timingChartInputs.noOfTaps - 1) * timingChartInputs.timeBetweenTaps;

  const timingChartInput = useSelector(
    (state) => state.timingChartValues.timingChartInputs
  );

  // Check if all values are non-null and non-undefined
  const allValuesFilled = Object.values(timingChartInput).every(
    (value) => value !== null && value !== undefined
  );
  if (!allValuesFilled) {
    const loc = `/program-input/${programName}`;
    return <Navigate to={loc} />;
  }

  if (programName === "dualtrak") {
    return <DualTrakTimingChart />;
  }

  return (
    <div className="w-[90%] relative mx-auto p-5  flex flex-col">
      <div
        ref={contentRef}
        className="w-full flex flex-col mx-auto p-7  gap-10"
        style={{ backgroundColor: "white" }}
      >
        <div className="flex flex-col gap-2 mx-auto">
          <h2 className="text-3xl font-bold text-center  text-red-600 uppercase">
            Projected Furnace and Charging Car Timing Chart
          </h2>
          <div className="text-xl font-bold text-center text-black uppercase">
            {timingChartInputs.meltPower}{" "}
            <span className="italic">
              kw Power-Trak Melting System-Total Production :{" "}
            </span>
            {timingChartInputs.furnaceNominalCapacityTons}{" "}
            <span className="italic">ST/HR</span> (
            {timingChartInputs.furnaceNominalCapacityMetricTons}{" "}
            <span className="italic">MT/HR</span>)
          </div>
          <div className="text-md font-bold text-center text-black uppercase">
            <span className="italic">Metal Type :</span>{" "}
            {timingChartInputs.metalType}
            {"  "}
            <span className="italic">Pour Temperture :</span>
            {"  "}
            {timingChartInputs.pourTemperature}
            {"  "}
            <span className="italic">District Manager :</span>{" "}
            {timingChartInputs.districtManager}
          </div>
        </div>
        {/*Start*/}
        <div className="flex flex-col gap-2 relative mt-12">
          {/*Second*/}
          <div className="flex flex-col relative">
            {/*First*/}
            <div
              className=" flex items-center ml-[225px] absolute -top-14 left-0"
              style={{
                width: `${
                  ((timingChartInputs.initialCharge || 0) +
                    (timingChartInputs.melting || 0) +
                    (timingChartInputs.meltPrep || 0) +
                    (tapTime || 0)) *
                    (scale || 1) -
                  140
                }px`,
                minWidth: `${
                  ((timingChartInputs.initialCharge || 0) +
                    (timingChartInputs.melting || 0) +
                    (timingChartInputs.meltPrep || 0) +
                    (tapTime || 0)) *
                    (scale || 1) -
                  140
                }px`,
              }}
            >
              <div className="w-0 h-0 border-t-[35px] border-t-transparent border-b-[35px] border-b-transparent border-r-[70px] border-r-[#689147e7] absolute -left-[69px]"></div>

              <div
                className="h-10 w-full  box-border flex items-center justify-center"
                style={{ backgroundColor: "#689147e7" }}
              >
                <span className="font-bold uppercase italic">
                  Total Cycle Time : {timingChartInputs.totalCycleTime} - (
                  {timingChartInputs.furnaceNominalCapacityTons} ST/
                  {timingChartInputs.furnaceNominalCapacityMetricTons} MT)
                </span>
              </div>

              <div className="w-0 h-0 border-l-[70px] border-l-[#689147e7] border-t-[35px] border-t-transparent border-b-[35px] border-b-transparent absolute -right-[69px]"></div>
            </div>
            {Array.from({ length: timingChartInputs.noOfFurnace }).map(
              (_, furnaceNo) => (
                <>
                  <div key={furnaceNo} className="flex items-center gap-5">
                    <div className="w-[140px] h-[180px]  flex items-center">
                      <img
                        src={furnaceImg}
                        alt="Logo"
                        className="w-full h-[150px]"
                      />
                    </div>
                    <div className="w-[90%] flex items-center h-[200px]">
                      <div className="w-full mt-12 h-[200px] flex items-start  overflow-x-hidden">
                        <div className="flex relative h-[150px] border-box">
                          {timingChartInputs.timeBetweenTapsFCE * furnaceNo !==
                          0 ? (
                            <>
                              {timingChartInputs.timeBetweenTapsFCE *
                                furnaceNo -
                                tapTime -
                                timingChartInputs.meltPrep >
                                0 && (
                                <div
                                  className=" flex flex-col text-center box-border text-[16px] items-center justify-center  italic overflow-hidden break-words whitespace-normal border text-black text-sm font-bold"
                                  style={{
                                    width: `${
                                      (timingChartInputs.timeBetweenTapsFCE *
                                        furnaceNo -
                                        tapTime -
                                        timingChartInputs.meltPrep) *
                                      scale
                                    }px`,
                                    minWidth: `${
                                      (timingChartInputs.timeBetweenTapsFCE -
                                        tapTime -
                                        timingChartInputs.meltPrep) *
                                      scale
                                    }px`,
                                    backgroundColor: "#b11010",
                                  }}
                                ></div>
                              )}

                              {timingChartInputs.timeBetweenTapsFCE *
                                furnaceNo -
                                tapTime >
                                0 && (
                                <div
                                  className=" italic text-[16px] text-center flex box-border break-words overflow-hidden whitespace-normal  border items-center justify-center text-black text-sm font-bold"
                                  style={{
                                    width: `${
                                      (timingChartInputs.meltPrep >
                                      timingChartInputs.timeBetweenTapsFCE *
                                        furnaceNo -
                                        tapTime
                                        ? timingChartInputs.timeBetweenTapsFCE *
                                            furnaceNo -
                                          tapTime
                                        : timingChartInputs.meltPrep) * scale
                                    }px`,
                                    minWidth: `${
                                      (timingChartInputs.meltPrep >
                                      timingChartInputs.timeBetweenTapsFCE *
                                        furnaceNo -
                                        tapTime
                                        ? timingChartInputs.timeBetweenTapsFCE *
                                            furnaceNo -
                                          tapTime
                                        : timingChartInputs.meltPrep) * scale
                                    }px`,
                                    backgroundColor: "#9c531f",
                                  }}
                                ></div>
                              )}

                              <div className=" box-border overflow-hidden flex  border-black text-black text-sm font-medium">
                                {Array.from({
                                  length: timingChartInputs.noOfTaps,
                                }).map((_, i) => (
                                  <React.Fragment key={i}>
                                    <div
                                      className=" overflow-hidden  box-border flex flex-col justify-center items-center border text-black text-sm font-medium"
                                      style={{
                                        width: `${
                                          timingChartInputs.pourTimePerTap *
                                          scale
                                        }px`,
                                        minWidth: `${
                                          timingChartInputs.pourTimePerTap *
                                          scale
                                        }px`,
                                        backgroundColor: "#1e40af",
                                      }}
                                    >
                                      <span className="text-center text-[0.8em] font-bold">
                                        T
                                      </span>
                                      <span className="text-center text-[0.8em] font-bold">
                                        A
                                      </span>
                                      <span className="text-center text-[0.8em] font-bold">
                                        P
                                      </span>
                                      <span className="text-center text-[0.8em] font-bold">
                                        {i + 1}
                                      </span>
                                    </div>

                                    {tapTime >= 5 && (
                                      <div
                                        className="flex items-center box-border ml-[225px] absolute top-[10px] right-3"
                                        style={{
                                          width: `${tapTime * scale - 24}px`,
                                          minWidth: `${tapTime * scale - 24}px`,
                                        }}
                                      >
                                        <div className="w-0 h-0 box-border border-t-[28px] border-t-transparent border-b-[28px] border-b-transparent border-r-[12px] border-r-yellow-300 absolute -left-[12px]"></div>

                                        <div
                                          className="h-6  w-full box-border flex items-center justify-center"
                                          style={{ backgroundColor: "#fde047" }}
                                        >
                                          <span className="font-bold italic text-center text-[0.64em] p-[1px]">
                                            {tapTime} min
                                          </span>
                                        </div>

                                        <div className="w-0 h-0 border-l-[12px] border-l-yellow-300 border-t-[28px] border-t-transparent border-b-[28px] border-b-transparent absolute -right-[12px]"></div>
                                      </div>
                                    )}

                                    {i !== timingChartInputs.noOfTaps - 1 && (
                                      <div
                                        className=" overflow-hidden  text-black text-sm font-medium"
                                        style={{
                                          width: `${
                                            timingChartInputs.timeBetweenTaps *
                                            scale
                                          }px`,
                                          minWidth: `${
                                            timingChartInputs.timeBetweenTaps *
                                            scale
                                          }px`,
                                          backgroundColor: "#3b82f6",
                                        }}
                                      ></div>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </>
                          ) : null}
                        </div>
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className="flex relative h-[150px]">
                            <div
                              className="border box-border relative overflow-hidden flex items-center justify-center text-black text-sm font-bold"
                              style={{
                                width: `${
                                  timingChartInputs.initialCharge * scale
                                }px`,
                                minWidth: `${
                                  timingChartInputs.initialCharge * scale
                                }px`,
                                backgroundColor: "#758d4b",
                              }}
                            ></div>
                            <div
                              className="absolute w-20 h-8 left-0 top-[150px]"
                              style={{
                                transform: `translateX(${
                                  (timingChartInputs.initialCharge * scale) / 2
                                }px)`,
                              }}
                            >
                              <div
                                className="absolute left-0 top-0 w-[2px] h-[26px] "
                                style={{ backgroundColor: "#000000" }}
                              ></div>
                              <div
                                className="absolute left-0 bottom-[6px] w-full h-[1px] "
                                style={{ backgroundColor: "#000000" }}
                              ></div>
                            </div>
                            <div
                              className=" font-bold absolute top-40 left-20 px-1 py-[2px]"
                              style={{ backgroundColor: "#e5e7f3" }}
                            >
                              Initial Charge ({timingChartInputs.initialCharge}{" "}
                              min)
                            </div>

                            <div
                              className=" flex flex-col text-center text-[16px] items-center justify-center  italic overflow-hidden break-words whitespace-normal box-border border text-black text-sm font-bold p-2"
                              style={{
                                width: `${timingChartInputs.melting * scale}px`,
                                minWidth: `${
                                  timingChartInputs.melting * scale
                                }px`,
                                backgroundColor: "#b11010",
                              }}
                            >
                              <div className="p-2 border">
                                Melting ({timingChartInputs.melting} min)
                                <br />(
                                {
                                  timingChartInputs.furnaceNominalCapacityTons
                                }{" "}
                                ST/
                                {
                                  timingChartInputs.furnaceNominalCapacityMetricTons
                                }{" "}
                                MT)
                                <br />@ {timingChartInputs.meltPower}
                              </div>
                            </div>

                            <div
                              className=" italic text-[16px] text-center p-2 flex break-words overflow-hidden whitespace-normal box-border border items-center justify-center text-black text-sm font-bold"
                              style={{
                                width: `${
                                  timingChartInputs.meltPrep * scale
                                }px`,
                                minWidth: `${
                                  timingChartInputs.meltPrep * scale
                                }px`,
                                backgroundColor: "#9c531f",
                              }}
                            >
                              <div className="p-2 border">
                                {" "}
                                Prep, Slag, Chem, Temp (
                                {timingChartInputs.meltPrep} min)
                              </div>
                            </div>

                            <div
                              className="overflow-hidden box-border flex  border-black  text-black text-sm font-medium"
                              style={{ backgroundColor: "#900C3F" }}
                            >
                              {Array.from({
                                length: timingChartInputs.noOfTaps,
                              }).map((_, i) => (
                                <>
                                  <div
                                    className=" overflow-hidden box-borer flex flex-col justify-center items-center border text-black text-sm font-medium"
                                    style={{
                                      width: `${
                                        timingChartInputs.pourTimePerTap * scale
                                      }px`,
                                      minWidth: `${
                                        timingChartInputs.pourTimePerTap * scale
                                      }px`,
                                      backgroundColor: "#1e40af",
                                    }}
                                  >
                                    <span className="text-center text-[0.8em] font-bold">
                                      T
                                    </span>{" "}
                                    <span className="text-center text-[0.8em] font-bold">
                                      A
                                    </span>{" "}
                                    <span className="text-center text-[0.8em] font-bold">
                                      P
                                    </span>{" "}
                                    <span className="text-center text-[0.8em] font-bold">
                                      {i + 1}
                                    </span>
                                  </div>
                                  {tapTime >= 5 && (
                                    <div
                                      className="flex items-center box-border ml-[225px] absolute top-[10px] right-3"
                                      style={{
                                        width: `${tapTime * scale - 24}px`,
                                        minWidth: `${tapTime * scale - 24}px`,
                                      }}
                                    >
                                      <div className="w-0 h-0 box-border border-t-[28px] border-t-transparent border-b-[28px] border-b-transparent border-r-[12px] border-r-yellow-300 absolute -left-[12px]"></div>

                                      <div
                                        className="h-6  w-full box-border flex items-center justify-center"
                                        style={{ backgroundColor: "#fde047" }}
                                      >
                                        <span className="font-bold italic text-center text-[0.64em] p-[1px]">
                                          {tapTime} min
                                        </span>
                                      </div>

                                      <div className="w-0 h-0 border-l-[12px] border-l-yellow-300 border-t-[28px] border-t-transparent border-b-[28px] border-b-transparent absolute -right-[12px]"></div>
                                    </div>
                                  )}
                                  {i !== timingChartInputs.noOfTaps - 1 && (
                                    <div
                                      className=" overflow-hidden  text-black text-sm font-medium"
                                      style={{
                                        width: `${
                                          timingChartInputs.timeBetweenTaps *
                                          scale
                                        }px`,
                                        minWidth: `${
                                          timingChartInputs.timeBetweenTaps *
                                          scale
                                        }px`,
                                        backgroundColor: "#3b82f6",
                                      }}
                                    ></div>
                                  )}
                                </>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-5">
                      <div className="w-[140px] h-[180px] flex items-center">
                        <img
                          src={chargingSystemImg}
                          alt="Logo"
                          className="w-full h-[150px]"
                        />
                      </div>
                      <div className="w-[90%] flex items-center h-[200px]">
                        <div className="w-full mt-12 h-full flex items-start   overflow-x-hidden">
                          {timingChartInputs.timeBetweenTapsFCE * furnaceNo !==
                            0 && (
                            <div className="flex relative h-[150px]">
                              {timingChartInputs.timeBetweenTapsFCE *
                                furnaceNo -
                                timingChartInputs.refillTime -
                                timingChartInputs.travtravelTimeCarToLoadingPosWidth >
                                0 && (
                                <div
                                  className=" flex-col gap-1 italic text-[16px] text-center font-bold  overflow-hidden break-words whitespace-normal box-border border flex items-center justify-center text-black text-sm "
                                  style={{
                                    width: `${
                                      timingChartInputs.timeBetweenTapsFCE *
                                        furnaceNo -
                                        timingChartInputs.refillTime -
                                        timingChartInputs.travtravelTimeCarToLoadingPosWidth >
                                      timingChartInputs.chargingTime
                                        ? timingChartInputs.chargingTime
                                        : timingChartInputs.timeBetweenTapsFCE *
                                            furnaceNo -
                                          timingChartInputs.refillTime -
                                          timingChartInputs.travtravelTimeCarToLoadingPosWidth *
                                            scale
                                    }px`,
                                    backgroundColor: "#6a853d",
                                    minWidth: `${
                                      (timingChartInputs.timeBetweenTapsFCE *
                                        furnaceNo -
                                        timingChartInputs.refillTime -
                                        timingChartInputs.travtravelTimeCarToLoadingPosWidth >
                                      timingChartInputs.chargingTime
                                        ? timingChartInputs.chargingTime
                                        : timingChartInputs.timeBetweenTapsFCE *
                                            furnaceNo -
                                          timingChartInputs.refillTime -
                                          timingChartInputs.travtravelTimeCarToLoadingPosWidth) *
                                      scale
                                    }px`,
                                  }}
                                >
                                  {" "}
                                </div>
                              )}
                              {timingChartInputs.timeBetweenTapsFCE *
                                furnaceNo -
                                timingChartInputs.refillTime >
                                0 && (
                                <>
                                  <div
                                    className=" border relative box-border overflow-hidden flex items-center justify-center text-black text-sm font-medium"
                                    style={{
                                      width: `${
                                        (timingChartInputs.timeBetweenTapsFCE *
                                          furnaceNo -
                                          timingChartInputs.refillTime >
                                        timingChartInputs.travtravelTimeCarToLoadingPosWidth
                                          ? timingChartInputs.travtravelTimeCarToLoadingPosWidth
                                          : timingChartInputs.timeBetweenTapsFCE *
                                              furnaceNo -
                                            timingChartInputs.refillTime) *
                                        scale
                                      }px`,
                                      minWidth: `${
                                        timingChartInputs.travelTime * scale
                                      }px`,
                                      backgroundColor:
                                        "rgba(255, 255, 0, 0.92)",
                                    }}
                                  ></div>
                                </>
                              )}

                              <div
                                className="flex italic text-[16px] break-words whitespace-normal text-center font-bold items-center box-border border justify-center text-black text-sm "
                                style={{
                                  width: `${
                                    (timingChartInputs.refillTime >
                                    timingChartInputs.timeBetweenTapsFCE *
                                      furnaceNo
                                      ? timingChartInputs.timeBetweenTapsFCE *
                                        furnaceNo
                                      : timingChartInputs.refillTime) * scale
                                  }px`,
                                  minWidth: `${0 * scale}px`,
                                  backgroundColor: "#b7c893",
                                }}
                              >
                                {timingChartInputs.refillTime <
                                  timingChartInputs.timeBetweenTapsFCE *
                                    furnaceNo && (
                                  <span className="p-2 border">
                                    Loading The Charge Car (
                                    {timingChartInputs.refillTime} min)
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          {Array.from({ length: 10 }).map((_, iteration) => (
                            <div
                              key={iteration}
                              className="flex relative h-[150px]"
                            >
                              {iteration !== 0 && (
                                <>
                                  <div
                                    className="box-border border relative  overflow-hidden flex items-center justify-center text-black text-sm font-medium"
                                    style={{
                                      width: `${
                                        timingChartInputs.travelTime * scale
                                      }px`,
                                      minWidth: `${
                                        timingChartInputs.travelTime * scale
                                      }px`,
                                      backgroundColor:
                                        "rgba(255, 255, 0, 0.92)",
                                    }}
                                  ></div>
                                  <div
                                    className="absolute w-20 h-8 left-0 top-[150px]"
                                    style={{
                                      transform: `translateX(${
                                        (timingChartInputs.travelTime * scale) /
                                        2
                                      }px)`,
                                    }}
                                  >
                                    {/* Vertical Line */}
                                    <div
                                      className="absolute left-0 top-0 w-[2px] h-[26px] "
                                      style={{ backgroundColor: "#000000" }}
                                    ></div>

                                    {/* Horizontal Line */}
                                    <div
                                      className="absolute left-0 bottom-[6px] w-[50%] h-[1px] "
                                      style={{ backgroundColor: "#000000" }}
                                    ></div>
                                  </div>
                                  <div
                                    className=" font-bold absolute top-40 left-0 px-1 py-[2px]"
                                    style={{
                                      transform: `translateX(${
                                        ((timingChartInputs.travelTime + 5) *
                                          scale) /
                                        2
                                      }px)`,
                                      backgroundColor: "#d1d5db",
                                    }}
                                  >
                                    Travel Time ({timingChartInputs.travelTime}{" "}
                                    min)
                                  </div>
                                </>
                              )}
                              <div
                                className="flex-col  italic text-[16px] text-center font-bold  overflow-hidden break-words whitespace-normal box-border border flex items-center justify-center text-black text-sm p-2"
                                style={{
                                  width: `${
                                    timingChartInputs.chargingTime * scale
                                  }px`,
                                  minWidth: `${
                                    timingChartInputs.chargingTime * scale
                                  }px`,
                                  backgroundColor: "#6a853d",
                                }}
                              >
                                <div className="p-2 border">
                                  {" "}
                                  Charging The Furnace (
                                  {timingChartInputs.chargingTime} min)
                                  <br />(
                                  {
                                    timingChartInputs.furnaceNominalCapacityTons
                                  }{" "}
                                  ST/
                                  {
                                    timingChartInputs.furnaceNominalCapacityMetricTons
                                  }{" "}
                                  MT)
                                  <br />@ {timingChartInputs.meltPower}
                                </div>
                              </div>

                              <div
                                className=" box-border border relative overflow-hidden flex items-center justify-center text-black text-sm font-medium"
                                style={{
                                  width: `${
                                    timingChartInputs.travelTime * scale
                                  }px`,
                                  minWidth: `${
                                    timingChartInputs.travelTime * scale
                                  }px`,
                                  backgroundColor: "rgba(255, 255, 0, 0.92)",
                                }}
                              ></div>
                              <div
                                className="absolute w-20 h-8 top-[150px]"
                                style={{
                                  left:
                                    iteration === 0
                                      ? `${
                                          timingChartInputs.chargingTime * scale
                                        }px`
                                      : `${
                                          (timingChartInputs.chargingTime +
                                            timingChartInputs.travelTime) *
                                          scale
                                        }px`,

                                  transform: `translateX(${
                                    (timingChartInputs.travelTime * scale) / 2
                                  }px)`,
                                }}
                              >
                                <div
                                  className="absolute left-0 top-0 w-[2px] h-[26px]"
                                  style={{ backgroundColor: "#000000" }}
                                ></div>

                                <div
                                  className="absolute left-0 bottom-[6px] w-[50%] h-[1px] "
                                  style={{ backgroundColor: "#000000" }}
                                ></div>
                              </div>
                              <div
                                className=" font-bold text-center absolute left-0 top-40 px-[2px] py-[2px]"
                                style={{
                                  left:
                                    iteration === 0
                                      ? `${
                                          timingChartInputs.chargingTime * scale
                                        }px`
                                      : `${
                                          (timingChartInputs.chargingTime +
                                            timingChartInputs.travelTime) *
                                          scale
                                        }px`,
                                  backgroundColor: "#d1d5db",

                                  transform: `translateX(${
                                    ((timingChartInputs.travelTime + 5) *
                                      scale) /
                                    2
                                  }px)`,
                                }}
                              >
                                Travel Time ({timingChartInputs.travelTime} min)
                              </div>

                              <div
                                className=" flex p-2 italic text-[16px] box-border break-words whitespace-normal text-center font-bold items-center box-border border justify-center text-black text-sm"
                                style={{
                                  width: `${
                                    timingChartInputs.refillTime * scale
                                  }px`,
                                  minWidth: `${
                                    timingChartInputs.refillTime * scale
                                  }px`,
                                  backgroundColor: "#b7c893",
                                }}
                              >
                                <span className="p-2 border">
                                  Loading The Charge Car (
                                  {timingChartInputs.refillTime} min)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
        <div
          className="relative flex items-center ml-[220px]"
          style={{ width: "calc(90% - 120px)" }}
        >
          <div className="w-0 h-0 border-t-[35px] border-t-transparent box-border border-b-[35px] border-b-transparent border-r-[70px] border-r-[#f4622dfd] absolute -left-[56px]"></div>

          <div
            className="h-10  w-full  box-border flex items-center justify-center"
            style={{ backgroundColor: "rgba(244, 98, 45, 0.99)" }}
          >
            <span className="font-bold uppercase italic">
              Power Utilization : {timingChartInputs.powerUtilization}%
            </span>
          </div>

          <div className="w-0 h-0 border-l-[70px] border-l-[#f4622dfd] border-t-[35px] border-t-transparent border-b-[35px] border-b-transparent absolute -right-[62px]"></div>
        </div>
      </div>
      <div className="flex gap-5 mt-5 items-center justify-center">
        <button
          className=" top-5 left-12 text-black px-4 py-2 rounded-md flex items-center gap-2 shadow-md transition-all"
          style={{ backgroundColor: "#d1d5db" }}
          onClick={() => navigate("/program-input/powertrak")}
        >
          <IoMdArrowRoundBack size={18} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <button
          className=" top-5 left-42 text-black px-4 py-2 bg-blue-500 rounded-md flex items-center gap-2 shadow-md transition-all"
          onClick={() => reactToPrintFn()}
        >
          <FaFileDownload />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
};

export default TimingChart;

// import { useReactToPrint } from "react-to-print";
// import { useRef } from "react";

// const TimingChart = () => {
//   const contentRef = useRef(null);
//   const reactToPrintFn = useReactToPrint({ contentRef });
//   return (
//     <div>
//       <button onClick={() => reactToPrintFn()}>Print</button>
//       <div ref={contentRef}>Content to print</div>
//     </div>
//   );
// };
// export default TimingChart;

import powerTrakImg from "./assets/Power Trak.jpg";
import dualTrakImg from "./assets/Dual Trak.jpg";

export const programData = [
  {
    programName: "VIP® Power-Trak®",
    img: powerTrakImg,
    navigateTo: "powertrak",
  },
  {
    programName: "VIP® Dual-Trak®",
    img: dualTrakImg,
    navigateTo: "dualtrak",
  },
];

export const programInput = [
  {
    label: "Number of Power Supplies",
    name: "numberOfPowerSupplies",
    unit: "",
  },
  {
    label: "Number of Furnaces",
    name: "numOfFurnace",
    unit: "",
  },
  {
    label: "Continuous Metal Supply",
    name: "continuousMetalSupply",
    unit: "",
  },
  {
    label: "Pour Rate Per System",
    name: "pourRatePerSystem",
    unit: "TONS/HR",
  },
  { label: "Melt Power", name: "meltPower", unit: "KW" },
  {
    label: "Furnace Nominal Capacity (Metric Tons)",
    name: "furnaceNominalCapacityMetricTons",
    unit: "METRIC TONS",
    lowerLimit: 0.5,
    upperLimit: 60,
  },
  {
    label: "Furnace Nominal Capacity (Tons)",
    name: "furnaceNominalCapacityTons",
    unit: "TONS",
    lowerLimit: 0.5,
    upperLimit: 60,
  },
  {
    label: "Tap Size",
    name: "tapSize",
    unit: "TONS",
    lowerLimit: 0,
    upperLimit: 60,
  },
  {
    label: "Pour Time Per Tap",
    name: "pourTimePerTap",
    unit: "MIN",
  },
  {
    label: "Time Between Taps",
    name: "timeBetweenTaps",
    unit: "MIN",
  },
  {
    label: "Time To Load Initial Charge Into FCE",
    name: "timeToLoadInitialCharge",
    unit: "MIN",
  },
  { label: "LBS./ KW", name: "lbsPerKW", unit: "" },
  {
    label: "Pour Temperature (Deg F.)",
    name: "pourTemperature",
    unit: "°F",
  },
  { label: "Metal Type", name: "metalType", unit: "" },
];

export const programOutput = [
  { label: "Melt Rate", key: "formattedMeltRate", unit: "TONS/HR" },
  {
    label: "Power Density",
    key: "formattedPowerDensity",
    unit: "KW/TON",
  },
  { label: "Taps/Hour", key: "formattedTapsPerHour", unit: "" },
  {
    label: "Power Utilization",
    key: "formattedPowerUtilization",
    unit: "%",
  },
  {
    label: "Batch Melt Time",
    key: "batchMeltTime",
    unit: "MIN",
  },
  {
    label: "Off Time-Melt Preparation",
    key: "offTimeAvailable",
    unit: "MIN",
  },
  {
    label: "Batch Pour Time To Empty FCE",
    key: "batchPourTime",
    unit: "MIN",
  },
  {
    label: "Time To Load Initial Charge Into FCE",
    key: "timeToLoadInitialChargeintoFce",
    unit: "MIN",
  },
  {
    label: "Total Cycle Time",
    key: "formattedTotalCycleTime",
    unit: "MIN",
  },
  {
    label: "Total Off Time Between Melts",
    key: "totalOffTime",
    unit: "MIN",
  },
  { label: "Taps Per Melt", key: "formattedTapsPerMelt", unit: "" },
  {
    label:
      "1 SET CORELESS FURNACES OPERATING - TOTAL CORELESS POUR RATE  (TONS/HR.)",
    key: "corelessFurnacePourRate1",
    unit: "TONS/HR",
  },
  {
    label: "TIME BETWEEN TAPS",
    key: "formattedTimeBetweenTaps1",
    unit: "MIN",
  },
  {
    label:
      "2 SET CORELESS FURNACES OPERATING - TOTAL CORELESS POUR RATE  (TONS/HR.)",
    key: "corelessFurnacePourRate2",
    unit: "TONS/HR",
  },
  {
    label: "TIME BETWEEN TAPS",
    key: "formattedTimeBetweenTaps2",
    unit: "MIN",
  },
  {
    label:
      "3 SET CORELESS FURNACES OPERATING - TOTAL CORELESS POUR RATE  (TONS/HR.)",
    key: "corelessFurnacePourRate3",
    unit: "TONS/HR",
  },
  {
    label: "TIME BETWEEN TAPS",
    key: "formattedTimeBetweenTaps3",
    unit: "MIN",
  },
];

export const dualTrakProgramInput = [
  {
    label: "Number of Power Supplies",
    name: "numberOfPowerSupplies",
    unit: "",
  },
  {
    label: "Number of Furnaces",
    name: "numOfFurnace",
    unit: "",
  },
  {
    label: "Continuous Metal Supply",
    name: "continuousMetalSupply",
    unit: "",
  },
  {
    label: "Pour Rate Per System",
    name: "pourRatePerSystem",
    unit: "TONS/HR",
  },
  { label: "Melt Power", name: "meltPower", unit: "KW" },
  {
    label: "Hold Power",
    name: "holdPower",
    unit: "kW",
  },
  {
    label: "Furnace Nominal Capacity (Metric Tons)",
    name: "furnaceNominalCapacityMetricTons",
    unit: "METRIC TONS",
    lowerLimit: 0.5,
    upperLimit: 60,
  },
  {
    label: "Furnace Nominal Capacity (Tons)",
    name: "furnaceNominalCapacityTons",
    unit: "TONS",
    lowerLimit: 0.5,
    upperLimit: 60,
  },
  {
    label: "Tap Size",
    name: "tapSize",
    unit: "TONS",
    lowerLimit: 0,
    upperLimit: 60,
  },
  {
    label: "Pour Time Per Tap",
    name: "pourTimePerTap",
    unit: "MIN",
  },
  {
    label: "Time Between Taps",
    name: "timeBetweenTaps",
    unit: "MIN",
  },
  {
    label: "Time To Load Initial Charge Into FCE",
    name: "timeToLoadInitialCharge",
    unit: "MIN",
  },
  { label: "LBS./ KW", name: "lbsPerKW", unit: "" },
  {
    label: "Pour Temperature (Deg F.)",
    name: "pourTemperature",
    unit: "°F",
  },
  { label: "Metal Type", name: "metalType", unit: "" },
];

export const dualTrackProgramOutput = [
  { label: "Melt Rate", key: "formattedMeltRate", unit: "TONS/HR" },
  {
    label: "Power Density",
    key: "powerDensity",
    unit: "KW/TON",
  },
  { label: "Taps/Hour", key: "formattedTapsPerHour", unit: "" },
  {
    label: "Power Utilization",
    key: "formattedPowerUtilization",
    unit: "%",
  },
  {
    label: "Batch Melt Time",
    key: "batchMeltTime",
    unit: "MIN",
  },
  {
    label: "Off Time-Melt Preparation",
    key: "offTimeAvailable",
    unit: "MIN",
  },
  {
    label: "Batch Pour Time To Empty FCE",
    key: "batchPourTime",
    unit: "MIN",
  },
  {
    label: "Time To Load Initial Charge Into FCE",
    key: "timeToLoadInitialChargeintoFce",
    unit: "MIN",
  },
  {
    label: "Total Cycle Time",
    key: "formattedTotalCycleTime",
    unit: "MIN",
  },
  {
    label: "Total Off Time Between Melts",
    key: "totalOffTime",
    unit: "MIN",
  },
  { label: "Taps Per Melt", key: "formattedTapsPerMelt", unit: "" },
  {
    label: "1 Coreless Furnaces Operating - Total Coreless Pour Rate",
    key: "corelessFurnacePourRate1",
    unit: "TONS/HR",
  },
  {
    label: "Time Between Furnace Time Cycles",
    key: "formattedTimeBetweenTaps1",
    unit: "MIN",
  },
  {
    label: "2 Coreless Furnaces Operating - Total Coreless Pour Rate",
    key: "corelessFurnacePourRate2",
    unit: "TONS/HR",
  },
  {
    label: "Time Between Furnace Time Cycles",
    key: "formattedTimeBetweenTaps2",
    unit: "MIN",
  },
  {
    label: "3 Coreless Furnaces Operating - Total Coreless Pour Rate",
    key: "corelessFurnacePourRate3",
    unit: "TONS/HR",
  },
  {
    label: "Time Between Furnace Time Cycles",
    key: "formattedTimeBetweenTaps3",
    unit: "MIN",
  },
];

export const chargingSystemInput = [
  { label: "Number of Cars", name: "numCars", unit: "" },
  {
    label: "Travel Time (Car to Furnace)",
    name: "travelTimeToFurnace",
    unit: "MIN",
  },
  {
    label: "Travel Time (Car to Loading Position)",
    name: "travelTimeToLoading",
    unit: "MIN",
  },
];

export const chargingSystemOutput = [
  {
    label: "Charging Time (Car to Furnace)",
    key: "chargingTimeToFurnace",
    unit: "MIN",
  },
  {
    label: "Available Time to Refill Charge Car",
    key: "refillTime",
    unit: "MIN",
  },
];

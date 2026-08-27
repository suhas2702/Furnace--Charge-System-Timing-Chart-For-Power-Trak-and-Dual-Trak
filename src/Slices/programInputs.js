import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  setProgramInput: false,
  programInputs: {
    numberOfPowerSupplies: null,
    pourRatePerSystem: null,
    meltPower: null,
    holdPower: null,
    furnaceNominalCapacityMetricTons: null,
    tapSize: null,
    pourTimePerTap: null,
    timeToLoadInitialCharge: null,
    lbsPerKW: null,
    pourTemperature: null,
    metalType: null,
    travelTimeToFurnace: null,
    travelTimeToLoading: null,
    customerName: null,
    createdBy: null,
  },
};

const programInputValuesSlice = createSlice({
  name: "programInputsValues",
  initialState,
  reducers: {
    setProgramInput(state, action) {
      state.setProgramInput = action.payload;
    },

    setprogramInputs(state, action) {
      state.programInputs = {
        ...action.payload,
      };
    },
  },
});

export const { setprogramInputs, setProgramInput } =
  programInputValuesSlice.actions;

export default programInputValuesSlice.reducer;

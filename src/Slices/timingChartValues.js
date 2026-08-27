import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timingChartInputs: {
    initialCharge: null,
    melting: null,
    meltPrep: null,
    tapTime: null,
    noOfTaps: null,
    metalType: null,
    pourTemperature: null,
    districtManager: null,
    powerUtilization: null,
    totalCycleTime: null,
    chargingTime: null,
    refillTime: null,
    travelTime: null,
    meltPower: null,
    furnaceNominalCapacityTons: null,
    furnaceNominalCapacityMetricTons: null,
    districtManager: null,
    pourTimePerTap: null,
    timeBetweenTaps: null,
    noOfFurnace: null,
    timeBetweenTapsFCE: null,
    travtravelTimeCarToLoadingPosWidth: null,
    totalOffTime: null,
  },
};

const timingChartValuesSlice = createSlice({
  name: "timingChartValues",
  initialState,
  reducers: {
    setTimingChartInputs(state, action) {
      state.timingChartInputs = {
        ...state.timingChartInputs,
        ...action.payload,
      };
    },
  },
});

export const { setTimingChartInputs } = timingChartValuesSlice.actions;

export default timingChartValuesSlice.reducer;

// dispatch(setTimingChartInputs({ initialCharge: 20 }));
// dispatch(setTimingChartInputs({ melting: 50, pourTemperature: 1500 }));

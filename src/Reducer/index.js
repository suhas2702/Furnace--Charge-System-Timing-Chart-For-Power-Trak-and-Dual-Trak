import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../Slices/auth";
import profileReducer from "../Slices/profile";
import forgotPasswordReducer from "../Slices/forgotPassword";
import timingChartValuesReducers from "../Slices/timingChartValues";
import programInputValuesReducers from "../Slices/programInputs";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  timingChartValues: timingChartValuesReducers,
  programInputValues: programInputValuesReducers,
});

export default rootReducer;

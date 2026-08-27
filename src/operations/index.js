import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector.js";
import { setLoading, setToken, setRole } from "../Slices/auth.js";
import { setUser } from "../Slices/profile.js";
import { setEmail } from "../Slices/forgotPassword.js";
import { Endpoints } from "../apis.js";

const {
  CREATEUSER_API,
  LOGIN_API,
  SETADDITONALDEATILS_API,
  CHECKADDITIONALDETAILS_API,
  UPDATEDISPLAYNAME_API,
  CHANGEPASSWORD_API,
  CHECKOLDPASSWORD_API,
  ISREGISTEREDUSER_API,
  VERIFYEMAIL_API,
  RESETPASSWORDREQUEST_API,
  ACCEPTRESETPASSWORDREQUEST_API,
  SETPROGRAMINPUT_API,
} = Endpoints;

export function createUser(
  firstName,
  lastName,
  email,
  role,
  companyName,
  departmentName,
  displayName,
  active,
  navigate,
  token
) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        CREATEUSER_API,
        {
          firstName,
          lastName,
          email,
          role,
          companyName,
          departmentName,
          displayName,
          active,
        },
        {
          Authorization: `${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("User Created Successful");
      navigate("/create-user");
    } catch (error) {
      console.log("CREATE USER API ERROR............", error);
      toast.error("User Creation Failed");
      navigate("/create-user");
    }
    dispatch(setLoading(false));
  };
}

export function login(email, password, setIsFilled, navigate, setLoading) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    let response;
    try {
      response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (response.data.isPasswordIncorrrect) {
        toast.error("Incorrect Password");
        dispatch(setLoading(false));
        return;
      }

      if (!response.data.success) {
        if (response.data.isDeactivated) {
          toast.error(response.data.message);
          dispatch(setLoading(false));
          return;
        }
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));

      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (!response.data.additionalDetailsFilled) {
        setIsFilled(false);
      } else setIsFilled(true);
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
}

export function setAdditionalDetails(
  email,
  nickname,
  college,
  school,
  navigate,
  setLoading,
  token
) {
  return async (dispatch) => {
    setLoading(true);

    try {
      const response = await apiConnector(
        "POST",
        SETADDITONALDEATILS_API,
        {
          email,
          nickname,
          college,
          school,
        },
        {
          Authorization: `${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Additional Deatils Added Successfully");
      navigate("/");
    } catch (error) {
      console.log("SETADDITIONALDETAILS  API ERROR............", error);
      toast.error("Additional Deatils Not Added");
    }
    setLoading(false);
  };
}

export function checkAdditionalDetails(email, setLoading, setIsFilled, token) {
  return async (dispatch) => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "POST",
        CHECKADDITIONALDETAILS_API,
        {
          email,
        },
        {
          Authorization: `${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      if (response.additionalDetailsFilled) setIsFilled(true);
    } catch (error) {
      console.error("Error checking additional details:", error);
    }
    setLoading(false);
  };
}

export function updateDisplayName(email, displayName, token, setLoading) {
  return async (dispatch) => {
    try {
      setLoading(true);
      const response = await apiConnector(
        "POST",
        UPDATEDISPLAYNAME_API,
        {
          email,
          displayName,
        },
        {
          Authorization: `${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser(response.data.user));

      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Display Name Updated Successfully");
    } catch (error) {
      console.error("Error checking additional details:", error);
    }
    setLoading(false);
  };
}

export function changePassword(
  email,
  newPassword,
  oldPassword,
  setLoading,
  navigate,
  token
) {
  return async (dispatch) => {
    try {
      const CheckOldPasswordResponse = await apiConnector(
        "POST",
        CHECKOLDPASSWORD_API,
        {
          email,
          password: oldPassword,
        },
        {
          Authorization: `${token}`,
        }
      );

      if (!CheckOldPasswordResponse.data.success) {
        toast.error("Old Password Is Incorrect");
        throw new Error(CheckOldPasswordResponse.data.message);
      }

      const response = await apiConnector(
        "POST",
        CHANGEPASSWORD_API,
        {
          email,
          newPassword,
        },
        {
          Authorization: `${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password Changed Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error While Changing the Password", error);
    }
    setLoading(false);
  };
}

export function verifyIdentity(email, setLoading, setStep) {
  return async (dispatch) => {
    setLoading(true);
    try {
      const response = await apiConnector("POST", ISREGISTEREDUSER_API, {
        email,
      });

      if (!response.data.success) {
        toast.error("Enter Registered Email Address");
        setLoading(false);
        return;
      } else {
        setStep(2);
      }
      dispatch(setEmail(email));

      //navigate("/verify-identity");
    } catch (error) {
      console.error("Error While Verifing User Identity ", error);
    }
    setLoading(false);
  };
}

export function sendResetPasswordRequest(email, setLoading, navigate) {
  return async (dispatch) => {
    setLoading(true);
    try {
      const isUserResponse = await apiConnector("POST", ISREGISTEREDUSER_API, {
        email,
      });

      if (!isUserResponse.data.success) {
        toast.error("Enter Registered Email Address");
        setLoading(false);
        return;
      }

      const response = await apiConnector("POST", RESETPASSWORDREQUEST_API, {
        email,
      });

      if (!response.data.success) {
        toast.error("Reset Password Request Failed. Try Again");
        throw new Error(response.data.message);
      }
      toast;
      navigate("/reset-password-request-accepted");
    } catch (error) {
      console.error("Error While Requesting reset Password ", error);
    }
    setLoading(false);
  };
}

export function verifyAdditionalDetails({
  email,
  selectedQuestion,
  details,
  setLoading,
  navigate,
}) {
  return async (dispatch) => {
    setLoading(true);
    try {
      const response = await apiConnector("POST", VERIFYEMAIL_API, {
        email,
        selectedQuestion,
        ...details,
      });

      if (!response.data.success) {
        toast.error("Please Enter the Correct Answer");
        throw new Error(response.data.message);
      }
      toast.success("Enter the New Password");
      navigate("/reset-forgotpassword");
    } catch (error) {
      console.error("Error While Verifying Additional Questions ", error);
    }
    setLoading(false);
  };
}

export function resetPassword(email, newPassword, setLoading, navigate) {
  return async (dispatch) => {
    try {
      const CheckOldPasswordResponse = await apiConnector(
        "POST",
        CHECKOLDPASSWORD_API,
        {
          email,
          password: newPassword,
        }
      );

      if (CheckOldPasswordResponse.data.success) {
        toast.error("Your New Passsword Is Same Old Password");
        throw new Error(CheckOldPasswordResponse.data.message);
      }

      const response = await apiConnector("POST", CHANGEPASSWORD_API, {
        email,
        newPassword,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password Reset Successfully");
      dispatch(setEmail(null));
      navigate("/");
    } catch (error) {
      console.error("Error While Changing the Password", error);
    }
    setLoading(false);
  };
}

export function resetPasswordRequest(email, setLoading, token) {
  return async (dispatch) => {
    setLoading(true);

    try {
      const response = await apiConnector(
        "POST",
        ACCEPTRESETPASSWORDREQUEST_API,
        {
          email,
        },
        {
          Authorization: `${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("User Password Reset Successfully");
    } catch (error) {
      console.error("Error While Changing the Password", error);
    }
    setLoading(false);
  };
}

// export function resetPasswordRequest(
//   email,
//   setLoading,
//   token,
//   programName,
//   furnaceNominalCapacityMetricTons,
//   meltPower,
//   pourTemperature,
//   lbsPerKW,
//   pourRatePerSystem,
//   pourTimePerTap,
//   tapSize,
//   timeToLoadInitialCharge,
//   travelTimeToFurnace,
//   travelTimeToLoading,
//   timeBetweenTaps,
//   metalType,
//   holdPower,
//   noOfPowerSupplies,
//   customerName,
//   noOfFurnace,
//   noOfChargeCar
// ) {
//   return async (dispatch) => {
//     setLoading(true);
//     try {
//       const response = await apiConnector(
//         "POST",
//         SETPROGRAMINPUT_API,
//         {
//           email,
//           programName,
//           furnaceNominalCapacityMetricTons,
//           meltPower,
//           pourTemperature,
//           lbsPerKW,
//           pourRatePerSystem,
//           pourTimePerTap,
//           tapSize,
//           timeToLoadInitialCharge,
//           travelTimeToFurnace,
//           travelTimeToLoading,
//           timeBetweenTaps,
//           metalType,
//           holdPower,
//           noOfPowerSupplies,
//           customerName,
//           noOfFurnace,
//           noOfChargeCar,
//         },
//         {
//           Authorization: `${token}`,
//         }
//       );
//       if (!response.data.success) {
//         throw new Error(response.data.message);
//       }
//       toast.success("Data Saved Successfully");
//     } catch (error) {
//       console.error("Error While Saving the Program Values", error);
//     }
//     setLoading(false);
//   };
// }

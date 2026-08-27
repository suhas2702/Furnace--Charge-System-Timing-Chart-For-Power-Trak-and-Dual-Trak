import React, { useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner/Spinner";
import { checkAdditionalDetails } from "../../operations/index.js";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../../apiConnector";
import { Endpoints } from "../../apis";
const { CHECKADDITIONALDETAILS_API } = Endpoints;

const CheckAdditionalFilled = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const chechkIsFilled = async (email, setLoading, setIsFilled, token) => {
      setLoading(true);
      try {
        const response = await apiConnector(
          "POST",
          CHECKADDITIONALDETAILS_API,
          {
            email,
          },
          { Authorization: `${token}` }
        );

        if (!response.data.success) {
          throw new Error(response.data.message);
        }
        if (response.data.additionalDetailsFilled) {
          setIsFilled(true);
        }
      } catch (error) {
        console.error("Error checking additional details:", error);
      }
      setLoading(false);
    };
    chechkIsFilled(user.email, setLoading, setIsFilled, token);
  }, []);
  if (loading) return <Spinner />;
  if (isFilled) return <Navigate to="/" />;
  else return children;
};

export default CheckAdditionalFilled;

import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner/Spinner";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.auth);
  if (loading) return <Spinner />;
  if (token !== null) return children;
  else return <Navigate to="/login" />;
};

export default PrivateRoute;

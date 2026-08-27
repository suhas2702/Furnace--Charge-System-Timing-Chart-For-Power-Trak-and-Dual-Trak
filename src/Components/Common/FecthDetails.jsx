// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setRole } from "../Slices/auth";
// import toast from "react-hot-toast";
// import { apiConnector } from "../../apiConnector";
// import { Endpoints } from "../../apis";

// const { GETROLE_API } = Endpoints;

// const FetchDetails = () => {
//   const dispatch = useDispatch();
//   const { token } = useSelector((state) => state.auth);
//   const { user } = useSelector((state) => state.profile);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (token && user?.email) {
//       const getRole = async () => {
//         try {
//           setLoading(true);

//           const response = await apiConnector(
//             "POST",
//             GETROLE_API,
//             { email: user.email },
//             {
//               Authorization: `${token}`,
//             }
//           );

//           console.log("Get Role API Response", response);
//           if (!response.data.success) {
//             throw new Error(response.data.message);
//           }

//           console.log("Role Of User Is", response.data.role);
//           dispatch(setRole(response.data.role));
//         } catch (error) {
//           console.error("GET_ROLE_API ERROR:", error);
//           toast.error("Failed to Get Role");
//         } finally {
//           setLoading(false);
//         }
//       };

//       getRole();
//     }
//   }, [token, user?.email, dispatch]);

//   if (loading) {
//     return (
//       <div className="h-[calc(100vh-62px)] w-10/12 mx-auto flex justify-center items-center relative">
//         <Spinner />
//       </div>
//     );
//   }
//   return null;
// };

// export default FetchDetails;

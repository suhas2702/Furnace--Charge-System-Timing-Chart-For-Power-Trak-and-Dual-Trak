const express = require("express");
const router = express.Router();
const {
  createUser,
  login,
  getCompanyName,
  setAdditionalDetails,
  checkAdditionalDetails,
  updateDisplayName,
  changePassword,
  checkOldPasssword,
  isRegisteredUser,
  verifyIdentity,
  resetPasswordRequest,
  getAllUsers,
  acceptResetPasswordRequest,
  deleteUser,
  toggleActive,
  getUserDetails,
  editUserDetails,
  getRole,
  setProgramInput,
  getProgramInputValues,
  deleteProgramInput,
  editProgramInputs,
} = require("../controller/index.js");
const { auth, isAdmin, isSalesman } = require("../middlewares/index.js");

router.post("/createUser", auth, isAdmin, createUser);
router.post("/login", login);
router.get("/getCompanyNames", auth, getCompanyName);
router.post("/setAddtionalDetails", auth, setAdditionalDetails);
router.post("/checkAddtionalDetails", auth, checkAdditionalDetails);
router.post("/updateDisplayName", auth, updateDisplayName);
router.post("/changePassword", changePassword);
router.post("/checkOldPassword", auth, checkOldPasssword);
router.post("/isRegisteredUser", isRegisteredUser);
router.post("/verifyIdentity", verifyIdentity);
router.post("/resetPasswordRequest", resetPasswordRequest);
router.get("/getAllUsers", auth, isAdmin, getAllUsers);
router.post(
  "/acceptResetPasswordRequest",
  auth,
  isAdmin,
  acceptResetPasswordRequest
);
router.delete("/deleteUser", auth, isAdmin, deleteUser);
router.post("/toggleActive", auth, isAdmin, toggleActive);
router.post("/getUserDetails", auth, isAdmin, getUserDetails);
router.put("/editUserDetails", auth, isAdmin, editUserDetails);
router.post("/getRole", auth, getRole);
router.post("/setProgramInput", auth, setProgramInput);
router.post("/getProgramInputValues", auth, getProgramInputValues);
router.delete("/deleteProgramInput", auth, deleteProgramInput);
router.post("/editProgramInput", auth, editProgramInputs);
module.exports = router;

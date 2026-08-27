const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const dbConnections = require("../config/config.js");
const generatePassword = require("../utils/passwordGenerator.js");
const sendEmail = require("../utils/mailSender.js");
require("dotenv").config();

//have not trimmed the spaces in the input handle in frontend or in backend
exports.createUser = async (req, res) => {
  const transaction = new sql.Transaction(await dbConnections);
  try {
    const {
      firstName,
      lastName,
      email,
      role,
      active,
      companyName,
      departmentName,
      displayName,
    } = req.body;
    const isActive = active === "1";

    if (
      !firstName ||
      !email ||
      !role ||
      isActive === undefined ||
      !companyName ||
      !displayName
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    await transaction.begin();

    const userCheck = await transaction
      .request()
      .input("emailAddress", sql.NVarChar, email)
      .query("SELECT 1 FROM tblUser WHERE sEmailAddress = @emailAddress");

    if (userCheck.recordset.length > 0) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    await transaction
      .request()
      .input("firstName", sql.NVarChar, firstName)
      .input("lastName", sql.NVarChar, lastName || null)
      .input("emailAddress", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .input("role", sql.NVarChar, role)
      .input("isActive", sql.Bit, isActive)
      .input("companyName", sql.NVarChar, companyName)
      .input("displayName", sql.NVarChar, displayName)
      .input("departmentName", sql.NVarChar, departmentName || null).query(`
                INSERT INTO tblUser (sFirstName, sLastName, sEmailAddress, sPassword, sRole, bActive, sCompanyName, sDisplayName, sDepartmentName)
                VALUES (@firstName, @lastName, @emailAddress, @password, @role, @isActive, @companyName, @displayName, @departmentName)
            `);

    await sendEmail(
      email,
      "Your Account Has Been Created",
      `Hello ${firstName},\n\nYour account has been created successfully.\n\nLogin Credentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nBest Regards,\nInductotherm Group`
    );

    await transaction.commit();
    return res.status(201).json({
      success: true,
      message: "User created successfully and email sent",
    });
  } catch (err) {
    await transaction.rollback();
    console.error(" Error creating user:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Could not create user",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const con = await dbConnections;
    const userResult = await con
      .request()
      .input("emailAddress", sql.NVarChar, email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @emailAddress");

    if (userResult.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    const user = userResult.recordset[0];

    if (!user.bActive) {
      return res.status(200).json({
        success: false,
        isDeactivated: true,
        message: "Your account is deactivated. Please contact admin.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.sPassword);
    if (!isPasswordValid) {
      return res.status(200).json({
        success: false,
        isPasswordIncorrrect: true,
        message: "Password is incorrect",
      });
    }

    const token = jwt.sign(
      { email: user.sEmailAddress, id: user.nID, role: user.sRole },
      process.env.JWT_SECRET
    );

    // res.cookie("token", token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "Strict",
    //     maxAge: 3600000 // 1 hour
    // });

    const userResponse = {
      id: user.nID,
      firstName: user.sFirstName,
      email: user.sEmailAddress,
      companyName: user.sCompanyName,
      displayName: user.sDisplayName,
      img: `https://api.dicebear.com/5.x/initials/svg?seed=${user.sFirstName} ${user.sLastName}`,
      active: user.bActive,
    };

    if (user.sLastName) userResponse.lastName = user.sLastName;
    if (user.sDepartmentName)
      userResponse.departmentName = user.sDepartmentName;

    const { sNickName, sSchoolName, sCollegeName } = user;

    const additionalDetailsFilled = Boolean(
      sNickName && sSchoolName && sCollegeName
    );
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      additionalDetailsFilled,
      user: userResponse,
    });
  } catch (err) {
    console.error(
      "Error while logging user, Could not login please try again:",
      err
    );
    return res.status(500).json({
      success: false,
      message: "Could Not Login User",
    });
  }
};

exports.getCompanyName = async (req, res) => {
  try {
    const con = await dbConnections;
    const result = await con
      .request()
      .query("SELECT sCompanyName FROM tblCompanyName");

    let companyNames = result.recordset.map((row) => row.sCompanyName);

    companyNames.sort((a, b) => a.localeCompare(b));

    return res.status(200).json({
      success: true,
      message: "Company Names Sent Successfully",
      companyNames,
    });
  } catch (err) {
    console.error("Error While Fetching Company Names", err);
    return res.status(500).json({
      success: false,
      message: "Could Not Fetch Company Names",
    });
  }
};

// exports.setAdditionalDetails = async (req, res) => {
//   try {
//     const { email, nickname, college, school } = req.body;

//     // Check for missing fields
//     if (!email || !nickname || !college || !school) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // Database connection
//     const con = await dbConnections;
//     const userCheck = await con
//       .request()
//       .input("sEmailAddress", email)
//       .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");

//     if (userCheck.recordset.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     await con
//       .request()
//       .input("sEmailAddress", sEmailAddress)
//       .input("sNickName", sNickName)
//       .input("sCollegeName", sCollegeName)
//       .input("sSchoolName", sSchoolName)
//       .query(
//         `UPDATE tblUser
//        SET sNickName = @sNickName,
//            sCollegeName = @sCollegeName,
//            sSchoolName = @sSchoolName
//        WHERE sEmailAddress = @sEmailAddress`
//       );

//     return res.status(200).json({
//       success: true,
//       message: "Additional details updated successfully",
//     });
//   } catch (err) {
//     console.error("Error while setting additional details:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Could not set additional details",
//     });
//   }
// };

exports.setAdditionalDetails = async (req, res) => {
  try {
    const { email, nickname, college, school } = req.body;
    if (!email || !nickname || !college || !school) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Database connection
    const con = await dbConnections;
    const userCheck = await con
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update additional details
    await con
      .request()
      .input("sEmailAddress", sql.NVarChar, email)
      .input("sNickName", sql.NVarChar, nickname || null)
      .input("sCollegeName", sql.NVarChar, college || null)
      .input("sSchoolName", sql.NVarChar, school || null).query(`
        UPDATE tblUser 
        SET sNickName = @sNickName, 
            sCollegeName = @sCollegeName, 
            sSchoolName = @sSchoolName 
        WHERE sEmailAddress = @sEmailAddress
      `);

    return res.status(200).json({
      success: true,
      message: "Additional details updated successfully",
    });
  } catch (err) {
    console.error("Error while setting additional details:", err);
    return res.status(500).json({
      success: false,
      message: "Could not set additional details",
    });
  }
};

exports.checkAdditionalDetails = async (req, res) => {
  try {
    const { email } = req.user || req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const con = await dbConnections;

    const result = await con
      .request()
      .input("email", email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { sNickName, sSchoolName, sCollegeName } = result.recordset[0];

    const additionalDetailsFilled = Boolean(
      sNickName && sSchoolName && sCollegeName
    );

    return res.status(200).json({
      success: true,
      additionalDetailsFilled,
    });
  } catch (error) {
    console.error("Error checking additional details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateDisplayName = async (req, res) => {
  try {
    const { email, displayName } = req.body;

    if (!email || !displayName) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }
    const con = await dbConnections;

    const result = await con
      .request()
      .input("email", email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.recordset[0];

    await con
      .request()
      .input("email", email)
      .input("displayName", displayName)
      .query(
        "UPDATE tblUser SET sDisplayName = @displayName WHERE sEmailAddress = @email"
      );

    const userResponse = {
      id: user.nID,
      firstName: user.sFirstName,
      email: user.sEmailAddress,
      role: user.sRole,
      companyName: user.sCompanyName,
      displayName,
      img: `https://api.dicebear.com/5.x/initials/svg?seed=${user.sFirstName} ${user.sLastName}`,
    };

    if (user.sLastName) userResponse.lastName = user.sLastName;
    if (user.sDepartmentName)
      userResponse.departmentName = user.sDepartmentName;

    return res.status(200).json({
      success: true,
      displayName,
      user: userResponse,
      message: "Display Name Updated Successfully",
    });
  } catch (error) {
    console.error("Error While Updating The Display Name", error);
    return res.status(500).json({
      success: false,
      message: "Could Not Update Display Name",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required in newpassword",
      });
    }
    const con = await dbConnections;

    const result = await con
      .request()
      .input("email", email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await con
      .request()
      .input("email", email)
      .input("hashedPassword", hashedPassword)
      .query(
        "UPDATE tblUser SET sPassword = @hashedPassword WHERE sEmailAddress = @email"
      );

    return res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (error) {
    console.error("Error While Changing The Password", error);
    return res.status(500).json({
      success: false,
      message: "Could Not Change The Password",
    });
  }
};

exports.checkOldPasssword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required in Old Password",
      });
    }
    const con = await dbConnections;

    const result = await con
      .request()
      .input("email", email)
      .query("SELECT sPassword FROM tblUser WHERE sEmailAddress = @email");

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!(await bcrypt.compare(password, result.recordset[0].sPassword))) {
      return res.status(200).json({
        success: false,
        message: "Old Password Is Incorrect",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Old Password Is Correct",
    });
  } catch (error) {
    console.error("Error While Checking Old Password", error);
    return res.status(500).json({
      success: false,
      message: "Error While Checking Old Password",
    });
  }
};

exports.isRegisteredUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email Is Required",
      });
    }
    const con = await dbConnections;

    const result = await con
      .request()
      .input("email", email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");

    if (result.recordset.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Exists",
    });
  } catch (error) {
    console.error("Error In Is User Registered", error);
    return res.status(500).json({
      success: false,
      message: "Error While In Is User Registered ",
    });
  }
};

exports.verifyIdentity = async (req, res) => {
  try {
    const { email, selectedQuestion } = req.body;

    // Mapping frontend question names to actual database column names
    const questionMapping = {
      nickName: "sNickName",
      collegeName: "sCollegeName",
      schoolName: "sSchoolName",
    };

    // Check if required fields are provided
    if (!email || !selectedQuestion || !req.body[selectedQuestion]) {
      return res.status(400).json({
        success: false,
        message: "Email and the selected security answer are required",
      });
    }

    // Get actual column name from mapping
    const dbColumnName = questionMapping[selectedQuestion];

    if (!dbColumnName) {
      return res.status(400).json({
        success: false,
        message: "Invalid security question selected",
      });
    }

    const con = await dbConnections;

    // Fetch user details based on email
    const result = await con
      .request()
      .input("email", sql.NVarChar(75), email)
      .query(
        `SELECT ${dbColumnName} FROM tblUser WHERE sEmailAddress = @email`
      );

    // Check if user exists
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const correctAnswer = result.recordset[0][dbColumnName];
    const providedAnswer = req.body[selectedQuestion];

    // Verify the selected question's answer
    if (
      !correctAnswer ||
      providedAnswer.toLowerCase() !== correctAnswer.toLowerCase()
    ) {
      return res.json({
        success: false,
        message: "Identity verification failed. Incorrect Answer.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User identity verified successfully",
    });
  } catch (error) {
    console.error("Error verifying user identity:", error);
    return res.status(500).json({
      success: false,
      message: "Error while verifying user identity",
    });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email Is Required",
      });
    }

    const con = await dbConnections;
    const user = await con
      .request()
      .input("email", email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");
    const displayName = user.recordset[0].sDisplayName;
    const companyName = user.recordset[0].sCompanyName;

    const role = "Admin";
    const result = await con
      .request()
      .input("role", role)
      .query(
        "SELECT sEmailAddress FROM tblUser WHERE sRole = @role AND bActive = 1"
      );

    if (result.recordset.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No Admin Available",
      });
    }
    const adminEmails = result.recordset.map((row) => row.sEmailAddress);
    for (let i = 0; i < adminEmails.length; i++) {
      await sendEmail(
        adminEmails[i],
        "Reset password Request",
        `Hello ,\n${displayName} From ${companyName} Requested To Reset His Password.\n\nCredentials:\nEmail: ${email}\n\nPlease Reset The Password As Soon As Possible.\n\nThankYou.\n\nBest Regards,\nInductotherm Group`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Reset Request Sent Successfully",
    });
  } catch (error) {
    console.error("Error While Sending Reset Password Request", error);
    return res.status(500).json({
      success: false,
      message: "Error While Sending Reset Password Request",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const con = await dbConnections;
    const users = await con
      .request()
      .query(
        "SELECT sFirstName,sLastName,sDisplayName,sEmailAddress,sCompanyName,sDepartmentName,sRole,bActive FROM tblUser"
      );
    return res.status(200).json({
      success: true,
      Users: users.recordset,
      message: "Users Sent Successfully",
    });
  } catch (error) {
    console.error("Error While Sending User Details", error);
    return res.status(500).json({
      success: false,
      message: "Error While Sending User Details",
    });
  }
};

exports.acceptResetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email Is Required",
      });
    }
    const con = await dbConnections;
    const result = await con
      .request()
      .input("email", email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");
    const user = result.recordset;
    if (result.recordset.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User Not Found",
      });
    }
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    await con
      .request()
      .input("hashedPassword", hashedPassword)
      .input("email", email)
      .query(
        "UPDATE tblUser SET sPassword = @hashedPassword WHERE sEmailAddress = @email;"
      );

    await sendEmail(
      email,
      "Passsword Reset Succesfully",
      `Hello ${user.firstName},\n\nYour Password Reset Request Is Accepted.\n\nYour New Password is:\nEmail:
       ${email}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nBest Regards,\nInductotherm Group`
    );

    return res.status(200).json({
      success: true,
      message: "Password Reset Successfull",
    });
  } catch (error) {
    console.error("Error While Reseting the Password", error);
    return res.status(500).json({
      success: false,
      message: "Error While Reseting the Password",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email Is Required",
      });
    }
    const con = await dbConnections;

    const result = await con
      .request()
      .input("email", email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");

    if (result.recordset.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User Not Found",
      });
    }
    await con
      .request()
      .input("email", email)
      .query("DELETE FROM tblUser WHERE sEmailAddress = @email;");

    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.error("Error While Deleting User", error);
    return res.status(500).json({
      success: false,
      message: "Error While Deleting User",
    });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const { email, isActive } = req.body;

    if (!email || isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }
    const con = await dbConnections;

    const result = await con
      .request()
      .input("email", email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");

    if (result.recordset.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User Not Found",
      });
    }
    await con
      .request()
      .input("email", email)
      .input("isActive", !isActive)
      .query(
        "UPDATE tblUser SET bActive = @isActive WHERE sEmailAddress = @email"
      );

    return res.status(200).json({
      success: true,
      message: "Active Field Toggled Successfully",
    });
  } catch (error) {
    console.error("Error While Toggling Active Field", error);
    return res.status(500).json({
      success: false,
      message: "Error While Toggling Active Field",
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email Is Required",
      });
    }
    const con = await dbConnections;

    const result = await con
      .request()
      .input("email", email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");
    const user = result.recordset[0];
    if (result.recordset.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User Not Found",
      });
    }
    const userResponse = {
      id: user.nID,
      firstName: user.sFirstName,
      email: user.sEmailAddress,
      role: user.sRole,
      companyName: user.sCompanyName,
      displayName: user.sDisplayName,
      img: `https://api.dicebear.com/5.x/initials/svg?seed=${user.sFirstName} ${user.sLastName}`,
      active: user.bActive,
    };

    if (user.sLastName) userResponse.lastName = user.sLastName;
    if (user.sDepartmentName)
      userResponse.departmentName = user.sDepartmentName;

    return res.status(200).json({
      success: true,
      UserDetail: userResponse,
      message: "User Details Fetched Successfully",
    });
  } catch (error) {
    console.error("Error While Fetching User Details", error);
    return res.status(500).json({
      success: false,
      message: "Error While Fetching User Details",
    });
  }
};

exports.editUserDetails = async (req, res) => {
  try {
    const { email, firstName, lastName, role, displayName, isActive } =
      req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const con = await dbConnections;

    const userCheck = await con
      .request()
      .input("email", email)
      .query("SELECT * FROM tblUser WHERE sEmailAddress = @email");

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let updateFields = [];
    if (firstName) updateFields.push("sFirstName = @firstName");
    if (lastName) updateFields.push("sLastName = @lastName");
    if (role) updateFields.push("sRole = @role");
    if (displayName) updateFields.push("sDisplayName = @displayName");
    if (typeof isActive === "boolean") updateFields.push("bActive = @isActive");

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }

    const updateQuery = `UPDATE tblUser SET ${updateFields.join(
      ", "
    )} WHERE sEmailAddress = @email`;

    const request = con.request().input("email", email);
    if (firstName) request.input("firstName", firstName);
    if (lastName) request.input("lastName", lastName);
    if (role) request.input("role", role);
    if (displayName) request.input("displayName", displayName);
    if (typeof isActive === "boolean") request.input("isActive", isActive);

    await request.query(updateQuery);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error while updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating user",
    });
  }
};

exports.getRole = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email Is Required",
      });
    }
    const con = await dbConnections;

    const result = await con
      .request()
      .input("email", email)
      .query("SELECT sRole FROM tblUser WHERE sEmailAddress = @email");

    if (result.recordset.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      role: result.recordset[0].sRole,
      message: "Role Sent Successfully",
    });
  } catch (error) {
    console.error("Error While Fetching the Role", error);
    return res.status(500).json({
      success: false,
      message: "Error While Fetching the Role",
    });
  }
};

exports.getProgramInputValues = async (req, res) => {
  try {
    const email = req.user.email;
    const role = req.user.role;
    const { programName } = req.body;
    console.log("programName", programName);
    const pName = programName === "dualtrak" ? "Dual Trak" : "Power Trak";
    const con = await dbConnections;

    const id = await con
      .request()
      .input("email", email)
      .query("SELECT nID FROM tblUser WHERE sEmailAddress = @email");
    let result;
    if (role === "Admin") {
      result = await con
        .request()
        .input("pName", pName)
        .query("SELECT * FROM tblProgramInputValues where sProgramName=@pName");
    } else {
      result = await con
        .request()
        .input("id", id.recordset[0].nID)
        .query(
          "SELECT * FROM tblProgramInputValues where nUserID=@id and sProgramName=@programName"
        );
    }

    return res.status(200).json({
      success: true,
      data: result.recordset,
      message: "Program Input Sent Successfully",
    });
  } catch (error) {
    console.error("Error While Fetching the Program Input Values", error);
    return res.status(500).json({
      success: false,
      message: "Error While Fetching the Program Input Values",
    });
  }
};

exports.setProgramInput = async (req, res) => {
  try {
    const email = req.user.email;

    const {
      pName,
      createdBy,
      noOfPowerSupplies,
      furnaceNominalCapacity,
      meltPower,
      pourTemperture,
      lbsPerKw,
      pourRatePerSystem,
      pourTimePerTap,
      tapSize,
      timeToLoadInitialCharge,
      travelTimeCarToFurnace,
      travelTimeCarToLoadingPos,
      customerName,
      noOfFurnace,
      noOfChargeCar,
      continousMetalSupply,
      timeBetweenTaps,
      metalType,
      holdPower,
      lastUpdatedBy,
    } = req.body;

    if (
      !email ||
      !pName ||
      !createdBy ||
      noOfPowerSupplies == null ||
      furnaceNominalCapacity == null ||
      meltPower == null ||
      pourTemperture == null ||
      lbsPerKw == null ||
      pourRatePerSystem == null ||
      pourTimePerTap == null ||
      tapSize == null ||
      timeToLoadInitialCharge == null ||
      travelTimeCarToFurnace == null ||
      travelTimeCarToLoadingPos == null ||
      !customerName ||
      noOfFurnace == null ||
      noOfChargeCar == null ||
      !lastUpdatedBy ||
      !continousMetalSupply ||
      (continousMetalSupply !== "Yes" && continousMetalSupply !== "No") ||
      timeBetweenTaps == null ||
      !metalType ||
      holdPower == null
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields Required.",
      });
    }
    const programName = pName === "dualtrak" ? "Dual Trak" : "Power Trak";
    const con = await dbConnections;

    const result = await con
      .request()
      .input("email", email)
      .query("SELECT nID FROM tblUser WHERE sEmailAddress = @email");

    if (result.recordset.length === 0) {
      return res.status(200).json({
        success: false,
        message: "User Not Found",
      });
    }
    const nid = result.recordset[0].nID;

    await con
      .request()
      .input("userID", sql.BigInt, nid)
      .input("programName", sql.NVarChar(10), programName)
      .input("noOfPowerSupplies", sql.Int, noOfPowerSupplies)
      .input("furnaceNominalCapacity", sql.Float, furnaceNominalCapacity)
      .input("meltPower", sql.Float, meltPower)
      .input("pourTemperture", sql.Float, pourTemperture)
      .input("lbsPerKw", sql.Float, lbsPerKw)
      .input("pourRatePerSystem", sql.Float, pourRatePerSystem)
      .input("pourTimePerTap", sql.Int, pourTimePerTap)
      .input("tapSize", sql.Float, tapSize)
      .input("timeToLoadInitialCharge", sql.Int, timeToLoadInitialCharge)
      .input("travelTimeCarToFurnace", sql.Int, travelTimeCarToFurnace)
      .input("travelTimeCarToLoadingPos", sql.Int, travelTimeCarToLoadingPos)
      .input("customerName", sql.NVarChar(75), customerName)
      .input("noOfFurnace", sql.Int, noOfFurnace)
      .input("noOfChargeCar", sql.Int, noOfChargeCar)
      .input("continousMetalSupply", sql.VarChar(5), continousMetalSupply)
      .input("timeBetweenTaps", sql.Int, timeBetweenTaps)
      .input("metalType", sql.VarChar(50), metalType)
      .input("holdPower", sql.Float, holdPower)
      .input("createdDate", sql.DateTime, new Date())
      .input("lastUpdatedDate", sql.DateTime, new Date())
      .input("lastUpdatedBy", sql.VarChar(50), lastUpdatedBy)
      .input("createdBy", sql.NVarChar(125), createdBy).query(`
    INSERT INTO tblProgramInputValues (
      nUserID,
      sProgramName,
      nNoOfPowerSupplies,
      nFurnaceNominalCapacity,
      nMeltPower,
      nPourTemperature,
      nLBSperKW,
      nPourRateperSystem,
      nPourTimeperTap,
      nTapSize,
      nTimeToLoadInitialChargeintoFurnace,
      nTravelTimeofChargeCarToFurnace,
      nTravelTimeofChargeCarToLoadingPosition,
      sCustomerName,
      nNoofFurnaces,
      nNoofChargeCars,
      sContinuousMetalSupply,
      nTimebetweentaps,
      sMetalType,
      nHoldPower,
      dtCreatedDate,
      dtLastUpdatedDate,
      sLastUpdatedBy,
      sCreatedBy
    ) VALUES (
      @userID,
      @programName,
      @noOfPowerSupplies,
      @furnaceNominalCapacity,
      @meltPower,
      @pourTemperture,
      @lbsPerKw,
      @pourRatePerSystem,
      @pourTimePerTap,
      @tapSize,
      @timeToLoadInitialCharge,
      @travelTimeCarToFurnace,
      @travelTimeCarToLoadingPos,
      @customerName,
      @noOfFurnace,
      @noOfChargeCar,
      @continousMetalSupply,
      @timeBetweenTaps,
      @metalType,
      @holdPower,
      @createdDate,
      @lastUpdatedDate,
      @lastUpdatedBy,
      @createdBy
    )
  `);

    return res.status(200).json({
      success: true,
      role: result.recordset[0].sRole,
      message: "Program Input Set Successfully",
    });
  } catch (error) {
    console.error("Error While Stting Program Input ", error);
    return res.status(500).json({
      success: false,
      message: "Error While Stting Program Inputttt",
    });
  }
};

exports.deleteProgramInput = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id Is Required",
      });
    }
    const con = await dbConnections;

    await con
      .request()
      .input("id", id)
      .query("delete FROM tblProgramInputValues WHERE nID = @id");

    return res.status(200).json({
      success: true,
      message: "ProgramInput Deleted Successfully",
    });
  } catch (error) {
    console.error("Error While Deleting Program input", error);
    return res.status(500).json({
      success: false,
      message: "Error While Deleting Program input",
    });
  }
};

exports.editProgramInputs = async (req, res) => {
  try {
    const {
      nID,
      customerName,
      lastUpdatedBy,
      numberOfPowerSupplies,
      pourRatePerSystem,
      meltPower,
      holdPower,
      furnaceNominalCapacityMetricTons,
      tapSize,
      pourTimePerTap,
      timeToLoadInitialCharge,
      lbsPerKW,
      pourTemperature,
      metalType,
      travelTimeToFurnace,
      travelTimeToLoading,
    } = req.body;

    if (!nID || !lastUpdatedBy) {
      return res.status(400).json({
        success: false,
        message: "Id is required.",
      });
    }

    const con = await dbConnections;

    const existing = await con
      .request()
      .input("nID", nID)
      .query("SELECT * FROM tblProgramInputValues WHERE nID=@nID");

    if (existing.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Program input data not found for the given nID",
      });
    }

    const updateFields = [];
    const request = con.request().input("nID", nID);

    if (numberOfPowerSupplies !== undefined) {
      updateFields.push("nNoOfPowerSupplies = @numberOfPowerSupplies");
      request.input("numberOfPowerSupplies", numberOfPowerSupplies);
    }
    if (pourRatePerSystem !== undefined) {
      updateFields.push("nPourRateperSystem = @pourRatePerSystem");
      request.input("pourRatePerSystem", pourRatePerSystem);
    }
    if (meltPower !== undefined) {
      updateFields.push("nMeltPower = @meltPower");
      request.input("meltPower", meltPower);
    }
    if (holdPower !== undefined) {
      updateFields.push("nHoldPower = @holdPower");
      request.input("holdPower", holdPower);
    }
    if (furnaceNominalCapacityMetricTons !== undefined) {
      updateFields.push(
        "nFurnaceNominalCapacity = @furnaceNominalCapacityMetricTons"
      );
      request.input(
        "furnaceNominalCapacityMetricTons",
        furnaceNominalCapacityMetricTons
      );
    }
    if (tapSize !== undefined) {
      updateFields.push("nTapSize = @tapSize");
      request.input("tapSize", tapSize);
    }
    if (pourTimePerTap !== undefined) {
      updateFields.push("nPourTimeperTap = @pourTimePerTap");
      request.input("pourTimePerTap", pourTimePerTap);
    }
    if (timeToLoadInitialCharge !== undefined) {
      updateFields.push(
        "nTimeToLoadInitialChargeintoFurnace = @timeToLoadInitialCharge"
      );
      request.input("timeToLoadInitialCharge", timeToLoadInitialCharge);
    }
    if (lbsPerKW !== undefined) {
      updateFields.push("nLBSperKW = @lbsPerKW");
      request.input("lbsPerKW", lbsPerKW);
    }
    if (pourTemperature !== undefined) {
      updateFields.push("nPourTemperature = @pourTemperature");
      request.input("pourTemperature", pourTemperature);
    }
    if (metalType !== undefined) {
      updateFields.push("sMetalType = @metalType");
      request.input("metalType", metalType);
    }
    if (travelTimeToFurnace !== undefined) {
      updateFields.push(
        "nTravelTimeofChargeCarToFurnace = @travelTimeToFurnace"
      );
      request.input("travelTimeToFurnace", travelTimeToFurnace);
    }
    if (travelTimeToLoading !== undefined) {
      updateFields.push(
        "nTravelTimeofChargeCarToLoadingPosition = @travelTimeToLoading"
      );
      request.input("travelTimeToLoading", travelTimeToLoading);
    }
    if (lastUpdatedBy !== undefined) {
      updateFields.push("sLastUpdatedBy = @lastUpdatedBy");
      request.input("lastUpdatedBy", lastUpdatedBy);
    }
    if (customerName !== undefined) {
      updateFields.push("sCustomerName = @customerName");
      request.input("customerName", customerName);
    }

    updateFields.push("dtLastUpdatedDate = GETDATE()");

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update.",
      });
    }

    const updateQuery = `
      UPDATE tblProgramInputValues
      SET ${updateFields.join(", ")}
      WHERE nID=@nID
    `;

    await request.query(updateQuery);
    const data = await con
      .request()
      .input("nID", nID)
      .query("SELECT * FROM tblProgramInputValues WHERE nID=@nID");
    return res.status(200).json({
      success: true,
      data: data.recordsets[0],
      message: "Program input data updated successfully.",
    });
  } catch (error) {
    console.error("Error while updating program input data:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating program inputs.",
    });
  }
};

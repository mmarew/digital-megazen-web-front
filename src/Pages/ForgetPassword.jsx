import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import forgetCss from "../CSS/Forget.module.css";
import loginCss from "../CSS/Login.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ErrorHandler from "../Components/Utilities/ErrorHandler";
import ErrorDisplayer from "../Components/Utilities/ErrorDisplayer";
import ImgApp from "../ImgSlider";
import sendRequestViaWS from "../Components/Utilities/sendRequestViaWS";

function ForgetPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState({
    password: "",
    retypedPassword: "",
  });
  const [processing, setProcessing] = useState(false);

  const [errors, setErrors] = useState({
    Message: null,
    Detail: null,
  });
  const [showForms, setshowForms] = useState({
    showPinCode: false,
    showPassword: false,
    showPhoneNumber: true,
  });

  let serverUrl = localStorage.getItem("targetUrl");
  let navigate = useNavigate();

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const submitRegistrationRequest = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({ Message: null, Detail: null });
    try {
      const response = await axios.post(serverUrl + "forgetRequest/", {
        phoneNumber,
      });
      let { data, uniqueId } = response.data;
      localStorage.setItem("forgetUniqueId", uniqueId);
      sendRequestViaWS(uniqueId);
      setshowForms({ ...showForms, showPhoneNumber: false, showPinCode: true });

      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      ErrorHandler(error, setErrors);
    }
  };

  const verifyPincode = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);
      let forgetUniqueId = localStorage.getItem("forgetUniqueId");
      setErrors({ Message: null, Detail: null });
      const response = await axios.post(serverUrl + "verifyPin/", {
        phoneNumber,
        pincode,
        forgetUniqueId,
      });
      setProcessing(false);
      if (response.data.data === "correctPin") {
        setshowForms({
          ...showForms,
          showPinCode: false,
          showPassword: true,
          showPhoneNumber: false,
        });
        setErrors({ Message: "SUCCESS", Detail: null });
      } else {
        setErrors({ Message: "Wrong Pincode", Detail: "Wrong Pincode" });
      }
    } catch (error) {
      ErrorHandler(error, setErrors);
      setProcessing(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (password.password !== password.retypedPassword) {
      setErrors({ Message: "Password mismatch", Detail: "Password mismatch" });
      return;
    }

    setProcessing(true);
    try {
      const response = await axios.post(serverUrl + "updateChangeInpassword/", {
        phoneNumber,
        password,
        forgetUniqueId: localStorage.getItem("forgetUniqueId"),
      });
      if (response.data.data === "passwordChanged") {
        navigate("/login");
        alert("Your password has been changed");
      }
    } catch (error) {
      ErrorHandler(error, setErrors);
    }
    setProcessing(false);
  };

  return (
    <div className={loginCss.loginWrapper}>
      <div className={loginCss.LeftSide}>
        <div className={forgetCss.forgetFormWrapper}>
          {showForms.showPhoneNumber && (
            <form
              onSubmit={submitRegistrationRequest}
              className={forgetCss.forgetForm}
            >
              <h5 className={forgetCss.forgetFormTitle}>
                Password Forget Request Form in Smart Stock Management
              </h5>
              <TextField
                className={forgetCss.phoneNumberInput}
                required
                type="tel"
                onChange={handlePhoneNumberChange}
                label="Enter Phone Number"
              />
              {errors.Message && <ErrorDisplayer error={errors.Detail} />}
              <div>
                {processing ? (
                  <Button fullWidth disabled>
                    Processing .....
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    className={forgetCss.requestButton}
                    type="submit"
                    variant="contained"
                  >
                    Request Forget
                  </Button>
                )}
              </div>
              <Link className={forgetCss.linkToOthers} to={"/login"}>
                If you have an account, Login here.
              </Link>
              <Link className={forgetCss.linkToOthers} to={"/register"}>
                If you are new, register here.
              </Link>
            </form>
          )}

          {showForms.showPinCode && (
            <form className={forgetCss.pincodeWrapper} onSubmit={verifyPincode}>
              <p className={forgetCss.pincodeMessage}>
                Your forgotten resetting PIN has been sent to your phone. Please
                check your phone and enter it in the following input field.
              </p>
              <TextField
                className={forgetCss.pincodeInput}
                required
                onChange={(e) => setPincode(e.target.value)}
                type="number"
                label="Enter Pin Code"
              />
              {errors.Message && <ErrorDisplayer error={errors.Detail} />}
              <div>
                {processing ? (
                  <Button fullWidth disabled>
                    Processing .....
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Verify
                  </Button>
                )}
              </div>
            </form>
          )}
          {showForms.showPassword && (
            <form className={forgetCss.passwordForm} onSubmit={updatePassword}>
              <h3 className={forgetCss.passwordFormTitle}>
                Please Enter Your New Password
              </h3>
              <br />
              <TextField
                className={forgetCss.passwordInput}
                required
                name="password"
                onChange={(e) =>
                  setPassword({ ...password, password: e.target.value })
                }
                type="password"
                label="Enter Password"
              />
              <br />
              <TextField
                className={forgetCss.passwordInput}
                required
                name="retypedPassword"
                onChange={(e) =>
                  setPassword({ ...password, retypedPassword: e.target.value })
                }
                type="password"
                label="Re-enter Password"
              />
              <br />
              {errors.Message && <ErrorDisplayer error={errors.Detail} />}
              <Box>
                {processing ? (
                  <Button fullWidth disabled>
                    Processing .....{" "}
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    className={forgetCss.updateButton}
                    type="submit"
                    color="primary"
                    variant="contained"
                  >
                    Update
                  </Button>
                )}
              </Box>
            </form>
          )}
        </div>
      </div>
      <div className={loginCss.loginRightSide}>
        <ImgApp />
      </div>
    </div>
  );
}

export default ForgetPassword;

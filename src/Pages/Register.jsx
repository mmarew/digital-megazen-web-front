import axios from "axios";
import React, { useEffect, useState } from "react";
import registerCss from "../CSS/Register.module.css";
import loginCss from "../CSS/Login.module.css";
import {
  Button,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ConsumeableContext } from "../Components/Body/UserContext/UserContext";
import ImgApp from "../ImgSlider";
import ErrorHandler from "../Components/Utilities/ErrorHandler";
import VerifyLogin from "./VerifyLogin";
function Register() {
  const [registrationStatus, setRegistrationStatus] = useState("");

  const [Errors, setErrors] = useState({
    Message: "Not Found",
    Detail: "",
  });
  const [Processing, setProcessing] = useState(false);
  let serverUrl = localStorage.getItem("targetUrl");
  const navigate = useNavigate();
  const [RegisterForm, setRegisterForm] = useState({});
  let handleRegistrationChange = (e) => {
    e.preventDefault();
    let value = e.target.value,
      names = e.target.name;
    setRegisterForm({ ...RegisterForm, [names]: value });
    setErrors({ Detail: "", Message: "" });
  };
  const { setownersName } = ConsumeableContext();

  let handleRegistrationSubmit = async (e) => {
    try {
      e.preventDefault();
      setRegistrationStatus("");
      setErrors({ Detail: "", Message: "" });
      let { retypePasswod, registerPassword } = RegisterForm;

      if (retypePasswod !== registerPassword)
        return setTimeout(() =>
          setErrors({
            Detail: "Password does not match",
            Message: "Password does not match",
          })
        );
      setProcessing(true);
      let response = await axios.post(
        serverUrl + "RegisterUsers/",
        RegisterForm
      );
      setProcessing(false);
      let data = response.data.data,
        token = response.data.token;
      if (data == "Data is inserted successfully.") {
        setRegistrationStatus("Success");
        setownersName(RegisterForm.fullName);
        localStorage.setItem("storeToken", token);
        localStorage.setItem("ownersName", RegisterForm.fullName);
      } else {
        localStorage.setItem("ownersName", RegisterForm.fullName);
        setownersName(RegisterForm.fullName);
        navigate("/login");
      }
    } catch (error) {
      setProcessing(false);
      ErrorHandler(error, setErrors);
    }
  };
  useEffect(() => {
    let VerifyUsersLogin = async () => {
      let responces = await VerifyLogin();
      if (responces?.data == "alreadyConnected") {
        navigate("/");
      }
    };
    VerifyUsersLogin();
  }, []);

  return (
    <div className={loginCss.loginWrapper}>
      {registrationStatus == "Success" ? (
        <Paper sx={{ padding: "20px", margin: "20px" }}>
          <Typography variant="body1">
            You are registered successfully. Thank you for registering.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Continue
          </Button>
        </Paper>
      ) : (
        <div className={loginCss.LeftSide}>
          <div className={registerCss.titleCreateAccount}>
            Create an account
          </div>
          <div className={registerCss.subTitleCreateAccount}>
            By creating an account you can administer your shops or other's shop
          </div>
          <form
            className={registerCss.userRegistrationForm}
            onSubmit={handleRegistrationSubmit}
            action=""
          >
            <div style={{ color: "red", paddingBottom: "10px" }}>
              {Errors.Detail}
            </div>

            <LinearProgress id="LinearProgress2" />
            <TextField
              fullWidth
              required
              name="fullName"
              onChange={handleRegistrationChange}
              type="text"
              label="Full Name"
            />

            <TextField
              fullWidth
              required
              name="registerPhone"
              onChange={handleRegistrationChange}
              type="tel"
              label="phone number"
            />

            <TextField
              fullWidth
              required
              name="registerPassword"
              onChange={handleRegistrationChange}
              type="password"
              label="Password"
            />
            <TextField
              fullWidth
              required
              name="retypePasswod"
              onChange={handleRegistrationChange}
              type="password"
              label="retype Password"
            />

            <div>
              <span>Already have an account? </span>
              <span
                style={{
                  textDecoration: "none",
                  color: "#6998ff",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/login")}
              >
                Login here
              </span>
            </div>

            {!Processing ? (
              <Button
                fullWidth
                variant="contained"
                name="submitButton"
                type="submit"
                placeholder=""
                color="primary"
              >
                Register
              </Button>
            ) : (
              <Button disabled>Processing</Button>
            )}
          </form>
        </div>
      )}
      <div className={loginCss.loginRightSide}>
        <ImgApp />
      </div>
    </div>
  );
}

export default Register;

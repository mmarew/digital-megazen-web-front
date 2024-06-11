import React, { useEffect, useState } from "react";
import loginCss from "../CSS/Login.module.css";
import axios from "axios";
import { Button, LinearProgress, TextField, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ImgApp from "../ImgSlider";
import { ConsumeableContext } from "../Components/Body/UserContext/UserContext";
import Localstorage from "../Components/Body/LocalStorage/Localstorage";
import VerifyLogin from "./VerifyLogin";
import DecodeJWT from "../Components/Utilities/DecodeJWT";
import ErrorHandler from "../Components/Utilities/ErrorHandler";

function Login() {
  let serverAddress = localStorage.getItem("targetUrl");
  let Navigate = useNavigate();
  const [loginErrors, setloginErrors] = useState({ Message: "", Detail: "" });
  const [loginForm, setloginForm] = useState({});
  const { setownersName } = ConsumeableContext();
  let submitForm = async (e) => {
    try {
      e.preventDefault();
      setProcess(true);
      let response = await axios.post(serverAddress + "Login/", loginForm);
      setProcess(false);
      if (response.data == "Not Registered Phone Number") {
        return setloginErrors(response.data);
      }

      let { Message, token, data } = response.data;
      setloginErrors({ Message: "", Detail: "" });
      if (data == "login successfully.") {
        let { usersFullName } = DecodeJWT(token);
        localStorage.setItem("ownersName", usersFullName);
        localStorage.setItem("storeToken", token);
        Navigate("/Business");
      } else {
        setloginErrors({ Message: data, Detail: "" });
      }
    } catch (error) {
      setProcess(false);
      // setloginErrors(error.message);
      ErrorHandler(error, setloginErrors);
    }
  };
  let handleFormData = (e) => {
    setloginErrors({ Message: "", Detail: "" });
    let values = e.target.value;
    let names = e.target.name;
    setloginForm({ ...loginForm, [names]: values });
  };

  let navigate = useNavigate();
  useEffect(() => {
    Localstorage();
    setProcess(true);
    let data = VerifyLogin();
    data
      .then((response) => {
        if (response?.data == "alreadyConnected") {
          navigate("/");
        }
        setProcess(false);
      })
      .catch((error) => {
        setProcess(false);
        ErrorHandler(error, setloginErrors);
      });
  }, []);
  const [Process, setProcess] = useState(false);
  return (
    <div className={loginCss.loginWrapper}>
      <div className={loginCss.LeftSide}>
        <div className={loginCss.gladMessage}>Glad to see you back</div>
        <div className={loginCss.greetingToLogin}>
          Login to your account to see how your shops are doing?
        </div>

        {loginErrors.Message && (
          <div style={{ color: "red", padding: "10px" }}>
            {loginErrors.Detail}
          </div>
        )}
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "500px",
          }}
          onSubmit={submitForm}
          action=""
        >
          <TextField
            fullWidth
            required
            name="phoneNumber"
            onChange={handleFormData}
            type="text"
            label="phone number"
          />
          <br />

          <TextField
            fullWidth
            required
            name="Password"
            onChange={handleFormData}
            type="password"
            label="Password"
          />
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <Link
              className={loginCss.passwordForgotten}
              to={"/forgetPaassword"}
            >
              Forgot Password?
            </Link>
            <Link className={loginCss.passwordForgotten} to={"/help"}>
              Need Help?
            </Link>
          </Box>
          {Process ? (
            <LinearProgress id="LinearProgress" />
          ) : (
            <Button fullWidth variant="contained" color="primary" type="submit">
              Login
            </Button>
          )}
          <div className={loginCss.signupRegister}>
            <div className={loginCss.titleTohaveAccount}>
              <span> Don't have an account? </span>
              <Link to="/register" className={loginCss.RegisterTex}>
                &nbsp; Register.
              </Link>
            </div>
          </div>
        </form>
      </div>
      <div className={loginCss.loginRightSide}>
        <ImgApp />
      </div>
    </div>
  );
}

export default Login;

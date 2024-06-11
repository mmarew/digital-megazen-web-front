import { Box, Button, Modal, TextField } from "@mui/material";
import React, { useState } from "react";
import ProfileCss from "../../../CSS/Profile.module.css";
import axios from "axios";
import ErrorHandler from "../../Utilities/ErrorHandler";
import { ButtonProcessing } from "../../Utilities/Utility";
import { useNavigate } from "react-router-dom";
function DeleteUsersProfile({ data }) {
  let errodData = {
    Message: "",
    Detail: "",
  };
  let serverUrl = localStorage.getItem("targetUrl");
  let storeToken = localStorage.getItem("storeToken");
  const navigate = useNavigate();
  let { deleteProfileModal, setdeleteProfileModal, settargetRender } = data;
  const [ErrorsOrSuccess, setErrorsOrSuccess] = useState(errodData);
  const [Password, setPassword] = useState(null);
  const [Processing, setProcessing] = useState(null);
  let deleteProfile = async () => {
    settargetRender("DeleteProfile");
    setErrorsOrSuccess({ ...errodData });
    setProcessing(true);
    try {
      if (Password != null)
        if (Password.length > 0) {
          let responces = await axios.post(serverUrl + "deleteUsers/", {
            token: storeToken,
            userPassword: Password,
          });
          setProcessing(false);
          let { message, data } = responces.data;
          if (
            message == "success" &&
            data == "User and associated data deleted successfully."
          ) {
            alert(
              "your account and related data are deleted from our digital system."
            );
            localStorage.removeItem("storeToken");
            navigate("/login");
          } else if (responces.data.data == "wrong password") {
            setErrorsOrSuccess({
              ...errodData,
              Detail: "wrong password confirmation",
            });
          }
        }
    } catch (error) {
      setProcessing(false);
      ErrorHandler(error, setErrorsOrSuccess);
    }
  };

  return (
    <div>
      <Modal open={deleteProfileModal}>
        <Box className="modalBox">
          <h5> Are you sure you want to delete your profile?</h5>
          <div style={{ color: "red", margin: "20px" }}>
            {" "}
            {ErrorsOrSuccess.Detail}
          </div>
          <form
            className={ProfileCss.deleteProfileForm}
            onSubmit={(e) => {
              e.preventDefault();
              deleteProfile();
            }}
          >
            <TextField
              required
              fullWidth
              type="password"
              className={ProfileCss.passwordInput}
              onChange={(e) => {
                setErrorsOrSuccess({ ...errodData });
                setPassword(e.target.value);
              }}
              value={Password}
              label="Enter Your Password"
            />
            <br />
            <br />
            {Processing ? (
              <ButtonProcessing />
            ) : (
              <Box className={ProfileCss.deleteProfileButtons}>
                <Button
                  sx={{
                    marginRight: "10px",
                  }}
                  className={ProfileCss.deleteSubmitButton}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  className={ProfileCss.deleteCloseButton}
                  onClick={() => {
                    setdeleteProfileModal(false);
                  }}
                  variant="contained"
                  color="error"
                >
                  Close
                </Button>
              </Box>
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default DeleteUsersProfile;

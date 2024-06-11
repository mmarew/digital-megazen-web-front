import axios from "axios";
import React, { useEffect, useState } from "react";
import "./CreateBusiness.css";
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import { ButtonProcessing } from "../Utilities/Utility";
import currentDates from "../Body/Date/currentDate";
import { Close } from "@mui/icons-material";
import ErrorHandler from "../Utilities/ErrorHandler";

function CreateBusiness({
  getBusiness,
  setnewBusiness,
  newBusiness,
  setRequestFailOrSuccess,
}) {
  const [Process, setProcess] = useState(false);
  let serverAddress = localStorage.getItem("targetUrl");
  const [businessData, setbusinessData] = useState({
    createdDate: currentDates(),
  });

  let handleCreateForm = (e) => {
    e.preventDefault();
    setBusinessNameError("");
    let filteredName = e.target.value.replace(/[^a-zA-Z0-9_ ]/g, "");
    if (filteredName != e.target.value) {
      setBusinessNameError(`Business name must be from a-z and 0-9`);
      return;
    }
    let token = localStorage.getItem("storeToken");
    setbusinessData({
      ...businessData,
      [e.target.name]: e.target.value,
      token,
    });
  };

  let submitAlldatas = async (e) => {
    e.preventDefault();
    let businessName = businessData.businessName;
    let i = 0;
    let filteredName = businessName.replace(/[^a-zA-Z0-9_ ]/g, "");
    if (filteredName != businessName) {
      setBusinessNameError(`Business name must be from a-z and 0-9`);
      return;
    }
    setRequestFailOrSuccess({});

    setProcess(true);
    try {
      let response = await axios.post(
        serverAddress + "business/createBusiness/",
        businessData
      );
      setProcess(false);
      getBusiness();
      let data = response.data.data;
      if (data == "already exist") {
        setRequestFailOrSuccess((prev) => ({
          ...prev,
          Responce: "FAIL",
          Message: "Error on create table ",
        }));
        setBusinessNameError(
          "This business name is reserved before. Please change its name."
        );
      } else if (data === "Business created successfully") {
        setRequestFailOrSuccess((prev) => ({
          ...prev,
          Responce: "SUCCESS",
          Message: "Business created successfully",
        }));
        cancelBusinessCreation("");
      } else if (data == "Errors") {
        setRequestFailOrSuccess((prev) => ({
          ...prev,
          Responce: "FAIL",
          Message: "Error on create table ",
        }));
        return;
      }
    } catch (error) {
      setProcess(false);
      ErrorHandler(error, setRequestFailOrSuccess);
    }
  };

  let cancelBusinessCreation = () => {
    setnewBusiness("");
  };

  useEffect(() => {}, []);
  const [businessNameError, setBusinessNameError] = useState(null);
  return (
    <div>
      <Modal open={newBusiness.Open}>
        <Box className="modalBox">
          <IconButton
            onClick={cancelBusinessCreation}
            sx={{ color: "red", float: "right" }}
          >
            <Close />
          </IconButton>
          <form onSubmit={submitAlldatas}>
            <TextField
              fullWidth
              required
              name="businessName"
              onChange={handleCreateForm}
              label="Enter Business Name"
            />
            <br /> <br />
            {businessNameError && (
              <div style={{ color: "red", margin: "10px" }}>
                {businessNameError}
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              {!Process ? (
                <Button variant="contained" color="primary" type="submit">
                  Create
                </Button>
              ) : (
                <ButtonProcessing />
              )}
              &nbsp;&nbsp;&nbsp;
              {/* <Button
                onClick={cancelBusinessCreation}
                id="cancelButton"
                type="button"
                value={"Cancel"}
                variant="contained"
                color="warning"
              >
                Cancel
              </Button> */}
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default CreateBusiness;

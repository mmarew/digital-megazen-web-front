import axios from "axios";
import React, { useState } from "react";
import currentDates from "../Body/Date/currentDate";
import "../Costs/AddCostItems.css";
import { Box, Button, Modal, TextField } from "@mui/material";
import { ButtonProcessing } from "../Utilities//Utility";
import SuccessOrError from "../Body/Others/SuccessOrError";
import SearchExpencesItem from "./SearchExpencesItem";
import { useNavigate } from "react-router-dom";
function AddExpencesItems(props) {
  let Navigate = useNavigate();
  const [inputValue, setinputValue] = useState(null);
  const [AddExpences, setAddExpences] = useState(false);
  let serverAddress = localStorage.getItem("targetUrl");
  let token = localStorage.getItem("storeToken");
  const businessId = localStorage.getItem("businessId");
  /////////usestates start here////////////
  let ExpData = {
    Costname: "",
    token,
    businessId,
    registrationDate: currentDates(),
  };
  const [data, setdata] = useState(ExpData);
  const [Processing, setProcessing] = useState(false);
  const [Errors, setErrors] = useState(null);
  const [Success, setSuccess] = useState(null);
  // uuse state ends here
  let resetUsestate = (array) => {
    array.map((item) => {
      item(null);
    });
  };
  let collectInputInformation = (e) => {
    let businessName = localStorage.getItem("businessName");
    resetUsestate([setErrors, setSuccess]);
    setdata({
      ...data,
      [e.target.name]: e.target.value,
      businessName,
    });
  };

  let submitExpences = async (e) => {
    e.preventDefault();

    try {
      resetUsestate([setErrors, setSuccess]);
      setProcessing(true);
      let response = await axios.post(
        serverAddress + "Expences/AddExpencesItems/",
        data
      );

      setErrors(null);
      if (response.data.data == "Registered successfully") {
        setSuccess("SUCCESS");
        setdata(ExpData);
      } else if (response.data.data == "already registered before") {
        setErrors("Already registered before");
      } else if (response.data.data == "notallowedToU") {
        setErrors(
          `you can't make registration to this kinds of data please tell to owner of the business`
        );
      }
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      setErrors(error.message);
    }
  };
  return (
    <div>
      <br /> <br />
      <Button variant="contained" onClick={() => setAddExpences(true)}>
        Add expense Item
      </Button>{" "}
      <br /> <br />
      <Modal open={AddExpences}>
        <Box className="modalBox">
          <form className="form-add-cost" onSubmit={submitExpences}>
            <h5 className="titleToRegistrationForm">
              Forms To Register Expences Items
            </h5>
            <br />
            <label>Date</label>
            <TextField
              value={data.registrationDate}
              onChange={collectInputInformation}
              className="inputToCotsRegistration"
              required
              type="date"
              name="date"
              id="dateIdInCost"
            />
            <br />
            <TextField
              className="inputToCotsRegistration"
              required
              value={data.Costname}
              name="Costname"
              label="Cost name"
              onChange={collectInputInformation}
            />
            <br />

            {!Processing ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  sx={{ marginRight: "10px" }}
                  variant="contained"
                  type="Submit"
                >
                  submit
                </Button>
                <Button
                  color="warning"
                  variant="contained"
                  onClick={() => setAddExpences(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <ButtonProcessing />
            )}
            {Errors && (
              <div style={{ color: "red", padding: "10px" }}>{Errors}</div>
            )}
          </form>
        </Box>
      </Modal>
      {!AddExpences && (
        <SearchExpencesItem
          proccessData={{ Processing, setProcessing }}
          InputValue={inputValue}
          setSearchTypeValueError={setErrors}
        />
      )}
      {/* {!AddExpences && <AddExpencesTransaction />} */}
      {Success && <SuccessOrError request={Success} setErrors={setSuccess} />}
    </div>
  );
}

export default AddExpencesItems;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { ButtonProcessing } from "../../Utilities/Utility";
import AddCostTransactionCss from "../../Costs/AddCostTransaction.module.css";
import CloseIcon from "@mui/icons-material/Close";
import currentDates from "../../Body/Date/currentDate";
import axios from "axios";
import SuccessOrError from "../../Body/Others/SuccessOrError";
import { ConsumeableContext } from "../../Body/UserContext/UserContext";
import ErrorHandler from "../../Utilities/ErrorHandler";
import { useNavigate } from "react-router-dom";
function AddExpTransaction() {
  let Navigate = useNavigate();
  let {
    setTransactionType,
    allExpencesList,
    setSinlgeSalesInputValues,
    singleSalesInputValues,
    openExpences,
    setOpenExpences,
    validFileTypes,
    acceptableFileExtensions,
  } = ConsumeableContext();
  const token = localStorage.getItem("storeToken");
  const [errorOrSuccess, setErrorsOrSuccess] = useState({
    Message: "",
    Detail: "",
  });
  const businessId = localStorage.getItem("businessId");
  let serverAddress = localStorage.getItem("targetUrl");

  const [registerableExpences, setRegisterableExpences] = useState({});
  let expData = {
    expDescription: "",
    expAmount: "",
    expDate: currentDates(),
  };
  const [Formdata, setFormdata] = useState(expData);
  const [Procecssing, setProcecssing] = useState(false);
  let handleClose = () => {
    // setErrorsOrSuccess({ Message: "", Detail: "" });
    let { showExpencesRecods, showBuyAndSales } = singleSalesInputValues;
    if (!showExpencesRecods && !showBuyAndSales) {
      setSinlgeSalesInputValues((previousData) => ({
        ...previousData,
        showExpencesRecods: true,
        showBuyAndSales: true,
      }));
    }
    // setSinlgeSalesInputValues((previousData) => ({}));
    setOpenExpences(false);
    setTransactionType("");
  };
  let collectCotForm = (e) => {
    setFormdata({
      ...Formdata,
      [e.target.name]: e.target.value,
    });
  };
  let handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let copyOfForm = { ...Formdata };
      copyOfForm.costsId = registerableExpences.costsId;
      copyOfForm.token = token;
      copyOfForm.businessId = businessId;
      let keysOfForm = Object.keys(copyOfForm);
      keysOfForm.forEach((key) => {
        formData.set(key, copyOfForm[key]);
      });
      setProcecssing(true);
      setErrorsOrSuccess({
        Message: "",
        Detail: "",
      });

      let response = await axios.post(
        `${serverAddress}Expences/registerExpenceTransaction`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token,
          },
        }
      );
      Navigate("waitting");
      setTimeout(() => {
        Navigate("/OpenBusiness/transaction/Expenses");
      });
      setFormdata(expData);

      setProcecssing(false);
      let data = response.data.data;
      if (data == "registered before") {
        setErrorsOrSuccess({
          Message: "Fail",
          Detail: "these data are registered before",
        });
      } else if (data == "Inserted properly") {
        setErrorsOrSuccess({
          Message: "SUCCESS",
          Detail: "Inserted properly",
        });
        setSinlgeSalesInputValues((previousData) => ({
          ...previousData,
          showExpencesRecods: false,
          showBuyAndSales: false,
          searchTarget: "getLast10records",
          showSearchForm: false,
        }));
        setTimeout(() => {
          setSinlgeSalesInputValues((previousData) => ({
            ...previousData,
            showExpencesRecods: true,
            showBuyAndSales: false,
            searchTarget: "getLast10records",
          }));
        }, 10);
        handleClose();
      }
    } catch (error) {
      ErrorHandler(error, setErrorsOrSuccess);
      setProcecssing(false);
    }
  };
  // fetchExpencesItemsFromServer;
  useEffect(() => {
    // setSinlgeSalesInputValues((previousData) => ({
    //   ...previousData,
    //   showExpencesRecods: false,
    //   showBuyAndSales: false,
    // }));
  }, []);
  const [formData, setformData] = useState(new FormData());
  const handleFileChanges = (e) => {
    let { name, files } = e.target;
    if (e.target.name !== "attachedFiles") {
      return;
    }
    let file = files[0];
    if (!validFileTypes.includes(file.type)) {
      alert("File type not supported");
      e.target.value = null;

      return;
    }
    formData.set(name, file);
  };
  return (
    <div>
      {errorOrSuccess?.Message && (
        <SuccessOrError
          request={
            errorOrSuccess?.Message.toLowerCase() == "success"
              ? "SUCCESS"
              : errorOrSuccess?.Detail
          }
          setErrors={setErrorsOrSuccess}
        />
      )}
      <Modal open={openExpences}>
        <Box className="modalBox">
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <CloseIcon />
          </IconButton>

          {allExpencesList?.length > 0 ? (
            <form
              onSubmit={(e) => handleFormSubmit(e)}
              className={AddCostTransactionCss.costTransactionForm}
            >
              <br />
              <h5>Expences Transaction Registration Form</h5>
              <br />
              <label> Select Date</label>
              <TextField
                className={AddCostTransactionCss.formInputToTransaction}
                required
                value={Formdata.expDate || currentDates()}
                name="expDate"
                onChange={collectCotForm}
                type="Date"
              />
              <br />
              <label>Choose Expences Item</label>

              <Select required>
                {allExpencesList?.map((items) => {
                  return (
                    <MenuItem
                      onClick={() => {
                        setRegisterableExpences(items);
                      }}
                      value={items}
                    >
                      {items.costName}
                    </MenuItem>
                  );
                })}
              </Select>
              <br />
              <TextField
                required
                value={Formdata.expAmount}
                type="number"
                label="Expences Amount"
                name={"expAmount"}
                onChange={collectCotForm}
                className={AddCostTransactionCss.formInputToTransaction}
              />
              <br />
              <TextField
                required
                value={Formdata.expDescription}
                onChange={collectCotForm}
                label="Expences Description"
                className={AddCostTransactionCss.formInputToTransaction}
                name={"expDescription"}
                type="text"
              />
              <br />
              <TextField
                onChange={handleFileChanges}
                type="file"
                name="attachedFiles"
                accept={acceptableFileExtensions}
              />

              <br />
              {!Procecssing ? (
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              ) : (
                <ButtonProcessing />
              )}
            </form>
          ) : (
            <div style={{ color: "red" }}>No data found</div>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default AddExpTransaction;

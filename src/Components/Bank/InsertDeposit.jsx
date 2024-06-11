import { Button, Paper, TextField } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import currentDates from "../Body/Date/currentDate";
import axios from "axios";
import ErrorHandler from "../Utilities/ErrorHandler";
import SuccessOrError from "../Body/Others/SuccessOrError";
import { useNavigate } from "react-router-dom";
import { ConsumeableContext } from "../Body/UserContext/UserContext";

let depositFormat = {
  depositedDate: currentDates(),
  accountNumber: "",
  depositedAmount: "",
  clientSideUniqueId: "",
  depositsDescriptions: "",
  attachedFilesName: "",
};
function InsertDeposite() {
  let Navigate = useNavigate();
  const { acceptableFileExtensions, validFileTypes } = ConsumeableContext();
  let token = localStorage.getItem("storeToken");
  let formData = new FormData();
  let serverAddress = localStorage.getItem("targetUrl");
  let businessId = localStorage.getItem("businessId");
  const [textData, setTextData] = useState({ ...depositFormat });
  const [errorsOrSuccesses, setErrorsOrSuccesses] = useState({
    Message: "",
    Detail: "",
  });

  let submitForm = async (e) => {
    e.preventDefault();
    try {
      formData.append("textData", JSON.stringify(textData));
      formData.append("selectedFile", selectedFile);

      const config = {
        headers: {
          Authorization: token, // Replace "YourTokenHere" with the actual token value
          "Content-Type": "multipart/form-data",
        },
      };
      setErrorsOrSuccesses({ Message: "", Detail: "" });
      setProcessing(true);
      let Responces = await axios.post(
        serverAddress + "bankDeposit/registerDeposit",
        formData,
        config
      );
      Navigate("/waiiting");
      setTimeout(() => {
        Navigate("/OpenBusiness/transaction/bankDeposit");
      });
      setProcessing(false);
      setTextData({ ...depositFormat });
      let fileInput = document.querySelector(' [name="selectedFile"]');
      fileInput.value = "";
      setErrorsOrSuccesses({
        Message: "Success",
        Detail: "Registered successfully",
      });
    } catch (error) {
      ErrorHandler(error, setErrorsOrSuccesses);
      setProcessing(false);
    }
  };
  let handleInputChanges = (e) => {
    let uuid = uuidv4();
    setTextData({
      ...textData,
      [e.target.name]: e.target.value,
      clientSideUniqueId: uuid,
      businessId,
    });
  };
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    let file = event?.target?.files[0];
    if (!validFileTypes.includes(file.type)) {
      alert("File type not supported");
      event.target.value = null;

      return;
    }
    setSelectedFile(file);
  };
  const [Processing, setProcessing] = useState(false);
  return (
    <div>
      <br /> <br />
      <Paper sx={{ padding: "30px", maxWidth: "300px" }}>
        {errorsOrSuccesses.Message && (
          // <div style={{ color: "red", padding: "10px" }}>
          //   {errorsOrSuccesses.Detail}
          // </div>
          <SuccessOrError
            toastingTime={4000}
            request={
              errorsOrSuccesses.Message.toLowerCase() === "success"
                ? "Success"
                : errorsOrSuccesses.Detail
            }
            setErrors={setErrorsOrSuccesses}
          />
        )}
        <form
          enctype="multipart/form-data" // Add the enctype attribute
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            maxWidth: "300px",
          }}
          onSubmit={submitForm}
        >
          <TextField
            type="date"
            onChange={handleInputChanges}
            label="Date"
            value={textData.depositedDate}
            required
            name="depositedDate"
          />
          <TextField
            type="number"
            name="depositedAmount"
            onChange={handleInputChanges}
            value={textData.depositedAmount}
            label="Amount"
            required
          />
          <TextField
            onChange={handleInputChanges}
            value={textData.accountNumber}
            name="accountNumber"
            required
            label="Account Number"
          />
          <TextField
            onChange={handleInputChanges}
            value={textData.depositsDescriptions}
            name="depositsDescriptions"
            required
            label="Description"
          />
          <label>Attach file here</label>
          <TextField
            type="file"
            name="selectedFile"
            onChange={handleFileChange}
            accept={acceptableFileExtensions}
          />
          {Processing ? (
            <Button disabled>Processing ..... </Button>
          ) : (
            <Button variant="contained" type="submit">
              submit
            </Button>
          )}
        </form>
      </Paper>
    </div>
  );
}

export default InsertDeposite;

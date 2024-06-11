import { Box, Button, Modal, TextField } from "@mui/material";
import React, { useState } from "react";
import { DateFormatter } from "../Body/Date/currentDate";
import axios from "axios";
import ErrorHandler from "../Utilities/ErrorHandler";
import SuccessOrError from "../Body/Others/SuccessOrError";

function UpdateDeposit({ data }) {
  let { editBankDeposit, setEditBankDeposit, getDeposit } = data;
  const [Processing, setProcessing] = useState(false);
  const [errorsOrSuccess, seterrorsOrSuccess] = useState({
    Message: null,
    Detail: null,
  });
  let formData = new FormData();
  const [depositData, setDepositData] = useState({
    ...editBankDeposit.depositData,
  });
  const [filesData, setFilesData] = useState(null);
  let handleInputsChange = (e) => {
    setDepositData({ ...depositData, [e.target.name]: e.target.value });
  };
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let handleUpdateFormSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.append("depositData", JSON.stringify(depositData));

      formData.append("newAttachedFiles", filesData);
      const config = {
        headers: {
          Authorization: token, // Replace "YourTokenHere" with the actual token value
          "Content-Type": "multipart/form-data",
        },
      };
      setProcessing(true);
      seterrorsOrSuccess({ Message: "", Detail: "" });
      let responces = await axios.put(
        serverAddress + "bankDeposit/updateDeposit",
        formData,
        config
      );
      getDeposit();
      setProcessing(false);
      setEditBankDeposit({ openModal: false });
      let { data } = responces.data;
      if (data == "success") {
        setEditBankDeposit({ ...editBankDeposit, openModal: false });
      }
    } catch (error) {
      ErrorHandler(error, seterrorsOrSuccess);
      setProcessing(false);
    }
  };
  let handleFilesChange = (e) => {
    setFilesData(e.target.files[0]);
  };
  return (
    <Modal open={editBankDeposit.openModal}>
      <Box className="modalBox">
        {errorsOrSuccess.Message && (
          <SuccessOrError
            setErrors={seterrorsOrSuccess}
            toastingTime={3000}
            request={
              errorsOrSuccess?.Message?.toLowerCase() == "success"
                ? "Success"
                : errorsOrSuccess.Detail
            }
          />
        )}
        <form
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          onSubmit={handleUpdateFormSubmit}
        >
          <TextField
            name="depositedDate"
            onChange={handleInputsChange}
            value={DateFormatter(depositData.depositedDate)}
            type="date"
            required
          />
          <TextField
            name="depositedAmount"
            label="Deposited Amount"
            onChange={handleInputsChange}
            value={depositData.depositedAmount}
            type="number"
            required
          />
          <TextField
            name="accountNumber"
            onChange={handleInputsChange}
            label="Account Number"
            value={depositData.accountNumber}
            type="text"
            required
          />
          <TextField
            name="depositsDescriptions"
            onChange={handleInputsChange}
            label="Deposits Descriptions"
            multiline
            value={depositData.depositsDescriptions}
            type="text"
            required
          />
          <TextField
            onChange={handleFilesChange}
            name="newAttachedFiles"
            type="file"
          />
          {Processing ? (
            <Button disabled>Processing...</Button>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "200px",
                margin: "auto",
              }}
            >
              <Button variant="contained" color="success" type="submit">
                Update
              </Button>
              <Button
                onClick={() => setEditBankDeposit({ openModal: false })}
                variant="contained"
                color="error"
              >
                Close
              </Button>
            </div>
          )}
        </form>
      </Box>
    </Modal>
  );
}

export default UpdateDeposit;

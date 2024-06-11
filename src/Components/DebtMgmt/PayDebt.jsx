import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import CurrencyFormatter from "../Utilities/Utility";
import ErrorHandler from "../Utilities/ErrorHandler";
import currentDates from "../Body/Date/currentDate";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
let paymentData = {
  paidAmount: null,
  Descriptions: null,
  paymentType: null,

  paidDate: currentDates(),
};
function PayDebt({ data }) {
  const { debtPayment, setDebtPayment, setfetchDebtData, DebitList } = data;

  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  let businessId = localStorage.getItem("businessId");
  const [successOrErrors, setSuccessOrErrors] = useState({
    Message: "",
    Detail: "",
  });
  const [debtFormData, setDebtFormData] = useState({ ...paymentData });
  let handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let formData = new FormData();
      setProcessing(true);
      let allRequiredData = {
        ...debtFormData,
        token,
        businessName,
        businessId,
        ...debtPayment.item,
      };

      formData.append("depositData", JSON.stringify(allRequiredData));

      formData.append("newAttachedFiles", selectedFile);
      const config = {
        headers: {
          Authorization: token, // Replace "YourTokenHere" with the actual token value
          "Content-Type": "multipart/form-data",
        },
      };
      let responces = await axios.put(
        serverAddress + "debt/confirmDebtPayment",
        formData,
        config
      );
      setfetchDebtData((prev) => {
        return !prev;
      });
      setDebtPayment((prevData) => ({
        ...prevData,
        openModal: false,
      }));
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      ErrorHandler(error, setSuccessOrErrors);
    }
  };
  let handleInputsChanges = (e) => {
    let { name, value } = e.target;
    setDebtFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  let handleClose = () => {
    setDebtPayment((prevData) => ({
      ...prevData,
      openModal: false,
    }));
  };
  let { validFileTypes, acceptableFileExtensions } = ConsumeableContext();
  const [selectedFile, setSelectedFile] = useState(null);
  let handleFileChange = (event) => {
    let file = event.target.files[0];
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
      <Modal open={debtPayment.openModal}>
        <Box className="modalBox">
          <IconButton onClick={handleClose} className="modalBoxCloseIcon">
            <Close />
          </IconButton>
          <form
            onSubmit={handleFormSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "10px",
            }}
          >
            {/* {unitPrice * purchaseQty} */}
            {/* {JSON.stringify(DebitList)} */}
            <h3>Payment form to debt</h3>
            <h4>Money to be paid: {CurrencyFormatter(debtPayment.tobePaid)}</h4>
            {successOrErrors.Message && (
              <p style={{ color: "red" }}>{successOrErrors.Detail}</p>
            )}
            <label>Payment Date</label>
            <TextField
              onChange={handleInputsChanges}
              value={debtFormData.paidDate}
              name="paidDate"
              type="date"
              required
              fullWidth
            />
            <TextField
              onChange={handleInputsChanges}
              value={debtFormData.paidAmount}
              name="paidAmount"
              type="number"
              label="Paid Amount"
              required
              fullWidth
            />
            <TextField
              onChange={handleInputsChanges}
              name="Descriptions"
              value={debtFormData.Descriptions}
              type="text"
              label="Description"
              required
              fullWidth
            />
            <label>Choose payment type</label>
            <Select
              onChange={handleInputsChanges}
              name="paymentType"
              value={debtFormData.paymentType}
            >
              <MenuItem value="On cash">On cash</MenuItem>
              <MenuItem value="By bank">By bank</MenuItem>
            </Select>
            <label>Attach files</label>
            <TextField
              name="newAttachedFiles"
              type="file"
              onChange={handleFileChange}
              accept={acceptableFileExtensions}
            />
            {Processing ? (
              <Button disabled>Processing ...... </Button>
            ) : (
              <Button variant="contained" type="submit">
                Confirm payment
              </Button>
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default PayDebt;

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import ErrorHandler from "../Utilities/ErrorHandler";
import SuccessOrError from "../Body/Others/SuccessOrError";

function DeleteDeposit({ data }) {
  let { deleteBankDeposit, setDeleteBankDeposit, getDeposit } = data;
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessId = localStorage.getItem("businessId");
  const [errorORSuccess, setErrorORSuccess] = useState({
    Message: "",
    Detail: "",
  });

  const [Processing, setProcessing] = useState(false);
  const [userPassword, setUserPassword] = useState(null);
  let handleDeleteFormSubmit = async (event) => {
    try {
      setErrorORSuccess({ Message: "", Detail: "" });
      event.preventDefault();
      setProcessing(true);
      let responces = await axios.delete(
        serverAddress + "bankDeposit/deleteDeposit/",
        {
          data: {
            userPassword,
            token,
            businessId,
            bankDepositsId: deleteBankDeposit.depositData.bankDepositsId,
          },
        }
      );
      getDeposit();
      setProcessing(false);
      setDeleteBankDeposit({ openModal: false });
    } catch (error) {
      ErrorHandler(error, setErrorORSuccess);
      setProcessing(false);
    }
  };
  return (
    <div>
      <Modal open={deleteBankDeposit.openModal}>
        <Box className="modalBox">
          {errorORSuccess.Message && (
            <SuccessOrError
              request={
                errorORSuccess.Message.toLowerCase() == "success"
                  ? errorORSuccess.Message
                  : errorORSuccess.Detail
              }
              setErrors={setErrorORSuccess}
            />
          )}
          <form
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            onSubmit={handleDeleteFormSubmit}
          >
            <Typography>
              Are you sure to delete this deposit data? if so, please enter your
              password
            </Typography>
            <TextField
              required
              type="password"
              onChange={(e) => setUserPassword(e.target.value)}
              label="Password"
            />
            {!Processing ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <Button type="submit" variant="contained" color="error">
                  delete
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => setDeleteBankDeposit({ openModal: false })}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button disabled>Processing...</Button>
            )}
          </form>{" "}
        </Box>
      </Modal>
    </div>
  );
}

export default DeleteDeposit;

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import ErrorHandler from "../Utilities/ErrorHandler";

function DeleteDebtTransaction({ data }) {
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessId = localStorage.getItem("businessId");
  const [Processing, setProcessing] = useState(false);
  const [errorsVsSuccess, seterrorsVsSuccess] = useState({
    Message: null,
    Detail: null,
  });

  let { deleteDebt, setDeleteDebt, getUsersDebtData } = data;
  const [userPassword, setUserPassword] = useState(null);
  let handleDeleteSubmit = async (e) => {
    try {
      setProcessing(true);
      e.preventDefault();
      seterrorsVsSuccess({ Message: null, Detail: null });
      let responces = await axios.delete(
        serverAddress + "debt/deleteDebtData",
        {
          data: {
            userPassword,
            businessId: businessId,
            deletableItem: deleteDebt?.item,
          },
          headers: {
            Authorization: token,
          },
        }
      );
      getUsersDebtData();
      handleClose();
      seterrorsVsSuccess({ Message: "Success", Detail: "success" });
      setProcessing(false);
    } catch (error) {
      ErrorHandler(error, seterrorsVsSuccess);
      setProcessing(false);
    }
  };
  let handleClose = () => {
    setDeleteDebt({ ...deleteDebt, openModal: false });
    setUserPassword(null);
  };
  return (
    <div>
      <Modal open={deleteDebt.openModal}>
        <Box className="modalBox">
          {errorsVsSuccess.Message && (
            <p style={{ color: "red", padding: 10 }}>
              {errorsVsSuccess.Message}
            </p>
          )}

          <Typography>
            You are going to delete your debt item. Are you sure to delete it?
            If So please enter password below.
          </Typography>
          <form
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
            onSubmit={handleDeleteSubmit}
          >
            <br />
            <TextField
              label="User Password"
              name="userPassword"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              type="password"
            />
            {!Processing ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                  margin: "auto",
                }}
              >
                <Button variant="contained" color="error" type="submit">
                  Confirm
                </Button>{" "}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button disabled>Processing...</Button>
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default DeleteDebtTransaction;

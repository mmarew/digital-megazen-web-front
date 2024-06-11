import React from "react";
// import Dialog from "@mui/material";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { ButtonProcessing } from "../Utilities/Utility";
import ErrorHandler from "../Utilities/ErrorHandler";
function DeleteProducts({ data }) {
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");

  let { ConfirmDelete, setConfirmDelete, fetchProducts } = data;
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const [userPassword, setUserPassword] = useState(null);
  const [Proccessing, setProccessing] = useState(null);
  let { item } = ConfirmDelete;
  const [Errors, setErrors] = useState({ Message: null, Detail: "" });

  item.businessName = businessName;

  let deleteMyProducts = async () => {
    try {
      item.businessId = businessId;
      item.token = token;
      item.userPassword = userPassword;
      setProccessing(true);
      let deletResponce = await axios.post(
        serverAddress + "products/deleteProducts/",
        item
      );
      setProccessing(false);

      fetchProducts();
      handleClose(true);
      let { data, Messages } = deletResponce.data;
      if (data == "Error") {
        alert(Messages);
        return;
      }
    } catch (error) {
      ErrorHandler(error, setErrors);
      // setErrors(error.message);
      setProccessing(false);
    }
  };

  let handleClose = () => {
    setConfirmDelete({ Verify: false });
    setUserPassword(null);
    setProccessing(null);
  };
  return (
    <div>
      <Dialog open={ConfirmDelete.Verify}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <form
            style={{
              width: "80%",
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              deleteMyProducts();
            }}
          >
            <TextField
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              fullWidth
              required
              label={"Enter Password to verify"}
            />
            <br />
            <div style={{ color: "red" }}>
              {Errors.Message && Errors.Detail}
            </div>
            <br />
            {!Proccessing ? (
              <div>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => handleClose(true)}
                >
                  Cancel
                </Button>
                &nbsp; &nbsp; &nbsp;
                <Button variant="contained" type="submit">
                  Confirm
                </Button>
              </div>
            ) : (
              <ButtonProcessing />
            )}
            <br />
          </form>
        </DialogActions>
      </Dialog>
      {Proccessing ? <ButtonProcessing /> : null}
    </div>
  );
}

export default DeleteProducts;

import React from "react";
import { Snackbar, SnackbarContent } from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";

function CustomSnackbar({ open, message, type, onClose, toastingTime }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  const variant = type === "success" ? "success" : "error";
  const Icon = type === "success" ? CheckCircleIcon : ErrorIcon;

  return (
    <Snackbar open={open} autoHideDuration={toastingTime} onClose={handleClose}>
      <SnackbarContent
        sx={{
          backgroundColor: variant === "success" ? "green" : "red",
        }}
        message={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Icon style={{ marginRight: "8px" }} />
            <span> {message}</span>
            <CloseIcon onClick={handleClose} />
          </div>
        }
      />
    </Snackbar>
  );
}

export default CustomSnackbar;

import React, { useEffect, useState } from "react";
import CustomSnackbar from "./Notification";

function SuccessOrError({ request, setErrors, toastingTime }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  if (!toastingTime) toastingTime = 2000;

  const handleSuccess = (event) => {
    setOpen(true);
    setMessage(request);
    setType("success");
  };

  const handleError = (event) => {
    setOpen(true);
    setMessage(request);
    setType("error");
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (request?.toLowerCase()?.includes("success")) {
      handleSuccess();
      return;
    }
    handleError();
    if (typeof setErrors == "function" && !setErrors)
      setTimeout(() => {
        setErrors({ Message: null, Detail: null });
      }, 3000);
  }, [, request, setErrors]);

  return (
    <div>
      {open && (
        <CustomSnackbar
          toastingTime={toastingTime}
          open={open}
          message={message}
          type={type}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default SuccessOrError;

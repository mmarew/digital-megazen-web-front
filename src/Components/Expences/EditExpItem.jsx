import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { ButtonProcessing } from "../Utilities/Utility";

function EditExpItem({
  data: {
    openEditingModal,
    setopenEditingModal,
    getExpencesLists,
    setSuccessError,
  },
}) {
  const token = localStorage.getItem("storeToken");
  const businessId = localStorage.getItem("businessId");
  const businessName = localStorage.getItem("businessName");
  const serverAddress = localStorage.getItem("targetUrl");

  const [costName, setCostName] = useState(openEditingModal.cost.costName);
  const [processing, setProcessing] = useState(false);

  const updateMyCostData = async () => {
    try {
      setProcessing(true);
      const response = await axios.post(`${serverAddress}updateExpencesItem/`, {
        costName,
        businessId,
        businessName,
        token,
        costsId: openEditingModal.cost.costsId,
      });
      setProcessing(false);

      getExpencesLists();
      const data = response.data.data;
      if (data === "updated successfully") {
        setSuccessError({
          Message: "SUCCESS",
          Detail: "SUCCESS",
        });
        setopenEditingModal({ open: false });
      } else {
        setSuccessError({
          Message: "Fail",
          Detail: data,
        });
      }
    } catch (error) {
      setProcessing(false);
      setSuccessError({
        Message: "Errors",
        Detail:
          "An error occurred while updating cost data. Please try again later.",
      });
    }
  };

  return (
    <div>
      <Modal open={openEditingModal.open}>
        <Box className="modalBox">
          <IconButton
            aria-label="close"
            onClick={() => setopenEditingModal({ open: false })}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <CloseIcon />
          </IconButton>
          <br />
          <br />
          <h3>Edition form to expenses</h3>
          <br />
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              width: "90%",
              margin: "auto",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <TextField
              value={costName}
              onChange={(e) => setCostName(e.target.value)}
              type="text"
            />
            <br />
            {processing ? (
              <ButtonProcessing />
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={updateMyCostData}
              >
                Update
              </Button>
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default EditExpItem;

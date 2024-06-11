import React, { useEffect, useState } from "react";
import { TextField, Button, IconButton } from "@mui/material";
import { Box, Modal } from "@mui/material";
import axios from "axios";
import { ButtonProcessing } from "../Utilities/Utility";
import NameValidators from "../Body/NameValidators";
import { Close } from "@mui/icons-material";
function ModalToEditBusinessName({
  setopenBusinessEditingModal,
  openBusinessEditingModal,
  getBusiness,
}) {
  let serverAddress = localStorage.getItem("targetUrl");
  const [updatedBusinessName, setUpdatedBusinessName] = useState("");
  const [Processing, setProcessing] = useState(false);
  const [businessId, setBusinessI] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    let updateRes = await axios.post(
      `${serverAddress}business/updateBusinessName`,
      {
        token: localStorage.getItem("storeToken"),
        businessname: updatedBusinessName,
        targetBusinessId: businessId,
      }
    );
    getBusiness();
    setProcessing(false);
    setopenBusinessEditingModal({ open: false });
    // Perform any additional form submission logic here
    // For example, you can make an API request to submit the form data to the server

    // Reset the form and clear the business name
    setUpdatedBusinessName("");
    // Open the modal
  };
  useEffect(() => {
    setBusinessI(openBusinessEditingModal.datas.BusinessID);

    setUpdatedBusinessName(openBusinessEditingModal.datas.BusinessName);
  }, []);
  const [BusinessNameError, setBusinessNameError] = useState(null);

  return (
    <div>
      <Modal open={openBusinessEditingModal.Open}>
        <Box className="modalBox">
          <IconButton
            onClick={() => {
              setopenBusinessEditingModal((prev) => {
                return { ...prev, Open: false };
              });
            }}
            sx={{ float: "right", color: "red" }}
          >
            <Close />
          </IconButton>
          <h2 style={{ textAlign: "center", margin: "10px auto" }}>
            Business Form Edition
          </h2>
          <form
            style={{
              width: "300px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={handleFormSubmit}
          >
            <TextField
              label="Business Name"
              value={updatedBusinessName}
              onChange={(e) => {
                let Value = e.target.value;
                let namingRule = NameValidators(Value, setBusinessNameError);
                if (namingRule == "wrong naming rule") {
                  return;
                }
                setUpdatedBusinessName(Value);
              }}
            />
            {BusinessNameError && (
              <div style={{ color: "red" }}>{BusinessNameError}</div>
            )}
            <br />
            <div style={{ textAlign: "center" }}>
              {!Processing ? (
                <>
                  <Button type="submit" variant="contained">
                    Update
                  </Button>{" "}
                </>
              ) : (
                <ButtonProcessing />
              )}
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default ModalToEditBusinessName;

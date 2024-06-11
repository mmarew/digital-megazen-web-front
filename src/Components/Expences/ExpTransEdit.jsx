import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Box, Modal, Button } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { ButtonProcessing } from "../Utilities/Utility";
function ExpTransEdit({
  EditExpences,
  setEditExpences,
  getExpencesTransaction,
  setErrorVsSuccess,
}) {
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");
  const [Processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    ...EditExpences.item,
    token,
    businessId,
  });
  useEffect(() => {
    setFormData((prev) => ({
      ...EditExpences.item,
      ...prev,
    }));
  }, [EditExpences]);

  let serverAddress = localStorage.getItem("targetUrl");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // newlyAttachedFile,collectedData

    let formDataKey = Object.keys(formData);
    formDataKey.forEach((key) => {
      collectedData.set(key, formData[key]);
    });
    try {
      setProcessing(true);
      let Res = await axios.post(
        serverAddress + "Expences/updateMyexpencesList",
        collectedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token,
          },
        }
        // { ...formData }
      );
      setEditExpences({ Open: false });
      setProcessing(false);
      getExpencesTransaction();
      // Perform form submission or other logic here
      if (Res.data.data == "Updated") {
        setErrorVsSuccess("Updated");
      } else {
        setErrorVsSuccess("Error on update");
      }
    } catch (error) {
      setProcessing(false);
      setErrorVsSuccess("Error on update");
    }
  };
  const [collectedData, setCollectedData] = useState(new FormData());
  let handleFileChanges = (event) => {
    let { name, files } = event.target;
    let file = files[0];
    if (event.target.name == "newlyAttachedFile") {
      collectedData.set(name, file);
    }
  };

  return (
    <div>
      <Modal open={EditExpences.Open}>
        <Box className="modalBox">
          {" "}
          <h3>Edition Form To Expences</h3>
          <br />
          <form
            style={{ width: "300px", margin: "auto" }}
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              type="number"
              label="Cost Amount"
              name="costAmount"
              value={formData.costAmount}
              onChange={handleChange}
            />
            <br />
            <br />
            <TextField
              fullWidth
              type="text"
              label="Cost Descriptions"
              name="costDescription"
              value={formData.costDescription}
              onChange={handleChange}
            />
            <br />
            <br />
            <TextField
              type="file"
              name="newlyAttachedFile"
              onChange={handleFileChanges}
            />
            {!Processing ? (
              <Box sx={{ textAlign: "center" }}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>{" "}
                <Button
                  style={{ backgroundColor: "brown", color: "white" }}
                  onClick={() => {
                    setEditExpences({ Open: false });
                  }}
                  variant="contained"
                >
                  Close
                </Button>
              </Box>
            ) : (
              <ButtonProcessing />
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}
export default ExpTransEdit;

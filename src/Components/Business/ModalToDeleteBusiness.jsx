import { Box, Modal, TextField, Button } from "@mui/material";
import React from "react";
import DeleteBusiness from "./DeleteBusiness";
import { useState } from "react";
import { ButtonProcessing } from "../Utilities/Utility";
function ModalToDeleteBusiness({ Data }) {
  let {
    openBusinessDeletingModal,
    setopenBusinessDeletingModal,
    getBusiness,
    setRequestFailOrSuccess,
  } = Data;
  let { datas, Open } = openBusinessDeletingModal;
  let { businessId, businessName } = datas;
  const [Proccessing, setProccessing] = useState(false);
  //   let { setOpen, setProccessing } = openBusinessDeletingModal;
  const [userPassword, setuserPassword] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  // Handle confirmed action here
  let callDeleteFnction = async (e) => {
    e.preventDefault();
    let responce = await DeleteBusiness({
      setRequestFailOrSuccess,
      businessId,
      businessName,
      getBusiness,
      setProccessing,
      userPassword,
      setDeleteError,
      setopenBusinessDeletingModal,
    });
    if (responce == "") {
    }
  };

  return (
    <Modal open={Open}>
      <Box className="modalBox">
        <form onSubmit={callDeleteFnction}>
          <h4>Do you want to delete this Business?</h4>
          <div>Enter password here to confirm</div>
          <br />
          <TextField
            type="password"
            fullWidth
            required
            onChange={(e) => setuserPassword(e.target.value)}
          />
          {Proccessing ? (
            <ButtonProcessing />
          ) : (
            <div style={{ padding: "10px", textAlign: "center" }}>
              <Button variant="contained" type="submit">
                Submit
              </Button>
              <Button
                onClick={() =>
                  setopenBusinessDeletingModal({
                    ...openBusinessDeletingModal,
                    Open: false,
                  })
                }
                sx={{ marginLeft: "10px" }}
                variant="contained"
                color="warning"
                type="submit"
              >
                Cancel
              </Button>
            </div>
          )}

          {deleteError && <div style={{ color: "red" }}>{deleteError}</div>}
        </form>
      </Box>
    </Modal>
  );
}

export default ModalToDeleteBusiness;

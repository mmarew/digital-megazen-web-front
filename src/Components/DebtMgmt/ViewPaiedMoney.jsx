import {
  Box,
  Button,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { DateFormatter } from "../Body/Date/currentDate";
import { Close, Message } from "@mui/icons-material";
import ErrorHandler from "../Utilities/ErrorHandler";
import axios from "axios";
import renderFilePreview from "../Utilities/filesViewer/fileViewer";
function ViewPaiedMoney({ data }) {
  const [successOrErrors, setSuccessOrErrors] = useState({
    Message: null,
    Detail: null,
  });
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  let businessId = localStorage.getItem("businessId");
  let handleClose = () => {
    setViewPaiedMoneyDetails((prevData) => ({
      ...prevData,
      openModal: false,
    }));
  };
  let { viewPaiedMoneyDetails, setViewPaiedMoneyDetails, setfetchDebtData } =
    data;
  let deletePaidMoneyData = async (e) => {
    e.preventDefault();

    try {
      setSuccessOrErrors({ Message: null, Detail: null });
      setProcessing(true);
      let responces = await axios.post(
        serverAddress + "debt/deletePaidMoneyData",
        {
          userPassword,
          token,
          businessName,
          businessId,
          ...confirmDelete.item,
        }
      );
      setProcessing(false);
      setConfirmDelete((prevData) => ({
        ...prevData,
        openModal: false,
      }));
      setfetchDebtData((prevdata) => !prevdata);
      handleClose();
    } catch (error) {
      setProcessing(false);
      ErrorHandler(error, setSuccessOrErrors);
    }
  };
  const [confirmDelete, setConfirmDelete] = useState({
    openModal: false,
    item: null,
  });
  const [userPassword, setuserPassword] = useState(null);
  const [Processing, setProcessing] = useState(false);
  return (
    <div>
      {confirmDelete.openModal ? (
        <Modal open={confirmDelete.openModal}>
          <Box className="modalBox">
            <IconButton
              onClick={() =>
                setConfirmDelete((prevData) => ({
                  ...prevData,
                  openModal: false,
                }))
              }
              sx={{ position: "absolute", right: 10, top: 10 }}
            >
              <Close />
            </IconButton>
            <br />

            <Typography>
              Are you sure to delete this payment? if so, please type your
              password
            </Typography>
            {successOrErrors.Message && (
              <Box sx={{ color: "red", padding: "20px 10px" }}>
                {successOrErrors.Detail}
              </Box>
            )}
            <br />
            <form
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
              onSubmit={deletePaidMoneyData}
            >
              <TextField
                value={userPassword}
                onChange={(e) => {
                  // reset errors
                  setSuccessOrErrors({ Message: null, Detail: null });
                  // set passwords
                  setuserPassword(e.target.value);
                }}
                type="password"
                required
                label="Password"
              />
              {Processing ? (
                <Button>Processing ...... </Button>
              ) : (
                <Button color="error" variant="contained" type="submit">
                  Confirm Delete
                </Button>
              )}
            </form>
          </Box>
        </Modal>
      ) : (
        <Modal open={viewPaiedMoneyDetails.openModal}>
          <Box className="modalBox modalBoxLarge">
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", right: 10, top: 10, color: "red" }}
            >
              <Close />
            </IconButton>
            <br />
            {viewPaiedMoneyDetails?.paidData?.length === 0 ? (
              <Typography
                variant="h5"
                sx={{ color: "red", padding: "20px 10px" }}
              >
                No data found
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={6}>
                        <h1>List of paid debts</h1>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Paid Amount</TableCell>
                      <TableCell>Paid By</TableCell>
                      <TableCell>Payment Type</TableCell>
                      <TableCell>Paid Date</TableCell>
                      <TableCell>Description</TableCell>{" "}
                      <TableCell>Attached files</TableCell>{" "}
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {viewPaiedMoneyDetails?.paidData?.map((item, index) => {
                      return (
                        <TableRow>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item?.paidAmount}</TableCell>
                          <TableCell>{item?.employeeName}</TableCell>
                          <TableCell>{item?.paymentType}</TableCell>
                          <TableCell>{DateFormatter(item?.paidDate)}</TableCell>
                          <TableCell>{item?.Descriptions}</TableCell>
                          <TableCell>
                            {item?.attachedDebtPaymbentFilesName
                              ? renderFilePreview(
                                  item?.attachedDebtPaymbentFilesName
                                )
                              : "No file attached"}
                          </TableCell>
                          <TableCell>
                            <Button
                              color="error"
                              onClick={() =>
                                setConfirmDelete({
                                  openModal: true,
                                  item: item,
                                })
                              }
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default ViewPaiedMoney;

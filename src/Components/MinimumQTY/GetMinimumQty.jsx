import axios from "axios";
import "./GetMinimumQty.css";
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  Checkbox,
} from "@mui/material";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
import { DateFormatter } from "../Body/Date/currentDate";
import ErrorHandler from "../Utilities/ErrorHandler";
import { Link } from "react-router-dom";

function GetMinimumQty({ setFetchedDataLength }) {
  const [viewInTable, setViewInTable] = useState(true);
  const [errorsVsSuccess, seterrorsVsSuccess] = useState({
    Message: "",
    Detail: "",
  });
  let businessId = localStorage.getItem("businessId");
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  const [MinimumQty, setMinimumQty] = useState({ progress: "wait", data: [] });

  let { setShowProgressBar, setProccessing } = ConsumeableContext();

  async function getQtyFromServer() {
    try {
      setShowProgressBar(true);
      seterrorsVsSuccess({ Message: "", Detail: "" });
      let response = await axios.post(serverAddress + "GetMinimumQty/", {
        token,
        businessName,
        businessId,
      });
      setShowProgressBar(false);
      let { data } = response.data;

      if (data === `you are not owner of this business`) {
        alert(data);
        data = [];
      }
      setFetchedDataLength(data.length);
      setMinimumQty({ ...MinimumQty, progress: "done", data });
    } catch (error) {
      setMinimumQty({ ...MinimumQty, progress: "done", data: [] });
      ErrorHandler(error, seterrorsVsSuccess);
      setShowProgressBar(false);
    }
  }

  useEffect(() => {
    getQtyFromServer();
  }, []);

  return (
    <div>
      {errorsVsSuccess?.Message ? (
        <h4 style={{ color: "red" }}>{errorsVsSuccess?.Detail}</h4>
      ) : (
        <>
          <br />
          <h5>Current Minimum Qty and Inventory</h5>
          {MinimumQty.progress === "wait" ? (
            <h4>Please wait...</h4>
          ) : MinimumQty?.data?.length > 0 ? (
            <>
              <Checkbox
                checked={viewInTable}
                onChange={() => setViewInTable(!viewInTable)}
              />{" "}
              View in table
              {viewInTable ? (
                <Box style={{ padding: "10px" }}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>No</TableCell>
                          <TableCell>
                            <strong>Product Name</strong>
                          </TableCell>
                          <TableCell>Last sold</TableCell>
                          <TableCell>
                            <strong>Inventory</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Minimum Qty</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Status</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {MinimumQty?.data?.map((item, index) => (
                          <TableRow key={"minimum_" + index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              {DateFormatter(item.registeredTimeDaily)}
                            </TableCell>
                            <TableCell>{item.inventoryItem}</TableCell>
                            <TableCell>{item.minimumQty}</TableCell>
                            <TableCell>
                              {item.inventoryItem > item.minimumQty ? (
                                <Chip
                                  style={{
                                    backgroundColor: "green",
                                    color: "white",
                                    fontWeight: 600,
                                  }}
                                  label="GOOD"
                                  color="success"
                                  variant="contained"
                                />
                              ) : (
                                <Chip
                                  label={
                                    // no transaction made or low
                                    item.inventoryItem == undefined
                                      ? "no transaction"
                                      : "TOO LOW "
                                  }
                                  style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <TableContainer align="center">
                  <Table sx={{ width: "100%" }}>
                    <TableBody
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {MinimumQty?.data?.map((item, index) => {
                        return (
                          <TableRow
                            sx={{
                              padding: "10px ",
                              margin: "4px 10px",
                              width: "280px",
                            }}
                            component={Paper}
                            key={"minimum_" + index}
                          >
                            <TableCell>
                              <div>
                                <strong>{index + 1}) Product Name:</strong>{" "}
                                {item.productName}
                              </div>
                              <div>
                                <strong>Inventory:</strong> {item.inventoryItem}
                              </div>
                              <div>
                                <strong>Minimum Qty:</strong> {item.minimumQty}
                              </div>
                              <div>
                                <strong>Status:</strong>{" "}
                                {item.inventoryItem > item.minimumQty ? (
                                  <Chip
                                    style={{
                                      backgroundColor: "green",
                                      color: "white",
                                      fontWeight: 600,
                                    }}
                                    label="GOOD"
                                    color="primary"
                                    variant="contained"
                                  />
                                ) : (
                                  <Chip
                                    label="TOO LOW"
                                    style={{
                                      backgroundColor: "red",
                                      color: "white",
                                      fontWeight: 600,
                                    }}
                                  />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          ) : (
            <div>
              <p>You haven't registered any transactions.</p>
              <p>
                To view minimum quantity, please register some transactions.{" "}
                <Link className="linkStyles" to="/OpenBusiness/transaction">
                  Click here
                </Link>{" "}
                to make registration.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default GetMinimumQty;

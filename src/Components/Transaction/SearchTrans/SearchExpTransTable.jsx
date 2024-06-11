import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import { DateFormatter } from "../../Body/Date/currentDate";

import ExportToExcel from "../../PDF_EXCEL/PDF_EXCEL";
import CurrencyFormatter from "../../Utilities/Utility";
import { Checkbox } from "@mui/material";
import ExpTransEdit from "../../Expences/ExpTransEdit";
import ExptransDelete from "../../Expences/ExptransDelete";
import SuccessOrError from "../../Body/Others/SuccessOrError";
import renderFilePreview from "../../Utilities/filesViewer/fileViewer";
import ActionsToEachExpences from "./ActionsToEachExpences";
function SearchExpTransTable({
  getExpencesTransaction,
  expencesData,
  modifyAmountOrDescription,
  ViewCostList,
  cancelEditingProcess,
  setconfirmAction,
  TotalCostAmount,
  setshowConfirmDialog,
}) {
  expencesData.map((data) => {
    data.costRegisteredDate = DateFormatter(data.costRegisteredDate);
  });
  let serverAddress = localStorage.getItem("targetUrl");

  const [ErrorVsSuccess, setErrorVsSuccess] = useState(null);
  const [showEachItems, setshowEachItems] = useState(true);
  const [viewInTable, setviewInTable] = useState(false);

  let openedBusiness = localStorage.getItem("openedBusiness");
  const [deviceSize, setdeviceSize] = useState(window.innerWidth);
  // window.addEventListener("resize", () => {
  //   setdeviceSize(window.innerWidth);
  // });
  const [EditExpences, setEditExpences] = useState({ item: "", Open: false });
  const [DeleteConfirmation, setDeleteConfirmation] = useState({
    item: {},
    Open: false,
  });
  const [ExpandView, setExpandView] = useState(true);
  return (
    <Box>
      {ErrorVsSuccess && (
        <SuccessOrError
          request={ErrorVsSuccess}
          setErrorVsSuccess={setErrorVsSuccess}
        />
      )}

      <div sx={{ padding: "20px" }}>
        {EditExpences && (
          <ExpTransEdit
            setErrorVsSuccess={setErrorVsSuccess}
            getExpencesTransaction={getExpencesTransaction}
            EditExpences={EditExpences}
            setEditExpences={setEditExpences}
          />
        )}
        {DeleteConfirmation.Open && (
          <ExptransDelete
            setErrorVsSuccess={setErrorVsSuccess}
            ErrorVsSuccess={ErrorVsSuccess}
            getExpencesTransaction={getExpencesTransaction}
            DeleteConfirmation={DeleteConfirmation}
            setDeleteConfirmation={setDeleteConfirmation}
          />
        )}
        {ViewCostList.length > 0 && (
          <ExportToExcel data={ViewCostList} target={"expencesTransactions"} />
        )}
        <div>
          {expencesData?.length > 0 ? (
            <>
              <Checkbox
                checked={deviceSize > 768 ? true : false}
                onChange={() => {
                  setviewInTable(!viewInTable);
                  setdeviceSize(deviceSize > 768 ? 700 : 800);
                }}
              />
              View In Table
              <Checkbox
                checked={showEachItems}
                onChange={() => {
                  setshowEachItems(!showEachItems);
                }}
              />
              Show Each Transactions
              {viewInTable ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {expencesData?.map((items, index) => {
                      return (
                        <Paper
                          sx={{
                            padding: "20px",
                            margin: "10px",
                            width: "300px",
                          }}
                          key={"expenceWrapper_" + index}
                          id={`expenceWrapper_${items.costId}`}
                        >
                          <div>
                            <strong>Cost Name : </strong>
                            <span id={`expName_${items.expenseId}`}>
                              {items.costName}
                            </span>
                          </div>
                          <div>
                            <strong>Date: </strong>
                            <span
                              onClick={() => {
                                setshowEachItems(!showEachItems);
                              }}
                              sx={{ maxWidth: "120px" }}
                              id={`costRegisteredDate_${items.expenseId}`}
                            >
                              <Chip
                                style={{
                                  maxWidth: "120px",
                                  color: "rgb(25,118,210)",
                                  backgroundColor: "rgb(248,248,248)",
                                }}
                                label={
                                  showEachItems
                                    ? DateFormatter(items.costRegisteredDate)
                                    : items.costRegisteredDate
                                }
                              />
                            </span>
                          </div>
                          <div>
                            <strong>Cost Amount: </strong>
                            <span
                              className={items.contentEditable && "editableTd"}
                              onInput={(e) =>
                                modifyAmountOrDescription(
                                  e,
                                  "updateExpences_" + items.expenseId
                                )
                              }
                              contentEditable={`${items.contentEditable}`}
                              id={`expAmount_${items.expenseId}`}
                            >
                              {CurrencyFormatter(items.costAmount)}
                            </span>
                          </div>
                          <div>
                            <strong> Description: </strong>
                            <span
                              className={items.contentEditable && "editableTd"}
                              onInput={(e) =>
                                modifyAmountOrDescription(
                                  e,
                                  "updateExpences_" + items.expenseId
                                )
                              }
                              contentEditable={`${items.contentEditable}`}
                              id={`expDescription_${items.expenseId}`}
                            >
                              {items.costDescription}
                            </span>
                          </div>
                          <div>
                            <strong>Attached Files: </strong>
                            {items?.attachedFilesName ? (
                              <a
                                download={true}
                                href={
                                  serverAddress +
                                  "uploads/" +
                                  items?.attachedFilesName
                                }
                              >
                                {renderFilePreview(items?.attachedFilesName)}
                                {/* <img
                                    style={{ width: "50px", height: "50px" }}
                                    src={
                                      serverAddress +
                                      "uploads/" +
                                      items?.attachedFilesName
                                    }
                                  /> */}
                              </a>
                            ) : (
                              "no file attached   "
                            )}
                          </div>
                          {openedBusiness == "myBusiness" && (
                            <div style={{ display: "flex" }}>
                              <strong style={{ padding: "10px 0" }}>
                                {" "}
                                Action :{" "}
                              </strong>
                              <ActionsToEachExpences
                                data={{
                                  items,
                                  setEditExpences,
                                  EditExpences,
                                  DeleteConfirmation,
                                  setDeleteConfirmation,
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <>
                              {items.contentEditable && (
                                <Button
                                  id={"updateExpences_" + items.expenseId}
                                  className="updateExpences"
                                  onClick={() => {
                                    // setconfirmAction("updateExpencesList");
                                    // setconfirmMessages(
                                    //   "Are you sure to update this expences record?"
                                    // );

                                    setshowConfirmDialog(true);
                                  }}
                                >
                                  Update
                                </Button>
                              )}
                            </>
                          </div>
                        </Paper>
                      );
                    })}
                  </div>
                  <Paper sx={{ padding: "20px", margin: "0 10px" }}>
                    <strong>Total Expenses: </strong>
                    <span>
                      {TotalCostAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "ETB",
                      })}
                    </span>
                  </Paper>
                </div>
              ) : (
                <TableContainer>
                  <Table className="costTransaction">
                    <TableHead>
                      <TableRow>
                        <TableCell>NO</TableCell>
                        <TableCell>Cost Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Cost Amount</TableCell>
                        <TableCell> Description</TableCell>
                        <TableCell> Attached Files</TableCell>
                        {openedBusiness == "myBusiness" && (
                          <TableCell> Action </TableCell>
                        )}
                        <TableCell> Decision</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expencesData?.map((items, index) => {
                        return (
                          <TableRow
                            key={"expenceWrapper_" + index}
                            id={`expenceWrapper_${items.costId}`}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell id={`expName_${items.expenseId}`}>
                              {items.costName}
                            </TableCell>
                            <TableCell
                              onClick={() => {
                                setshowEachItems(!showEachItems);
                              }}
                              sx={{ maxWidth: "120px" }}
                              id={`costRegisteredDate_${items.expenseId}`}
                            >
                              <Chip
                                style={{
                                  color: "rgb(25,118,210)",
                                  backgroundColor: "rgb(248,248,248)",
                                }}
                                label={
                                  showEachItems
                                    ? items.costRegisteredDate
                                    : items.costRegisteredDate
                                }
                              />
                            </TableCell>
                            <TableCell
                              className={items.contentEditable && "editableTd"}
                              onInput={(e) =>
                                modifyAmountOrDescription(
                                  e,
                                  "updateExpences_" + items.expenseId
                                )
                              }
                              contentEditable={`${items.contentEditable}`}
                              id={`expAmount_${items.expenseId}`}
                            >
                              {CurrencyFormatter(items.costAmount)}
                            </TableCell>
                            <TableCell
                              className={items.contentEditable && "editableTd"}
                              onInput={(e) =>
                                modifyAmountOrDescription(
                                  e,
                                  "updateExpences_" + items.expenseId
                                )
                              }
                              contentEditable={`${items.contentEditable}`}
                              id={`expDescription_${items.expenseId}`}
                            >
                              {items.costDescription}
                            </TableCell>
                            <TableCell>
                              {" "}
                              {items?.attachedFilesName ? (
                                <a
                                  download={true}
                                  href={
                                    serverAddress +
                                    "uploads/" +
                                    items?.attachedFilesName
                                  }
                                >
                                  {renderFilePreview(items?.attachedFilesName)}
                                </a>
                              ) : (
                                "no file attached"
                              )}
                            </TableCell>
                            <TableCell>
                              {showEachItems ? (
                                <>
                                  {items.contentEditable && (
                                    <>
                                      <Button
                                        className="cancelExpeEditing1"
                                        id={`editExpences_` + items.expenseId}
                                        onClick={(e) => {
                                          cancelEditingProcess(e, index);
                                        }}
                                      >
                                        CANCEL
                                      </Button>
                                    </>
                                  )}

                                  {openedBusiness == "myBusiness" ? (
                                    <>
                                      {!items.contentEditable && (
                                        <>
                                          <ActionsToEachExpences
                                            data={{
                                              items,
                                              setEditExpences,
                                              EditExpences,
                                              DeleteConfirmation,
                                              setDeleteConfirmation,
                                            }}
                                          />
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                            </TableCell>
                            <TableCell>
                              <>
                                {items.contentEditable && (
                                  <Button
                                    id={"updateExpences_" + items.expenseId}
                                    className="updateExpences"
                                    onClick={() => {
                                      setconfirmAction("updateExpencesList");
                                      setshowConfirmDialog(true);
                                    }}
                                  >
                                    Update
                                  </Button>
                                )}
                              </>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    <TableRow>
                      <TableCell colSpan={5}>Total Expenses</TableCell>
                      <TableCell>
                        {CurrencyFormatter(TotalCostAmount)}
                      </TableCell>
                    </TableRow>
                  </Table>
                </TableContainer>
              )}
            </>
          ) : (
            // {Procs}
            <Chip
              style={{
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                color: "red",
                margin: "10px",
              }}
              label={<h3>On this date no expences transaction</h3>}
            />
          )}
        </div>
      </div>
    </Box>
  );
}

export default SearchExpTransTable;

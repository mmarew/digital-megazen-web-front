import {
  Box,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import currentDates, { DateFormatter } from "../../Body/Date/currentDate";
import CurrencyFormatter, { ButtonProcessing } from "../../Utilities/Utility";
import { ConsumeableContext } from "../../Body/UserContext/UserContext";
import { Checkbox, Paper } from "@mui/material";
import ExportToExcel from "../../PDF_EXCEL/PDF_EXCEL";

import { ExpandMore, ExpandLess, MoreVert } from "@mui/icons-material";
import SuccessOrError from "../../Body/Others/SuccessOrError";
import ModalTodeleteEachTransaction from "./ModalTodeleteEachTransaction";
import ModalToEditEachTransaction from "./ModalToEditEachTransaction";
import HRTAG from "../../Utilities/HRTAG";
import renderFilePreview from "../../Utilities/filesViewer/fileViewer";
import ActionsToEachItems from "./ActionsToEachBuySales";
import tableNavCSS from "../../../CSS/Tablenav.module.css";
import TablesExpandOrLess from "../../Utilities/TablesExpandOrLess";
function GetEachTransaction() {
  let { singleSalesInputValues } = ConsumeableContext();
  let employeeRole = JSON.parse(localStorage.getItem("employeeRole"));
  let { ProductId, searchInput, currentDay, fromDate, toDate, searchTarget } =
    singleSalesInputValues;
  // return;
  let token = localStorage.getItem("storeToken");
  let openedBusiness = localStorage.getItem("openedBusiness");
  // use state starts here
  const [ErrorsOrSuccess, setErrorsOrSuccess] = useState("");
  const [EditSingleItem, setEditSingleItem] = useState({
    open: false,
    Items: {},
  });
  const [ShowDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState({
      open: false,
      Items: {},
    });
  let businessId = localStorage.getItem("businessId");
  let businessName = localStorage.getItem("businessName");
  let serverAddress = localStorage.getItem("targetUrl");
  const { Processing, setProcessing } = ConsumeableContext();

  let Today = currentDates();
  const [DailyTransaction, setDailyTransaction] = useState([]);
  const [mergedDataArray, setmergedDataArray] = useState([]);
  /**getDailyTransaction start here */
  let getDailyTransaction = async (targetproductId) => {
    try {
      // searchInput, currentDay;
      let OB = {
        currentDates: currentDay ? currentDay : Today,
        businessId,
        productId: targetproductId,
        businessName,
        token,
        searchInput,
        fromDate,
        toDate,
        searchTarget,
      };
      setProcessing(true);
      setErrorsOrSuccess();
      setTransactionData((prev) => ({ TotalSales: 0, TotalPurchase: 0 }));
      let responce = await axios.post(
        serverAddress + "Transaction/getDailyTransaction/",
        {
          ...OB,
        }
      );
      setProcessing(false);
      let mydata = responce.data.data;
      if (mydata == "Error") {
        setErrorsOrSuccess(responce.data.Error);
        return;
      }
      const data = [...mydata];
      // sort by registration date
      data.sort((a, b) => {
        return (
          new Date(a.registeredTimeDaily) - new Date(b.registeredTimeDaily)
        );
      });
      const mergedData = {};
      data.forEach((current) => {
        const { unitPrice, productRegistrationDate } = current;
        const key = `${unitPrice}-${productRegistrationDate}`;

        if (!mergedData[key]) {
          mergedData[key] = { ...current };
        } else {
          mergedData[key].purchaseQty += current?.purchaseQty || 0;
          mergedData[key].salesQty += current?.salesQty || 0;
          mergedData[key].creditsalesQty += current?.creditsalesQty || 0;
          mergedData[key].brokenQty += current?.brokenQty || 0;
        }
      });

      setmergedDataArray(Object.values(mergedData));

      if (mydata.length == 0) {
        return setErrorsOrSuccess("There is no registered data on this date.");
      }
      let i = 0;
      let Description = "",
        productName = "",
        brokenQty = 0,
        productsIdList = [],
        ProductId = "",
        purchaseQty = 0,
        creditSalesQty = 0,
        salesQty = 0,
        registrationDate = "",
        prevProductId = 0,
        dailySales = {},
        productDetail = [],
        creditDueDate = "",
        creditPaymentDate = "",
        salesTypeValues = "",
        mydataLength = mydata.length,
        registrationSource = "Single";
      // collect same products to add qty
      for (; i < mydataLength; i++) {
        ProductId = mydata[i].ProductId;
        creditDueDate = dailySales[`creditDueDate` + ProductId];
        salesTypeValues = dailySales[`salesTypeValues` + ProductId];
        creditSalesQty = Number(dailySales["creditSalesQty" + ProductId]);
        salesQty = Number(dailySales["salesQuantity" + ProductId]);
        purchaseQty = Number(dailySales["purchaseQty" + ProductId]);
        brokenQty = Number(dailySales["wrickageQty" + ProductId]);
        Description = dailySales["Description" + ProductId];
        creditPaymentDate = dailySales["Description" + creditPaymentDate];
        // return
        if (
          !creditPaymentDate ||
          creditPaymentDate == undefined ||
          creditPaymentDate == "null"
        )
          creditPaymentDate = "";
        if (!creditDueDate) creditDueDate = "";
        if (salesTypeValues == undefined) salesTypeValues = "";
        if (isNaN(creditSalesQty)) creditSalesQty = 0;
        if (isNaN(salesQty)) salesQty = 0;
        if (isNaN(purchaseQty)) purchaseQty = 0;
        if (isNaN(brokenQty)) brokenQty = 0;
        if (isNaN(salesQty)) salesQty = 0;
        if (Description == undefined) Description = "";

        // return;
        ////////////////////////////
        creditPaymentDate += mydata[i].creditPaymentDate;
        salesTypeValues += mydata[i].salesTypeValues + ", ";
        creditSalesQty += mydata[i].creditsalesQty;
        productName = mydata[i].productName;
        Description += mydata[i].Description + " ";
        brokenQty += mydata[i].brokenQty;
        purchaseQty += mydata[i].purchaseQty;
        registrationDate = mydata[i].registrationDate;
        salesQty += mydata[i].salesQty;

        dailySales["registrationSource" + ProductId] = registrationSource;
        dailySales["creditPaymentDate" + ProductId] = creditPaymentDate;
        dailySales[`creditDueDate` + ProductId] = creditDueDate;
        dailySales[`salesTypeValues` + ProductId] = salesTypeValues;
        dailySales["creditSalesQty" + ProductId] = creditSalesQty;
        dailySales["salesQuantity" + ProductId] = salesQty;
        dailySales["purchaseQty" + ProductId] = purchaseQty;
        dailySales["wrickageQty" + ProductId] = brokenQty;
        dailySales["Description" + ProductId] = Description;

        // collect products id only
        if (prevProductId != ProductId) {
          productsIdList.push({
            ProductId,
          });
        }
        // to get last collection
        productDetail[0] = {
          productName: productName,
          PurchaseQty: purchaseQty,
          SalesQty: salesQty,
          BrokenQty: brokenQty,
        };
        prevProductId = ProductId;
      }
      setDailyTransaction(mydata);
    } catch (error) {
      setProcessing(false);
      setErrorsOrSuccess(error.message);
    }
  };

  useEffect(() => {
    setDailyTransaction([]);
    getDailyTransaction(ProductId);
  }, [ProductId]);
  const [viewInTable, setViewInTable] = useState(true);
  // window.addEventListener("resize", () => {
  //   setdeviceSize(window.innerWidth);
  // });
  let {
    TransactionData,
    setTransactionData,
    netCahFlowValue,
    setNetCahFlowValue,
  } = ConsumeableContext();
  useEffect(() => {
    let salesMoney = 0,
      purchaseMoney = 0;
    DailyTransaction.map((items) => {
      let revenue =
        (Number(items.salesQty) + Number(items.creditsalesQty)) *
        Number(items.unitPrice);

      salesMoney = salesMoney + revenue;
      purchaseMoney += Number(items.purchaseQty) * Number(items.unitCost);
      // setTransactionData((prev) => {
      //   return {
      //     ...prev,
      //     TotalSales:
      //       Number(prev.TotalSales) +
      //       Number(items.salesQty + items.creditsalesQty) *
      //         Number(items.unitPrice),
      //     TotalPurchase:
      //       Number(prev.TotalPurchase) +
      //       Number(items.purchaseQty) * Number(items.unitCost),
      //   };
      // });
      setTransactionData(() => ({}));
    });
    setNetCahFlowValue((prev) => ({
      ...prev,
      totalSalesRevenue: salesMoney,
      totalCost: purchaseMoney,
    }));
  }, [DailyTransaction]);
  const [viewEachTransactions, setviewEachTransactions] = useState(true);

  const [viewableData, setviewableData] = useState([]);
  useEffect(() => {
    setviewableData(viewEachTransactions ? DailyTransaction : mergedDataArray);
  }, [viewEachTransactions, DailyTransaction, mergedDataArray]);
  const [ExpandView, setExpandView] = useState(false);
  return (
    <div>
      {Processing ? (
        <LinearProgress />
      ) : DailyTransaction.length > 0 ? (
        <div>
          <TablesExpandOrLess
            data={{
              minimizeTable: ExpandView,
              setminimizeTable: setExpandView,
              Title: " Sales & Purchase Transaction Table",
            }}
          />

          {!ExpandView && (
            <div>
              {ErrorsOrSuccess && (
                <SuccessOrError
                  request={ErrorsOrSuccess}
                  setErrorsOrSuccess={setErrorsOrSuccess}
                />
              )}
              <div>
                <br />
                {(openedBusiness == "myBusiness" ||
                  employeeRole?.includes("Sales")) && (
                  <div>
                    {/*  totalSalesRevenue: salesMoney,
      totalCost: */}
                    Total Sales :-{" "}
                    {CurrencyFormatter(netCahFlowValue.totalSalesRevenue)}
                  </div>
                )}

                {(openedBusiness == "myBusiness" ||
                  employeeRole?.includes("Purchasing")) && (
                  <div>
                    Total Cost:- {CurrencyFormatter(netCahFlowValue.totalCost)}
                  </div>
                )}

                <div>
                  <Checkbox
                    checked={viewInTable}
                    onChange={() => {
                      setViewInTable(!viewInTable);
                    }}
                  />{" "}
                  View in table
                  <Checkbox
                    onChange={() =>
                      setviewEachTransactions(!viewEachTransactions)
                    }
                    checked={viewEachTransactions}
                  />{" "}
                  View Each Transaction
                  {!viewInTable ? (
                    <Grid container spacing={2}>
                      {viewableData?.map((items, index) => {
                        return (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={"minimum_" + index}
                          >
                            <Paper
                              sx={{
                                padding: "40px 8%",
                                // maxWidth: "280px",
                              }}
                            >
                              <div>
                                <strong className="MuiTableCell-root">
                                  Product Name:{" "}
                                </strong>
                                {items.itemDetailInfo
                                  ? JSON.parse(items.itemDetailInfo).productName
                                  : ""}
                              </div>
                              <div>
                                <strong>Registration Date: </strong>
                                {DateFormatter(items.registeredTimeDaily)}
                              </div>
                              <div>
                                <strong>Registered By:- </strong>
                                {items.employeeName}
                              </div>
                              {(openedBusiness == "myBusiness" ||
                                employeeRole?.includes("Purchasing")) && (
                                <>
                                  <div>
                                    <strong>Purchase QTY: </strong>
                                    {items.purchaseQty}
                                  </div>
                                  <div>
                                    <strong>Purchase Payment Type:- </strong>
                                    {items.purchaseQty > 0 ? (
                                      <>
                                        <span>
                                          {items.purchasePaymentType}{" "}
                                        </span>
                                        <span>
                                          On Date{" "}
                                          {DateFormatter(items.debtDueDate)}
                                        </span>
                                      </>
                                    ) : (
                                      "No Purchase"
                                    )}
                                  </div>

                                  {/* //////////////// */}
                                  <div>
                                    <strong>Unit Cost:- </strong>
                                    <span>
                                      {CurrencyFormatter(items.unitCost)}
                                    </span>
                                  </div>

                                  <div>
                                    <strong>Total Cost:- </strong>
                                    <span>
                                      {CurrencyFormatter(
                                        items.purchaseQty * items.unitCost
                                      )}
                                    </span>
                                  </div>
                                </>
                              )}
                              {(openedBusiness == "myBusiness" ||
                                employeeRole?.includes("Sales")) && (
                                <>
                                  <div>
                                    <strong>Sales QTY: </strong>
                                    {items.salesQty ? items.salesQty : 0}
                                  </div>
                                  <div>
                                    <strong>Sales QTY Credit: </strong>
                                    {items.creditsalesQty
                                      ? items.creditsalesQty
                                      : 0}
                                  </div>
                                </>
                              )}
                              <div
                                style={{
                                  color: "white",
                                  backgroundColor: "green",
                                }}
                              >
                                <strong>Inventory: </strong>
                                {items.inventoryItem}
                              </div>
                              {(openedBusiness == "myBusiness" ||
                                employeeRole?.includes("Sales")) && (
                                <>
                                  <div>
                                    <strong>Unit Price: </strong>
                                    {CurrencyFormatter(items.unitPrice)}
                                  </div>
                                  <div>
                                    <strong>Total Price: </strong>
                                    {CurrencyFormatter(
                                      items.unitPrice *
                                        (Number(items.creditsalesQty) +
                                          Number(items.salesQty))
                                    )}
                                  </div>
                                </>
                              )}
                              <div>
                                <strong>Payment Date: </strong>
                                {DateFormatter(items.creditPaymentDate)}
                              </div>
                              <div>
                                <strong>Sales Type : </strong>
                                {items.salesTypeValues}
                              </div>
                              {/* {(creditPaymentDate, creditsalesQty,)} */}
                              <div>
                                <strong>Broken QTY: </strong>
                                {items.brokenQty}
                              </div>
                              <div>
                                <strong>Description: </strong>{" "}
                                {items.Description}
                              </div>
                              <div>
                                <strong>files: </strong>{" "}
                                {items.attachedFilesName ? (
                                  <a
                                    href={
                                      serverAddress +
                                      "uploads/" +
                                      items.attachedFilesName
                                    }
                                    // download={true}
                                  >
                                    {" "}
                                    {renderFilePreview(
                                      items?.attachedFilesName
                                    )}
                                  </a>
                                ) : (
                                  "No file attached"
                                )}
                              </div>
                              <div>
                                <strong>Actions: </strong>
                                {openedBusiness !== "employersBusiness"
                                  ? viewEachTransactions && (
                                      <>
                                        <IconButton
                                          onClick={() => {
                                            setShowDeleteConfirmationModal({
                                              open: true,
                                              Items: items,
                                            });
                                          }}
                                          aria-label="delete"
                                        >
                                          <DeleteIcon color="error" />
                                        </IconButton>
                                        <IconButton
                                          onClick={() => {
                                            setEditSingleItem(
                                              (previousState) => {
                                                return {
                                                  ...previousState,
                                                  open: true,
                                                  Items: items,
                                                };
                                              }
                                            );
                                          }}
                                        >
                                          <EditIcon color="info" />
                                        </IconButton>
                                      </>
                                    )
                                  : ""}
                              </div>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead className="tableHeader">
                          <TableRow>
                            <TableCell>NO</TableCell>
                            <TableCell className="thTitle">
                              Product Name
                            </TableCell>
                            <TableCell className="thTitle">
                              Transaction Date
                            </TableCell>
                            <TableCell className="thTitle">
                              Registered by
                            </TableCell>
                            {(openedBusiness == "myBusiness" ||
                              employeeRole?.includes("Purchasing")) && (
                              <>
                                <TableCell className="thTitle">
                                  Purchase Qty{" "}
                                </TableCell>
                                <TableCell>Purchase Payment Type</TableCell>
                                <TableCell>Debt payment Date</TableCell>
                                <TableCell className="thTitle">
                                  Unit Cost{" "}
                                </TableCell>

                                <TableCell className="thTitle">
                                  Total Cost{" "}
                                </TableCell>
                              </>
                            )}
                            {(openedBusiness == "myBusiness" ||
                              employeeRole?.includes("Sales")) && (
                              <>
                                <TableCell className="thTitle">
                                  Sales Qty
                                </TableCell>
                                <TableCell className="thTitle">
                                  Sales Qty Credit
                                </TableCell>
                                <TableCell className="thTitle">
                                  {" "}
                                  Sales Type
                                </TableCell>
                                <TableCell className="thTitle">
                                  unit Price
                                </TableCell>
                                <TableCell className="thTitle">
                                  Sales in cash
                                </TableCell>

                                <TableCell className="thTitle">
                                  Credit Payment Date
                                </TableCell>
                              </>
                            )}
                            <TableCell className="thTitle">
                              {" "}
                              Inventory
                            </TableCell>
                            <TableCell className="thTitle">
                              Broken Qty
                            </TableCell>
                            <TableCell className="thTitle">
                              Description
                            </TableCell>
                            <TableCell>files</TableCell>
                            {viewEachTransactions &&
                              openedBusiness !== "employersBusiness" && (
                                <TableCell className="thTitle">
                                  {" "}
                                  Update / Delete{" "}
                                </TableCell>
                              )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {viewableData?.map((items, index) => {
                            return (
                              <TableRow key={"detailes_" + index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  {items.itemDetailInfo
                                    ? JSON.parse(items.itemDetailInfo)
                                        .productName
                                    : ""}
                                </TableCell>
                                <TableCell>
                                  {DateFormatter(items.registeredTimeDaily)}
                                </TableCell>
                                <TableCell>{items.employeeName}</TableCell>
                                {(openedBusiness == "myBusiness" ||
                                  employeeRole?.includes("Purchasing")) && (
                                  <>
                                    <TableCell>{items.purchaseQty}</TableCell>
                                    <TableCell>
                                      {items.purchasePaymentType}
                                    </TableCell>
                                    <TableCell>
                                      {DateFormatter(items.debtDueDate)}
                                    </TableCell>
                                    <TableCell>
                                      {CurrencyFormatter(items.unitCost)}
                                    </TableCell>
                                    <TableCell>
                                      {CurrencyFormatter(
                                        items.purchaseQty * items.unitCost
                                      )}
                                    </TableCell>{" "}
                                  </>
                                )}
                                {(openedBusiness == "myBusiness" ||
                                  employeeRole?.includes("Sales")) && (
                                  <>
                                    <TableCell>{items.salesQty}</TableCell>
                                    <TableCell>
                                      {items.creditsalesQty}
                                    </TableCell>
                                    <TableCell>
                                      {Number(items.creditsalesQty) > 0 ||
                                      Number(items.salesQty) > 0
                                        ? items.salesTypeValues
                                        : "No sales"}
                                    </TableCell>
                                    <TableCell>
                                      {CurrencyFormatter(items.unitPrice)}
                                    </TableCell>
                                    <TableCell>
                                      {CurrencyFormatter(
                                        (items.salesQty +
                                          items.creditsalesQty) *
                                          items.unitPrice
                                      )}
                                    </TableCell>

                                    <TableCell>
                                      {DateFormatter(items.creditPaymentDate)}
                                    </TableCell>
                                  </>
                                )}{" "}
                                <TableCell>{items.inventoryItem}</TableCell>
                                {/* {(creditPaymentDate, creditsalesQty,)} */}
                                <TableCell> {items.brokenQty} </TableCell>
                                <TableCell> {items.Description}</TableCell>
                                <TableCell>
                                  {items?.attachedFilesName ? (
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        textDecoration: "none",
                                        height: "50px",
                                        width: "50px",
                                      }}
                                      href={
                                        serverAddress +
                                        "uploads/" +
                                        items?.attachedFilesName
                                      }
                                      download
                                    >
                                      {renderFilePreview(
                                        items?.attachedFilesName
                                      )}
                                    </a>
                                  ) : (
                                    "No files attached"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {openedBusiness !== "employersBusiness"
                                    ? viewEachTransactions && (
                                        <>
                                          <ActionsToEachItems
                                            data={{
                                              items,
                                              setShowDeleteConfirmationModal,
                                              setEditSingleItem,
                                              EditSingleItem,
                                              ShowDeleteConfirmationModal,
                                            }}
                                          />
                                          {/* <MoreVert /> */}
                                        </>
                                      )
                                    : ""}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow>
                            <TableCell colSpan={6}></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {!Processing ? (
                      <div style={{ width: "600px", margin: "auto" }}>
                        <ExportToExcel
                          data={DailyTransaction}
                          target="dailySales"
                        />
                      </div>
                    ) : (
                      <>
                        <ButtonProcessing />
                        <LinearProgress />
                      </>
                    )}
                  </Box>
                </div>

                {/*ModalToEditEachTransaction  */}
                {EditSingleItem.open && (
                  <ModalToEditEachTransaction
                    Data={{
                      EditSingleItem,
                      setEditSingleItem,
                      setErrorsOrSuccess,
                      getDailyTransaction: getDailyTransaction,
                    }}
                  />
                )}
                {/* modal to delete items */}
                {ShowDeleteConfirmationModal.open && (
                  <ModalTodeleteEachTransaction
                    getDailyTransaction={getDailyTransaction}
                    setShowDeleteConfirmationModal={
                      setShowDeleteConfirmationModal
                    }
                    ShowDeleteConfirmationModal={ShowDeleteConfirmationModal}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Chip
          sx={{ margin: "10px 0" }}
          color="error"
          label="No Sales or Buys Transaction Data Found "
        />
      )}
    </div>
  );
}

export default GetEachTransaction;
// dani biruk ,saron asech, bek seif

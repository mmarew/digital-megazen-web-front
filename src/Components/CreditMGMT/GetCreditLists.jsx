import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
  TextField,
  Box,
  TableContainer,
  Paper,
  Checkbox,
} from "@mui/material";
import { IconButton, Typography } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

import "./GetCreditLists.css";
import { DateFormatter } from "../Body/Date/currentDate";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
import CurrencyFormatter, { ButtonProcessing } from "../Utilities/Utility";
import GetCreditListEdit from "./GetCreditListEdit";
import ExportToExcel from "../PDF_EXCEL/PDF_EXCEL";
import SuccessOrError from "../Body/Others/SuccessOrError";
import HRTAG from "../Utilities/HRTAG";
import tableNavCSS from "../../CSS/Tablenav.module.css";
export let getCollectedMoney = (data, salesRegistrationWay, infos) => {
  if (data == undefined || data == null) return 0;
  let { transactionId, dailySalesId } = data;
  if (salesRegistrationWay == "Single") {
    transactionId = dailySalesId;
  }
  let Money = 0;
  infos.map((info) => {
    if (info.transactionId == transactionId) {
      let { collectionAmount } = info;
      Money += Number(collectionAmount);
    }
  });

  return Money;
};
function GetCreditLists({
  dateRange,
  Notifications,
  randval,
  setFetchedDataLength,
  details,
  creditSearchTarget,
}) {
  let searchTarget = details?.searchTarget,
    ProductId = details?.ProductId;
  const [SuccessOrErrorsOnCredit, setSuccessOrErrorsOnCredit] = useState(null);
  const [Processing, setProcessing] = useState(false);
  let {
    netCahFlowValue,
    setNetCahFlowValue,
    setCollectedMoney,
    validFileTypes,
    acceptableFileExtensions,
    setShowProgressBar,
  } = ConsumeableContext();
  let { accountRecivable, collectedCashFromAR } = netCahFlowValue;
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  let businessId = localStorage.getItem("businessId");

  const [creditData, setCreditData] = useState({
    soldOnTotal_Oncredit: [],
    soldInDaily_SoldOncredits: [],
    soldInDaily_CreditPaied_maynotInTime: [],
    soldInDaily_CreditPaied: [],
    partiallyPaidInTotal: [],
  });

  let getUsersCreditList = async () => {
    setShowProgressBar(true);
    setProcessing(true);

    try {
      let Responces = await axios.get(
        serverAddress +
          "Credit/getUsersCreditList?token=" +
          token +
          "&businessName=" +
          businessName +
          "&businessId=" +
          businessId +
          "&fromDate=" +
          dateRange.fromDate +
          "&toDate=" +
          dateRange.toDate +
          "&searchTarget=" +
          searchTarget +
          "&ProductId=" +
          ProductId +
          "&creditSearchTarget=" +
          creditSearchTarget
      );

      setProcessing(false);

      let {
        partiallyPaidInTotal,
        partiallyPaidInDailyNotInRegisteredDate,
        soldInDaily_CreditPaied_maynotInTime,
        soldOnTotal_Oncredit,
        soldInDaily_SoldOncredits,
        soldInDaily_CreditPaied,
      } = Responces.data;

      if (typeof setFetchedDataLength === "function") {
        setFetchedDataLength(soldInDaily_SoldOncredits?.length);
      }
      setCreditData({
        soldInDaily_CreditPaied_maynotInTime,
        soldOnTotal_Oncredit,
        soldInDaily_SoldOncredits,
        soldInDaily_CreditPaied,
        partiallyPaidInDailyNotInRegisteredDate,
        partiallyPaidInTotal,
      });

      setShowProgressBar(false);
    } catch (error) {
      setShowProgressBar(false);
      setProcessing(false);
      setSuccessOrErrorsOnCredit(error.message);
    }
  };
  useEffect(() => {
    getUsersCreditList();
  }, [, randval]);
  const [Collection, setCollection] = useState({
    creditPaymentDate: null,
    partialOrFull: "Partial",
  });
  let confirmPayments = async (data, salesWAy, e) => {
    try {
      e.preventDefault();
      let { collectedAmount, creditPaymentDate } = Collection;

      if (
        isNaN(collectedAmount) ||
        !collectedAmount ||
        Number(collectedAmount) == 0
      ) {
        alert("paid amount should be > 0 value");
        return;
      }

      setShowProgressBar(true);
      setProcessing(true);
      setSuccessOrErrorsOnCredit(null);
      let formData = new FormData();
      let textData = {
        data,
        salesWAy,
        businessName,
        token,
        businessId,
        ...Collection,
      };
      formData.set("textData", JSON.stringify(textData));
      formData.set("collectedCreditFile", selectedFile);
      const config = {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      };
      // i am here
      const Responces = await axios.put(
        serverAddress + "confirmPayments",
        formData,
        config
      );
      getUsersCreditList();
      let Message = Responces.data.data;
      setSuccessOrErrorsOnCredit(Message);
      setOpenConfirmationModal((prevstate) => {
        return { ...prevstate, Open: false };
      });
      setCollection({ creditPaymentDate: null, partialOrFull: "Partial" });
      // setOpenConfirmationModal({ Open: false });
      setProcessing(false);
      setShowProgressBar(false);
    } catch (error) {}
  };
  const [openConfirmationModal, setOpenConfirmationModal] = useState({
    Open: false,
  });

  useEffect(() => {
    let {
      partiallyPaidInTotal,
      soldInDaily_SoldOncredits,
      soldOnTotal_Oncredit,
    } = creditData;
    let accountRecivableTotalMoney = 0,
      totalCollectedAmount = 0;
    // sold on total sales way and on credit
    let calculateCollectedMoney = (collectedMoneyData) => {
      collectedMoneyData?.map((data) => {
        let { collectionAmount } = data;
        totalCollectedAmount += Number(collectionAmount);
      });
    };
    let calculateAccountRecivable = (datas) => {
      datas?.map((data) => {
        let { creditsalesQty, unitPrice } = data;
        accountRecivableTotalMoney +=
          Number(creditsalesQty) * Number(unitPrice);
      });
    };

    calculateAccountRecivable(soldOnTotal_Oncredit);
    calculateAccountRecivable(soldInDaily_SoldOncredits);

    // calculateCollectedMoney(partiallyPaidInDailyNotInRegisteredDate);
    calculateCollectedMoney(partiallyPaidInTotal);

    ////////////////////////////
    setNetCahFlowValue((prev) => ({
      ...prev,
      accountRecivable: accountRecivableTotalMoney,
    }));
    // setAccountRecivableAmt(accountRecivableTotalMoney);
    setNetCahFlowValue((prev) => ({
      ...prev,
      collectedCashFromAR: totalCollectedAmount,
    }));
    // if it not work
    setCollectedMoney({
      Money: totalCollectedAmount,
      Detail: partiallyPaidInTotal,
    });
    ////////////////////////////
  }, [creditData]);

  /////////////////////////////////////////////
  let handleCollectionInfo = (e) => {
    setCollection((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    let file = event.target.files[0];
    if (!validFileTypes.includes(file.type)) {
      alert("File type not supported");
      event.target.value = null;
      return;
    }
    setSelectedFile(file);
  };

  const [showCreditListDetails, setshowCreditListDetails] = useState({
    open: false,
    data: {},
    salesWay: "",
  });

  useEffect(() => {
    let setNumberOfNotifications = Notifications?.setNumberOfNotifications;
    if (
      typeof setNumberOfNotifications === "function" &&
      creditSearchTarget != "History"
    )
      setNumberOfNotifications((prev) => {
        return {
          ...prev,
          Credits: creditData.soldInDaily_SoldOncredits?.length,
        };
      });
  }, [creditData]);
  const [viewInTable, setviewInTable] = useState(
    window.innerWidth > 768 ? true : false
  );
  const [minimizeTable, setminimizeTable] = useState(false);
  return (
    <div>
      <main>
        <Box className={tableNavCSS.tableHead}>
          <div className={tableNavCSS.tableHeadTitle}>
            <span>Sales in credit</span>
            <Button
              onClick={() =>
                window.open(
                  "https://www.youtube.com/watch?v=7s9FFZZ78cg",
                  "_blank"
                )
              }
            >
              Need Help?
            </Button>
          </div>

          <IconButton
            className={tableNavCSS.iconButtonExpandOrMinimize}
            onClick={() => setminimizeTable(!minimizeTable)}
          >
            {minimizeTable ? (
              <ExpandMore className={tableNavCSS.expandMore} />
            ) : (
              <ExpandLess className={tableNavCSS.expandLess} />
            )}
          </IconButton>
        </Box>
        <HRTAG />
        {SuccessOrErrorsOnCredit && (
          <SuccessOrError
            toastingTime={5000}
            request={SuccessOrErrorsOnCredit}
            setErrors={setSuccessOrErrorsOnCredit}
          />
        )}
        {!minimizeTable && (
          <Paper sx={{ padding: "20px" }}>
            {creditData?.soldInDaily_SoldOncredits?.length > 0 && (
              <>
                <ExportToExcel data={creditData} target={"creditsales"} />
                <div style={{ display: "flex", alignItems: "center" }}>
                  {viewInTable}
                  <Checkbox
                    checked={viewInTable}
                    onChange={(e) => setviewInTable(e.target.checked)}
                  />
                  <span>View In Table</span>
                </div>
              </>
            )}
            {creditData.soldInDaily_SoldOncredits?.length > 0 ? (
              <Box>
                {!viewInTable ? (
                  <Box style={{ padding: "10px" }}>
                    <Box>
                      <Box style={{ display: "flex", flexWrap: "wrap" }}>
                        {creditData.soldInDaily_SoldOncredits?.map(
                          (data, index) => (
                            <Box
                              component={Paper}
                              key={"indexOfGetData" + index}
                              style={{
                                padding: "20px",
                                margin: "3px 6px",
                                width: "280px",
                              }}
                            >
                              <Box>
                                <div>
                                  <strong>Number: </strong>
                                  {index + 1}
                                </div>
                                <div>
                                  <strong>Name: </strong>
                                  {data.productName}
                                </div>
                                <div>
                                  <strong>Credit sales qty: </strong>
                                  {data.creditsalesQty}
                                </div>
                                <div>
                                  <strong>Unit Price: </strong>
                                  {CurrencyFormatter(data.unitPrice)}
                                </div>
                                <div>
                                  <strong>Money Credit: </strong>
                                  {CurrencyFormatter(
                                    data.creditsalesQty * data.unitPrice
                                  )}
                                </div>
                                <div>
                                  <strong>To Be collected: </strong>
                                  {CurrencyFormatter(
                                    Number(data.creditsalesQty) *
                                      Number(data.unitPrice) -
                                      getCollectedMoney(
                                        data,
                                        "Single",
                                        creditData.partiallyPaidInTotal
                                      )
                                  )}
                                </div>
                                <div>
                                  <strong>Description: </strong>
                                  {data.Description}
                                </div>
                                <div>
                                  <strong> Credit Payment Date: </strong>
                                  {DateFormatter(data.creditPaymentDate)}
                                </div>
                                <div>
                                  <strong> Registration Date: </strong>
                                  {DateFormatter(data.registeredTimeDaily)}
                                </div>

                                <strong>Collected Money </strong>
                                <Button
                                  onClick={() => {
                                    setshowCreditListDetails({
                                      transactionId: data.dailySalesId,
                                      open: true,
                                      data: creditData.partiallyPaidInTotal,
                                      salesWay: "singleSales",
                                    });
                                  }}
                                >
                                  {CurrencyFormatter(
                                    getCollectedMoney(
                                      data,
                                      "Single",
                                      creditData.partiallyPaidInTotal
                                    )
                                  )}
                                </Button>
                                <div>
                                  <Button
                                    variant="contained"
                                    onClick={() => {
                                      setOpenConfirmationModal({
                                        salesWAy: "singleSales",
                                        Open: true,
                                        data: data,
                                      });
                                    }}
                                  >
                                    Collect Money
                                  </Button>
                                </div>
                              </Box>
                            </Box>
                          )
                        )}
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Number</TableCell>
                            <TableCell>
                              Product&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name{" "}
                            </TableCell>
                            <TableCell>
                              Credit&nbsp;&nbsp;&nbsp;&nbsp;Sales
                            </TableCell>
                            <TableCell>Unit&nbsp;Price</TableCell>
                            <TableCell>Total&nbsp;Price</TableCell>
                            <TableCell>To Be collected </TableCell>
                            <TableCell>
                              Description&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </TableCell>
                            <TableCell>Collection&nbsp;Date</TableCell>
                            <TableCell>Sales&nbsp;&nbsp;Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Collected</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {creditData.soldInDaily_SoldOncredits?.map(
                            (data, index) => (
                              <TableRow key={"indexOfGetData" + index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{data.productName}</TableCell>
                                <TableCell>{data.creditsalesQty}</TableCell>
                                <TableCell>
                                  {CurrencyFormatter(data.unitPrice)}
                                </TableCell>
                                <TableCell>
                                  {CurrencyFormatter(
                                    data.creditsalesQty * data.unitPrice
                                  )}
                                </TableCell>
                                <TableCell>
                                  {CurrencyFormatter(
                                    Number(data.creditsalesQty) *
                                      Number(data.unitPrice) -
                                      getCollectedMoney(
                                        data,
                                        "Single",
                                        creditData.partiallyPaidInTotal
                                      )
                                  )}
                                </TableCell>
                                <TableCell>{data.Description}</TableCell>
                                <TableCell>
                                  {DateFormatter(data.creditPaymentDate)}
                                </TableCell>
                                <TableCell>
                                  {DateFormatter(data.registeredTimeDaily)}
                                </TableCell>
                                <TableCell>Pending</TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() => {
                                      setshowCreditListDetails({
                                        transactionId: data.dailySalesId,
                                        open: true,
                                        data: creditData.partiallyPaidInTotal,
                                        salesWay: "totalSales",
                                      });
                                    }}
                                  >
                                    {CurrencyFormatter(
                                      getCollectedMoney(
                                        data,
                                        "Single",
                                        creditData.partiallyPaidInTotal
                                      )
                                    )}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => {
                                      setOpenConfirmationModal({
                                        salesWAy: "singleSales",
                                        Open: true,
                                        data: data,
                                      });
                                    }}
                                  >
                                    Collect
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
                <Box className="Summary_Container">
                  <Typography style={{ marginRight: "70px" }} variant="h6">
                    Summary
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.2rem",
                      }}
                    >
                      Receivable: {CurrencyFormatter(accountRecivable)}
                    </div>

                    <div style={{}}>
                      Collected Money {CurrencyFormatter(collectedCashFromAR)}
                    </div>

                    <div style={{}} colSpan={4}>
                      To Be Collected:{" "}
                      {CurrencyFormatter(
                        accountRecivable - collectedCashFromAR
                      )}
                    </div>
                  </div>
                </Box>
              </Box>
            ) : (
              <>
                {Processing ? (
                  " Waiting ... "
                ) : (
                  <h4 style={{ color: "#333" }}> No credit data </h4>
                )}
              </>
            )}
            <Dialog
              open={openConfirmationModal.Open}
              // onClose={() => {
              //   setOpenConfirmationModal({ Open: false });
              // }}
            >
              <DialogTitle>Confirm Payment</DialogTitle>
              <DialogContent>
                <Box>
                  Remain Amount={" "}
                  {CurrencyFormatter(
                    Number(
                      openConfirmationModal.data?.creditsalesQty *
                        openConfirmationModal.data?.unitPrice
                    ) -
                      Number(
                        getCollectedMoney(
                          openConfirmationModal.data,
                          "Single",
                          creditData.partiallyPaidInTotal
                        )
                      )
                  )}
                </Box>
                <Box>When do you have recived your money?</Box>
              </DialogContent>
              <DialogActions>
                <form
                  style={{ width: "90%", margin: "auto" }}
                  onSubmit={(e) => {
                    confirmPayments(
                      openConfirmationModal.data,
                      openConfirmationModal.salesWAy,
                      e
                    );
                  }}
                >
                  <TextField
                    value={Collection.creditPaymentDate}
                    fullWidth
                    required
                    name="creditPaymentDate"
                    onChange={handleCollectionInfo}
                    type="date"
                  />

                  <TextField
                    sx={{ margin: "20px 0" }}
                    type="number"
                    name="collectedAmount"
                    onChange={handleCollectionInfo}
                    fullWidth
                    label="paied Amount"
                    value={Collection.collectedAmount}
                  />
                  <TextField
                    fullWidth
                    type="file"
                    name="collectedCreditFile"
                    onChange={handleFileChange}
                    accept={acceptableFileExtensions}
                  />
                  <Box sx={{ margin: "10px auto", textAlign: "center" }}>
                    {!Processing ? (
                      <Button type="submit" variant="contained" color="primary">
                        Confirm
                      </Button>
                    ) : (
                      <ButtonProcessing />
                    )}
                    <Button
                      sx={{ marginLeft: "20px" }}
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        setOpenConfirmationModal({ Open: false });
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              </DialogActions>
            </Dialog>
            {showCreditListDetails.open && (
              <GetCreditListEdit
                getUsersCreditList={getUsersCreditList}
                showCreditListDetails={showCreditListDetails}
                setshowCreditListDetails={setshowCreditListDetails}
              />
            )}
          </Paper>
        )}
      </main>
    </div>
  );
}

export default GetCreditLists;

import React, { createContext, useContext, useState } from "react";
import currentDates from "../Date/currentDate";
let InitialContext = createContext();
function UserContext(props) {
  const [ShowProgressBar, setShowProgressBar] = useState(true);
  // This is data where sold by credit and money is not collected so we need it to deduct from sold in cash

  const [Processing, setProcessing] = useState(false);
  const [accountRecivableAmt, setAccountRecivableAmt] = useState(0);
  // This is data where sold by credit and collected in our selection time range  so we need it to add in net cash-flow
  const [collectedMoney, setCollectedMoney] = useState({
    Money: 0,
    Detail: [],
  });
  // This is data where sold by credit and money is collected but collected time may or may not in selected time range so we need it to deduct from sold in cash
  const [unTimeRecivableCollected, setunTimeRecivableCollected] = useState(0);
  const [singleSalesInputValues, setSinlgeSalesInputValues] = useState({
    toDate: currentDates(),
    fromDate: currentDates(),
    ProductId: "getLast10records",
    // it consideres target of search
    searchTarget: "getLast10records",
    expencesId: null,
    searchTransactions: false,
    showCreditRecords: false,
    showSearchForm: false,
    showBuyAndSales: true,
    showExpencesRecods: true,
    fetchDeposits: true,
  });
  // singleSalesInputValues, setSinlgeSalesInputValues
  // it contain initial value of net cash flow
  let netCashFlowInitial = {
    totalSalesRevenue: 0,
    totalCost: 0,
    totalExpences: 0,
    accountRecivable: 0,
    collectedCashFromAR: 0,
    depositToBak: 0,
  };
  // it contain real value of net cash flow
  const [netCahFlowValue, setNetCahFlowValue] = useState({
    ...netCashFlowInitial,
  });
  const [ownersName, setownersName] = useState("");
  const [TransactionData, setTransactionData] = useState({
    TotalSales: 0,
    TotalPurchase: 0,
    TotalExpences: 0,
  });
  const [deviceSize, setdeviceSize] = useState(window.innerWidth);
  const [viewInTable, setViewInTable] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [Products, setProducts] = useState([]);
  const [allExpencesList, setAllExpencesList] = useState([]);
  // Products, setProducts,allExpencesList, setAllExpencesList
  // window.addEventListener("resize", () => {
  //   setdeviceSize(window.innerWidth);
  // });
  const [RegisterableItems, steRegisterableItems] = useState({
    items: {},
    Open: true,
    registerationType: transactionType,
  });
  const [openExpences, setOpenExpences] = useState(true);
  const acceptableFileExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".mp3",
    ".wav",
    ".pdf",
    ".doc",
    ".docx",
  ].join(",");
  const validFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
    "audio/mpeg",
    "audio/wav",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  return (
    <InitialContext.Provider
      value={{
        netCahFlowValue,
        setNetCahFlowValue,
        netCashFlowInitial,
        openExpences,
        setOpenExpences,
        RegisterableItems,
        steRegisterableItems,
        Products,
        setProducts,
        allExpencesList,
        setAllExpencesList,
        transactionType,
        setTransactionType,
        Processing,
        setProcessing,
        singleSalesInputValues,
        setSinlgeSalesInputValues,
        ownersName,
        setownersName,
        ShowProgressBar,
        setShowProgressBar,
        accountRecivableAmt,
        setAccountRecivableAmt,
        unTimeRecivableCollected,
        setunTimeRecivableCollected,
        collectedMoney,
        setCollectedMoney,
        TransactionData,
        setTransactionData,
        deviceSize,
        setdeviceSize,
        viewInTable,
        setViewInTable,
        validFileTypes,
        acceptableFileExtensions,
      }}
    >
      {props.children}
    </InitialContext.Provider>
  );
}
export default UserContext;
export { InitialContext };
export let ConsumeableContext = () => {
  return useContext(InitialContext);
};

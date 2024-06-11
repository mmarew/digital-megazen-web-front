import React, { useState } from "react";
import singleSalesCss from "../../../CSS/AddSingleSales.module.css";
import { Tab, Tabs } from "@mui/material";
import GetRegisterableItems from "../../../Components/Transaction/AddTrans/GetRegisterableItems";
import GetEachTransaction from "../../../Components/Transaction/SearchTrans/GetEachTransaction";
import AddSingleSales_Register from "../../../Components/Transaction/AddTrans/RegisterPurchaseAndSales";
import SuccessOrError from "../../../Components/Body/Others/SuccessOrError";
import currentDates from "../../../Components/Body/Date/currentDate";
import SearchExpenceTransaction from "../../../Components/Transaction/SearchTrans/SearchExpenceTransaction";
import GetCreditLists from "../../../Components/CreditMGMT/GetCreditLists";
import TransactionForm from "../../../Components/Transaction/SearchTrans/TransactionForm";

function AddSingleSales() {
  const [singleSalesInputValues, setSinlgeSalesInputValues] = useState({
    singleSalesToDate: currentDates(),
    singleSalesFromDate: currentDates(),
  });

  const [getAllDailyRegisters, setGetAllDailyRegisters] = useState({
    Open: false,
    ProductId: 0,
    RandValue: Math.random(),
  });
  const [Errors, setErrors] = useState("");

  const [RegisterableItems, steRegisterableItems] = useState({
    items: {},
    Open: false,
  });
  const [tabValue, setTabValue] = useState(0);

  let handleTabChanges = (event, newTab) => {
    setGetAllDailyRegisters({ Open: false });

    setTabValue(newTab);
  };
  return (
    <div className={singleSalesCss.singleSalesWrapper}>
      {Errors && <SuccessOrError request={Errors} setErrors={setErrors} />}
      <Tabs
        value={tabValue}
        onChange={(event, newTab) => {
          handleTabChanges(event, newTab);
        }}
      >
        <Tab label="Search" value={0} />
        <Tab label="Products" value={1} />
        {/* <Tab label="View daily" value={2} /> */}
      </Tabs>
      {tabValue == 0 && (
        <TransactionForm
          data={{
            singleSalesInputValues,
            setSinlgeSalesInputValues,
            setGetAllDailyRegisters,
            steRegisterableItems,
          }}
        />
      )}
      {tabValue == 1 && <GetRegisterableItems />}

      {RegisterableItems.Open && (
        <AddSingleSales_Register
          RegisterableItems={RegisterableItems}
          steRegisterableItems={steRegisterableItems}
        />
      )}
      {getAllDailyRegisters.Open && (
        <>
          {/* SearchExpenceTransaction({
  showEachItems,
  setshowEachItems,
  fromDate,
  toDate,
  InputValue,
  searchTarget,
}) */}
          <br />
          <GetCreditLists
            randval={Math.random()}
            dateRange={{
              fromDate: singleSalesInputValues.singleSalesFromDate,
              toDate: singleSalesInputValues.singleSalesToDate,
            }}
          />

          <GetEachTransaction
            fromDate={singleSalesInputValues.singleSalesFromDate}
            toDate={singleSalesInputValues.singleSalesToDate}
            ErrorsProps={{ Errors, setErrors }}
            setGetAllDailyRegisters={setGetAllDailyRegisters}
            currentDay={singleSalesInputValues.singleSalesToDate}
            ProductId={getAllDailyRegisters.ProductId}
            RandValue={getAllDailyRegisters.RandValue}
            searchInput={singleSalesInputValues.searchInput}
          />
          {getAllDailyRegisters.ProductId == "getAllTransaction" && (
            <SearchExpenceTransaction
              fromDate={singleSalesInputValues.singleSalesFromDate}
              toDate={singleSalesInputValues.singleSalesToDate}
              // selectedValue == "ALLTRANSACTION"
              InputValue={{ selectedValue: "ALLTRANSACTION" }}
            />
          )}
        </>
      )}
    </div>
  );
}
export default AddSingleSales;

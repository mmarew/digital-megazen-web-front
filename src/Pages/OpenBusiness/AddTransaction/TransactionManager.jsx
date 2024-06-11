import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../../../CSS/addTransaction.css";
import { Button, LinearProgress, Tab, Tabs } from "@mui/material";
import GetRegisterableItems from "../../../Components/Transaction/AddTrans/GetRegisterableItems";
import { useLocation } from "react-router-dom";

import SearchExpenceTransaction from "../../../Components/Transaction/SearchTrans/SearchExpenceTransaction";
import GetEachTransaction from "../../../Components/Transaction/SearchTrans/GetEachTransaction";
import GetCreditLists from "../../../Components/CreditMGMT/GetCreditLists";

import { fetchExpencesItemsFromServer } from "../../../Components/Expences/GetExpencesLists";
import GetDeposit from "../../../Components/Bank/GetDeposit";
import { ConsumeableContext } from "../../../Components/Body/UserContext/UserContext";
import NetCashFlow from "../../../Components/NetCashFlow/NetCashFlow";
function TransactionManager({ Time }) {
  const location = useLocation();
  const currentURL = location.pathname.split("/")[3];
  const [errorsOrSuccess, setErrorsOrSuccess] = useState({
    Message: "",
    Detail: "",
  });
  let navigate = useNavigate();

  const [Processing, setProcessing] = useState(true);
  useEffect(() => {
    // setownersName(localStorage.getItem("ownersName"));
    setProcessing(true);
    let getItems = async () => {
      let Responces = await GetRegisterableItems(setErrorsOrSuccess);
      setProcessing(false);
      if (Responces == "error") {
        return; // setErrorsOrSuccess("Error while fetching items");
      }
      setProducts(Responces);
    };
    getItems();
    let GetRegisterableExpencesItems = async () => {
      let responces = await fetchExpencesItemsFromServer(setErrorsOrSuccess);
      if (responces === "error") return;
      setAllExpencesList(responces.data.data);
    };
    GetRegisterableExpencesItems();
  }, []);

  let {
    singleSalesInputValues,
    transactionType,
    setTransactionType,
    Products,
    setProducts,
    setAllExpencesList,
    steRegisterableItems,
    setSinlgeSalesInputValues,
    openExpences,
    setOpenExpences,
  } = ConsumeableContext();
  let openedBusiness = localStorage.getItem("openedBusiness");
  let employeeRole = JSON.parse(localStorage.getItem("employeeRole"));
  useEffect(() => {
    setTransactionType(currentURL);
  }, [setTransactionType]);

  let handleNavigations = (e) => {
    let { name } = e.target;
    steRegisterableItems((prevItems) => ({ ...prevItems, Open: true }));
    navigate(name);
    setTransactionType(name);
    if (name == "bankDeposit") {
      setSinlgeSalesInputValues((revData) => ({
        ...revData,
        searchTransactions: false,
        showCreditRecords: false,
        showSearchForm: false,
        showExpencesRecods: false,
        showBuyAndSales: false,
        fetchDeposits: true,
      }));
    }
    if (name == "Search") {
      setSinlgeSalesInputValues((revData) => ({
        ...revData,
        searchTransactions: false,
        showCreditRecords: false,
        showSearchForm: true,
        showExpencesRecods: false,
        showBuyAndSales: false,
        fetchDeposits: false,
      }));
    }
  };
  return (
    <>
      <main>
        {/* // this is the firt section of add transaction */}
        <section>
          {(openedBusiness == "myBusiness" ||
            employeeRole?.includes("Sales")) && (
            <Button
              name="Sales"
              variant={currentURL == "Sales" ? "outlined" : "text"}
              onClick={handleNavigations}
            >
              Sales
            </Button>
          )}
          {(openedBusiness == "myBusiness" ||
            employeeRole?.includes("Purchasing")) && (
            <Button
              name="Buy"
              variant={currentURL === "Buy" ? "outlined" : "text"}
              onClick={handleNavigations}
            >
              BUY
            </Button>
          )}
          {(openedBusiness == "myBusiness" ||
            employeeRole?.includes("Purchasing")) && (
            <Button
              name="Both"
              variant={currentURL == "Both" ? "outlined" : "text"}
              onClick={handleNavigations}
            >
              Both
            </Button>
          )}
          <Button
            name="Expenses"
            variant={currentURL === "Expenses" ? "outlined" : "text"}
            onClick={(e) => {
              // turn on modal and navigate to expenses
              handleNavigations(e);
              setOpenExpences(true);
            }}
          >
            Expenses
          </Button>
          <Button
            name="bankDeposit"
            variant={currentURL === "bankDeposit" ? "outlined" : "text"}
            onClick={handleNavigations}
          >
            Deposit
          </Button>
          <Button
            variant={currentURL === "Search" ? "outlined" : "text"}
            label="Search"
            name="Search"
            onClick={(e) => {
              handleNavigations(e);
              setTransactionType("Search");
            }}
            type="search"
          >
            search
          </Button>
        </section>
        <Outlet />
        <br />
        {currentURL == "Search" && (
          <>
            {singleSalesInputValues.showBuyAndSales && <GetEachTransaction />}
            {singleSalesInputValues.fetchDeposits && <GetDeposit />}
            {singleSalesInputValues.showCreditRecords && (
              <GetCreditLists
                details={singleSalesInputValues}
                dateRange={{
                  fromDate: singleSalesInputValues.fromDate,
                  toDate: singleSalesInputValues.toDate,
                }}
              />
            )}
            {singleSalesInputValues.showExpencesRecods && (
              <SearchExpenceTransaction />
            )}
            <br />
            {singleSalesInputValues.showExpencesRecods &&
              singleSalesInputValues.showBuyAndSales && <NetCashFlow />}
          </>
        )}
      </main>

      {Products?.length > 0 ? (
        ""
      ) : Processing ? (
        <>
          <LinearProgress
            style={{
              margin: "10px 0",
            }}
          />
          <h4 style={{ color: "red" }}>
            We'r looking for your data. Please wait a few seconds
          </h4>
        </>
      ) : (
        <>
          {errorsOrSuccess.Message !== "" ? (
            <div style={{ color: "red" }}>{errorsOrSuccess.Detail}</div>
          ) : (
            <h4>
              We can't find any products to make transaction. So please click{" "}
              <Link className="linkStyles" to="/OpenBusiness/Items">
                here to add items
              </Link>{" "}
              first.
            </h4>
          )}
        </>
      )}
    </>
  );
}
export default TransactionManager;

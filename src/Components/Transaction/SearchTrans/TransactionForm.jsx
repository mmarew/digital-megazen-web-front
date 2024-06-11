import React, { useState } from "react";
import singleSalesCss from "../../../CSS/AddSingleSales.module.css";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { ConsumeableContext } from "../../Body/UserContext/UserContext";
let searchTypes = [
  "All Buy Sell and Expences",
  "All Buy And Sell only",
  "All Expences only",
  "Single items Buy And Sell",
  "Single Expences",
  "Bank deposit",
];
function TransactionForm({ data }) {
  let {
    singleSalesInputValues,
    setSinlgeSalesInputValues,
    Products,
    allExpencesList,
    setTransactionType,
  } = ConsumeableContext();
  const [searchTarget, setsearchTarget] = useState(null);
  //   functions start here
  let handleSearchSubmit = async (e) => {
    e.preventDefault();

    setSinlgeSalesInputValues({
      ...singleSalesInputValues,
      searchTransactions: false,
      showExpencesRecods: false,
      showBuyAndSales: false,
      showCreditRecords: false,
      fetchDeposits: false,
    });
    setTimeout(() => {
      if (searchTarget == "All Buy Sell and Expences") {
        setSinlgeSalesInputValues({
          ...singleSalesInputValues,
          searchTransactions: false,
          showExpencesRecods: true,
          showBuyAndSales: true,
          showCreditRecords: true,
          fetchDeposits: true,
        });
      } else if (searchTarget == "All Buy And Sell only") {
        setSinlgeSalesInputValues({
          ...singleSalesInputValues,
          searchTransactions: false,
          showExpencesRecods: false,
          showBuyAndSales: true,
          showCreditRecords: true,
          fetchDeposits: true,
        });
      } else if (searchTarget == "All Expences only") {
        setSinlgeSalesInputValues({
          ...singleSalesInputValues,
          searchTransactions: false,
          showExpencesRecods: true,
          showBuyAndSales: false,
          showCreditRecords: false,
        });
      } else if (searchTarget == "Single items Buy And Sell") {
        setSinlgeSalesInputValues({
          ...singleSalesInputValues,
          searchTransactions: true,
          showExpencesRecods: false,
          showBuyAndSales: true,
          showCreditRecords: true,
          fetchDeposits: true,
        });
      } else if (searchTarget == "Single Expences") {
        setSinlgeSalesInputValues({
          ...singleSalesInputValues,
          searchTransactions: true,
          showExpencesRecods: true,
          showBuyAndSales: false,
          showCreditRecords: false,
        });
      } else if (searchTarget == "Bank deposit") {
        setSinlgeSalesInputValues({
          ...singleSalesInputValues,
          fetchDeposits: true,
        });
      }
    });
  };

  let handleSearchableProductInput = (event) => {
    let { name, value } = event.target;

    setSinlgeSalesInputValues({
      ...singleSalesInputValues,
      [name]: value,
      showExpencesRecods: false,
      showBuyAndSales: false,
      showCreditRecords: false,
      fetchDeposits: false,
    });
    if (name == "targetedProduct") {
      setTimeout(() => {
        setSinlgeSalesInputValues((prevData) => ({
          ...prevData,
          ProductId: value.ProductId,
        }));
      }, 10);
      return;
    }
    if (name == "targetedExpences") {
      setTimeout(() => {
        setSinlgeSalesInputValues((prevData) => ({
          ...prevData,
          expencesId: value.costsId,
        }));
      }, 10);
      return;
    }
  };
  const handleSearchTypeInputs = (e) => {
    let { name, value } = e.target;
    setSinlgeSalesInputValues({
      ...singleSalesInputValues,
      searchTarget: value,
      showExpencesRecods: false,
      showBuyAndSales: false,
      showCreditRecords: false,
      fetchDeposits: false,
    });
    setsearchTarget(value);
  };

  return (
    <div>
      <form
        className={singleSalesCss.formToSearchItems}
        onSubmit={handleSearchSubmit}
      >
        <label
          style={{
            textAlign: "center",
            paddingLeft: "100px",
            width: "fit-content ",
          }}
        >
          From Date
        </label>
        <br />
        <TextField
          onChange={handleSearchableProductInput}
          value={singleSalesInputValues.fromDate}
          required
          fullWidth
          name="fromDate"
          type="date"
        />
        <br />
        <label
          style={{
            textAlign: "center",
            paddingLeft: "100px",
            width: "fit-content ",
          }}
        >
          TO Date
        </label>
        <TextField
          onChange={handleSearchableProductInput}
          value={singleSalesInputValues.toDate}
          required
          fullWidth
          name="toDate"
          type="date"
        />
        <br />
        {/* choose search target */}
        <label style={{ textAlign: "center", marginBottom: "10px" }}>
          Search Type
        </label>
        <Select
          onChange={handleSearchTypeInputs}
          value={searchTarget}
          required
          name="searchTarget"
          fullWidth
        >
          {searchTypes.map((type) => {
            return (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            );
          })}
        </Select>
        {/* Single items Buy And Sell */}
        {searchTarget === "Single items Buy And Sell" ? (
          <>
            <br />
            <label style={{ textAlign: "center", marginBottom: "10px" }}>
              Choose Product{" "}
            </label>
            <Select
              onChange={handleSearchableProductInput}
              value={singleSalesInputValues.targetedProduct}
              required
              name="targetedProduct"
            >
              {Products?.map((product) => {
                return (
                  <MenuItem key={product.ProductId} value={product}>
                    {product.productName}
                  </MenuItem>
                );
              })}
            </Select>
          </>
        ) : searchTarget === "Single Expences" ? (
          <>
            <br />
            <label style={{ textAlign: "center", marginBottom: "10px" }}>
              Choose Expences items
            </label>
            <Select
              onChange={handleSearchableProductInput}
              value={singleSalesInputValues.targetedExpences}
              required
              name="targetedExpences"
            >
              {allExpencesList?.map((items) => {
                return <MenuItem value={items}>{items.costName}</MenuItem>;
              })}
            </Select>
          </>
        ) : (
          ""
        )}

        <>
          {" "}
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              fullWidth
              id="btnsearchSingleProduct"
              type="submit"
              variant="contained"
            >
              Search data
            </Button>
            {/* <Button
              variant="contained"
              color="warning"
              onClick={() => {
                setTransactionType(null);
                setSinlgeSalesInputValues((previousItems) => ({
                  ...previousItems,
                  showSearchForm: false,
                  showExpencesRecods: true,
                  showBuyAndSales: true,
                  searchTarget: "getLast10records",
                }));
              }}
            >
              Close form
            </Button> */}
          </div>
        </>
      </form>
    </div>
  );
}

export default TransactionForm;

import { Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
import CurrencyFormatter from "../Utilities/Utility";
import "./NetCashflow.css";
function NetCashFlow() {
  const openedBusiness = localStorage.getItem("openedBusiness");
  const { netCahFlowValue } = ConsumeableContext();
  const [casOnhand, setCasOnhand] = useState(0);

  useEffect(() => {
    const calculateCashOnHand = () => {
      let cashOnHandValue = 0;

      if (openedBusiness === "myBusiness") {
        cashOnHandValue =
          netCahFlowValue.totalSalesRevenue -
          netCahFlowValue.totalCost -
          netCahFlowValue.totalExpences -
          netCahFlowValue.accountRecivable +
          netCahFlowValue.collectedCashFromAR;
      } else {
        cashOnHandValue =
          netCahFlowValue.totalSalesRevenue -
          netCahFlowValue.totalExpences -
          netCahFlowValue.accountRecivable +
          netCahFlowValue.collectedCashFromAR;
      }

      setCasOnhand(cashOnHandValue);
    };

    calculateCashOnHand();
  }, [netCahFlowValue, openedBusiness]);

  return (
    <div>
      <Paper style={{ padding: "20px" }}>
        <Typography variant="h6">Summary of Your Transactions</Typography>
        <ul>
          <li>
            <Typography variant="body1">
              Total Sales Revenue:{" "}
              {CurrencyFormatter(netCahFlowValue.totalSalesRevenue)}
            </Typography>
          </li>
          <li>
            <Typography
              variant="body1"
              sx={{ cursor: "pointer", color: "blue" }}
              onClick={(e) => setShowMoneyDetailModal(true)}
            >
              Collected Money:{" "}
              {CurrencyFormatter(netCahFlowValue.collectedCashFromAR)}
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Total Purchase Cost:{" "}
              {openedBusiness === "myBusiness"
                ? CurrencyFormatter(netCahFlowValue.totalCost)
                : 0}
            </Typography>
          </li>
          <li>
            <Typography>
              Total Expenses: {CurrencyFormatter(netCahFlowValue.totalExpences)}
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Account Receivable:{" "}
              {CurrencyFormatter(netCahFlowValue.accountRecivable)}
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Deposit to Bank: {CurrencyFormatter(netCahFlowValue.depositToBak)}
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Cash On Hand:{" "}
              <span className="bottomBorders">
                {CurrencyFormatter(casOnhand)}
              </span>
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Net Cash Flow:{" "}
              <span className="bottomBorders">
                {CurrencyFormatter(casOnhand - netCahFlowValue.depositToBak)}
              </span>{" "}
            </Typography>
          </li>
        </ul>
      </Paper>
    </div>
  );
}

export default NetCashFlow;

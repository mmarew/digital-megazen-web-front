import { Badge, Box, Checkbox, Select, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import GetCreditLists from "../Components/CreditMGMT/GetCreditLists";
import GetMinimumQty from "../Components/MinimumQTY/GetMinimumQty";
import GetMaximumSales from "../Components/MaximumQTY/GetMaximumSales";
import GetDebtListTab from "../Components/DebtMgmt/GetDebtListTab";
import PayDebt from "../Components/DebtMgmt/PayDebt";
import { getDebtData } from "../Components/DebtMgmt/DisplayerOfDebtList";
import CreditTab from "../Components/CreditMGMT/CreditTab";

function OpenBusinessHome() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [numberOfNotifications, setNumberOfNotifications] = useState({
    Inventory: 0,
    Credits: 0,
    Top: 0,
    Reports: 0,
    Debtes: 0,
  });
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
    let getRequiredData = async () => {
      let responcesOfDebt = await getDebtData("unPaid");
      let debtDataLength = responcesOfDebt.data.length;
      setNumberOfNotifications({
        ...numberOfNotifications,
        Debtes: debtDataLength,
      });
    };
    getRequiredData();
    // setNumberOfNotifications;
    if (window.innerWidth > 768) {
      setviewInTable(true);
    } else setviewInTable(false);
  }, []);
  const [viewInTable, setviewInTable] = useState(false);
  const [FetchedDataLength, setFetchedDataLength] = useState(0);
  return (
    <div>
      {/*used to show notifications amount only */}
      <div style={{ display: "none" }}>
        <GetCreditLists
          Notifications={{ numberOfNotifications, setNumberOfNotifications }}
          dateRange={{
            fromDate: "notInDateRange",
            toDate: "notInDateRange",
          }}
        />
      </div>
      <>
        <Tabs
          sx={{
            position: "relative",
            "& .MuiTab-root": {
              minWidth: 0,
              padding: "10px",
            },
          }}
          value={selectedTab}
          onChange={handleTabChange}
        >
          <Tab
            label={
              <>
                <Badge
                  sx={{ position: "absolute", top: "10px" }}
                  badgeContent={numberOfNotifications.Inventory}
                  color="error"
                />
                <span>Inventory</span>
              </>
            }
            value={0}
          />
          <Tab
            label={
              <>
                <Badge
                  sx={{ position: "absolute", top: "10px" }}
                  badgeContent={numberOfNotifications.Debtes}
                  color="error"
                />
                <span>Debets</span>
              </>
            }
            value={1}
          />
          <Tab
            label={
              <>
                <Badge
                  sx={{ position: "absolute", top: "10px" }}
                  badgeContent={numberOfNotifications.Credits}
                  color="error"
                />
                <span>Credit</span>
              </>
            }
            value={2}
          />
          <Tab
            label={
              <>
                <Badge
                  sx={{ position: "absolute", top: "10px" }}
                  badgeContent={numberOfNotifications.Top}
                  color="error"
                />
                <span>Top</span>
              </>
            }
            value={3}
          />
        </Tabs>
        <br />
        {selectedTab == 0 ? (
          <GetMinimumQty
            setFetchedDataLength={setFetchedDataLength}
            viewInTable={viewInTable}
          />
        ) : selectedTab == 1 ? (
          <GetDebtListTab />
        ) : selectedTab == 2 ? (
          <>
            <CreditTab
              setFetchedDataLength={setFetchedDataLength}
              viewInTable={viewInTable}
              Notifications={{
                numberOfNotifications,
                setNumberOfNotifications,
              }}
              dateRange={{
                fromDate: "notInDateRange",
                toDate: "notInDateRange",
              }}
            />
          </>
        ) : selectedTab == 3 ? (
          <GetMaximumSales
            setFetchedDataLength={setFetchedDataLength}
            viewInTable={viewInTable}
            Notifications={{ numberOfNotifications, setNumberOfNotifications }}
          />
        ) : selectedTab == 4 ? (
          ""
        ) : (
          ""
        )}
      </>
    </div>
  );
}

export default OpenBusinessHome;

import React from "react";
import { Tab, Tabs } from "@mui/material";
import GetCreditLists from "./GetCreditLists";

function CreditTab({
  setFetchedDataLength,
  viewInTable,
  Notifications,
  dateRange,
}) {
  const [tabValue, setTabValue] = React.useState(0);
  const { numberOfNotifications, setNumberOfNotifications } = Notifications;
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Tabs value={tabValue} onChange={handleChange}>
        <Tab label="Current Credit" />
        <Tab label="Credit History" />
        {/* <Tab label="Tab 3" /> */}
      </Tabs>
      {tabValue == 0 && (
        <GetCreditLists
          //   setFetchedDataLength={setFetchedDataLength}
          creditSearchTarget="unPaid"
          viewInTable={viewInTable}
          Notifications={{ numberOfNotifications, setNumberOfNotifications }}
          dateRange={{
            fromDate: "notInDateRange",
            toDate: "notInDateRange",
          }}
        />
      )}
      {tabValue == 1 && (
        <GetCreditLists
          //   setFetchedDataLength={setFetchedDataLength}
          creditSearchTarget="History"
          viewInTable={viewInTable}
          Notifications={{ numberOfNotifications, setNumberOfNotifications }}
          dateRange={{
            fromDate: "notInDateRange",
            toDate: "notInDateRange",
          }}
        />
      )}
    </>
  );
}

export default CreditTab;

import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import DisplayerOfDebtList from "./DisplayerOfDebtList";
function GetDebtListTab() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Current Debts" />
        <Tab label="Debts History" />
        {/* <Tab label="Tab 3" /> */}
      </Tabs>
      {value === 0 && <DisplayerOfDebtList Target="unPaid" />}
      {value === 1 && <DisplayerOfDebtList Target="History" />}
    </>
  );
}

export default GetDebtListTab;

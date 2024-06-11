import { Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import InsertDeposite from "./InsertDeposit";
import GetDeposit from "./GetDeposit";

const DepositTab = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Register" />
        <Tab label="View" />
      </Tabs>
      <br />

      {activeTab === 0 && <InsertDeposite />}
      {activeTab === 1 && <GetDeposit />}
    </div>
  );
};
export default DepositTab;

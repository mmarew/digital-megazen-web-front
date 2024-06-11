import React from "react";
import { getDebtData } from "./DisplayerOfDebtList";
import { useEffect } from "react";

function GetHistoryDebtList() {
  useEffect(() => {
    let getUsersDebtHistory = async () => {
      let responces = await getDebtData("History");
    };
    getUsersDebtHistory();
  }, []);

  return <div>GetHistoryDebtList</div>;
}

export default GetHistoryDebtList;

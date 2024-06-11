import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ButtonProcessing } from "../Utilities/Utility";
import SuccessOrError from "../Body/Others/SuccessOrError";
import { Select, MenuItem } from "@mui/material";
import AddExpencesTransaction from "../Transaction/AddTrans/AddExpTransaction";
import SearchExpenceTransaction from "../Transaction/SearchTrans/SearchExpenceTransaction";
import { fetchExpencesItemsFromServer } from "./GetExpencesLists";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
import currentDates from "../Body/Date/currentDate";
function App() {
  const [InputValue, setInputValue] = useState({
    fromDate: currentDates(),
    toDate: currentDates(),
  });
  const [showEachItems, setshowEachItems] = useState();

  const [expencesList, setExpencesList] = useState([{}]);
  const [open, setopen] = useState();
  let { Processing } = ConsumeableContext();
  const [ErrorsOrSuccess, setErrorsOrSuccess] = useState({
    Message: "",
    Detail: "",
  });
  const ReloadData = {
    Reload: false,
    Open: false,
    Rand: Math.random(),
  };
  const [GetSingleExpTransaction, setGetSingleExpTransaction] = useState(false);

  let handleSearch = () => {
    setGetSingleExpTransaction(false);
    setTimeout(() => {
      setGetSingleExpTransaction(true);
    });
  };
  useEffect(() => {
    fetchExpencesItemsFromServer().then((res) =>
      setExpencesList(res.data.data)
    );
  }, []);
  const handleInputChange = (event) => {
    setInputValue({
      ...InputValue,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      {ErrorsOrSuccess.Message && (
        <SuccessOrError
          request={
            ErrorsOrSuccess.Message == "SUCCESS"
              ? "SUCCESS"
              : ErrorsOrSuccess.Detail
          }
          setErrors={setErrorsOrSuccess}
        />
      )}
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          padding: "20px",
          margin: "10px",
          maxWidth: "300px",
          gap: "10px",
        }}
      >
        <h4>Search Expences </h4>

        <TextField
          label="From Date"
          required
          type="date"
          name="fromDate"
          value={InputValue.fromDate}
          onChange={handleInputChange}
        />
        <TextField
          label="To Date"
          required
          type="date"
          name="toDate"
          value={InputValue.toDate}
          onChange={(e) => {
            setGetSingleExpTransaction(ReloadData);
            setInputValue({ ...InputValue, [e.target.name]: e.target.value });
          }}
        />
        <label>Choose Transaction Type</label>
        <Select name="searchTarget" onChange={handleInputChange}>
          <MenuItem value="allTransaction">All Transactions</MenuItem>
          <MenuItem value="singleTransaction">Single Transactions</MenuItem>
        </Select>
        {InputValue.searchTarget == "singleTransaction" && (
          <>
            <label>Select Expense Type </label>
            <Select
              label="Select Expence"
              required
              name="expenceItem"
              onChange={(e) => {
                setGetSingleExpTransaction(ReloadData);
                setInputValue({ ...InputValue, ...e.target.value });
              }}
            >
              {expencesList?.map((item, index) => (
                <MenuItem key={"index_" + index} value={item}>
                  {item.costName}
                </MenuItem>
              ))}
            </Select>
          </>
        )}

        {Processing ? (
          <ButtonProcessing />
        ) : (
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        )}
      </form>

      {open && (
        <AddExpencesTransaction
          data={{
            RegisterableCots: expencesList,
            setopen,
            setErrorsOrSuccess,
            open,
          }}
        />
      )}
      {GetSingleExpTransaction && (
        <>
          <SearchExpenceTransaction
            searchTarget={InputValue.searchTarget}
            // "singleTransaction"
            InputValue={InputValue}
            toDate={InputValue.toDate}
            fromDate={InputValue.fromDate}
            setshowEachItems={setshowEachItems}
          />
        </>
      )}
    </div>
  );
}

export default App;

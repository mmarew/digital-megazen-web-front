import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import singleSalesCss from "../../../CSS/AddSingleSales.module.css";

import axios from "axios";
import currentDates, { DateFormatter } from "../../Body/Date/currentDate";
import CurrencyFormatter from "../../Utilities/Utility";
import SuccessOrError from "../../Body/Others/SuccessOrError";
import { ConsumeableContext } from "../../Body/UserContext/UserContext";
import { useNavigate } from "react-router-dom";
let inputData = {
  purchaseType: "Default",
  salesType: "On cash",
  Description: "",
  ProductId: "",
  brokenQty: "",
  creditPaymentDate: "",
  purchaseQty: "",
  salesQty: "",
  selectedDate: currentDates(),
  useNewPrice: false,
  unitPrice: null,
  newUnitPrice: "",
  newUnitCost: "",
  useNewCost: false,
  purchasePaymentType: "On cash",
  debtDueDate: null,
};

function RegisterPurchaseAndSales({ data }) {
  let {
    setTransactionType,
    transactionType,
    Products,
    setSinlgeSalesInputValues,
    singleSalesInputValues,
    RegisterableItems,
    steRegisterableItems,
    validFileTypes,
    acceptableFileExtensions,
  } = ConsumeableContext();
  let navigate = useNavigate();
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let registerationType = transactionType;
  const [singleSalesError, setsingleSalesError] = useState({});
  const [ErrorsOrSuccess, setErrorsOrSuccess] = useState(null);

  let [Processing, setProcessing] = useState(false);

  const [formInputValues, setformInputValues] = useState({ ...inputData });
  useEffect(() => {
    // check Token existances
    token = localStorage.getItem("storeToken");
    serverAddress = localStorage.getItem("targetUrl");

    //redirect token existance and  if token does not exist redirect to login
    if (!token) {
      window.location.href = "/login";
    }
  }, []);
  const [formData, setFormData] = React.useState(new FormData());
  const handleFilesAttachment = (e) => {
    // acceptableFileExtensions;
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!validFileTypes.includes(file.type)) {
      alert(
        "Invalid file type. Please select an image, audio, PDF, or Word document."
      );
      e.target.value = null;

      return;
    }
    formData.set("selectedFile", file);
    // ... you can also set additional properties if needed
  };

  let registerSinglesalesTransaction = async (e, items) => {
    try {
      e.preventDefault();
      let { salesType } = formInputValues;

      if (salesType === "Default") {
        setsingleSalesError((reviousErrorsOrSuccess) => ({
          ...reviousErrorsOrSuccess,
          salesType: "Sales type values has to be selected",
        }));
        return;
      }
      setProcessing(true);
      if (!token) {
        window.location.href = "/login";
        return;
      }
      setProcessing(true);
      formData.set("items", JSON.stringify(items));
      formData.set("businessId", localStorage.getItem("businessId"));
      let formInputKeyes = Object.keys(formInputValues);
      formInputKeyes.forEach((key) => {
        formData.set(key, formInputValues[key]);
      });
      // formData.append("formInputValues", JSON.stringify(formInputValues));

      let responce = await axios.post(
        serverAddress + "Transaction/registerSinglesalesTransaction/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token, // Include the token in the request headers
          },
        }
      );
      // navigate("/waitting");
      setTimeout(() => {
        navigate("/OpenBusiness/transaction/");
      });
      DateFormatter();
      setformInputValues({ ...inputData }); // Reset the form values to default
      setProcessing(false);

      if (responce.data.data === "success") {
        setErrorsOrSuccess("SUCCESS");
        handleClose();
        // reset data to hide search form, buy,expences and sales records
        setSinlgeSalesInputValues((previousState) => {
          return {
            ...previousState,
            showSearchForm: false,
            searchTarget: "getLast10records",
            showBuyAndSales: false,
            showExpencesRecods: false,
          };
        });
        // show last data only on success
        setTimeout(() => {
          setSinlgeSalesInputValues((previousState) => {
            return {
              ...previousState,
              showSearchForm: false,
              searchTarget: "getLast10records",
              showBuyAndSales: true,
            };
          });
        });
      }
    } catch (error) {
      setProcessing(false);
      setErrorsOrSuccess(error.message);
    }
  };
  let handleSalesTransactionInput = (e, ProductId) => {
    let { name, value, type } = e.target;
    if (Number(value) < 0 && type === "number") {
      setErrorsOrSuccess("negative value not allowed");
      return;
    }
    if (registerationType == "Buy") {
      // set saletqty to 0
      setformInputValues((previousState) => ({
        ...previousState,
        salesType: "On cash",
      }));
      setTimeout(() => {
        setformInputValues((previousState) => ({
          ...previousState,
          salesQty: 0,
        }));
      });
    } else if (registerationType === "Sales") {
      // set purchaseQty to 0
      setTimeout(() => {
        setformInputValues((previousState) => ({
          ...previousState,
          purchaseQty: 0,
        }));
      });
    }

    setformInputValues((previousState) => ({
      ...previousState,
      [name]: value,
      ProductId,
    }));
  };
  let handleClose = () => {
    steRegisterableItems((prevItems) => ({
      ...prevItems,
      items: null,
    }));
    let { showExpencesRecods, showBuyAndSales } = singleSalesInputValues;
    if (showExpencesRecods == false && showBuyAndSales == false)
      setSinlgeSalesInputValues((previousData) => ({
        ...previousData,
        showExpencesRecods: true,
        showBuyAndSales: true,
      }));
    setTransactionType(null);
    steRegisterableItems((prevItems) => {
      return {
        ...prevItems,
        Open: false,
      };
    });
    setProcessing(false);
  };

  return (
    <>
      <Modal open={RegisterableItems.Open}>
        <Box className="modalBox">
          <Box
            sx={{
              overflowY: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography component="h2">
              Single Item {registerationType} Registration To Product{" "}
              {RegisterableItems?.items?.productName}
            </Typography>
          </Box>
          <Typography variant="body1" component="p">
            <form
              className={singleSalesCss.singleTransactionForm}
              onSubmit={(e) => {
                registerSinglesalesTransaction(e, RegisterableItems.items);
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                Date
              </div>{" "}
              <br />
              <TextField
                onInput={(e) =>
                  handleSalesTransactionInput(
                    e,
                    RegisterableItems?.items?.ProductId
                  )
                }
                value={formInputValues?.selectedDate}
                required
                fullWidth
                type="date"
                name="selectedDate"
              />
              <br />
              <Autocomplete
                id="product-select-demo"
                sx={{ width: 300 }}
                options={Products}
                autoHighlight
                onChange={(event, value) =>
                  steRegisterableItems((prev) => {
                    return { ...prev, items: value };
                  })
                }
                getOptionLabel={(product) => product?.productName}
                renderOption={(props, product) => (
                  <Box component="li" {...props}>
                    {product?.productName}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label="Choose a product"
                    inputProps={{
                      ...params?.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
              {/* if item is selected */}
              {RegisterableItems?.items &&
              Object.keys(RegisterableItems?.items)?.length > 0 ? (
                <>
                  <br />
                  {(registerationType == "Buy" ||
                    registerationType == "Both") && (
                    <>
                      <TextField
                        fullWidth
                        type="number"
                        required
                        value={formInputValues?.purchaseQty}
                        className={"dailyRegistrationInputs"}
                        onInput={(e) =>
                          handleSalesTransactionInput(
                            e,
                            RegisterableItems?.items?.ProductId
                          )
                        }
                        name="purchaseQty"
                        label="purchase quantity"
                      />
                      {formInputValues.useNewCost ? (
                        <>
                          <br />
                          <TextField
                            onInput={(e) =>
                              handleSalesTransactionInput(
                                e,
                                RegisterableItems.items?.ProductId
                              )
                            }
                            value={formInputValues?.newUnitCost}
                            label="Enter New Cost"
                            fullWidth
                            required
                            name="newUnitCost"
                            type="number"
                          />
                        </>
                      ) : (
                        <div style={{ paddingTop: "10px" }}>
                          Unit Cost=
                          {RegisterableItems?.items?.productsUnitCost}
                        </div>
                      )}
                      <br />
                      <label>Purchase Payment Type</label>
                      <Select
                        onChange={(e) =>
                          handleSalesTransactionInput(
                            e,
                            RegisterableItems.items?.ProductId
                          )
                        }
                        fullWidth
                        name="purchasePaymentType"
                        value={formInputValues?.purchasePaymentType}
                      >
                        {/*  */}
                        <MenuItem value="On cash">On cash</MenuItem>
                        {formInputValues?.useNewCost
                          ? formInputValues.newUnitCost > 0 &&
                            formInputValues?.purchaseQty > 0 && (
                              <MenuItem value="On debt">On debt</MenuItem>
                            )
                          : RegisterableItems?.items?.productsUnitCost > 0 &&
                            formInputValues?.purchaseQty > 0 && (
                              <MenuItem value="On debt">On debt</MenuItem>
                            )}
                        <MenuItem value="By bank">By Bank</MenuItem>
                        {/* <MenuItem value="Free gift">Free Gift</MenuItem> */}
                      </Select>
                      {/*it is credit duedate */}
                      {/* it hase tobe on menue item */}
                      {formInputValues?.purchasePaymentType == "On debt" && (
                        <>
                          <br />
                          <label>Debt Due Date</label>
                          <TextField
                            onChange={(e) =>
                              handleSalesTransactionInput(
                                e,
                                RegisterableItems.items?.ProductId
                              )
                            }
                            name="debtDueDate"
                            value={formInputValues?.debtDueDate}
                            required
                            fullWidth
                            type="date"
                          />
                          <br />
                        </>
                      )}

                      <div>
                        <Checkbox
                          checked={formInputValues?.useNewCost}
                          onChange={(e) => {
                            setformInputValues((previousState) => ({
                              ...previousState,
                              useNewCost: !formInputValues?.useNewCost,
                              ProductId: RegisterableItems?.items?.ProductId,
                            }));
                          }}
                          name="useNewCost"
                        />
                        <span>Use New Cost</span>
                      </div>
                      {formInputValues?.purchaseQty > 0 && (
                        <div style={{ padding: "10px 0" }}>
                          Purchase in money{" "}
                          {formInputValues?.useNewCost
                            ? CurrencyFormatter(
                                formInputValues?.purchaseQty *
                                  formInputValues?.newUnitCost
                              )
                            : CurrencyFormatter(
                                formInputValues?.purchaseQty *
                                  RegisterableItems?.items?.productsUnitCost
                              )}
                        </div>
                      )}
                    </>
                  )}
                  {/* sales input section */}

                  {(registerationType == "Both" ||
                    registerationType == "Sales") && (
                    <>
                      <TextField
                        fullWidth
                        type="number"
                        required
                        className={"dailyRegistrationInputs"}
                        onInput={(e) =>
                          handleSalesTransactionInput(
                            e,
                            RegisterableItems.items.ProductId
                          )
                        }
                        name="salesQty"
                        label="Sales quantity"
                        value={formInputValues.salesQty}
                      />
                      <br />
                      {formInputValues.useNewPrice ? (
                        <TextField
                          value={formInputValues.unitPrice}
                          name="unitPrice"
                          onChange={(e) => {
                            handleSalesTransactionInput(
                              e,
                              RegisterableItems.items.ProductId
                            );
                          }}
                          required
                          label={"Enter New Price "}
                          fullWidth
                          type="number"
                        />
                      ) : (
                        <div style={{}}>
                          Unit Price=
                          {RegisterableItems.items.productsUnitPrice}
                        </div>
                      )}
                      <div>
                        <Checkbox
                          checked={formInputValues.useNewPrice}
                          onChange={(e) => {
                            setformInputValues((previousState) => ({
                              ...previousState,
                              useNewPrice: !formInputValues.useNewPrice,
                              ProductId: RegisterableItems.items.ProductId,
                            }));
                          }}
                          name="useNewPrice"
                        />
                        <span>Use New Price</span>
                      </div>
                      {formInputValues.salesQty > 0 && (
                        <div style={{ padding: "10px" }}>
                          sales in money{" "}
                          {formInputValues.useNewPrice
                            ? formInputValues.unitPrice &&
                              CurrencyFormatter(
                                formInputValues.salesQty *
                                  formInputValues.unitPrice
                              )
                            : CurrencyFormatter(
                                formInputValues.salesQty *
                                  RegisterableItems.items.productsUnitPrice
                              )}
                        </div>
                      )}
                    </>
                  )}
                  {/* broken qty input start here */}
                  <br />
                  <TextField
                    required
                    fullWidth
                    type="number"
                    className={"dailyRegistrationInputs"}
                    onInput={(e) => {
                      handleSalesTransactionInput(
                        e,
                        RegisterableItems.items.ProductId
                      );
                    }}
                    minimum="0"
                    name="brokenQty"
                    label="Broken quantity"
                    value={formInputValues.brokenQty}
                  />
                  <br />
                  {/* payment type starts here */}
                  {(registerationType == "Sales" ||
                    registerationType == "Both") && (
                    <>
                      <label>Sales payment type</label>
                      <Select
                        value={formInputValues.salesType}
                        name="salesType"
                        onChange={(e) => {
                          setsingleSalesError({});
                          handleSalesTransactionInput(
                            e,
                            RegisterableItems.items.ProductId
                          );
                        }}
                        sx={{ margin: "20px auto" }}
                        fullWidth
                        required
                      >
                        <MenuItem defaultValue={"Default"}>
                          Choose values{" "}
                        </MenuItem>
                        <MenuItem value={"On cash"}>On cash</MenuItem>
                        <MenuItem value={"By bank"}>By bank</MenuItem>
                        <MenuItem value={"On credit"}>On credit</MenuItem>
                        {/* <MenuItem value={"By cheque"}>By cheque</MenuItem> */}
                        {/* <MenuItem value={"Free Gift"}>Free Gift</MenuItem> */}
                        {/* <MenuItem value={"On credit"}>On credit</MenuItem> */}
                      </Select>
                      <Box sx={{ color: "red", marginBottom: "20px" }}>
                        {" "}
                        {singleSalesError.salesType}
                      </Box>
                      {formInputValues.salesType === "On credit" && (
                        <Box sx={{ width: "100%" }}>
                          <label>Payment date</label>
                          <TextField
                            id=""
                            onChange={(e) =>
                              handleSalesTransactionInput(
                                e,
                                RegisterableItems.items.ProductId
                              )
                            }
                            value={formInputValues.creditPaymentDate}
                            name="creditPaymentDate"
                            className=""
                            required
                            fullWidth
                            type="date"
                          />
                          <br /> <br />
                        </Box>
                      )}
                    </>
                  )}
                  {/* description starts here */}
                  <TextField
                    fullWidth
                    required
                    className={"dailyRegistrationInputs"}
                    onInput={(e) =>
                      handleSalesTransactionInput(
                        e,
                        RegisterableItems.items.ProductId
                      )
                    }
                    value={formInputValues.Description}
                    name="Description"
                    label="Description"
                  />
                  <br />
                  <label>Attach Files i.e receipt</label>
                  <br />
                  <TextField
                    name="selectedFile"
                    onChange={handleFilesAttachment}
                    type="file"
                    accept={acceptableFileExtensions}
                  />
                </>
              ) : (
                ""
              )}
              <br />
              <Box>
                {Processing ? (
                  <Button disabled variant="contained">
                    Processing...
                  </Button>
                ) : (
                  <>
                    <Button color="primary" variant="contained" type="submit">
                      ADD
                    </Button>{" "}
                    &nbsp; &nbsp; &nbsp;
                    <Button
                      onClick={handleClose}
                      color="warning"
                      variant="contained"
                    >
                      Close
                    </Button>
                  </>
                )}
              </Box>
            </form>
          </Typography>
        </Box>
      </Modal>
      {ErrorsOrSuccess && (
        <SuccessOrError
          request={ErrorsOrSuccess}
          setErrors={setErrorsOrSuccess}
        />
      )}
    </>
  );
}

export default RegisterPurchaseAndSales;

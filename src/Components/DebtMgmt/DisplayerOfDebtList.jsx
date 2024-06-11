import axios from "axios";
import React, { useEffect, useState } from "react";
import ErrorHandler from "../Utilities/ErrorHandler";
import {
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DateFormatter } from "../Body/Date/currentDate";
import PayDebt from "./PayDebt";
import ViewPaiedMoney from "./ViewPaiedMoney";
import DeleteDebtTransaction from "./DeleteDebtTransaction";
export let getDebtData = async (searchTarget) => {
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessName = localStorage.getItem("businessName");
  let businessId = localStorage.getItem("businessId");

  let responce = await axios.get(
    serverAddress +
      "debt/getDebtData?token=" +
      token +
      "&businessName=" +
      businessName +
      "&businessId=" +
      businessId +
      "&searchTarget=" +
      searchTarget
  );
  return responce.data;
};
export const calculatePaidDebt = (data, dailySalesId) => {
  let total = 0;
  data.forEach((item) => {
    if (dailySalesId == item.dailySalesId) total += item.paidAmount;
  });
  return total;
};
function DisplayerOfDebtList({ Target }) {
  const [debtPayment, setDebtPayment] = useState({
    openModal: false,
    item: null,
    tobePaid: 0,
  });
  const [Processing, setProcessing] = useState(false);
  const [DebitList, setDebitList] = useState([]);
  const [errorsVsSuccess, setErrorsVsSuccess] = useState({
    Message: null,
    Detail: null,
  });
  const [paiedMoney, setPaiedMoney] = useState([]);
  // it is used to fetch and refetch the debt data using useEffect
  const [fetchDebtData, setfetchDebtData] = useState(false);
  let getUsersDebtData = async () => {
    try {
      setProcessing(true);
      setErrorsVsSuccess({ Message: null, Detail: null });
      let Responces = await getDebtData(Target);

      setDebitList(Responces.data);
      setPaiedMoney(Responces.paiedMoney);
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      ErrorHandler(error, setErrorsVsSuccess);
    }
  };
  useEffect(() => {
    getUsersDebtData();
  }, [, fetchDebtData]);
  const [viewPaiedMoneyDetails, setViewPaiedMoneyDetails] = useState({
    paidData: null,
    dailySalesId: null,
    openModal: false,
  });
  const [deleteDebt, setDeleteDebt] = useState({
    item: null,
    openModal: false,
  });
  return (
    <div>
      {errorsVsSuccess?.Message ? (
        <div style={{ color: "red" }}>{errorsVsSuccess?.Detail}</div>
      ) : (
        <>
          {deleteDebt.openModal && (
            <DeleteDebtTransaction
              data={{ deleteDebt, setDeleteDebt, getUsersDebtData }}
            />
          )}
          {/* <>Current debt</> <>History</> */}
          {debtPayment?.openModal ? (
            <PayDebt
              data={{
                debtPayment,
                setDebtPayment,
                setfetchDebtData,
                DebitList,
              }}
            />
          ) : (
            ""
          )}
          {/* <PayDebt data={{ debtPayment, setDebtPayment }} /> */}
          {Processing ? (
            <div>
              <div>Loading ...... </div>
              <LinearProgress />
            </div>
          ) : null}
          {DebitList?.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>NO</TableCell>
                    <TableCell>Unit Cost</TableCell>
                    <TableCell>Purchase Qty</TableCell>
                    <TableCell>Total Debt Money</TableCell>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>Debt Due Date</TableCell>
                    <TableCell>Total paid Money</TableCell>
                    <TableCell>To be paid</TableCell>
                    <TableCell>Descriptions</TableCell>
                    <TableCell>Pay</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DebitList.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item?.purchaseQty}</TableCell>{" "}
                        <TableCell>{item?.unitCost}</TableCell>
                        <TableCell>
                          {item?.unitCost * item?.purchaseQty}
                        </TableCell>
                        <TableCell>
                          {DateFormatter(item?.registeredTimeDaily)}
                        </TableCell>
                        <TableCell>
                          {DateFormatter(item?.debtDueDate)}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() =>
                              setViewPaiedMoneyDetails({
                                paidData: paiedMoney,
                                dailySalesId: item?.dailySalesId,
                                openModal: true,
                              })
                            }
                          >
                            {calculatePaidDebt(paiedMoney, item?.dailySalesId)}
                          </Button>
                        </TableCell>
                        <TableCell>
                          {item?.unitCost * item?.purchaseQty -
                            calculatePaidDebt(paiedMoney, item?.dailySalesId)}
                        </TableCell>
                        <TableCell>{item?.Description}</TableCell>
                        <TableCell>
                          {item?.unitCost * item?.purchaseQty -
                            calculatePaidDebt(paiedMoney, item?.dailySalesId) >
                          0 ? (
                            <Button
                              onClick={() =>
                                setDebtPayment({
                                  openModal: true,
                                  item: item,
                                  tobePaid:
                                    item?.unitCost * item?.purchaseQty -
                                    calculatePaidDebt(
                                      paiedMoney,
                                      item?.dailySalesId
                                    ),
                                })
                              }
                              variant={"contained"}
                            >
                              Pay
                            </Button>
                          ) : (
                            <Button disabled>Paid</Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={"contained"}
                            color={"error"}
                            onClick={() =>
                              setDeleteDebt({
                                item: item,
                                openModal: true,
                              })
                            }
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            !Processing && <h3>No debt data found</h3>
          )}
          <ViewPaiedMoney
            data={{
              setfetchDebtData,
              viewPaiedMoneyDetails,
              setViewPaiedMoneyDetails,
            }}
          />
        </>
      )}
    </div>
  );
}

export default DisplayerOfDebtList;

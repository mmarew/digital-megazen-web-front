import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DateFormatter } from "../Body/Date/currentDate";
import ErrorHandler from "../Utilities/ErrorHandler";
import SuccessOrError from "../Body/Others/SuccessOrError";
import DeleteDeposit from "./DeleteDeposit";
import UpdateDeposit from "./UpdateDeposit";
import { ConsumeableContext } from "../Body/UserContext/UserContext";
import CurrencyFormatter from "../Utilities/Utility";
import renderFilePreview from "../Utilities/filesViewer/fileViewer";
import ActionsToDeposites from "./ActionsToDeposites";
import TablesExpandOrLess from "../Utilities/TablesExpandOrLess";
import ExportToExcel from "../PDF_EXCEL/PDF_EXCEL";

function GetDeposit() {
  const [minimizeTable, setminimizeTable] = useState(false);
  const [errorsVsSuccess, setErrorsVsSuccess] = useState({
    Message: "",
    Detail: "",
  });
  let { netCahFlowValue, setNetCahFlowValue, singleSalesInputValues } =
    ConsumeableContext();
  let { toDate, fromDate, searchTarget } = singleSalesInputValues;
  let token = localStorage.getItem("storeToken");
  let serverAddress = localStorage.getItem("targetUrl");
  let businessId = localStorage.getItem("businessId");
  const [bankDepositData, setBankDepositData] = useState([]);
  let getDeposit = async () => {
    try {
      let responces = await axios.get(
        serverAddress + "bankDeposit/getDeposit",
        {
          params: {
            fromDate: fromDate,
            toDate: toDate,
            searchTarget: searchTarget,
            businessId: businessId,
          },
          headers: {
            Authorization: token, // Replace "YourTokenHere" with the actual token value
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setBankDepositData(responces.data.data);
    } catch (error) {
      ErrorHandler(error, setErrorsVsSuccess);
    }
  };
  useEffect(() => {
    let totalDeposit = 0;
    bankDepositData.map((data) => {
      let { depositedAmount } = data;
      totalDeposit += Number(depositedAmount);
    });
    setNetCahFlowValue((prev) => ({
      ...prev,
      depositToBak: totalDeposit,
    }));
  }, [bankDepositData]);

  useEffect(() => {
    getDeposit();
  }, []);
  const [deleteBankDeposit, setDeleteBankDeposit] = useState({
    depositData: "",
    openModal: false,
  });
  const [editBankDeposit, setEditBankDeposit] = useState({
    depositData: "",
    openModal: false,
  });
  return (
    <div>
      {errorsVsSuccess.Message && (
        <SuccessOrError
          request={
            errorsVsSuccess.Message.toLowerCase() == "success"
              ? errorsVsSuccess.Message
              : errorsVsSuccess.Detail
          }
          setErrors={setErrorsVsSuccess}
          toastingTime={4000}
        />
      )}
      <TablesExpandOrLess
        data={{
          minimizeTable,
          setminimizeTable,
          Title: "Deposit Tranactions Table",
        }}
      />

      {!minimizeTable && (
        <>
          {bankDepositData.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Deposited Amount</TableCell>
                    <TableCell>Deposited By</TableCell>
                    <TableCell>Deposited Date</TableCell>
                    <TableCell>Deposits Descriptions</TableCell>
                    <TableCell>Attached Files</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bankDepositData.map((data, index) => (
                    <TableRow key={data.clientSideUniqueId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {CurrencyFormatter(data.depositedAmount)}
                      </TableCell>
                      <TableCell>{data.employeeName}</TableCell>
                      <TableCell>{DateFormatter(data.depositedDate)}</TableCell>
                      <TableCell>{data.depositsDescriptions}</TableCell>

                      <TableCell>
                        {data.attachedFilesName &&
                        data.attachedFilesName != "No file" ? (
                          <a
                            target="_blank"
                            download
                            href={`${serverAddress}uploads/${data.attachedFilesName}`}
                          >
                            {/* lllllllllllll */}
                            {renderFilePreview(data?.attachedFilesName)}
                          </a>
                        ) : (
                          "No file"
                        )}
                      </TableCell>
                      <TableCell>
                        <ActionsToDeposites
                          dataOfDeposit={{
                            setEditBankDeposit,
                            data,
                            setDeleteBankDeposit,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5}>
                      Total Deposit:{" "}
                      {CurrencyFormatter(netCahFlowValue.depositToBak)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>
                      {" "}
                      <ExportToExcel
                        data={bankDepositData}
                        target="depositTransactions"
                      />{" "}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <h3 style={{ color: "red", padding: "10px" }}>
              No bank deposit data found
            </h3>
            // ""
          )}{" "}
        </>
      )}
      {editBankDeposit?.openModal && (
        <UpdateDeposit
          data={{ editBankDeposit, setEditBankDeposit, getDeposit }}
        />
      )}
      {deleteBankDeposit?.openModal && (
        <DeleteDeposit
          data={{ deleteBankDeposit, setDeleteBankDeposit, getDeposit }}
        />
      )}
    </div>
  );
}

export default GetDeposit;

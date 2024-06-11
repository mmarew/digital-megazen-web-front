import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Chip,
  LinearProgress,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SuccessOrError from "../Body/Others/SuccessOrError";
import RemoveEmployeeModal from "./EmployeeRemove";
import { More, Settings } from "@mui/icons-material";
import EmployeesSettings from "./EmployeesSettings";
function EmployeeView() {
  const [employeesPermissions, setEmployeesPermissions] = useState({
    openSettings: false,
    employeesInfo: {},
  });
  const [Processing, setProcessing] = useState(true);
  const businessId = localStorage.getItem("businessId");
  const serverAddress = localStorage.getItem("targetUrl");
  const token = localStorage.getItem("storeToken");
  const [employeesList, setEmployeesList] = useState([]);
  const [errors, setErrors] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState({
    open: false,
    employeeId: "",
  });

  const getBusinessEmployee = async () => {
    try {
      const response = await axios.post(
        serverAddress + "getBusinessEmployee/",
        {
          businessId,
          token,
        }
      );
      setProcessing(false);
      setEmployeesList(response.data.data);
      setErrors("");
    } catch (error) {
      setProcessing(false);
      setErrors(error.message);
    }
  };

  useEffect(() => {
    getBusinessEmployee();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {employeesPermissions.openSettings && (
        <EmployeesSettings
          data={{
            employeesPermissions,
            setEmployeesPermissions,
            getBusinessEmployee,
          }}
        />
      )}
      {Processing && (
        <div style={{ marginTop: "10px" }}>
          <LinearProgress />{" "}
        </div>
      )}
      {errors && <SuccessOrError setErrors={setErrors} request={errors} />}
      <div>
        {employeesList.length === 0 ? (
          <div style={{ padding: "10px" }}>
            <h4 style={{ color: "red" }}>No Employee</h4>
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>List of permissions</TableCell>
                  <TableCell>Settings</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeesList?.map((employee) => (
                  <TableRow key={employee.employeeId}>
                    <TableCell>{employee.employeeName}</TableCell>
                    <TableCell>
                      <a href={"tel:+" + employee.phoneNumber}>
                        {employee.phoneNumber}
                      </a>
                    </TableCell>

                    <TableCell>
                      {JSON.parse(employee.employeeRole)?.length > 0 ? (
                        JSON.parse(employee.employeeRole)?.map((role) => (
                          <Chip
                            sx={{ margin: "5px" }}
                            key={role}
                            label={role}
                          />
                        ))
                      ) : (
                        <Chip color="error" label="No Permissions" />
                      )}
                      <div id="employeeRole"></div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <Button onClick={handleMenuOpen}>
                          {" "}
                          <Settings />
                        </Button>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              setShowConfirmDialog({
                                open: true,
                                employeeId: employee.employeeId,
                              });
                            }}
                          >
                            Remove employee
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              setEmployeesPermissions({
                                openSettings: true,
                                employeesInfo: employee,
                              })
                            }
                          >
                            Edit permissions
                          </MenuItem>
                        </Menu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      {showConfirmDialog.open && (
        <RemoveEmployeeModal
          getBusinessEmployee={getBusinessEmployee}
          employeeId={showConfirmDialog.employeeId}
          removeModal={setShowConfirmDialog}
        />
      )}
    </div>
  );
}

export default EmployeeView;

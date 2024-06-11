import { Box, Button, Checkbox, Modal } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import ErrorHandler from "../Utilities/ErrorHandler";
import SuccessOrError from "../Body/Others/SuccessOrError";
import { Title } from "@mui/icons-material";

let employeesRole = [
  { Title: "addItems", Description: "Register new items" },
  { Title: "Sales", Description: "Register new sales" },
  { Title: "Purchasing", Description: "Register new purchasing" },
  { Title: "manageEmployees", Description: "Manage employees" },
];

function EmployeesSettings({ data }) {
  let { employeesPermissions, setEmployeesPermissions, getBusinessEmployee } =
    data;
  let { employeesInfo } = employeesPermissions;
  let [roleInDataBase, setRoleInDataBase] = useState(
    JSON.parse(employeesInfo.employeeRole)
  );
  const [errorsVsSuccess, setErrorsVsSuccess] = useState({
    Message: null,
    Detail: null,
  });
  const [selectedRoles, setSelectedRoles] = useState([]);
  const businessId = localStorage.getItem("businessId");
  const serverAddress = localStorage.getItem("targetUrl");
  const token = localStorage.getItem("storeToken");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorsVsSuccess({
        Message: null,
        Detail: null,
      });
      let OB = { roles: roleInDataBase, businessId, token, ...employeesInfo };
      // return;
      // Send data to the server using Axios
      let Responces = await axios.post(
        serverAddress + "Employees/addEmployeesRoles/",
        OB
      );
      // Reset the selected roles
      let { Message } = Responces.data;
      if (Message === "Success") {
        getBusinessEmployee();
        setErrorsVsSuccess({
          Message: "SUCCESS",
          Detail: null,
        });
      }
      // setSelectedRoles([]);

      // Handle success or any additional logic
    } catch (error) {
      // Handle error
      ErrorHandler(error, setErrorsVsSuccess);
      console.error(error);
      // Display an error message to the user or perform any necessary actions
    }
  };

  const handleRoleChange = (event) => {
    const { value, checked } = event.target;

    if (roleInDataBase?.includes(value)) {
      if (!checked) {
        // Remove the role from roleInDataBase
        setRoleInDataBase((prevRoles) =>
          prevRoles?.filter((role) => role !== value)
        );
      }
    } else {
      if (checked) {
        // Add the role to roleInDataBase

        setRoleInDataBase((prevRoles) => {
          if (prevRoles) return [...prevRoles, value];
          else {
            return [value];
          }
        });
      }
    }
  };
  let isAllowedRole = (role) => {
    return roleInDataBase?.includes(role);
  };
  return (
    <Modal open={employeesPermissions.openSettings}>
      <Box className="modalBox">
        {errorsVsSuccess.Message && (
          <SuccessOrError
            setErrors={setErrorsVsSuccess}
            request={errorsVsSuccess.Message}
          />
        )}
        <form onSubmit={handleSubmit}>
          <h4>Employees Roles</h4>
          {employeesRole.map((role) => (
            <div key={role.Title}>
              <Checkbox
                value={role.Title}
                checked={isAllowedRole(role.Title)}
                onChange={handleRoleChange}
              />
              {role.Description}
            </div>
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "190px",
            }}
          >
            <Button variant="contained" type="submit">
              Submit
            </Button>
            <Button
              onClick={() => setEmployeesPermissions({ openSettings: false })}
              variant="contained"
              color="warning"
            >
              Close
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default EmployeesSettings;

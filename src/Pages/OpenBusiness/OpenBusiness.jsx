import React, { useEffect, useState, useContext } from "react";
import homeIcon from "../../Components/ICONS/BusinessJS/iconHomeBlack.svg";
import businessIcon from "../../Components/ICONS/BusinessJS/businessBlack.svg";
import transactionIcon from "../../Components/ICONS/BusinessJS/transactionBlack.svg";
import logoutIcon from "../../Components/ICONS/Login/logout-svgrepo-com.svg";
import EmployeeIcon from "../../Components/ICONS/BusinessJS/iconEmployee.svg";
import ItemsIcon from "../../Components/ICONS/BusinessJS/iconItems.svg";
import openBusinessCss from "../../CSS/OpenBusiness.module.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, LinearProgress, Menu } from "@mui/material";
import { ConsumeableContext } from "../../Components/Body/UserContext/UserContext";

import { AppBar, Box, MenuItem, Toolbar } from "@mui/material";
import OpenBusinessLeftSide from "../../Components/OPEN/OpenBusinessLeftSide";
import HoverableLink from "../../Components/Body/HoverableLink";
import { LogoutofThisPage } from "../../Components/Logout/Logout";
import WellcomeInfo from "../../Components/Utilities/WellcomeInfo";

function OpenBusiness() {
  const [HoverableTitle, setHoverableTitle] = useState("");
  let Navigate = useNavigate();
  const { ownersName, setownersName, ShowProgressBar, setShowProgressBar } =
    ConsumeableContext();
  useEffect(() => {
    setownersName(localStorage.getItem("ownersName"));
  }, []);

  let registerItems = (activeTab) => {
    setActiveTab(activeTab);
  };

  const [screenSize, setScreenSize] = useState(window.innerWidth);
  useEffect(() => {
    setShowProgressBar(false);
    // window.addEventListener("resize", setScreenSize(window.innerWidth));
  }, []);
  /////////////////////////////////////

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option) => {
    // Handle the option click here
    handleMenuClose();
  };
  const [activeTab, setActiveTab] = useState("Home");
  const location = useLocation();
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);
  let employeeRole = localStorage.getItem("employeeRole");
  let openedBusiness = localStorage.getItem("openedBusiness");
  ///////////////////////////////
  let { singleSalesInputValues, setSinlgeSalesInputValues } =
    ConsumeableContext();
  let handleTransaction = () => {
    setSinlgeSalesInputValues(() => {
      return {
        ...singleSalesInputValues,
        showBuyAndSales: false,
        fetchDeposits: false,
        showCreditRecords: false,
        showExpencesRecods: false,
      };
    });
    setTimeout(() => {
      setSinlgeSalesInputValues(() => {
        return {
          ...singleSalesInputValues,
          showBuyAndSales: true,
          fetchDeposits: true,
          showCreditRecords: true,
          showExpencesRecods: true,
        };
      });
    });
    /*singleSalesInputValues, showBuyAndSales,fetchDeposits,showCreditRecords ,showExpencesRecods*/
  };

  let businessName = localStorage.getItem("businessName");
  return (
    <div className={openBusinessCss.openBusinesswrapper}>
      {/* Small size nav bar starts here */}
      <div className={openBusinessCss.navBar}>
        <AppBar sx={{ backgroundColor: "white" }} position="static">
          <Toolbar>
            <div className={openBusinessCss.registerViewSearch}>
              <span
                // style={{ display: "none  !important" }}
                title="Open Business"
                onClick={() => {
                  Navigate("/OpenBusiness");
                  registerItems("Home");
                }}
                className={`${
                  activeTab == "/OpenBusiness" ? openBusinessCss.activeLink : ""
                }`}
                name="gotoHome"
                id="OpenBusiness"
              >
                <IconButton className={openBusinessCss.iconButton}>
                  <img
                    style={{ width: "30px" }}
                    className={openBusinessCss.openBusIcon}
                    src={homeIcon}
                  />
                  <span className={openBusinessCss.Title}>Home</span>
                </IconButton>
              </span>{" "}
              {/* transaction starts here */}
              <span
                title="Transaction"
                onClick={(e) => {
                  handleTransaction();
                  Navigate("transaction");
                  registerItems("Transaction");
                  setHoverableTitle();
                }}
                className={`${
                  typeof activeTab === "string" &&
                  activeTab?.startsWith("/OpenBusiness/transaction")
                    ? openBusinessCss.activeLink
                    : ""
                }`}
                name="addTransaction"
                id="addTransaction"
              >
                <IconButton className={openBusinessCss.iconButton}>
                  <img
                    style={{ width: "30px" }}
                    className={openBusinessCss.openBusIcon}
                    src={transactionIcon}
                    alt="transaction"
                  />{" "}
                  <span className={openBusinessCss.Title}>Transactions</span>
                </IconButton>
              </span>
              {/* ///////////////// */}
              {(openedBusiness == "myBusiness" ||
                employeeRole?.includes("addItems")) && (
                <span
                  title="Add Item"
                  onClick={() => {
                    Navigate("Items");
                    registerItems("addItem");
                  }}
                  className={`${
                    typeof activeTab === "string" &&
                    activeTab?.startsWith("/OpenBusiness/Items")
                      ? openBusinessCss.activeLink
                      : ""
                  }`}
                  name="addItem"
                  id="addItem"
                  // to="Items"
                >
                  <IconButton className={openBusinessCss.iconButton}>
                    <img
                      style={{ width: "30px" }}
                      className={openBusinessCss.openBusIcon}
                      src={ItemsIcon}
                      alt="Items Icon"
                    />{" "}
                    <span className={openBusinessCss.Title}>Item</span>
                  </IconButton>
                </span>
              )}
              {/* ////////////////// */}
              <span
                title="Search"
                onClick={() => {
                  Navigate("search");
                  registerItems("Search");
                }}
                className={`${
                  typeof activeTab === "string" &&
                  activeTab?.startsWith("/OpenBusiness/search")
                    ? openBusinessCss.activeLink
                    : ""
                }`}
                name="Search"
                id="search"
              >
                {/* <IconButton className={openBusinessCss.iconButton}>
                  <img
                    style={{ width: "30px" }}
                    className={openBusinessCss.openBusIcon}
                    src={viewIcon}
                    alt="transaction"
                  />{" "}
                  <span className={openBusinessCss.Title}>View</span>
                </IconButton> */}
                {/* <img src={viewIcon} /> */}
              </span>
              <span>
                <IconButton
                  sx={{ display: "flex", flexDirection: "column" }}
                  aria-label="Options"
                  aria-controls="three-dot-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                >
                  <MoreVertIcon sx={{ color: "black", marginTop: "10px" }} />

                  <span style={{}} className={openBusinessCss.Title}>
                    More
                  </span>
                </IconButton>
                <Menu
                  id="three-dot-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem>
                    <HoverableLink
                      title="Open Business"
                      onClick={registerItems}
                      className={openBusinessCss.openBusinessTab}
                      name="gotoBusiness"
                      to="/"
                      id="Open Business"
                    >
                      <IconButton
                        style={{ flexDirection: "row" }}
                        className={openBusinessCss.iconButton}
                      >
                        <img
                          style={{ width: "30px", marginRight: "10px" }}
                          className={openBusinessCss.openBusIcon}
                          src={businessIcon}
                        />
                        <span className={openBusinessCss.Title}>Business</span>
                      </IconButton>
                    </HoverableLink>
                  </MenuItem>
                  {/* logout menu */}
                  <MenuItem>
                    <HoverableLink
                      title="Open Business"
                      onClick={LogoutofThisPage}
                      className={openBusinessCss.openBusinessTab}
                      name="gotoBusiness"
                      to="/login"
                      id="Open Business"
                    >
                      <IconButton
                        style={{ flexDirection: "row" }}
                        className={openBusinessCss.iconButton}
                      >
                        <img
                          style={{ width: "30px", marginRight: "10px" }}
                          className={openBusinessCss.openBusIcon}
                          src={logoutIcon}
                        />
                        <span className={openBusinessCss.Title}>Logout</span>
                      </IconButton>
                    </HoverableLink>
                  </MenuItem>
                  {/* if employee has access to add employees */}
                  {(openedBusiness == "myBusiness" ||
                    employeeRole?.includes("manageEmployees")) && (
                    <MenuItem onClick={() => handleOptionClick("Option 1")}>
                      <HoverableLink
                        title="Employee"
                        onClick={registerItems}
                        className={openBusinessCss.openBusinessTab}
                        name="Employee"
                        to="Employee"
                        id="Employee"
                      >
                        <IconButton
                          className={openBusinessCss.iconButton}
                          style={{ flexDirection: "row" }}
                        >
                          <img
                            style={{ width: "30px", marginRight: "10px" }}
                            className={openBusinessCss.openBusIcon}
                            src={EmployeeIcon}
                            alt="transaction"
                          />{" "}
                          <span className={openBusinessCss.Title}>
                            Employee
                          </span>
                        </IconButton>
                        {/* <img src={E} /> */}
                      </HoverableLink>
                    </MenuItem>
                  )}
                </Menu>
              </span>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <main className={openBusinessCss.MainWrapper}>
        {screenSize > 768 && (
          <div className={openBusinessCss.leftSideDiv}>
            <OpenBusinessLeftSide />
          </div>
        )}
        <div className={openBusinessCss.middeleSideDiv}>
          <WellcomeInfo Message={`Welcome to  ${businessName}`} />

          <div className={openBusinessCss.businessInfoWrapper}>
            <Outlet />
            {ShowProgressBar && (
              <Box sx={{ padding: "10px 0" }}>
                <LinearProgress />
              </Box>
            )}
            <div></div>
          </div>
        </div>
      </main>
      {HoverableTitle}
    </div>
  );
}

export default OpenBusiness;

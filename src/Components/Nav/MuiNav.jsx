import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import VerifyLogin from "../../Pages/VerifyLogin";
import { useEffect } from "react";
import BusinessLogo from "../../Components/ICONS/BusinessJS/businessBlack.svg";
import HelpLogo from "../../Components/ICONS/BusinessJS/SupportBlack.svg";
import ProfileLogo from "../../Components/ICONS/BusinessJS/ProfileBlack.svg";
import "./Nav.css";

export default function NavBar() {
  let hundleNavigationBar = (e) => {};
  let navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath == "/help") return;
    let verify = VerifyLogin();
    verify.then((res) => {
      if (!res) {
        navigate("/login");
      }
    });
  }, []);
  return (
    <div className="NavBar">
      <Box sx={{}}>
        <AppBar position="static" sx={{ backgroundColor: "#fff" }}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "block", sm: "block" } }}
            >
              <div className="navLinks">
                <Link
                  onClick={hundleNavigationBar}
                  className="Lists"
                  to="/Business"
                >
                  <div className="logoAndTitleWrapper">
                    <img className="listImg" src={BusinessLogo} />
                    <span>Business</span>
                  </div>
                </Link>
                <Link
                  onClick={hundleNavigationBar}
                  className="Lists"
                  to="/help"
                >
                  <div className="logoAndTitleWrapper">
                    <img className="listImg" src={HelpLogo} />
                    <span>Help</span>
                  </div>
                </Link>
                <Link
                  onClick={hundleNavigationBar}
                  className="Lists ownerName"
                  to="/Profiles"
                >
                  <div className={"logoAndTitleWrapper"}>
                    <img className="listImg" src={ProfileLogo} />
                    <span>Profile</span>
                  </div>
                </Link>
              </div>
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

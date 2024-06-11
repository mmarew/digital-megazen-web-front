import { useNavigate } from "react-router-dom";

function LogoutofThisPage() {
  let counter = 0;
  // let navigate = useNavigate();
  localStorage.removeItem("storeToken");
  localStorage.removeItem("ownersName");
  localStorage.clear();
  counter++;
  let storeToken = localStorage.getItem("storeToken");
  if (!storeToken) {
    window.location.href = "/login";
  } else {
    if (counter <= 3) LogoutofThisPage();
  }
}
export { LogoutofThisPage };

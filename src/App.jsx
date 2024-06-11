import "./App.css";
import "./CSS/ModalBox.css";
import "./CSS/Customs.css";
import "./CSS/LinksStyle.css";
import Transaction from "./Pages/Transaction";
import Report from "./Pages/Report";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Items from "./Pages/OpenBusiness/Items";
import Employee from "./Pages/Employee";
import Help from "./Pages/Help";
import NavBar from "./Components/Nav/MuiNav";
import ForgetPassword from "./Pages/ForgetPassword";
import OpenBusinessHome from "./Pages/OpenBusinessHome";
import Admin from "./Pages/Admin";
import Business from "./Pages/Business";
import OpenBusiness from "./Pages/OpenBusiness/OpenBusiness";
import RegisterEmployersProducts from "./Pages/RegisterEmployersProducts";
import OpenEmployeersBusiness from "./Pages/OpenEmployeersBusiness";
import HowToRegisterAndLogin from "./Components/Afterlogin/Help/HowToRegisterAndLogin";
import HowToCreateBusiness from "./Components/Afterlogin/Help/HowToCreateBusiness";
import HowToRegisterProductsAndExpencesItems from "./Components/Afterlogin/Help/OpenedBsiness/HowToRegisterProductsAndExpencesItems";
import HowToregisterSalesAndPurchaseTransaction from "./Components/Afterlogin/Help/OpenedBsiness/HowToregisterSalesAndPurchaseTransaction";
import HowToRegisterExpencesTransaction from "./Components/Afterlogin/Help/OpenedBsiness/HowToRegisterExpencesTransaction";
import RegisterPurchaseAndSales from "./Components/Transaction/AddTrans/RegisterPurchaseAndSales";
import AddExpTransaction from "./Components/Transaction/AddTrans/AddExpTransaction";
import TransactionForm from "./Components/Transaction/SearchTrans/TransactionForm";
import TransactionManager from "./Pages/OpenBusiness/AddTransaction/TransactionManager";
import GetEachTransaction from "./Components/Transaction/SearchTrans/GetEachTransaction";
import SearchExpenceTransaction from "./Components/Transaction/SearchTrans/SearchExpenceTransaction";
import GetDeposit from "./Components/Bank/GetDeposit";
import InsertDeposite from "./Components/Bank/InsertDeposit";
import PrivacyPolicy from "./Pages/Privacy/PrivacyPolicy";
import Footer from "./Components/Footer/Footer";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/OpenEmployeersBusiness"
            element={<OpenEmployeersBusiness />}
          >
            <Route path="Register" element={<RegisterEmployersProducts />} />
            <Route path="view" element={<Transaction />} />
          </Route>

          <Route path="/admin" element={<Admin />} />
          <Route path="/Transaction" element={<Transaction />} />
          <Route path="/forgetPaassword" element={<ForgetPassword />} />
          <Route path="/Employee" element={<Employee />} />
          <Route path="/Reports" element={<Report />} />
          <Route
            path="/Profiles"
            element={
              <>
                {window.innerWidth < 768 && <NavBar />}
                <Profile />
              </>
            }
          />
          <Route
            path="/Business"
            element={
              <>
                {window.innerWidth < 768 && <NavBar />}
                <Business />
              </>
            }
          />
          <Route
            path="/help"
            element={
              <>
                {window.innerWidth < 768 && <NavBar />}
                <Help />
              </>
            }
          >
            <Route
              path="loginAndRegister"
              element={<HowToRegisterAndLogin />}
            />
            <Route
              path="howToCreateBusiness"
              element={<HowToCreateBusiness />}
            />
            <Route
              path="registerProductsAndExpencesItems"
              element={<HowToRegisterProductsAndExpencesItems />}
            />
            <Route
              path="registerSalesAndPurchaseTransaction"
              element={<HowToregisterSalesAndPurchaseTransaction />}
            />
            <Route
              path="registerExpencesTransaction"
              element={<HowToRegisterExpencesTransaction />}
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route
            path="/register"
            element={
              <>
                <Register />
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                {window.innerWidth < 768 && <NavBar />}
                <Business />
              </>
            }
          />

          <Route path="/OpenBusiness" element={<OpenBusiness />}>
            <Route path="" element={<OpenBusinessHome />} />
            <Route path="Items" element={<Items />} />
            <Route path="Employee" element={<Employee />} />
            <Route path="transaction" element={<TransactionManager />}>
              <Route
                index
                element={
                  <>
                    <GetEachTransaction />
                    <SearchExpenceTransaction />

                    <GetDeposit />
                  </>
                }
              />
              <Route
                path="Expenses"
                element={
                  <>
                    <AddExpTransaction />
                    <SearchExpenceTransaction />
                  </>
                }
              />
              <Route
                path="Sales"
                element={
                  <>
                    <RegisterPurchaseAndSales />
                    <GetEachTransaction />
                  </>
                }
              />
              <Route
                path="Buy"
                element={
                  <>
                    <RegisterPurchaseAndSales />
                    <GetEachTransaction />
                  </>
                }
              />
              <Route
                path="Both"
                element={
                  <>
                    <RegisterPurchaseAndSales />
                    <GetEachTransaction />
                  </>
                }
              />
              <Route
                path="bankDeposit"
                element={
                  <>
                    <InsertDeposite />
                    <GetDeposit />
                  </>
                }
              />
              <Route path="Search" element={<TransactionForm />} />
            </Route>
          </Route>
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}
export default App;

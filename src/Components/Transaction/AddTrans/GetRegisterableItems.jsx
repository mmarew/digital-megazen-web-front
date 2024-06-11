import axios from "axios";
import ErrorHandler from "../../Utilities/ErrorHandler";

const GetRegisterableItems = async (setErrorsOrSuccess) => {
  try {
    const token = localStorage.getItem("storeToken");
    const businessId = localStorage.getItem("businessId");
    const businessName = localStorage.getItem("businessName");
    const serverAddress = localStorage.getItem("targetUrl");
    const response = await axios.post(
      `${serverAddress}products/getRegistrableProducts/`,
      {
        token,
        businessId,
        businessName,
        Target: "All Products",
      }
    );
    const data = response.data.data;
    return data;
  } catch (error) {
    ErrorHandler(error, setErrorsOrSuccess);
    return "error";
  }
};
export default GetRegisterableItems;

function ErrorHandler(error, setErrorsOrSuccess) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (
      error.response.status === 404 ||
      error.response.status === 403 ||
      error.response.status === 402 ||
      error.response.status === 401 ||
      error.response.status === 400
    ) {
      // Not found error
      let errors = error?.response?.data?.Error;
      let Detail = "";

      if (errors) {
        Detail = "Errors: " + errors;
      } else
        Detail = `Status: ${error.response.status}, ${error.response.statusText} `;
      setErrorsOrSuccess({
        Message: "Not Found",
        Detail: Detail,
      });
    } else {
      let Detail = `Status: ${error.response.status}, ${error.response.statusText}`;
      // Other HTTP errors
      setErrorsOrSuccess({
        Message: "HTTP Error",
        Detail: Detail,
      });
    }
  } else if (error.request) {
    // The request was made but no response was received
    let Detail = `Unable to connect to the server.`;

    setErrorsOrSuccess({
      Message: "Connection Error",
      Detail: Detail,
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    let Detail = error.message;
    setErrorsOrSuccess({
      Message: "Request Error",
      Detail: Detail,
    });
  }
}

export default ErrorHandler;

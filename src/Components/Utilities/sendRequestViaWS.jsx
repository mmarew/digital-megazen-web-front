function sendRequestViaWS(uniqueId) {
  const targetWSUrl = localStorage.getItem("targetWSUrl");
  const socket = new WebSocket(targetWSUrl); // Replace with your server's URL
  socket.addEventListener("open", function (event) {
    // Connection opened
    let jsonData = JSON.stringify({ flag: "sendMyPinViaSMS", uniqueId });
    socket.send(jsonData); // Send a message to the server
  });
  socket.addEventListener("message", function (event) {
    // Handle received message from the server
    const message = event.data;
    console.log("Received message from server:", message);
    // Process the message as needed
  });

  socket.addEventListener("close", function (event) {
    // Connection closed
  });
}

export default sendRequestViaWS;

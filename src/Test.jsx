import React from "react";

function App() {
  let handleClick = () => {
    window.postMessage("clicked");
  };
  return <button onClick={handleClick}>Button</button>;
}
export default App;
